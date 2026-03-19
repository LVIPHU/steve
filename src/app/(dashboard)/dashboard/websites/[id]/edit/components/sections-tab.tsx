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
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { reorderSections } from "@/lib/editor-utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TEMPLATE_ALLOWED_SECTIONS } from "@/lib/templates";
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
  onAddSection: (sectionType: SectionType) => Promise<void>;
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
  onAddSection,
  websiteId,
  templateId,
}: SectionsTabProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addingType, setAddingType] = useState<SectionType | null>(null);

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

  async function handleAddSection(sectionType: SectionType) {
    setAddingType(sectionType);
    setShowAddDialog(false);
    try {
      await onAddSection(sectionType);
    } catch {
      // Error handled by parent via toast
    } finally {
      setAddingType(null);
    }
  }

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;
  const selectedSection = selectedSectionId
    ? sections.find((s) => s.id === selectedSectionId)
    : null;

  const allowedTypes =
    TEMPLATE_ALLOWED_SECTIONS[templateId as keyof typeof TEMPLATE_ALLOWED_SECTIONS] ?? [];

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

      {addingType && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-11 flex items-center gap-2 px-3 border-b border-border"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <span className="text-xs text-muted-foreground">Dang tao noi dung...</span>
        </motion.div>
      )}

      <div className="p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          onClick={() => setShowAddDialog(true)}
          disabled={addingType !== null}
        >
          <Plus className="h-3 w-3" />
          Them section
        </Button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Them section moi</DialogTitle>
            <DialogDescription>
              Chon loai section phu hop voi template cua ban
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allowedTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto py-3 flex flex-col gap-1"
                onClick={() => handleAddSection(type)}
              >
                <span className="font-medium">{SECTION_TYPE_LABELS[type]}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
