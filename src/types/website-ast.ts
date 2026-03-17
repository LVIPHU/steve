export type SectionType = "hero" | "about" | "features" | "content" | "gallery" | "cta";

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

export type SectionContent =
  | HeroContent
  | AboutContent
  | FeaturesContent
  | ContentContent
  | GalleryContent
  | CtaContent;

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
