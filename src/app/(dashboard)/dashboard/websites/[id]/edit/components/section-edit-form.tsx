"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  onRegenerateSection: (sectionId: string, prompt: string) => Promise<void>;
  websiteId: string;
  templateId: string;
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

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload/image", { method: "POST", body: formData });
  if (!res.ok) return null;
  const { url } = await res.json();
  return url;
}

function ImageUploadField({
  label,
  url,
  onUpload,
}: {
  label: string;
  url: string;
  onUpload: (uploadedUrl: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(false);
    const uploaded = await uploadImage(file);
    setUploading(false);
    if (uploaded) {
      onUpload(uploaded);
    } else {
      setUploadError(true);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <FieldGroup label={label}>
      <div className="flex items-center gap-2">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-12 w-12 object-cover rounded" />
        ) : null}
        {uploading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3 w-3" />
            Tai anh len
          </Button>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {uploadError ? (
        <p className="text-xs text-destructive">Tai anh that bai. Thu lai.</p>
      ) : null}
    </FieldGroup>
  );
}

function RegenerateSection({
  section,
  onRegenerateSection,
}: {
  section: Section;
  onRegenerateSection: (sectionId: string, prompt: string) => Promise<void>;
}) {
  const [regenPrompt, setRegenPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState(false);

  async function handleRegenerate() {
    setIsRegenerating(true);
    setRegenError(false);
    try {
      await onRegenerateSection(section.id, regenPrompt);
    } catch {
      setRegenError(true);
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <>
      <Separator />
      <div className="p-4 space-y-2">
        <Input
          placeholder="Huong dan them (tuy chon)"
          value={regenPrompt}
          onChange={(e) => setRegenPrompt(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          {isRegenerating ? "Dang tao lai..." : "Tao lai section"}
        </Button>
        {regenError ? (
          <p className="text-xs text-destructive">Tao lai that bai. Thu lai.</p>
        ) : null}
      </div>
    </>
  );
}

export function SectionEditForm({
  section,
  onUpdateField,
  onRegenerateSection,
}: SectionEditFormProps) {
  const { type } = section;

  if (type === "hero") {
    const headline = resolveField<string>(section, "headline") ?? "";
    const subtext = resolveField<string>(section, "subtext") ?? "";
    const ctaText = resolveField<string>(section, "ctaText") ?? "";
    const ctaUrl = resolveField<string>(section, "ctaUrl") ?? "";
    const backgroundImage = resolveField<string>(section, "backgroundImage") ?? "";

    return (
      <div>
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
          <ImageUploadField
            label="Anh nen"
            url={backgroundImage}
            onUpload={(url) => onUpdateField("backgroundImage", url)}
          />
        </div>
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  if (type === "about") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";

    return (
      <div>
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
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  if (type === "features") {
    const title = resolveField<string>(section, "title") ?? "";
    const items = resolveField<FeaturesContent["items"]>(section, "items") ?? [];

    return (
      <div>
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
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  if (type === "content") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";

    return (
      <div>
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
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  if (type === "gallery") {
    const title = resolveField<string>(section, "title") ?? "";
    const images = resolveField<GalleryContent["images"]>(section, "images") ?? [];

    return (
      <div>
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
              <ImageUploadField
                label="Anh"
                url={image.url}
                onUpload={(url) => {
                  const newImages = images.map((img, i) =>
                    i === idx ? { ...img, url } : img
                  );
                  onUpdateField("images", newImages);
                }}
              />
            </div>
          ))}
        </div>
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  if (type === "cta") {
    const title = resolveField<string>(section, "title") ?? "";
    const body = resolveField<string>(section, "body") ?? "";
    const buttonText = resolveField<string>(section, "buttonText") ?? "";
    const buttonUrl = resolveField<string>(section, "buttonUrl") ?? "";

    return (
      <div>
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
        <RegenerateSection section={section} onRegenerateSection={onRegenerateSection} />
      </div>
    );
  }

  return null;
}
