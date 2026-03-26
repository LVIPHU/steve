/**
 * Agent 7: Consistency Checker (Deterministic)
 * Verify links, nav, design consistency across all generated pages.
 */
import type { ConsistencyResult, PagePlan } from "./types";

export function checkConsistency(
  allPages: Record<string, string>,
  pagePlan: PagePlan
): ConsistencyResult {
  const pageNames = Object.keys(allPages);
  const brokenLinks: string[] = [];
  const missingPages: string[] = [];
  const navInconsistencies: string[] = [];
  const warnings: string[] = [];

  // 1. Check every internal link in every page points to an existing page
  const linkRegex = /<a[^>]*href="([a-z][a-z0-9-]*)"[^>]*>/gi;
  for (const [pageName, html] of Object.entries(allPages)) {
    let match: RegExpExecArray | null;
    const checkedLinks = new Set<string>();
    while ((match = linkRegex.exec(html)) !== null) {
      const target = match[1].replace(/\.html$/, "").replace(/^\//, "");
      if (target && !target.startsWith("http") && !target.startsWith("#") && !checkedLinks.has(target)) {
        checkedLinks.add(target);
        if (!(target in allPages)) {
          brokenLinks.push(`${pageName} -> "${target}" (page does not exist)`);
        }
      }
    }
  }

  // 2. Check planned pages were actually generated
  for (const planned of pagePlan.pages) {
    if (!(planned.name in allPages) || !allPages[planned.name]?.trim()) {
      missingPages.push(planned.name);
    }
  }

  // 3. Check nav consistency — every page should have a <nav>
  const pagesWithNav: string[] = [];
  const pagesWithoutNav: string[] = [];
  for (const [pageName, html] of Object.entries(allPages)) {
    if (/<nav[\s\S]*?<\/nav>/i.test(html)) {
      pagesWithNav.push(pageName);
    } else {
      pagesWithoutNav.push(pageName);
    }
  }
  if (pagesWithNav.length > 0 && pagesWithoutNav.length > 0) {
    navInconsistencies.push(
      `Pages without nav: ${pagesWithoutNav.join(", ")} (but ${pagesWithNav.join(", ")} have nav)`
    );
  }

  // 4. Check footer consistency
  const pagesWithFooter: string[] = [];
  const pagesWithoutFooter: string[] = [];
  for (const [pageName, html] of Object.entries(allPages)) {
    if (/<footer[\s\S]*?<\/footer>/i.test(html)) {
      pagesWithFooter.push(pageName);
    } else {
      pagesWithoutFooter.push(pageName);
    }
  }
  if (pagesWithFooter.length > 0 && pagesWithoutFooter.length > 0) {
    warnings.push(
      `Pages without footer: ${pagesWithoutFooter.join(", ")}`
    );
  }

  // 5. Check palette consistency (at least same primary color across pages)
  const primaryColors = new Map<string, string>();
  for (const [pageName, html] of Object.entries(allPages)) {
    const primaryMatch = html.match(/--color-primary:\s*(#[0-9a-fA-F]{3,8})/i);
    if (primaryMatch) {
      primaryColors.set(pageName, primaryMatch[1].toLowerCase());
    }
  }
  const uniqueColors = new Set(primaryColors.values());
  if (uniqueColors.size > 1) {
    warnings.push(
      `Different primary colors detected: ${Array.from(primaryColors.entries()).map(([p, c]) => `${p}=${c}`).join(", ")}`
    );
  }

  return { brokenLinks, missingPages, navInconsistencies, warnings };
}
