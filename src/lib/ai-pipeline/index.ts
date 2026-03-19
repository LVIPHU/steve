import { analyzePrompt } from "./analyzer";
import { researchContext } from "./researcher";
import { generateHtml } from "./generator";
import { validateAndFix } from "./validator";
import type { PipelineEvent } from "./types";

export type { PipelineEvent } from "./types";

export async function runGenerationPipeline(
  prompt: string,
  currentHtml: string | undefined,
  onEvent: (event: PipelineEvent) => void
): Promise<string> {
  // Step 1: Analyze
  onEvent({ step: "analyze", status: "start" });
  const analysis = await analyzePrompt(prompt);
  onEvent({
    step: "analyze",
    status: "done",
    detail: `Loại: ${analysis.type} · Sections: ${analysis.sections.slice(0, 4).join(", ") || "auto"}`,
  });

  // Step 2: Research
  onEvent({ step: "research", status: "start" });
  const research = await researchContext(analysis);
  onEvent({
    step: "research",
    status: "done",
    detail: `CSS patterns ready · DaisyUI components mapped`,
  });

  // Step 3: Generate
  onEvent({ step: "generate", status: "start" });
  const rawHtml = await generateHtml(prompt, analysis, research, currentHtml);
  onEvent({ step: "generate", status: "done" });

  // Step 4: Validate + fix
  onEvent({ step: "validate", status: "start" });
  const { html, fixes, warnings } = validateAndFix(rawHtml);
  const fixDetail =
    fixes.length > 0
      ? `${fixes.length} fix(es) applied`
      : warnings.length > 0
      ? `${warnings.length} warning(s)`
      : "Không phát hiện lỗi";
  onEvent({ step: "validate", status: "done", detail: fixDetail, fix_count: fixes.length });

  if (warnings.length > 0) {
    console.warn("[ai-pipeline] validator warnings:", warnings);
  }

  return html;
}
