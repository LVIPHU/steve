import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json({ error: "file field is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "File must be an image" }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File size must not exceed 5MB" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const fileName = `${session.user.id}/${Date.now()}-${file.name}`;

  const { error: storageError } = await supabase.storage
    .from("website-images")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (storageError) {
    return Response.json({ error: storageError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("website-images").getPublicUrl(fileName);

  return Response.json({ url: data.publicUrl });
}
