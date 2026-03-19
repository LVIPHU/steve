"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { resolveField } from "@/lib/ast-utils";
import type { Section, WebsiteTheme, GoalsContent } from "@/types/website-ast";

interface GoalsSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function GoalsSection({ section, theme: _theme }: GoalsSectionProps) {
  const title = resolveField<string>(section, "title") ?? "Muc tieu";
  const items = resolveField<GoalsContent["items"]>(section, "items") ?? [];

  const pathname = usePathname();
  const websiteSlug = pathname.split("/").pop() ?? "default";
  const storageKey = `goals-${websiteSlug}-${section.id}`;

  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setChecked(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  function handleToggle(idx: number) {
    const next = checked.map((val, i) => (i === idx ? !val : val));
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const completedCount = checked.filter(Boolean).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Progress value={progress} className="mb-4 h-2" />
      <p className="text-sm text-muted-foreground mb-4">
        Hoan thanh {completedCount} / {items.length} muc tieu
      </p>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 py-2">
          <Checkbox
            checked={mounted ? checked[idx] : false}
            onCheckedChange={() => handleToggle(idx)}
          />
          <span className={checked[idx] ? "line-through opacity-60" : ""}>
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
}
