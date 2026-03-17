import type { Section, WebsiteTheme, HeroContent } from "@/types/website-ast";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function HeroSection({ section, theme }: HeroSectionProps) {
  const headline = resolveField<string>(section, "headline");
  const subtext = resolveField<string>(section, "subtext");
  const ctaText = resolveField<string | undefined>(section, "ctaText");
  const ctaUrl = resolveField<string | undefined>(section, "ctaUrl");

  return (
    <section className={cn("py-16 px-4 bg-white text-center")}>
      <h1 className="text-5xl font-bold leading-[1.1] mx-auto max-w-4xl">
        {headline}
      </h1>
      <p className="text-lg leading-relaxed mt-4 max-w-2xl mx-auto">
        {subtext}
      </p>
      {ctaText != null ? (
        <a
          href={ctaUrl ?? "#"}
          className="inline-block mt-8 px-6 py-3 rounded-lg text-white font-medium"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {ctaText}
        </a>
      ) : null}
    </section>
  );
}
