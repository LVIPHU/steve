"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { WebsiteAST, Section } from "@/types/website-ast";
import { applyManualOverride } from "@/lib/editor-utils";
import { EditorTopbar } from "./components/editor-topbar";
import { EditorPreview } from "./components/editor-preview";

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

  const handleReorderSections = useCallback((newSections: Section[]) => {
    setAst((prev) => ({ ...prev, sections: newSections }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSelectSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveTab("sections");
  }, []);

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
      } else {
        alert("Luu that bai. Kiem tra ket noi va thu lai.");
      }
    } catch {
      alert("Luu that bai. Kiem tra ket noi va thu lai.");
    } finally {
      setIsSaving(false);
    }
  }, [ast, websiteId]);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Ban co thay doi chua luu. Roi trang se mat cac thay doi chua duoc luu."
      );
      if (!confirmed) return;
    }
    router.push(`/dashboard/websites/${websiteId}`);
  }, [hasUnsavedChanges, router, websiteId]);

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
          <div
            data-active-tab={activeTab}
            data-selected-section={selectedSectionId}
            className="p-4 text-sm text-muted-foreground"
          >
            Sidebar placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
