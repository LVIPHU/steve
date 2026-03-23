import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Adding pages column to websites table...");

  await sql`ALTER TABLE "websites" ADD COLUMN IF NOT EXISTS "pages" jsonb`;
  console.log("Column added.");

  const result = await sql`
    UPDATE "websites"
    SET "pages" = jsonb_build_object('index', html_content)
    WHERE html_content IS NOT NULL AND "pages" IS NULL
  `;
  console.log(`Data migrated: ${result.count} rows updated.`);

  await sql.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
