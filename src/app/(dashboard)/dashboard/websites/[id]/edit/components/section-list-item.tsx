"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveField } from "@/lib/ast-utils";
import type { Section, SectionType } from "@/types/website-ast";

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  about: "Gioi thieu",
  features: "Tinh nang",
  content: "Noi dung",
  gallery: "Thu vien",
  cta: "Keu goi",
  steps: "Cac buoc",
  ingredients: "Nguyen lieu",
  goals: "Muc tieu",
  flashcard: "The hoc",
  quiz: "Cau hoi",
};

interface SortableSectionItemProps {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
}

export function SortableSectionItem({
  section,
  isSelected,
  onClick,
}: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const displayTitle =
    resolveField<string>(section, "title") ||
    resolveField<string>(section, "headline") ||
    section.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-11 flex items-center gap-2 px-3 border-b border-border last:border-b-0 select-none",
        isSelected && "bg-accent text-accent-foreground"
      )}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        {...attributes}
        aria-label="Keo de sap xep"
        className="cursor-grab text-muted-foreground hover:text-foreground flex-shrink-0 touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Section type badge */}
      <Badge variant="secondary" className="text-xs flex-shrink-0">
        {SECTION_TYPE_LABELS[section.type]}
      </Badge>

      {/* Clickable title area */}
      <button
        onClick={onClick}
        className="flex-1 text-left text-sm truncate min-w-0"
      >
        {displayTitle}
      </button>
    </div>
  );
}
