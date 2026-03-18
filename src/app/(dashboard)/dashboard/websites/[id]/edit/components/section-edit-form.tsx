"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveField } from "@/lib/ast-utils";
import type {
  Section,
  HeroContent,
  FeaturesContent,
  GalleryContent,
} from "@/types/website-ast";

interface SectionEditFormProps {
  section: Section;
  onUpdateField: (field: string, value: unknown) => void;
}

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none";

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function SectionEditForm({ section, onUpdateField }: SectionEditFormProps) {
  const { type } = section;

  if (type === "hero") {
    const headline = resolveField<string>(section, "headline") ?? "";
    const subtext = resolveField<string>(section, "subtext") ?? "";
    const ctaText = resolveField<string>(section, "ctaText") ?? "";
    const ctaUrl = resolveField<string>(section, "ctaUrl") ?? "";

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={headline}
            onChange={(e) => onUpdateField("headline", e.target.value)}
            placeholder="Tieu de chinh..."
          />
        </FieldGroup>
        <FieldGroup label="Mo ta">
          <textarea
            className={textareaClass}
            value={subtext}
            onChange={(e) => onUpdateField("subtext", e.target.value)}
            placeholder="Mo ta ngan..."
          />
        </FieldGroup>
        <FieldGroup label="CTA Text">
          <Input
            value={ctaText}
            onChange={(e) => onUpdateField("ctaText", e.target.value)}
            placeholder="Nhan vao day..."
          />
        </FieldGroup>
        <FieldGroup label="CTA URL">
          <Input
            value={ctaUrl}
            onChange={(e) => onUpdateField("ctaUrl", e.target.value)}
            placeholder="https://..."
          />
        </FieldGroup>
      </div>
    );
  }

  if (type === "about") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={title}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Tieu de..."
          />
        </FieldGroup>
        <FieldGroup label="Noi dung">
          <textarea
            className={textareaClass}
            value={body}
            onChange={(e) => onUpdateField("body", e.target.value)}
            placeholder="Noi dung..."
          />
        </FieldGroup>
      </div>
    );
  }

  if (type === "features") {
    const title = resolveField<string>(section, "title") ?? "";
    const items = resolveField<FeaturesContent["items"]>(section, "items") ?? [];

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={title}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Tieu de..."
          />
        </FieldGroup>
        {items.map((item, idx) => (
          <div key={idx} className="border border-border rounded-md p-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Tinh nang {idx + 1}
            </p>
            <FieldGroup label="Icon">
              <Input
                value={item.icon}
                onChange={(e) => {
                  const newItems = items.map((it, i) =>
                    i === idx ? { ...it, icon: e.target.value } : it
                  );
                  onUpdateField("items", newItems);
                }}
                placeholder="emoji hoac icon..."
              />
            </FieldGroup>
            <FieldGroup label="Nhan">
              <Input
                value={item.label}
                onChange={(e) => {
                  const newItems = items.map((it, i) =>
                    i === idx ? { ...it, label: e.target.value } : it
                  );
                  onUpdateField("items", newItems);
                }}
                placeholder="Ten tinh nang..."
              />
            </FieldGroup>
            <FieldGroup label="Mo ta">
              <Input
                value={item.description}
                onChange={(e) => {
                  const newItems = items.map((it, i) =>
                    i === idx ? { ...it, description: e.target.value } : it
                  );
                  onUpdateField("items", newItems);
                }}
                placeholder="Mo ta tinh nang..."
              />
            </FieldGroup>
          </div>
        ))}
      </div>
    );
  }

  if (type === "content") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={title}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Tieu de..."
          />
        </FieldGroup>
        <FieldGroup label="Noi dung">
          <textarea
            className={textareaClass}
            value={body}
            onChange={(e) => onUpdateField("body", e.target.value)}
            placeholder="Noi dung..."
          />
        </FieldGroup>
      </div>
    );
  }

  if (type === "gallery") {
    const title = resolveField<string>(section, "title") ?? "";
    const images = resolveField<GalleryContent["images"]>(section, "images") ?? [];

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={title}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Tieu de..."
          />
        </FieldGroup>
        {images.map((image, idx) => (
          <div key={idx} className="border border-border rounded-md p-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Hinh anh {idx + 1}
            </p>
            <FieldGroup label="Chu thich">
              <Input
                value={image.caption}
                onChange={(e) => {
                  const newImages = images.map((img, i) =>
                    i === idx ? { ...img, caption: e.target.value } : img
                  );
                  onUpdateField("images", newImages);
                }}
                placeholder="Chu thich hinh anh..."
              />
            </FieldGroup>
          </div>
        ))}
      </div>
    );
  }

  if (type === "cta") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";
    const buttonText = resolveField<string>(section, "buttonText") ?? "";
    const buttonUrl = resolveField<string>(section, "buttonUrl") ?? "";

    return (
      <div className="p-4 space-y-4">
        <FieldGroup label="Tieu de">
          <Input
            value={title}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Tieu de..."
          />
        </FieldGroup>
        <FieldGroup label="Noi dung">
          <textarea
            className={textareaClass}
            value={body}
            onChange={(e) => onUpdateField("body", e.target.value)}
            placeholder="Noi dung..."
          />
        </FieldGroup>
        <FieldGroup label="Nut bam">
          <Input
            value={buttonText}
            onChange={(e) => onUpdateField("buttonText", e.target.value)}
            placeholder="Nhan vao day..."
          />
        </FieldGroup>
        <FieldGroup label="URL nut bam">
          <Input
            value={buttonUrl}
            onChange={(e) => onUpdateField("buttonUrl", e.target.value)}
            placeholder="https://..."
          />
        </FieldGroup>
      </div>
    );
  }

  return null;
}
