export function buildFreshSystemPrompt(): string {
  return `You are an expert web developer. Generate a complete, self-contained website as a Single HTML file with ALL CSS embedded in <style> tags and ALL JavaScript in <script> tags.

Rules:
- Mobile-first responsive design
- You may use these approved CDNs only: cdn.tailwindcss.com, chart.js, alpinejs
- For any persistent state, use localStorage with the "appgen-" prefix for all keys (e.g., "appgen-data", "appgen-settings")
- Do NOT use any external images or fonts that require authentication
- Make the design visually polished and professional
- Output ONLY the raw HTML — no explanation, no markdown, no commentary
- Start your response with <!DOCTYPE html>`;
}

export function buildEditSystemPrompt(currentHtml: string): string {
  return `You are an expert web developer editing an existing website. Here is the current HTML:

${currentHtml}

Rules:
- Apply the requested changes while preserving the overall structure and style
- Keep ALL CSS in <style> tags and ALL JavaScript in <script> tags
- Preserve all localStorage usage with the "appgen-" prefix — do not change key names
- Output the complete updated HTML file — not a diff, not a partial snippet
- Output ONLY the raw HTML — no explanation, no markdown, no commentary
- Start your response with <!DOCTYPE html>`;
}

export function stripMarkdownFences(raw: string): string {
  return raw.replace(/^```(?:html?)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
