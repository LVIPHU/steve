import type { ValidationResult } from "./types";

// Rule-based JS validator — no LLM, fast and reliable.
// Detects and auto-fixes common AI generation bugs.

export function validateAndFix(html: string): ValidationResult {
  const fixes: string[] = [];
  const warnings: string[] = [];
  let result = html;

  // Fix 1: Tailwind class names used as CSS properties
  // e.g. "justify-center: center" → "justify-content: center"
  // e.g. "items-center: center" → "align-items: center"
  if (/justify-center\s*:/.test(result)) {
    result = result.replace(/justify-center\s*:\s*\w+/g, "justify-content: center");
    fixes.push("CSS: justify-center → justify-content: center");
  }
  if (/items-center\s*:/.test(result)) {
    result = result.replace(/items-center\s*:\s*\w+/g, "align-items: center");
    fixes.push("CSS: items-center → align-items: center");
  }
  if (/flex-col\s*:/.test(result)) {
    result = result.replace(/flex-col\s*:\s*\w+/g, "flex-direction: column");
    fixes.push("CSS: flex-col → flex-direction: column");
  }

  // Fix 2: Flip card — .card-inner has height: 100% but no explicit height on .card
  // Inject explicit height if pattern detected but missing
  const hasCardInner = /\.card-inner/.test(result);
  const hasCardHeight = /\.card\s*\{[^}]*height\s*:/.test(result);
  if (hasCardInner && !hasCardHeight) {
    result = result.replace(
      /\.card\s*\{/,
      ".card { height: 220px;"
    );
    fixes.push("Layout: added height: 220px to .card (flip card fix)");
  }

  // Warning 3: alert() or confirm() usage
  if (/\balert\s*\(|\bconfirm\s*\(/.test(result)) {
    warnings.push("alert()/confirm() detected — consider DaisyUI <dialog> modal instead");
  }

  // Warning 4: Alpine x-for usage
  if (/x-for/.test(result)) {
    warnings.push("Alpine x-for detected — should use vanilla JS DOM rendering instead");
  }

  // Warning 5: Tailwind aspect-ratio plugin classes
  if (/aspect-w-|aspect-h-/.test(result)) {
    warnings.push("aspect-w/h Tailwind classes require plugin not available in CDN");
  }

  return { html: result, fixes, warnings };
}
