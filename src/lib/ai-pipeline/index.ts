import { analyzePrompt } from "./analyzer";
import { analyzeAndDesign } from "./analyze-and-design";
import { generateHtml } from "./generator";
import { validateAndFix } from "./validator";
import { reviewHtml } from "./reviewer";
import { buildUserMessage, buildEditUserMessage, refineHtml } from "./context-builder";
import { selectComponents } from "@/lib/component-library";
import type { PipelineEvent } from "./types";

export type { PipelineEvent } from "./types";

export async function runGenerationPipeline(
  prompt: string,
  currentHtml: string | undefined,
  onEvent: (event: PipelineEvent) => void
): Promise<string> {
  const isEditMode = !!currentHtml;
  const enableRefine = process.env.ENABLE_REFINE === "true";
  const reviewThreshold = parseInt(process.env.REVIEW_THRESHOLD ?? "75", 10);

  let userMessage: string;

  if (isEditMode) {
    // Edit mode: 4 steps — analyze, components, generate, validate
    // Skip design, review, refine — use analyzePrompt() only (no design needed)
    onEvent({ step: "analyze", status: "start" });
    const analysis = await analyzePrompt(prompt);
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

    userMessage = buildEditUserMessage(prompt, currentHtml!);
  } else {
    // Fresh mode: merged analyze+design step (1 LLM call instead of 2)
    onEvent({ step: "analyze", status: "start" });
    const { analysis, design } = await analyzeAndDesign(prompt);
    onEvent({
      step: "analyze",
      status: "done",
      detail: `Loai: ${analysis.type} · Sections: ${analysis.sections.slice(0, 3).join(", ")}`,
    });

    onEvent({ step: "components", status: "start" });
    const snippets = selectComponents(analysis);
    onEvent({
      step: "components",
      status: "done",
      detail: `${snippets.length} component(s) selected`,
    });

    // Design already resolved alongside analyze — emit done event only
    onEvent({
      step: "design",
      status: "done",
      detail: `Preset: ${design.preset} · Primary: ${design.palette.primary}`,
    });

    userMessage = buildUserMessage(prompt, analysis, design, snippets);
  }

  // Step: Generate
  onEvent({ step: "generate", status: "start" });
  let html = await generateHtml(
    userMessage,
    isEditMode ? "edit" : "fresh",
    (chunk) => onEvent({ step: "generate", status: "streaming", chunk })
  );
  onEvent({ step: "generate", status: "done" });

  // Validate first (always) — catches common structural issues cheaply
  onEvent({ step: "validate", status: "start" });
  const { html: validatedHtml, fixes, warnings } = validateAndFix(html);
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
    const review = await reviewHtml(prompt, validatedHtml);
    onEvent({
      step: "review",
      status: "done",
      detail: `Score: ${review.score}/100 · must_fix: ${review.must_fix.length}`,
    });

    // Step: Refine (conditional on review score)
    const needsRefine = review.score < reviewThreshold || review.must_fix.length > 0;
    if (needsRefine) {
      onEvent({ step: "refine", status: "start" });
      const refined = await refineHtml(validatedHtml, review);
      const { html: finalHtml } = validateAndFix(refined);
      onEvent({ step: "refine", status: "done", detail: `Fixed ${review.must_fix.length} issue(s)` });
      return finalHtml;
    }
  }

  return validatedHtml;
}
