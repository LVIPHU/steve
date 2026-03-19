import { Oswald } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface FitnessLayoutProps {
  ast: WebsiteAST;
}

export function FitnessLayout({ ast }: FitnessLayoutProps) {
  return (
    <div
      className={oswald.className}
      style={{ "--primary-color": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-end">
        <DarkModeToggle />
      </div>
      {ast.sections.map((section) => {
        const isHero = section.type === "hero";
        return (
          <div
            key={section.id}
            className={cn(
              "border-l-4",
              isHero ? "py-20 bg-zinc-900 text-white dark:bg-zinc-950" : "py-12"
            )}
            style={{ borderLeftColor: ast.theme.primaryColor }}
          >
            <div className="max-w-5xl mx-auto px-6">
              <SectionRenderer section={section} theme={ast.theme} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
