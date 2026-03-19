export interface ComponentSnippet {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  priority: number;
  domain_hints: string[];
  min_score: number;
  fallback: boolean;
  fallback_for: string[];
  html: string;
}
