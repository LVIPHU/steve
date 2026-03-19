import type { ComponentSnippet } from "../types";
import { heroSnippets } from "./hero";
import { navbarSnippets } from "./navbar";
import { featuresSnippets } from "./features";
import { cardsSnippets } from "./cards";
import { footerSnippets } from "./footer";
import { statsSnippets } from "./stats";
import { testimonialsSnippets } from "./testimonials";
import { interactiveSnippets } from "./interactive";
import { blogSnippets } from "./blog";
import { portfolioSnippets } from "./portfolio";
import { ecommerceSnippets } from "./ecommerce";

export const ALL_SNIPPETS: ComponentSnippet[] = [
  ...heroSnippets,
  ...navbarSnippets,
  ...featuresSnippets,
  ...cardsSnippets,
  ...footerSnippets,
  ...statsSnippets,
  ...testimonialsSnippets,
  ...interactiveSnippets,
  ...blogSnippets,
  ...portfolioSnippets,
  ...ecommerceSnippets,
];
