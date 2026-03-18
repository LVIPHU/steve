"use client";

import { ArrowLeft, Monitor, Tablet, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorTopbarProps {
  websiteName: string;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onBack: () => void;
  previewMode: "desktop" | "tablet" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
}

export function EditorTopbar({
  websiteName,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onBack,
  previewMode,
  onPreviewModeChange,
}: EditorTopbarProps) {
  return (
    <div className="h-12 bg-sidebar border-b border-border flex items-center justify-between px-4 shrink-0">
      {/* Left: Back button */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Quay lai
        </Button>
      </div>

      {/* Center: Website name */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xl font-semibold truncate max-w-xs">
          {websiteName}
          {hasUnsavedChanges ? "*" : ""}
        </span>
      </div>

      {/* Right: Responsive toggle + Save button */}
      <div className="flex items-center gap-2">
        {/* Responsive toggle */}
        <div className="flex items-center rounded-md border border-border">
          <button
            aria-label="Desktop preview"
            onClick={() => onPreviewModeChange("desktop")}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-l-md transition-colors",
              previewMode === "desktop"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            aria-label="Tablet preview"
            onClick={() => onPreviewModeChange("tablet")}
            className={cn(
              "h-8 w-8 flex items-center justify-center border-x border-border transition-colors",
              previewMode === "tablet"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            aria-label="Mobile preview"
            onClick={() => onPreviewModeChange("mobile")}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-r-md transition-colors",
              previewMode === "mobile"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Save button */}
        <Button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          size="sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Luu...
            </>
          ) : (
            <>{hasUnsavedChanges ? "● Luu" : "Luu"}</>
          )}
        </Button>
      </div>
    </div>
  );
}
