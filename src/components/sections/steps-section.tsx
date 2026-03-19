"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";
import type { Section, WebsiteTheme, StepsContent } from "@/types/website-ast";

interface StepsSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function StepsSection({ section, theme: _theme }: StepsSectionProps) {
  const title = resolveField<string>(section, "title") ?? "Cac buoc thuc hien";
  const items = resolveField<StepsContent["items"]>(section, "items") ?? [];

  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  function handleToggle(idx: number) {
    setChecked((prev) => prev.map((val, i) => (i === idx ? !val : val)));
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-4 py-4 border-b border-border last:border-b-0">
          <span className="text-4xl font-bold text-muted-foreground/30 flex-shrink-0 w-12 text-right">
            {idx + 1}.
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Checkbox
                checked={checked[idx]}
                onCheckedChange={() => handleToggle(idx)}
              />
              <span className={cn("font-medium", checked[idx] && "line-through opacity-60")}>
                {item.label}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 ml-7">{item.description}</p>
            )}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.label}
                className="mt-2 ml-7 rounded-lg max-h-48 object-cover"
              />
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
