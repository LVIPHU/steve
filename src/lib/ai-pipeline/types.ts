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
  step: "analyze" | "components" | "design" | "generate" | "review" | "refine" | "validate" | "complete" | "error";
  status: "start" | "done" | "streaming";
  detail?: string; // shown in chat panel
  chunk?: string;  // raw HTML chunk when streaming
  html?: string; // only on complete
  fix_count?: number; // only on validate done
  error?: string; // only on error
}
