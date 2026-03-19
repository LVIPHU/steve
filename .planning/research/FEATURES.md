# Feature Research

**Domain:** AI-powered HTML website generation pipeline (Enhanced AI Pipeline v1.1)
**Researched:** 2026-03-19
**Confidence:** HIGH (pipeline architecture verified against official OpenAI docs + production AI tool patterns)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features the pipeline must deliver for the product to feel credible. Missing any of these makes the output feel like a toy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Visible progress steps during generation | v0.dev, Bolt.new, Lovable all show step-by-step progress; users expect to see what AI is doing, not a spinner | LOW | Already done via SSE. Step labels in Vietnamese must match new 7-step flow. |
| Output that doesn't look like a default template | Every AI website builder in 2025 ships with generic blue Bootstrap/DaisyUI defaults; users immediately recognize and reject it | HIGH | Root cause documented in phase-09: model re-uses DaisyUI default palette. Design Agent fixes this. |
| Edit requests that feel instant relative to fresh generation | Users understand fresh generation takes time; edits feel different — they expect a faster loop | MEDIUM | Edit mode skips Design/Review/Refine: ~35s vs ~73s. Correct instinct. |
| Content that matches the user's domain | Fitness site should not read like a SaaS landing page; cooking blog should not look corporate | MEDIUM | Analyzer already extracts domain. Design Agent translates domain to style preset. This is the key "intelligence" users value. |
| Generated HTML that works without errors | Broken JavaScript, invisible text (white-on-white), overflow issues = product failure | MEDIUM | Validate step (local regex) already exists. Review step catches deeper issues (alert(), Alpine x-for bugs). |
| Responsive output | Mobile responsiveness is assumed in 2025, not a feature | LOW | Enforced by DaisyUI + Tailwind utility classes. Technical score in Review deducts for fixed-pixel widths. |

### Differentiators (Competitive Advantage)

Features that elevate the product above "just another AI site generator." These justify the product's existence.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Design Agent: domain-aware visual identity | Unlike v0/Bolt which generate generic UI, this system picks a style preset (bold-dark, warm-organic, etc.) matched to user's content domain — fitness gets one palette, food blog gets another | MEDIUM | gpt-4o-mini call (~5s). 5 style presets cover the main user segments. Style is deterministic per domain type, not random. |
| Component library as reference injection | RAG-style: curated high-quality HTML snippets injected as "examples" into AI context. Model adapts structure+style without inventing from scratch — reduces variance and token waste on boilerplate | MEDIUM | ~25 static snippets, no vector DB needed. Tag-matching selector (local, ~0s). Max 4 snippets = ~1200 tokens injected. |
| Review + Conditional Refine gate | Production AI pipelines (Blueprint2Code, SELF-REFINE) demonstrate that a generate-then-critique loop improves output quality. Only triggering refine when score < 75 avoids unnecessary latency on already-good outputs | HIGH | Self-bias risk: same model reviewing its own output tends to over-score. Mitigation: use gpt-4o-mini (smaller, different optimization) to review gpt-4o output — not same model. Rubric specificity also limits self-preference. |
| OpenAI Prompt Caching for stable system prompt | ~800-token invariant system prompt gets cached automatically; per-request context moves to user message. Reduces latency ~50% on cached prefix and input token cost up to 90%. Users directly perceive this as faster generation. | LOW | Automatic for gpt-4o when prompt >= 1024 tokens (threshold met). Zero code changes needed beyond restructuring system vs user message split. Static content must come first. |
| Edit mode that skips unnecessary steps | Users who already have a styled website don't want the AI to redesign their colors. Skipping Design/Review/Refine in edit mode respects user's existing choices and cuts latency from ~73s to ~35s | LOW | Conditional branching in pipeline index.ts. Already specified in architecture. |
| CSS variable injection for consistent theming | Design Agent outputs hex values → injected as CSS custom properties → generator uses `var(--color-primary)` not hardcoded hex → consistent color application across all sections. DaisyUI components get overridden without fighting oklch tokens. | LOW | Verified pattern in phase-09 doc. Bypasses DaisyUI's oklch color system entirely — simpler and more debuggable. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem like improvements but create compounding problems for this pipeline.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Using same GPT-4o model for both generation and review | Seems like it maximizes intelligence in the review step | Research confirms LLMs exhibit 10%+ self-preference bias when evaluating their own output (NeurIPS 2024). GPT-4o reviewing GPT-4o output will systematically over-score, making the review gate useless. | Use gpt-4o-mini for review — different optimization target, no self-preference, cheaper, faster (~8s) |
| Unlimited refine iterations (loop until score >= 75) | Feels like it guarantees quality | Creates unbounded latency. Research on SELF-REFINE shows quality gains plateau after 1-2 iterations. Each refine adds ~25s. Two failed refines = 120s+ generation, hitting Vercel timeout. | Single refine pass only. If still poor, return best attempt. Threshold can be lowered (70 instead of 75) to reduce refine frequency. |
| Injecting all 25 component snippets into context | More examples = better model behavior | Token budget blows up to ~7500 tokens per request. Model attention dilution: too many references confuse the model — it tries to combine incompatible layouts. Cost increase defeats the savings from prompt caching. | Max 4 snippets (~1200 tokens). Tag-matching selector picks the most relevant ones for the detected website type. |
| Running Design Agent in edit mode | Seems logical to keep design consistent during edits | User already has an established visual identity they approved. Re-running Design Agent risks changing colors/fonts without the user asking for it. Creates jarring inconsistency between old and new HTML sections. | Skip Design Agent in edit mode. If user explicitly asks "change colors to blue", handle it in the Generate step via user message, not via Design Agent. |
| Storing component snippets in a vector database | Sounds like proper RAG architecture | Overkill for 25 static snippets. Vector DB adds infrastructure dependency, embedding costs, and cold-start latency. Tag-matching on a small static set is deterministic, fast, and easy to debug. | Static TypeScript arrays with tag arrays. selectComponents() runs in ~0ms locally. Upgrade to vector search only if library grows beyond ~200 snippets. |
| Per-request prompt caching keys | Seems like explicit control over what gets cached | OpenAI prompt caching is fully automatic for gpt-4o — no cache key parameter exists. Any attempt to manually control it is based on misunderstanding the API. Cache triggers on exact prefix match for prompts >= 1024 tokens. | Just keep system prompt static and < first 1024 tokens. Moving variable content to user message is the correct mechanism. |

