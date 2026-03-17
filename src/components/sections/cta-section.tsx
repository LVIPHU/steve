import type { Section, WebsiteTheme } from "@/types/website-ast";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function CtaSection({ section, theme }: CtaSectionProps) {
  const title = resolveField<string>(section, "title");
  const body = resolveField<string>(section, "body");
  const buttonText = resolveField<string>(section, "buttonText");
  const buttonUrl = resolveField<string>(section, "buttonUrl");

  return (
    <section className={cn("py-12 px-4 text-center")}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold leading-[1.2]">{title}</h2>
        <p className="text-base leading-relaxed mt-4">{body}</p>
        <a
          href={buttonUrl}
          className="inline-block mt-6 px-8 py-3 rounded-lg text-white font-medium"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
