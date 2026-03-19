import { Plus_Jakarta_Sans } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface LearningLayoutProps {
  ast: WebsiteAST;
}

export function LearningLayout({ ast }: LearningLayoutProps) {
  return (
    <div
      className={cn(plusJakartaSans.className, "min-h-screen bg-slate-50 dark:bg-background")}
      style={{ "--primary-color": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto px-4 pt-4 flex justify-end">
        <DarkModeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {ast.sections.map((section) => {
          const isHero = section.type === "hero";
          return (
            <div
              key={section.id}
              className={cn(
                !isHero &&
                  "bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6"
              )}
            >
              <SectionRenderer section={section} theme={ast.theme} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
