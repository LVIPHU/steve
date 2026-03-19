export { HeroSection } from "./hero-section";
export { AboutSection } from "./about-section";
export { FeaturesSection } from "./features-section";
export { ContentSection } from "./content-section";
export { GallerySection } from "./gallery-section";
export { CtaSection } from "./cta-section";
export { GoalsSection } from "./goals-section";
export { QuizSection } from "./quiz-section";
export { FlashcardSection } from "./flashcard-section";
export { StepsSection } from "./steps-section";
export { IngredientsSection } from "./ingredients-section";

import type { Section, WebsiteTheme } from "@/types/website-ast";
import { HeroSection } from "./hero-section";
import { AboutSection } from "./about-section";
import { FeaturesSection } from "./features-section";
import { ContentSection } from "./content-section";
import { GallerySection } from "./gallery-section";
import { CtaSection } from "./cta-section";
import { GoalsSection } from "./goals-section";
import { QuizSection } from "./quiz-section";
import { FlashcardSection } from "./flashcard-section";
import { StepsSection } from "./steps-section";
import { IngredientsSection } from "./ingredients-section";

interface SectionRendererProps {
  section: Section;
  theme: WebsiteTheme;
}

export function SectionRenderer({ section, theme }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} theme={theme} />;
    case "about":
      return <AboutSection section={section} theme={theme} />;
    case "features":
      return <FeaturesSection section={section} theme={theme} />;
    case "content":
      return <ContentSection section={section} theme={theme} />;
    case "gallery":
      return <GallerySection section={section} theme={theme} />;
    case "cta":
      return <CtaSection section={section} theme={theme} />;
    case "goals":
      return <GoalsSection section={section} theme={theme} />;
    case "quiz":
      return <QuizSection section={section} theme={theme} />;
    case "flashcard":
      return <FlashcardSection section={section} theme={theme} />;
    case "steps":
      return <StepsSection section={section} theme={theme} />;
    case "ingredients":
      return <IngredientsSection section={section} theme={theme} />;
    default:
      return null;
  }
}