---

## Feature Dependencies

```
[Component Library: snippets/]
    └──required by──> [selectComponents() in context-builder]
                          └──required by──> [Generator: user message construction]

[Design Agent: designWebsite()]
    └──required by──> [Context Builder: buildUserMessage()]
                          └──required by──> [Generator: user message construction]
                                                └──feeds into──> [Reviewer: reviewHtml()]
                                                                     └──conditionally triggers──> [Refiner: refineHtml()]

[Lean System Prompt (~800 tokens)]
    └──enables──> [OpenAI Prompt Caching (automatic, >= 1024 tokens threshold)]
    └──required by──> [CSS Variable rules in system prompt]
                          └──required by──> [Design Agent CSS injection]

[Edit Mode Branch]
    └──skips──> [Design Agent]
    └──skips──> [Reviewer]
    └──skips──> [Refiner]
    └──uses──> [4-step subset: Analyze → Components → Generate → Validate]
```

### Dependency Notes

- **Component Library required before Context Builder:** snippets must exist before selectComponents() can inject them into user message. This is 09-01, done first.
- **Design Agent required before Generator refactor:** buildUserMessage() needs DesignResult to construct design brief section. Do 09-02 as a unit (design agent + context builder + new prompts together).
- **Lean System Prompt enables caching:** The caching benefit only materializes after system prompt is trimmed to ~800 tokens and variable content moves to user message. Both must be done in the same step.
- **Reviewer depends on completed Generate step:** Review reads the HTML output of Generate. No dependency on Design Agent output directly, but Design Agent output affects HTML quality which affects review score.
- **Refiner conflicts with Edit Mode:** Refiner must never fire in edit mode. Pipeline branching in index.ts is the enforcement point.
- **CSS variable injection conflicts with DaisyUI oklch tokens:** Verified in phase-09 that direct oklch override is fragile. Hex CSS vars bypass DaisyUI color tokens entirely. These two approaches cannot coexist — Cách B (hex injection) is the chosen path.

---

## MVP Definition

This is a milestone upgrade (v1.1), not a new product. The "MVP" for this milestone is: all 5 features ship together as a coherent pipeline, not piecemeal.

### Launch With (v1.1 — all required)

- [ ] Component Library (~25 snippets, tag-matching selector) — foundational for context injection
- [ ] Design Agent (gpt-4o-mini, 5 style presets, DesignResult type) — core quality improvement
- [ ] Context optimization (lean system prompt ~800 tokens, buildUserMessage()) — enables caching, improves model attention
- [ ] Review + Conditional Refine (gpt-4o-mini reviewer, threshold 75, single refine pass) — quality gate
- [ ] Edit mode branching (skip Design/Review/Refine, 4-step flow) — respects user intent, reduces latency

### Add After Validation (v1.x)

- [ ] Design Agent for Edit mode: extract current hex colors from existing HTML and pass into edit context — only add if users report style drift during edits
- [ ] Adjustable review threshold: surface threshold (currently 75) as a config constant, tune after observing real review scores in production logs
- [ ] Vietnamese content in component snippets: if users report that English placeholder content confuses the model for Vietnamese-language websites

