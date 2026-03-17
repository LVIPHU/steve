import { Plus_Jakarta_Sans } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface LearningLayoutProps {
  ast: WebsiteAST;
}

export function LearningLayout({ ast }: LearningLayoutProps) {
  return (
    <div
      className={plusJakarta.className}
      style={{ "--primary": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        {ast.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} theme={ast.theme} />
        ))}
      </div>
    </div>
  );
}
