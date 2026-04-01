import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), ".pipeline-logs.jsonl");

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = fs.readFileSync(LOG_PATH, "utf-8");
    return new Response(content, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Content-Disposition": 'attachment; filename="pipeline-logs.jsonl"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "No pipeline logs found" }, { status: 404 });
  }
}
