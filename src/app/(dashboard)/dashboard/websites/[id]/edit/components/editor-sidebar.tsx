"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { WebsiteAST, WebsiteTheme, Section, SectionType } from "@/types/website-ast";
import { SectionsTab } from "./sections-tab";
import { ThemeTab } from "./theme-tab";

interface EditorSidebarProps {
  ast: WebsiteAST;
  selectedSectionId: string | null;
  activeTab: "sections" | "theme";
  onTabChange: (tab: "sections" | "theme") => void;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (newSections: Section[]) => void;
  onUpdateSection: (sectionId: string, field: string, value: unknown) => void;
  onUpdateTheme: (partial: Partial<WebsiteTheme>) => void;
  onRegenerateSection: (sectionId: string, prompt: string) => Promise<void>;
  onAddSection: (sectionType: SectionType) => Promise<void>;
  websiteId: string;
  templateId: string;
}

export function EditorSidebar({
  ast,
  selectedSectionId,
  activeTab,
  onTabChange,
  onSelectSection,
  onReorderSections,
  onUpdateSection,
  onUpdateTheme,
  onRegenerateSection,
  onAddSection,
  websiteId,
  templateId,
}: EditorSidebarProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as "sections" | "theme")}
      className="h-full"
    >
      <TabsList className="w-full rounded-none border-b border-border bg-sidebar h-10">
        <TabsTrigger value="sections" className="flex-1">
          Sections
        </TabsTrigger>
        <TabsTrigger value="theme" className="flex-1">
          Theme
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sections" className="mt-0">
        <SectionsTab
          sections={ast.sections}
          selectedSectionId={selectedSectionId}
          onSelect={onSelectSection}
          onReorder={onReorderSections}
          onUpdateSection={onUpdateSection}
          onRegenerateSection={onRegenerateSection}
          onAddSection={onAddSection}
          websiteId={websiteId}
          templateId={templateId}
        />
      </TabsContent>
      <TabsContent value="theme" className="mt-0">
        <ThemeTab theme={ast.theme} onUpdateTheme={onUpdateTheme} />
      </TabsContent>
    </Tabs>
  );
}
