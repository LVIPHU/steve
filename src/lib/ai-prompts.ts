export const TEMPLATE_PRESETS: Record<string, string[]> = {
  blog: ["hero", "content", "cta"],
  portfolio: ["hero", "about", "features", "cta"],
  fitness: ["hero", "features", "content", "cta"],
  cooking: ["hero", "content", "gallery", "cta"],
  learning: ["hero", "content", "features", "cta"],
};

export const TEMPLATE_COLORS: Record<string, string> = {
  blog: "#2563eb",
  portfolio: "#7c3aed",
  fitness: "#16a34a",
  cooking: "#ea580c",
  learning: "#0891b2",
};

export const TEMPLATE_FONTS: Record<string, string> = {
  blog: "Inter",
  portfolio: "Playfair Display",
  fitness: "DM Sans",
  cooking: "Lora",
  learning: "Plus Jakarta Sans",
};

export function buildSystemPrompt(templateId: string): string {
  const sections = TEMPLATE_PRESETS[templateId] ?? TEMPLATE_PRESETS["blog"];
  const primaryColor = TEMPLATE_COLORS[templateId] ?? TEMPLATE_COLORS["blog"];
  const font = TEMPLATE_FONTS[templateId] ?? TEMPLATE_FONTS["blog"];

  return `You are a website content generator. Your task is to generate a complete website content structure in JSON format.

You MUST return a single valid JSON object matching the WebsiteAST schema exactly. No markdown, no code blocks, just raw JSON.

## Output Format

Return this exact JSON structure:

{
  "theme": {
    "primaryColor": "${primaryColor}",
    "backgroundColor": "#ffffff",
    "font": "${font}"
  },
  "sections": [
    {
      "id": "section-type-1",
      "type": "section_type",
      "ai_content": { /* section-specific fields */ },
      "manual_overrides": {}
    }
  ],
  "seo": {
    "title": "Page title (max 60 chars)",
    "description": "Meta description (max 155 chars)",
    "slug": "lowercase-hyphenated-slug"
  }
}

## Section Types and Their Fields

- "hero": { "headline": string, "subtext": string, "ctaText": string (optional), "ctaUrl": string (optional) }
- "about": { "title": string, "body": string }
- "features": { "title": string, "items": [{ "icon": string, "label": string, "description": string }] }
- "content": { "title": string, "body": string }
- "gallery": { "title": string, "images": [{ "url": string, "caption": string }] }
- "cta": { "title": string, "body": string, "buttonText": string, "buttonUrl": string }

## Template: ${templateId}

Suggested sections in order: ${sections.join(", ")}

You may adjust this order based on the content, but only use valid section types.

## Rules

- ALL field values must be plain strings (no markdown syntax, no HTML tags)
- Only use valid section types: hero, about, features, content, gallery, cta
- Each section must have a unique id (e.g., "hero-1", "content-1")
- The manual_overrides field must always be an empty object: {}
- The theme primaryColor is ${primaryColor} and font is ${font} — use these values exactly

## SEO Rules

- seo.title: max 60 characters, descriptive page title
- seo.description: max 155 characters, compelling meta description
- seo.slug: lowercase, hyphens only, no special characters, no spaces (e.g., "my-website-name")`;
}

export function buildUserPrompt(noteJson?: string | null, prompt?: string | null): string {
  if (!noteJson && !prompt) {
    return "Create a sample website with placeholder content.";
  }

  let result = "";

  if (noteJson) {
    result += `Here is the note content to turn into a website:\n\n${noteJson}`;
  }

  if (prompt) {
    if (result) {
      result += `\n\nAdditional instructions: ${prompt}`;
    } else {
      result += `Additional instructions: ${prompt}`;
    }
  }

  return result;
}
