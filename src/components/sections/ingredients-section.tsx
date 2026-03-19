"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";
import type { Section, WebsiteTheme, IngredientsContent } from "@/types/website-ast";

interface IngredientsSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function IngredientsSection({ section, theme: _theme }: IngredientsSectionProps) {
  const title = resolveField<string>(section, "title") ?? "Nguyen lieu";
  const items = resolveField<IngredientsContent["items"]>(section, "items") ?? [];

  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  function handleToggle(idx: number) {
    setChecked((prev) => prev.map((val, i) => (i === idx ? !val : val)));
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/50"
          >
            <Checkbox
              checked={checked[idx]}
              onCheckedChange={() => handleToggle(idx)}
            />
            <span className={cn("flex-1", checked[idx] && "line-through opacity-60")}>
              {item.name}
            </span>
            <span className={cn("text-sm text-muted-foreground", checked[idx] && "line-through opacity-60")}>
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
