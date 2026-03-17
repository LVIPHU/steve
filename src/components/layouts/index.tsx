export { BlogLayout } from "./blog-layout";
export { PortfolioLayout } from "./portfolio-layout";
export { FitnessLayout } from "./fitness-layout";
export { CookingLayout } from "./cooking-layout";
export { LearningLayout } from "./learning-layout";

import type { WebsiteAST } from "@/types/website-ast";
import { BlogLayout } from "./blog-layout";
import { PortfolioLayout } from "./portfolio-layout";
import { FitnessLayout } from "./fitness-layout";
import { CookingLayout } from "./cooking-layout";
import { LearningLayout } from "./learning-layout";

interface TemplateRendererProps {
  templateId: string;
  ast: WebsiteAST;
}

export function TemplateRenderer({ templateId, ast }: TemplateRendererProps) {
  switch (templateId) {
    case "blog":
      return <BlogLayout ast={ast} />;
    case "portfolio":
      return <PortfolioLayout ast={ast} />;
    case "fitness":
      return <FitnessLayout ast={ast} />;
    case "cooking":
      return <CookingLayout ast={ast} />;
    case "learning":
      return <LearningLayout ast={ast} />;
    default:
      return <BlogLayout ast={ast} />;
  }
}
