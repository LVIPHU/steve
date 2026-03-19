import { Lora } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const lora = Lora({ subsets: ["latin"] });

interface CookingLayoutProps {
  ast: WebsiteAST;
}

export function CookingLayout({ ast }: CookingLayoutProps) {
  return (
    <div
      className={cn(lora.className, "min-h-screen bg-[#fdf8f3] dark:bg-background")}
      style={{ "--primary-color": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-3xl mx-auto px-4 pt-4 flex justify-end">
        <DarkModeToggle />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {ast.sections.map((section) => {
          const isHero = section.type === "hero";
          const needsCard =
            section.type === "ingredients" || section.type === "steps";
          return (
            <div
              key={section.id}
              className={cn(
                needsCard &&
                  "bg-white dark:bg-card rounded-xl shadow-sm p-6 border border-border",
                isHero && "text-center py-8"
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
