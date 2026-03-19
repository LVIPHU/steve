export interface AnalysisResult {
  type: "landing" | "portfolio" | "dashboard" | "blog" | "generic";
  sections: string[]; // e.g. ["navbar", "hero", "flip-cards", "data-table", "footer"]
  features: string[]; // e.g. ["flip-animation", "prev-next-nav", "localStorage"]
  structured_data: string; // formatted data extracted from prompt (vocab table, etc.)
}

export interface ResearchResult {
  css_patterns: string; // specific CSS rules for detected features
  daisyui_components: string; // which DaisyUI classes to use per section
  layout_rules: string; // explicit constraints (card heights, grid cols, etc.)
}

export interface ValidationResult {
  html: string;
  fixes: string[];
  warnings: string[];
}

export interface PipelineEvent {
  step: "analyze" | "research" | "generate" | "validate" | "complete" | "error";
  status: "start" | "done";
  detail?: string; // shown in chat panel
  html?: string; // only on complete
  fix_count?: number; // only on validate done
  error?: string; // only on error
}