### Future Consideration (v2+)

- [ ] Multi-page progressive generation (deferred per PROJECT.md) — fundamentally different pipeline with scaffold + per-page generation + hash router
- [ ] Component library expansion beyond ~25 snippets — only worthwhile after establishing quality bar for existing snippets
- [ ] User-visible "design style" selector (let user pick bold-dark vs warm-organic manually) — adds UI surface, requires editor changes, defer until Design Agent quality is validated

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Design Agent (domain-aware palette/typography) | HIGH — directly solves "generic blue website" complaint | MEDIUM — new file, gpt-4o-mini call, DesignResult type | P1 |
| Component Library (snippet injection) | HIGH — reduces output variance, model has reference structure | MEDIUM — ~25 snippets to write, tag matching logic | P1 |
| Lean System Prompt + Context Split | HIGH — enables caching, lowers latency/cost, better model attention | LOW — refactor existing prompts, no new infrastructure | P1 |
| Review + Conditional Refine | MEDIUM-HIGH — catches bad outputs before user sees them | HIGH — new file, new prompt, conditional branching, timeout risk | P1 (but test threshold carefully) |
| Edit Mode Branching | MEDIUM — latency reduction, user intent respect | LOW — conditional in pipeline index.ts, already architected | P1 |
| CSS Variable Injection | HIGH (enables Design Agent output) | LOW — string interpolation in context-builder | P1 (dependency of Design Agent) |

**Priority key:**
- P1: Required for v1.1 milestone — all 5 features ship together
- P2: Add after validating v1.1 quality
- P3: Future milestone

---

## Competitor Feature Analysis

Context: This is an internal app, not competing with v0/Bolt commercially. But understanding what those tools do informs what "good" looks like to users who have used them.

| Feature | v0.dev | Bolt.new | Our Approach |
|---------|--------|----------|--------------|
| Visual style control | User picks component style from UI; no domain-aware auto-selection | No explicit design system; relies on model's training | Design Agent: automatic domain-to-style mapping; no UI picker needed |
| Component references | v0 uses its own React component library as the reference corpus | Bolt generates from scratch each time | Static HTML/DaisyUI snippets injected as text context; simpler, no component registry |
| Quality gate / review loop | No explicit review step; iterative editing by user | No review step; user edits iteratively | Automated review+refine before showing result; reduces user iteration cycles |
| Edit latency | Streaming incremental component updates | Full regeneration on each prompt | Edit mode: 4-step subset (~35s) vs fresh mode 7-step (~48-73s) |
| Prompt caching | Vercel infrastructure handles caching at platform level | Likely uses similar platform-level caching | Explicit system/user message split to maximize OpenAI automatic prefix caching |
| Multi-page support | Native: v0 generates component files, not single-page | Full multi-page apps are the core use case | Deferred to v1.2 (single HTML file with JS hash router) |

---

## Sources

- [OpenAI Prompt Caching — official docs](https://platform.openai.com/docs/guides/prompt-caching) — HIGH confidence. Confirms: automatic for gpt-4o, minimum 1024 tokens, up to 80% latency reduction, static-first ordering required.
- [OpenAI Prompt Caching announcement](https://openai.com/index/api-prompt-caching/) — HIGH confidence.
- [SELF-REFINE: Iterative Refinement with Self-Feedback](https://learnprompting.org/docs/advanced/self_criticism/self_refine) — MEDIUM confidence. Confirms generate-review-refine pattern is established; quality improves but plateaus.
- [Self-Preference Bias in LLM-as-a-Judge (NeurIPS 2024)](https://arxiv.org/abs/2410.21819) — HIGH confidence. Confirms GPT-4 shows ~10% self-preference bias; use different model for review.
- [Blueprint2Code multi-agent pipeline](https://pmc.ncbi.nlm.nih.gov/articles/PMC12575318/) — MEDIUM confidence. Confirms Previewing Agent (retrieval of relevant patterns) + Coding Agent + Debugging Agent is production pattern for code generation.
- [LLM-as-a-Judge: what engineers get wrong](https://vadim.blog/llm-as-judge) — MEDIUM confidence. Documents 12 bias types; verbosity bias, self-preference bias are most relevant here.
- [v0 vs Bolt.new comparison 2026](https://www.index.dev/blog/v0-vs-bolt-ai-app-builder-review) — MEDIUM confidence. Confirms user expectations: instant preview, step visibility, iterative editing.
- [AI agent latency optimization — LangChain](https://blog.langchain.com/how-do-i-speed-up-my-agent/) — MEDIUM confidence. Confirms streaming + step visibility reduces perceived latency even when total latency is unchanged.

---
*Feature research for: Enhanced AI Pipeline v1.1 — AI HTML Website Generation*
*Researched: 2026-03-19*
