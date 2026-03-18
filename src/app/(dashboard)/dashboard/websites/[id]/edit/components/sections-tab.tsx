"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderSections } from "@/lib/editor-utils";
import { Separator } from "@/components/ui/separator";
import type { Section, SectionType } from "@/types/website-ast";
import { SortableSectionItem, SECTION_TYPE_LABELS } from "./section-list-item";
import { SectionEditForm } from "./section-edit-form";

interface SectionsTabProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sections: Section[]) => void;
  onUpdateSection: (sectionId: string, field: string, value: unknown) => void;
  onRegenerateSection: (sectionId: string, prompt: string) => Promise<void>;
  websiteId: string;
  templateId: string;
}

export function SectionsTab({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onUpdateSection,
  onRegenerateSection,
  websiteId,
  templateId,
}: SectionsTabProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onReorder(reorderSections(sections, oldIndex, newIndex));
    }
  }

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;
  const selectedSection = selectedSectionId
    ? sections.find((s) => s.id === selectedSectionId)
    : null;

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              isSelected={section.id === selectedSectionId}
              onClick={() => onSelect(section.id)}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeSection ? (
            <div className="opacity-80 bg-background border border-border rounded shadow-lg px-3 h-11 flex items-center text-sm font-semibold">
              {SECTION_TYPE_LABELS[activeSection.type as SectionType]}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedSection && (
        <>
          <Separator />
          <SectionEditForm
            section={selectedSection}
            onUpdateField={(field, value) =>
              onUpdateSection(selectedSection.id, field, value)
            }
            onRegenerateSection={onRegenerateSection}
            websiteId={websiteId}
            templateId={templateId}
          />
        </>
      )}
    </div>
  );
}
