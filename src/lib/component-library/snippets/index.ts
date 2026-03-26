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
import { formsSnippets } from "./forms";
import { uiElementsSnippets } from "./ui-elements";
import { ctaSnippets } from "./cta";
import { mediaSnippets } from "./media";
import { pricingSnippets } from "./pricing";
import { notificationsSnippets } from "./notifications";
import { educationSnippets } from "./education";
import { exampleSnippets } from "./examples";

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
  ...formsSnippets,
  ...uiElementsSnippets,
  ...ctaSnippets,
  ...mediaSnippets,
  ...pricingSnippets,
  ...notificationsSnippets,
  ...educationSnippets,
  ...exampleSnippets,
];
