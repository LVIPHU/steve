import type { Section, WebsiteTheme, FeaturesContent } from "@/types/website-ast";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function FeaturesSection({ section, theme }: FeaturesSectionProps) {
  const title = resolveField<string>(section, "title");
  const items = resolveField<FeaturesContent["items"]>(section, "items");

  return (
    <section className={cn("py-12 px-4")}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold leading-[1.2] text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div
                className="text-2xl mb-2"
                style={{ color: theme.primaryColor }}
              >
                {item.icon}
              </div>
              <div className="font-bold text-lg">{item.label}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
