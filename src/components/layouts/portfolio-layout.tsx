import { Inter } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface PortfolioLayoutProps {
  ast: WebsiteAST;
}

export function PortfolioLayout({ ast }: PortfolioLayoutProps) {
  return (
    <div
      className={inter.className}
      style={{ "--primary-color": ast.theme.primaryColor } as React.CSSProperties}
    >
      {ast.sections.map((section) => {
        const isHero = section.type === "hero";
        const isCta = section.type === "cta";
        return (
          <div
            key={section.id}
            className={cn(
              isHero && "bg-slate-900 text-white dark:bg-slate-950 py-24",
              isCta && "py-16",
              !isHero && !isCta && "py-16"
            )}
            style={isCta ? { backgroundColor: ast.theme.primaryColor } : undefined}
          >
            <div className={cn("mx-auto px-4", isHero ? "max-w-5xl text-center" : "max-w-7xl")}>
              <SectionRenderer section={section} theme={ast.theme} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
