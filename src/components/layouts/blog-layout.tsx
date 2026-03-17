import { Inter } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";

const inter = Inter({ subsets: ["latin"] });

interface BlogLayoutProps {
  ast: WebsiteAST;
}

export function BlogLayout({ ast }: BlogLayoutProps) {
  return (
    <div
      className={inter.className}
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
