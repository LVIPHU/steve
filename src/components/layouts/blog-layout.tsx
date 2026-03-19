import { Merriweather } from "next/font/google";
import type { WebsiteAST } from "@/types/website-ast";
import { SectionRenderer } from "@/components/sections";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface BlogLayoutProps {
  ast: WebsiteAST;
}

export function BlogLayout({ ast }: BlogLayoutProps) {
  return (
    <div
      className={merriweather.className}
      style={{ "--primary-color": ast.theme.primaryColor } as React.CSSProperties}
    >
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-end">
        <DarkModeToggle />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {ast.sections.map((section, idx) => (
          <div key={section.id}>
            {idx > 0 && <hr className="border-t border-border my-12" />}
            <SectionRenderer section={section} theme={ast.theme} />
          </div>
        ))}
      </div>
    </div>
  );
}
