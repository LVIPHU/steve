-- Add pages JSONB column to websites table (Phase 13: Multi-page Website Support)
ALTER TABLE "websites" ADD COLUMN IF NOT EXISTS "pages" jsonb;

-- Migrate existing htmlContent to pages.index for all rows that have htmlContent
UPDATE "websites" SET "pages" = jsonb_build_object('index', html_content) WHERE html_content IS NOT NULL AND "pages" IS NULL;
