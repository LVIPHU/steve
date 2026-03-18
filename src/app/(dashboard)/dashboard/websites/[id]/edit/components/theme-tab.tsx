"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WebsiteTheme } from "@/types/website-ast";

const POPULAR_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Source Sans Pro", "Raleway", "Ubuntu", "Nunito", "Merriweather",
  "Playfair Display", "PT Serif", "Lora", "Crimson Text",
  "Space Grotesk", "DM Sans", "Plus Jakarta Sans", "Sora", "Outfit",
];

function injectGoogleFont(fontFamily: string) {
  const id = `gfont-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600&display=swap`;
  document.head.appendChild(link);
}

interface ThemeTabProps {
  theme: WebsiteTheme;
  onUpdateTheme: (partial: Partial<WebsiteTheme>) => void;
}

export function ThemeTab({ theme, onUpdateTheme }: ThemeTabProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredFonts = POPULAR_FONTS.filter((f) =>
    f.toLowerCase().includes(fontSearch.toLowerCase())
  ).slice(0, 8);

  function handleSelectFont(fontName: string) {
    injectGoogleFont(fontName);
    onUpdateTheme({ font: fontName });
    setFontSearch("");
    setShowDropdown(false);
  }

  return (
    <div className="p-4 space-y-6">
      {/* Color picker */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Mau chu dao
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
            className="w-10 h-8 rounded border border-input cursor-pointer"
          />
          <Input
            value={theme.primaryColor}
            onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
            className="w-28 font-mono text-sm"
            maxLength={7}
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Font selector */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Font chu
        </Label>
        <span className="text-sm text-muted-foreground block">
          Hien tai: {theme.font}
        </span>
        <div className="relative">
          <Input
            placeholder="Tim font..."
            value={fontSearch}
            onChange={(e) => {
              setFontSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filteredFonts.length > 0 && (
            <div className="absolute z-10 w-full border border-border rounded-md mt-1 max-h-48 overflow-y-auto bg-background shadow-md">
              {filteredFonts.map((font) => (
                <button
                  key={font}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleSelectFont(font)}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
