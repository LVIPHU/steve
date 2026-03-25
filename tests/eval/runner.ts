import "dotenv/config";
import { evalPrompts, type EvalPrompt } from "./prompts";
import { runGenerationPipeline } from "../../src/lib/ai-pipeline/index";

interface EvalResult {
  id: string;
  passed: boolean;
  score: number;    // 0-100
  failures: string[];
  htmlLength: number;
  latencyMs: number;
}

function evaluate(prompt: EvalPrompt, html: string): Omit<EvalResult, "id" | "latencyMs"> {
  const failures: string[] = [];
  let score = 100;

  if (prompt.expected.hasDoctype && !/<!DOCTYPE html>/i.test(html)) {
    failures.push("Missing DOCTYPE"); score -= 10;
  }
  if (prompt.expected.hasViewport && !/<meta[^>]*viewport/i.test(html)) {
    failures.push("Missing viewport"); score -= 10;
  }
  if (prompt.expected.hasTailwindCdn && !/cdn\.tailwindcss\.com/i.test(html)) {
    failures.push("Missing Tailwind CDN"); score -= 15;
  }
  if (html.length < prompt.expected.minLength) {
    failures.push(`HTML too short: ${html.length} < ${prompt.expected.minLength}`); score -= 20;
  }
  if (prompt.expected.hasNavbar && !/<nav[\s>]/i.test(html)) {
    failures.push("Missing navbar"); score -= 10;
  }
  if (prompt.expected.hasCta && !/<button|href="[^"]*"/i.test(html)) {
    failures.push("No CTA found"); score -= 10;
  }
  for (const section of prompt.expected.hasSections) {
    if (!html.toLowerCase().includes(section.toLowerCase())) {
      failures.push(`Missing section content: "${section}"`); score -= 5;
    }
  }

  return { passed: failures.length === 0, score: Math.max(0, score), failures, htmlLength: html.length };
}

async function runEvals() {
  const results: EvalResult[] = [];
  let passed = 0;

  console.log(`\nRunning ${evalPrompts.length} eval prompts...\n`);

  for (const ep of evalPrompts) {
    const t0 = Date.now();
    let html = "";

    try {
      html = await runGenerationPipeline({
        prompt: ep.prompt,
        onEvent: () => {},  // silent
      });
    } catch (e) {
      results.push({ id: ep.id, passed: false, score: 0, failures: [`Pipeline error: ${e}`], htmlLength: 0, latencyMs: Date.now() - t0 });
      console.log(`FAIL ${ep.id} - Pipeline error: ${e}`);
      continue;
    }

    const ev = evaluate(ep, html);
    const result: EvalResult = { id: ep.id, ...ev, latencyMs: Date.now() - t0 };
    results.push(result);

    if (result.passed) {
      passed++;
      console.log(`PASS ${ep.id} (${result.score}/100, ${result.htmlLength} chars, ${result.latencyMs}ms)`);
    } else {
      console.log(`FAIL ${ep.id} (${result.score}/100, ${result.latencyMs}ms)\n   ${result.failures.join("\n   ")}`);
    }
  }

  console.log(`\nResults: ${passed}/${evalPrompts.length} passed`);
  console.log(`   Avg score: ${Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)}/100`);
  console.log(`   Avg latency: ${Math.round(results.reduce((a, r) => a + r.latencyMs, 0) / results.length)}ms\n`);

  process.exit(passed === evalPrompts.length ? 0 : 1);
}

runEvals().catch(console.error);
