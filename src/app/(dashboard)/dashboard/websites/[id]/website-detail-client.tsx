"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionRenderer } from "@/components/sections";
import type { WebsiteAST, SeoMeta } from "@/types/website-ast";
import { cn } from "@/lib/utils";

interface WebsiteDetailClientProps {
  website: {
    id: string;
    name: string;
    slug: string;
    status: string;
    sourceNoteId: string | null;
    templateId: string | null;
    content: WebsiteAST | null;
    seoMeta: SeoMeta | null;
  };
  templateName: string;
  templateEmoji: string;
  username: string;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      aria-label={`Status: ${status}`}
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "published" &&
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        status === "draft" &&
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        status === "archived" &&
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      )}
    >
      {status === "published"
        ? "Published"
        : status === "draft"
          ? "Draft"
          : "Archived"}
    </span>
  );
}

export function WebsiteDetailClient({
  website,
  templateName,
  templateEmoji,
  username,
}: WebsiteDetailClientProps) {
  const [content, setContent] = useState<WebsiteAST | null>(website.content);
  const [status, setStatus] = useState<string>(website.status);
  const [slug, setSlug] = useState<string>(website.slug);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasContent = content !== null;
  const isPublished = status === "published";

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    // If website has sourceNoteId, fetch note JSON from mobile API first
    // This implements F-10's "note JSON + template + prompt -> Website AST" requirement
    let noteJson: string | null = null;
    if (website.sourceNoteId) {
      try {
        const noteRes = await fetch(`/api/notes/${website.sourceNoteId}`);
        if (noteRes.ok) {
          const noteData = await noteRes.json();
          noteJson = JSON.stringify(noteData);
        }
      } catch {
        // If note fetch fails, proceed without note (degrade gracefully)
        console.warn("Failed to fetch note, generating without note content");
      }
    }

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId: website.id, noteJson, prompt: null }),
    });

    if (!res.ok) {
      if (res.status === 504) {
        setError(
          "Generation timed out (30s). Try again — the request may succeed on retry."
        );
      } else {
        setError(
          "Generation failed. OpenAI did not return a valid response. Try again or check your connection."
        );
      }
      setGenerating(false);
      return;
    }

    const data = await res.json();
    setContent(data.content);
    setSlug(data.content.seo.slug);
    setGenerating(false);
  }

  async function handlePublish() {
    if (!slug.trim()) return;
    setPublishing(true);
    setError(null);

    const res = await fetch(`/api/websites/${website.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published", slug }),
    });

    if (!res.ok) {
      setError("This URL is already taken. Choose a different slug.");
      setPublishing(false);
      return;
    }

    setStatus("published");
    setPublishing(false);
  }

  return (
    <div>
      {/* Header: title + status badge + edit button */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-xl font-semibold">{website.name}</h1>
        <StatusBadge status={status} />
        {hasContent && (
          <Link href={`/dashboard/websites/${website.id}/edit`} className="ml-auto">
            <Button variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Chinh sua website
            </Button>
          </Link>
        )}
      </div>

      {/* Info card */}
      <Card className="mb-6">
        <CardContent className="px-6 py-4">
          <dl className="space-y-3 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 shrink-0">Template:</dt>
              <dd>
                {templateEmoji ? (
                  <span>
                    {templateEmoji} {templateName}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{templateName}</span>
                )}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 shrink-0">Source:</dt>
              <dd>
                {website.sourceNoteId ? (
                  <span className="font-mono text-xs">{website.sourceNoteId}</span>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 shrink-0">Status:</dt>
              <dd>
                <StatusBadge status={status} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Error banner */}
      {error ? (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      ) : null}

      {/* Generate / Regenerate + preview */}
      {!hasContent ? (
        <Card>
          <CardContent className="px-6 py-6 flex flex-col items-center gap-2">
            <p className="text-base font-semibold">Ready to generate</p>
            <p className="text-sm text-muted-foreground">
              Click Generate Website to create your site content using AI.
            </p>
            <Button
              variant="default"
              size="lg"
              className="w-full mt-4 min-h-[48px]"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Website"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Regenerate button (secondary) */}
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Regenerating will overwrite all AI-generated content. Your manual
              edits will be preserved.
            </p>
          </div>

          {/* Slug input + Publish */}
          <Card className="mb-6">
            <CardContent className="px-6 py-4 space-y-2">
              <Label htmlFor="slug">Public URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">
                  {username}/
                </span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="your-website-slug"
                  maxLength={32}
                />
              </div>
              {isPublished ? (
                <div className="space-y-2">
                  <a
                    href={`/${username}/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    /{username}/{slug}
                  </a>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePublish}
                    disabled={publishing || !slug.trim()}
                  >
                    {publishing ? "Updating..." : "Update Slug"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handlePublish}
                  disabled={publishing || !slug.trim()}
                >
                  {publishing ? "Publishing..." : "Publish"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
          <Card className="border overflow-y-auto max-h-[600px]">
            <CardContent className="p-4">
              {content.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  theme={content.theme}
                />
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
