import { Lora } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

const lora = Lora({ subsets: ["latin"] });

interface CookingLayoutProps {
  ast: WebsiteAST;
}

export function CookingLayout({ ast }: CookingLayoutProps) {
  return (
    <div
      className={lora.className}
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
