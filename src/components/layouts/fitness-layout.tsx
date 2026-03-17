import { DM_Sans } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

const dmSans = DM_Sans({ subsets: ["latin"] });

interface FitnessLayoutProps {
  ast: WebsiteAST;
}

export function FitnessLayout({ ast }: FitnessLayoutProps) {
  return (
    <div
      className={dmSans.className}
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
