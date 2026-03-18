"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { WebsiteAST, WebsiteTheme, Section } from "@/types/website-ast";
import { applyManualOverride, updateTheme, updateSectionAiContent } from "@/lib/editor-utils";
import { EditorTopbar } from "./components/editor-topbar";
import { EditorPreview } from "./components/editor-preview";
import { EditorSidebar } from "./components/editor-sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditorClientProps {
  websiteId: string;
  initialAst: WebsiteAST;
  websiteName: string;
  templateId: string;
}

export function EditorClient({
  websiteId,
  initialAst,
  websiteName,
  templateId,
}: EditorClientProps) {
  const router = useRouter();
  const [ast, setAst] = useState<WebsiteAST>(initialAst);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"sections" | "theme">("sections");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Unsaved changes guard — browser refresh/close
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  const handleUpdateSection = useCallback(
    (sectionId: string, field: string, value: unknown) => {
      setAst((prev) => applyManualOverride(prev, sectionId, field, value));
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleUpdateTheme = useCallback((partial: Partial<WebsiteTheme>) => {
    setAst((prev) => updateTheme(prev, partial));
    setHasUnsavedChanges(true);
  }, []);

  const handleReorderSections = useCallback((newSections: Section[]) => {
    setAst((prev) => ({ ...prev, sections: newSections }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSelectSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveTab("sections");
  }, []);

  const handleRegenerateSection = useCallback(
    async (sectionId: string, prompt: string) => {
      const section = ast.sections.find((s) => s.id === sectionId);
      if (!section) return;
      const res = await fetch("/api/ai/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId,
          sectionId,
          sectionType: section.type,
          prompt: prompt || undefined,
          currentContent: section.ai_content,
        }),
      });
      if (!res.ok) throw new Error("Regeneration failed");
      const { ai_content } = await res.json();
      setAst((prev) => updateSectionAiContent(prev, sectionId, ai_content));
      setHasUnsavedChanges(true);
    },
    [ast, websiteId]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: ast }),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        toast.success("Da luu", { duration: 2000 });
      } else {
        toast.error("Luu that bai. Kiem tra ket noi va thu lai.", { duration: 4000 });
      }
    } catch {
      toast.error("Luu that bai. Kiem tra ket noi va thu lai.", { duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  }, [ast, websiteId]);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      router.push(`/dashboard/websites/${websiteId}`);
    }
  }, [hasUnsavedChanges, websiteId, router]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorTopbar
        websiteName={websiteName}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onBack={handleBack}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Preview area */}
        <div className="flex-1 overflow-y-auto p-8">
          <EditorPreview
            ast={ast}
            templateId={templateId}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            previewMode={previewMode}
          />
        </div>
        {/* Sidebar */}
        <div className="w-[35%] min-w-[320px] max-w-[480px] border-l border-border overflow-y-auto bg-sidebar">
          <EditorSidebar
            ast={ast}
            selectedSectionId={selectedSectionId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSelectSection={handleSelectSection}
            onReorderSections={handleReorderSections}
            onUpdateSection={handleUpdateSection}
            onUpdateTheme={handleUpdateTheme}
            onRegenerateSection={handleRegenerateSection}
            websiteId={websiteId}
            templateId={templateId}
          />
        </div>
      </div>

      {/* Unsaved changes dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban co thay doi chua luu</DialogTitle>
            <DialogDescription>
              Roi trang se mat cac thay doi chua duoc luu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsavedDialog(false)}>
              Tiep tuc chinh sua
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push(`/dashboard/websites/${websiteId}`)}
            >
              Roi trang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
