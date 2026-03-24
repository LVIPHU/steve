import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let prompt = "";
  try {
    const body = await request.json();
    prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return Response.json({ name: "Website mới" });
  }

  if (!prompt) return Response.json({ name: "Website mới" });

  try {
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'Extract a short Vietnamese website name (3–6 words) from the user\'s prompt. Return JSON: {"name": "..."}. No quotes, no punctuation at the end.',
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 30,
      },
      { signal: AbortSignal.timeout(8000) }
    );
    const parsed = JSON.parse(completion.choices[0].message.content ?? "{}") as { name?: string };
    return Response.json({ name: parsed.name || prompt.slice(0, 50) || "Website mới" });
  } catch {
    return Response.json({ name: prompt.slice(0, 50) || "Website mới" });
  }
}
