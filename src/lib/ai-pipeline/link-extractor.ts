/**
 * Agent 1: Link Extractor (Deterministic)
 * Parse index HTML to extract all internal links, nav, footer, design tokens.
 */
import type { LinkExtractResult } from "./types";

export function extractLinks(html: string): LinkExtractResult {
  // 1. Extract internal links (relative, no protocol, no hash-only, no mailto)
  const linkRegex = /<a[^>]*href="([a-z][a-z0-9-]*)"[^>]*>/gi;
  const linksSet = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].replace(/\.html$/, "").replace(/^\//, "");
    if (href && href !== "index" && !href.startsWith("http") && !href.startsWith("#")) {
      linksSet.add(href);
    }
  }

  // 2. Extract <nav>...</nav>
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  const navHtml = navMatch?.[0] ?? "";

  // 3. Extract <footer>...</footer>
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  const footerHtml = footerMatch?.[0] ?? "";

  // 4. Extract CSS custom properties (palette)
  const paletteRegex = /--color-[a-z]+:\s*#[0-9a-fA-F]{3,8}/gi;
  const palette = (html.match(paletteRegex) ?? []).map((s) => s.trim());

  // 5. Extract Google Fonts
  const fontRegex = /family=([A-Za-z+]+)/g;
  const fontsSet = new Set<string>();
  while ((match = fontRegex.exec(html)) !== null) {
    fontsSet.add(match[1].replace(/\+/g, " "));
  }

  return {
    links: Array.from(linksSet),
    navHtml,
    footerHtml,
    palette,
    fonts: Array.from(fontsSet),
  };
}
