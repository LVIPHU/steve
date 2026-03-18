"use client";

import { cn } from "@/lib/utils";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

interface EditorPreviewProps {
  ast: WebsiteAST;
  templateId: string;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  previewMode: "desktop" | "tablet" | "mobile";
}

export function EditorPreview({
  ast,
  templateId: _templateId,
  selectedSectionId,
  onSelectSection,
  previewMode,
}: EditorPreviewProps) {
  return (
    <div
      className={cn(
        "transition-all duration-200 ease-in-out mx-auto",
        previewMode === "desktop" && "w-full",
        previewMode === "tablet" && "max-w-[768px]",
        previewMode === "mobile" && "max-w-[390px]"
      )}
      style={
        {
          "--primary-color": ast.theme.primaryColor,
          "--font-family": ast.theme.font,
        } as React.CSSProperties
      }
    >
      {ast.sections.map((section) => (
        <div
          key={section.id}
          onClick={() => onSelectSection(section.id)}
          className={cn(
            "cursor-pointer transition-all duration-150",
            section.id === selectedSectionId
              ? "ring-2 ring-primary"
              : "hover:ring-1 hover:ring-border"
          )}
        >
          <SectionRenderer section={section} theme={ast.theme} />
        </div>
      ))}
    </div>
  );
}
