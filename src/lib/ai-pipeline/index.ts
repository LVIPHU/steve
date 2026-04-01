import { analyzePrompt } from "./analyzer";
import { analyzeAndDesign } from "./analyze-and-design";
import { generateHtml } from "./generator";
import { validateAndFix } from "./validator";
import { reviewHtml } from "./reviewer";
import { buildUserMessage, buildEditUserMessage, refineHtml } from "./context-builder";
import { selectComponents, selectExamples } from "@/lib/component-library";
import { traceStep, createTraceId } from "@/lib/langfuse";
import type { PipelineEvent, AnalysisResult, DesignResult } from "./types";

export type { PipelineEvent } from "./types";

export interface PipelineResult {
  html: string;
  analysis?: AnalysisResult;
  design?: DesignResult;
}

export async function runGenerationPipeline({
  prompt,
  currentHtml,
  onEvent,
  otherPagesContext,
}: {
  prompt: string;
  currentHtml?: string;
  onEvent: (event: PipelineEvent) => void;
  otherPagesContext?: string;
}): Promise<PipelineResult> {
  const isEditMode = !!currentHtml;
  const enableRefine = process.env.ENABLE_REFINE === "true";
  const reviewThreshold = parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10);
  const traceId = createTraceId();

  let userMessage: string;
  let pipelineAnalysis: AnalysisResult | undefined;
  let pipelineDesign: DesignResult | undefined;

  if (isEditMode) {
    // Edit mode: 4 steps — analyze, components, generate, validate
    // Skip design, review, refine — use analyzePrompt() only (no design needed)
    onEvent({ step: "analyze", status: "start" });
    const t0 = Date.now();
    const analysis = await analyzePrompt(prompt);
    traceStep({
      traceId,
      step: "analyze",
      model: "gpt-4o-mini",
      inputLength: prompt.length,
      outputLength: JSON.stringify(analysis).length,
      latencyMs: Date.now() - t0,
    });
    onEvent({
      step: "analyze",
      status: "done",
      detail: `Loai: ${analysis.type} · Sections: ${analysis.sections.slice(0, 4).join(", ") || "auto"}`,
    });

    onEvent({ step: "components", status: "start" });
    const snippets = selectComponents(analysis);
    onEvent({
      step: "components",
      status: "done",
      detail: `${snippets.length} component(s) selected`,
    });

    userMessage = buildEditUserMessage(prompt, currentHtml!, otherPagesContext);
  } else {
    // Fresh mode: merged analyze+design step (1 LLM call instead of 2)
    onEvent({ step: "analyze", status: "start" });
    const t0 = Date.now();
    const { analysis, design } = await analyzeAndDesign(prompt);
    pipelineAnalysis = analysis;
    pipelineDesign = design;
    traceStep({
      traceId,
      step: "analyze_and_design",
      model: "gpt-4o-mini",
      inputLength: prompt.length,
      outputLength: JSON.stringify({ analysis, design }).length,
      latencyMs: Date.now() - t0,
    });
    onEvent({
      step: "analyze",
      status: "done",
      detail: `Loai: ${analysis.type} · Sections: ${analysis.sections.slice(0, 3).join(", ")}`,
    });

    onEvent({ step: "components", status: "start" });
    const snippets = selectComponents(analysis);
    const examples = selectExamples(analysis);
    const allSnippets = [...snippets, ...examples];
    onEvent({
      step: "components",
      status: "done",
      detail: `${snippets.length} component(s) selected${examples.length > 0 ? " + 1 reference example" : ""}`,
    });

    // Design already resolved alongside analyze — emit done event only
    onEvent({
      step: "design",
      status: "done",
      detail: `Preset: ${design.preset} · Primary: ${design.palette.primary}`,
    });

    userMessage = buildUserMessage(prompt, analysis, design, allSnippets, otherPagesContext);
  }

  // Step: Generate
  onEvent({ step: "generate", status: "start" });
  const tGen = Date.now();
  let html = await generateHtml(
    userMessage,
    isEditMode ? "edit" : "fresh",
    (chunk) => onEvent({ step: "generate", status: "streaming", chunk })
  );
  traceStep({
    traceId,
    step: "generate",
    model: "gpt-4o",
    inputLength: userMessage.length,
    outputLength: html.length,
    latencyMs: Date.now() - tGen,
  });
  onEvent({ step: "generate", status: "done" });

  // Validate first (always) — catches common structural issues cheaply
  onEvent({ step: "validate", status: "start" });
  const { html: validatedHtml, fixes, warnings } = validateAndFix(html, !otherPagesContext);
  const fixDetail =
    fixes.length > 0
      ? `${fixes.length} fix(es) applied`
      : warnings.length > 0
      ? `${warnings.length} warning(s)`
      : "Khong phat hien loi";
  onEvent({ step: "validate", status: "done", detail: fixDetail, fix_count: fixes.length });

  if (warnings.length > 0) {
    console.warn("[ai-pipeline] validator warnings:", warnings);
  }

  // Conditional review: only when ENABLE_REFINE=true AND validator signals quality issues
  const shouldReview =
    !isEditMode &&
    enableRefine &&
    (warnings.length > 0 || fixes.length > 2 || validatedHtml.length < 2000);

  if (shouldReview) {
    // Step: Review
    onEvent({ step: "review", status: "start" });
    const tReview = Date.now();
    const review = await reviewHtml(prompt, validatedHtml);
    traceStep({
      traceId,
      step: "review",
      model: "gpt-4o-mini",
      inputLength: validatedHtml.length,
      outputLength: JSON.stringify(review).length,
      latencyMs: Date.now() - tReview,
    });
    onEvent({
      step: "review",
      status: "done",
      detail: `Score: ${review.score}/100 · must_fix: ${review.must_fix.length}`,
    });

    // Step: Refine (conditional on review score)
    const needsRefine = review.score < reviewThreshold || review.must_fix.length > 0;
    if (needsRefine) {
      onEvent({ step: "refine", status: "start" });
      const tRefine = Date.now();
      const refined = await refineHtml(validatedHtml, review);
      const { html: finalHtml } = validateAndFix(refined);
      traceStep({
        traceId,
        step: "refine",
        model: "gpt-4o",
        inputLength: validatedHtml.length,
        outputLength: finalHtml.length,
        latencyMs: Date.now() - tRefine,
      });
      onEvent({ step: "refine", status: "done", detail: `Fixed ${review.must_fix.length} issue(s)` });
      return { html: finalHtml, analysis: pipelineAnalysis, design: pipelineDesign };
    }
  }

  return { html: validatedHtml, analysis: pipelineAnalysis, design: pipelineDesign };
}
