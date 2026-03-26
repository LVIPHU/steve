export interface AnalysisResult {
  type: "landing" | "portfolio" | "dashboard" | "blog" | "generic";
  sections: string[]; // e.g. ["navbar", "hero", "flip-cards", "data-table", "footer"]
  features: string[]; // e.g. ["flip-animation", "prev-next-nav", "localStorage"]
  structured_data: string; // formatted data extracted from prompt (vocab table, etc.)
}

export interface ValidationResult {
  html: string;
  fixes: string[];
  warnings: string[];
}

export interface DesignResult {
  preset: "bold-dark" | "warm-organic" | "clean-minimal" | "playful-bright" | "professional-blue";
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: "sharp" | "rounded" | "pill";
  cardStyle: "flat" | "bordered" | "shadow" | "glass";
  heroStyle: "centered" | "split-left" | "split-right" | "bg-image";
  density: "compact" | "comfortable" | "spacious";
}

export interface ReviewResult {
  score: number;
  visual: number;
  content: number;
  technical: number;
  must_fix: string[];
  suggestions: string[];
}

export interface PipelineEvent {
  step:
    | "analyze" | "components" | "design" | "generate" | "review" | "refine" | "validate" | "complete" | "error"
    // Multi-page expansion events
    | "link-extract" | "ba-analysis" | "design-system" | "data-architect" | "pm-planning"
    | "page-generate" | "page-complete" | "consistency-check" | "all-complete";
  status: "start" | "done" | "streaming";
  detail?: string;
  chunk?: string;
  html?: string;
  fix_count?: number;
  error?: string;
  // Multi-page fields
  pageName?: string;
  pagePlan?: PagePlan;
  pageNames?: string[];
}

// ─── Multi-page agent types ───────────────────────────────────────────────────

export interface PlannedPage {
  name: string;           // slug: "quiz", "scores", "vocabulary"
  purpose: string;        // "Trang quiz kiem tra tu vung"
  sections: string[];     // ["navbar", "quiz-card", "progress-bar", "footer"]
  features: string[];     // ["flip-animation", "localStorage", "timer"]
  dataRequirements: string; // "doc tu vung tu localStorage key 'appgen-vocab'"
  connectsTo: string[];   // ["index", "scores"]
  priority: number;       // 1=critical, 2=important, 3=nice-to-have
}

export interface PagePlan {
  pages: PlannedPage[];
  sharedComponents: string[]; // ["navbar", "footer", "dark-mode-toggle"]
}

export interface DesignSystem {
  globalTokens: {
    palette: { primary: string; secondary: string; accent: string; bg: string; text: string; muted: string };
    fonts: { heading: string; body: string };
    borderRadius: "sharp" | "rounded" | "pill";
    cardStyle: "flat" | "bordered" | "shadow" | "glass";
    density: "compact" | "comfortable" | "spacious";
    spacing: { sectionPadding: string; containerMax: string };
  };
  sharedComponents: {
    navStyle: string;
    footerStyle: string;
    buttonPrimary: string;
    buttonSecondary: string;
    cardPattern: string;
    headingStyle: string;
  };
  pageDesigns: Array<{
    name: string;
    heroStyle: "centered" | "split-left" | "split-right" | "bg-image" | "none";
    layout: "single-column" | "sidebar" | "grid" | "dashboard";
    accentColor: string;
    mood: string;
    keyComponents: string[];
  }>;
}

export interface DataStore {
  key: string;
  schema: string;
  readBy: string[];
  writtenBy: string[];
}

export interface DataFlow {
  from: string;
  to: string;
  dataDescription: string;
}

export interface DataContracts {
  stores: DataStore[];
  flows: DataFlow[];
}

export interface PageSpec {
  name: string;
  generationPrompt: string;
  sections: string[];
  features: string[];
}

export interface LinkExtractResult {
  links: string[];
  navHtml: string;
  footerHtml: string;
  palette: string[];
  fonts: string[];
}

export interface ConsistencyResult {
  brokenLinks: string[];
  missingPages: string[];
  navInconsistencies: string[];
  warnings: string[];
}
