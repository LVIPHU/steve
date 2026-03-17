import type { Section, WebsiteTheme, GalleryContent } from "@/types/website-ast";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  section: Section;
  theme: WebsiteTheme;
}

export function GallerySection({ section, theme }: GallerySectionProps) {
  const title = resolveField<string>(section, "title");
  const images = resolveField<GalleryContent["images"]>(section, "images");

  return (
    <section className={cn("py-12 px-4")}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold leading-[1.2] text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.caption}
                className="rounded-lg object-cover w-full aspect-video"
              />
              <p className="text-sm text-center mt-2">{image.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
