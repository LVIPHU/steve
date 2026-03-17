import { Playfair_Display } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface PortfolioLayoutProps {
  ast: WebsiteAST;
}

export function PortfolioLayout({ ast }: PortfolioLayoutProps) {
  return (
    <div
      className={playfair.className}
      style={{ "--primary": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-5xl mx-auto">
        {ast.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} theme={ast.theme} />
        ))}
      </div>
    </div>
  );
}
