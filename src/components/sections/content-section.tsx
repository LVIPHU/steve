import type { Section, WebsiteTheme } from "@/types/website-ast";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function ContentSection({ section, theme }: ContentSectionProps) {
  const title = resolveField<string>(section, "title");
  const body = resolveField<string>(section, "body");

  return (
    <section className={cn("py-12 px-4")}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold leading-[1.2]">{title}</h2>
        <p className="text-base leading-relaxed mt-4 whitespace-pre-wrap">{body}</p>
      </div>
    </section>
  );
}
