"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { WebsiteAST, Section } from "@/types/website-ast";
import { SectionsTab } from "./sections-tab";

interface EditorSidebarProps {
  ast: WebsiteAST;
  selectedSectionId: string | null;
  activeTab: "sections" | "theme";
  onTabChange: (tab: "sections" | "theme") => void;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (newSections: Section[]) => void;
  onUpdateSection: (sectionId: string, field: string, value: unknown) => void;
}

export function EditorSidebar({
  ast,
  selectedSectionId,
  activeTab,
  onTabChange,
  onSelectSection,
  onReorderSections,
  onUpdateSection,
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
        />
      </TabsContent>
      <TabsContent value="theme" className="mt-0">
        <div className="p-4 text-sm text-muted-foreground">
          Theme tab - coming in next plan
        </div>
      </TabsContent>
    </Tabs>
  );
}
