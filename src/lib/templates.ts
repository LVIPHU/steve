export const TEMPLATES = [
  { id: "blog", name: "Blog", icon: "\ud83d\udcdd" },
  { id: "portfolio", name: "Portfolio", icon: "\ud83d\udcbc" },
  { id: "fitness", name: "Fitness", icon: "\ud83d\udcaa" },
  { id: "cooking", name: "Cooking", icon: "\ud83c\udf73" },
  { id: "learning", name: "Learning", icon: "\ud83c\udf93" },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const KEYWORD_MAP: Record<string, TemplateId> = {
  blog: "blog",
  bai: "blog",
  viet: "blog",
  post: "blog",
  article: "blog",
  portfolio: "portfolio",
  project: "portfolio",
  fitness: "fitness",
  gym: "fitness",
  workout: "fitness",
  exercise: "fitness",
  cooking: "cooking",
  nau: "cooking",
  recipe: "cooking",
  food: "cooking",
  learning: "learning",
  hoc: "learning",
  study: "learning",
  course: "learning",
  work: "portfolio",
};

export function suggestTemplate(input: string): TemplateId | null {
  if (!input) return null;
  const lower = input.toLowerCase();
  for (const [keyword, templateId] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) return templateId;
  }
  return null;
}
