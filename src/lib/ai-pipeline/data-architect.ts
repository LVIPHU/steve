/**
 * Agent 4: Data Architect (LLM — gpt-4o-mini)
 * Design data contracts (localStorage keys, data formats) between pages.
 */
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { DataContracts, PagePlan } from "./types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

const DataContractsSchema = z.object({
  stores: z.array(z.object({
    key: z.string().describe("localStorage key name, e.g. 'appgen-vocab-list'"),
    schema: z.string().describe("JSON schema description, e.g. 'Array of {word: string, meaning: string, learned: boolean}'"),
    readBy: z.array(z.string()).describe("Page names that read this store"),
    writtenBy: z.array(z.string()).describe("Page names that write to this store"),
  })),
  flows: z.array(z.object({
    from: z.string().describe("Source page name"),
    to: z.string().describe("Destination page name"),
    dataDescription: z.string().describe("What data flows between these pages"),
  })),
});

const SYSTEM_PROMPT = `You are a Data Architect for web applications. Given a page plan, design the data contracts that enable pages to share state via localStorage.

Your tasks:
1. Identify what data each page needs to read and write
2. Design localStorage keys with clear naming convention (prefix: 'appgen-')
3. Define the schema for each stored value (JSON structure)
4. Map data flows between pages

Rules:
- Use consistent key naming: 'appgen-{feature}-{type}' e.g. 'appgen-quiz-scores', 'appgen-vocab-list'
- All values stored as JSON strings in localStorage
- Keep schemas simple — arrays of objects or single objects
- If a page has no data requirements (e.g. static "about" page), don't create unnecessary stores
- Include an 'appgen-user-settings' store if dark mode or preferences are used
- For quiz/learning apps: track scores with timestamps for history
- Return empty stores/flows arrays if the website is purely static (no interactive data)`;

export async function designDataContracts(
  pagePlan: PagePlan,
  originalPrompt: string,
  websiteType: string
): Promise<DataContracts> {
  const pageList = pagePlan.pages
    .map((p) => `- ${p.name}: ${p.purpose}\n  Features: ${p.features.join(", ")}\n  Data needs: ${p.dataRequirements}`)
    .join("\n");

  const userMessage = `## Website Type
${websiteType}

## Original User Request
${originalPrompt}

## Pages and Their Data Needs
- index: Main landing/home page (already generated)
${pageList}`;

  const completion = await getOpenAI().chat.completions.parse(
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: zodResponseFormat(DataContractsSchema, "data_contracts"),
    },
    { signal: AbortSignal.timeout(20000) }
  );

  return completion.choices[0].message.parsed! as DataContracts;
}
