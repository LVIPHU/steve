import { analyzePrompt } from "./analyzer";
import { generateHtml } from "./generator";
import { validateAndFix } from "./validator";
import { runDesignAgent } from "./design-agent";
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

  // Step 1: Analyze
  onEvent({ step: "analyze", status: "start" });
  const analysis = await analyzePrompt(prompt);
  onEvent({
    step: "analyze",
    status: "done",
    detail: `Loai: ${analysis.type} · Sections: ${analysis.sections.slice(0, 4).join(", ") || "auto"}`,
  });

  // Step 2: Components (tag-match, ~0ms, no LLM)
  onEvent({ step: "components", status: "start" });
  const snippets = selectComponents(analysis);
  onEvent({
    step: "components",
    status: "done",
    detail: `${snippets.length} component(s) selected`,
  });

  let userMessage: string;

  if (isEditMode) {
    // Edit mode: 4 steps — analyze, components, generate, validate
    // Skip design, review, refine
    userMessage = buildEditUserMessage(prompt);
  } else {
    // Fresh mode: design step
    onEvent({ step: "design", status: "start" });
    const design = await runDesignAgent(prompt, analysis);
    onEvent({
      step: "design",
      status: "done",
      detail: `Preset: ${design.preset} · Primary: ${design.palette.primary}`,
    });

    userMessage = buildUserMessage(prompt, analysis, design, snippets);
  }

  // Step: Generate
  onEvent({ step: "generate", status: "start" });
  let html = await generateHtml(userMessage);
  onEvent({ step: "generate", status: "done" });

  // Fresh mode + refine enabled: review + conditional refine
  if (!isEditMode && enableRefine) {
    // Step: Review
    onEvent({ step: "review", status: "start" });
    const review = await reviewHtml(prompt, html);
    onEvent({
      step: "review",
      status: "done",
      detail: `Score: ${review.score}/100 · must_fix: ${review.must_fix.length}`,
    });

    // Step: Refine (conditional)
    const needsRefine = review.score < reviewThreshold || review.must_fix.length > 0;
    if (needsRefine) {
      onEvent({ step: "refine", status: "start" });
      html = await refineHtml(html, review);
      onEvent({ step: "refine", status: "done", detail: `Fixed ${review.must_fix.length} issue(s)` });
    }
  }

  // Final step: Validate + fix
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

  return validatedHtml;
}
