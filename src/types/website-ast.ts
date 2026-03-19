export type SectionType =
  | "hero"
  | "about"
  | "features"
  | "content"
  | "gallery"
  | "cta"
  | "steps"
  | "quiz"
  | "flashcard"
  | "goals"
  | "ingredients";

export interface HeroContent {
  headline: string;
  subtext: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface AboutContent {
  title: string;
  body: string;
}

export interface FeaturesContent {
  title: string;
  items: Array<{ icon: string; label: string; description: string }>;
}

export interface ContentContent {
  title: string;
  body: string;
}

export interface GalleryContent {
  title: string;
  images: Array<{ url: string; caption: string }>;
}

export interface CtaContent {
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}

export interface StepsContent {
  title: string;
  items: Array<{ label: string; description: string; imageUrl?: string }>;
}

export interface IngredientsContent {
  title: string;
  items: Array<{ name: string; quantity: string }>;
}

export interface GoalsContent {
  title: string;
  items: Array<{ label: string }>;
}

export interface FlashcardContent {
  title: string;
  cards: Array<{ front: string; back: string }>;
}

export interface QuizContent {
  title: string;
  questions: Array<{
    question: string;
    choices: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
  }>;
}

export type SectionContent =
  | HeroContent
  | AboutContent
  | FeaturesContent
  | ContentContent
  | GalleryContent
  | CtaContent
  | StepsContent
  | IngredientsContent
  | GoalsContent
  | FlashcardContent
  | QuizContent;

export interface Section {
  id: string;
  type: SectionType;
  ai_content: SectionContent;
  manual_overrides: Partial<SectionContent>;
}

export interface WebsiteTheme {
  primaryColor: string;
  backgroundColor: string;
  font: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  slug: string;
}

export interface WebsiteAST {
  theme: WebsiteTheme;
  sections: Section[];
  seo: SeoMeta;
}
