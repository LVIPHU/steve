"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TEMPLATES, suggestTemplate, type TemplateId } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createWebsite } from "./action";

// --- Module-level sub-components (rerender-no-inline-components rule) ---

type TemplateCardProps = {
  id: TemplateId;
  name: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
};

function TemplateCard({ id, name, icon, selected, onClick }: TemplateCardProps) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "cursor-pointer rounded-lg border p-4 flex flex-col items-center gap-2 transition-colors",
        selected
          ? "ring-2 ring-primary border-primary"
          : "border-border hover:border-border/60 hover:bg-muted/50"
      )}
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="text-sm font-semibold">{name}</span>
    </div>
  );
}

type SuggestionBannerProps = {
  templateName: string;
  onDismiss: () => void;
};

function SuggestionBanner({ templateName, onDismiss }: SuggestionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="bg-muted rounded-lg px-4 py-2 flex items-center justify-between text-sm mb-4">
        <span>Goi y dua tren note cua ban: {templateName}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onDismiss}
          aria-label="Dong goi y"
        >
          <X />
        </Button>
      </div>
    </motion.div>
  );
}

// --- Main page component ---

export default function CreateWebsitePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<"note" | "prompt">("note");
  const [noteId, setNoteId] = useState("");
  const [promptText, setPromptText] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId | null>(null);
  const [suggestedTemplate, setSuggestedTemplate] = useState<TemplateId | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNoteIdBlur() {
    if (!noteId.trim()) return;
    const suggestion = suggestTemplate(noteId);
    if (suggestion) {
      setSuggestedTemplate(suggestion);
      setShowSuggestion(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui long nhap ten website");
      return;
    }
    if (!selectedTemplateId) {
      setError("Vui long chon mot template");
      return;
    }

    setLoading(true);

    const result = await createWebsite({
      name,
      templateId: selectedTemplateId,
      sourceNoteId: activeTab === "note" ? noteId : undefined,
      promptText: activeTab === "prompt" ? promptText : undefined,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // redirect happens server-side on success
  }

  const suggestedTemplateName = suggestedTemplate
    ? TEMPLATES.find((t) => t.id === suggestedTemplate)?.name ?? null
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">Tao website moi</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} noValidate>
            {/* Website name */}
            <div className="mb-4">
              <Label htmlFor="website-name" className="mb-1.5 block">
                Ten website
              </Label>
              <Input
                id="website-name"
                type="text"
                placeholder="Nhap ten website cua ban..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Tabs */}
            <div
              role="tablist"
              className="flex border-b border-border mb-4"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "note"}
                aria-controls="tab-panel-note"
                id="tab-note"
                onClick={() => setActiveTab("note")}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === "note"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Tu Note
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "prompt"}
                aria-controls="tab-panel-prompt"
                id="tab-prompt"
                onClick={() => setActiveTab("prompt")}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === "prompt"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Tu viet prompt
              </button>
            </div>

            {/* Tab panels */}
            <div className="mb-6">
              {activeTab === "note" ? (
                <div
                  role="tabpanel"
                  id="tab-panel-note"
                  aria-labelledby="tab-note"
                >
                  <Label htmlFor="note-id" className="mb-1.5 block">
                    Note ID
                  </Label>
                  <Input
                    id="note-id"
                    type="text"
                    placeholder="Nhap Note ID tu app mobile..."
                    value={noteId}
                    onChange={(e) => setNoteId(e.target.value)}
                    onBlur={handleNoteIdBlur}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div
                  role="tabpanel"
                  id="tab-panel-prompt"
                  aria-labelledby="tab-prompt"
                >
                  <Label htmlFor="prompt-text" className="mb-1.5 block">
                    Mo ta website
                  </Label>
                  <textarea
                    id="prompt-text"
                    rows={4}
                    placeholder="Chu de, muc tieu, doi tuong doc gia, phong cach... Cang chi tiet cang tot."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    disabled={loading}
                    className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                  />
                </div>
              )}
            </div>

            {/* Template selection */}
            <div className="mb-6">
              <Label className="mb-2 block">Chon template</Label>

              <AnimatePresence>
                {showSuggestion && suggestedTemplateName && (
                  <SuggestionBanner
                    templateName={suggestedTemplateName}
                    onDismiss={() => setShowSuggestion(false)}
                  />
                )}
              </AnimatePresence>

              <div
                role="radiogroup"
                aria-label="Chon template"
                className="grid grid-cols-3 gap-4"
              >
                {TEMPLATES.map((template) => (
                  <TemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    icon={template.icon}
                    selected={selectedTemplateId === template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={loading}
              >
                Huy
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                aria-busy={loading}
              >
                {loading && <Loader2 className="animate-spin" />}
                Tao website
              </Button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-destructive mt-3">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
