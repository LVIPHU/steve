import "dotenv/config";
import { db } from "@/db";
import { sql } from "drizzle-orm";

async function migrate() {
  await db.execute(sql`
    ALTER TABLE websites
      DROP COLUMN IF EXISTS content,
      DROP COLUMN IF EXISTS template_id,
      DROP COLUMN IF EXISTS seo_meta,
      DROP COLUMN IF EXISTS sync_status,
      DROP COLUMN IF EXISTS last_synced_at,
      ADD COLUMN IF NOT EXISTS chat_history JSONB
  `);
  console.log("Migration 08 complete");
  process.exit(0);
}
migrate();
