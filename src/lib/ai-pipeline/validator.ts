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

  // Check 1: DOCTYPE present
  if (!result.match(/^<!DOCTYPE html>/i)) {
    result = "<!DOCTYPE html>\n" + result;
    fixes.push("Added missing DOCTYPE");
  }

  // Check 2: Essential tags
  if (!/<html[\s>]/i.test(result)) warnings.push("Missing <html> tag");
  if (!/<head[\s>]/i.test(result)) warnings.push("Missing <head> tag");
  if (!/<body[\s>]/i.test(result)) warnings.push("Missing <body> tag");

  // Check 3: Viewport meta
  if (!/<meta[^>]*viewport/i.test(result)) {
    warnings.push("Missing viewport meta — mobile rendering will break");
  }

  // Check 4: Tailwind CDN present
  if (!/cdn\.tailwindcss\.com/i.test(result)) {
    warnings.push("Missing Tailwind CDN — styles may not render");
  }

  // Check 5: Empty body
  if (/<body[^>]*>\s*<\/body>/i.test(result)) {
    warnings.push("Empty <body> — generation likely failed or incomplete");
  }

  // Check 6: Suspiciously short HTML
  if (result.length < 500) {
    warnings.push(`HTML very short (${result.length} chars) — likely incomplete generation`);
  }

  // Check 7: Mismatched script tags
  const scriptOpens = (result.match(/<script[\s>]/g) || []).length;
  const scriptCloses = (result.match(/<\/script>/g) || []).length;
  if (scriptOpens !== scriptCloses) {
    warnings.push(`Mismatched <script> tags: ${scriptOpens} opens vs ${scriptCloses} closes`);
  }

  // Check 8: CSS custom property referenced but not defined
  if (/var\(--color-primary\)/i.test(result) && !/--color-primary\s*:/.test(result)) {
    warnings.push("CSS variable --color-primary referenced but never defined");
  }

  return { html: result, fixes, warnings };
}
