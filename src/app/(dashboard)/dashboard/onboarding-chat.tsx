"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function OnboardingChat() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit() {
    const prompt = inputValue.trim();
    if (!prompt || isCreating) return;
    setIsCreating(true);

    try {
      // AI extracts a meaningful website name from the freeform prompt
      const nameRes = await fetch("/api/ai/extract-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { name } = nameRes.ok
        ? ((await nameRes.json()) as { name: string })
        : { name: prompt.slice(0, 50) || "Website mới" };

      // Create the website record
      const createRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!createRes.ok) throw new Error("Failed to create website");
      const { id } = (await createRes.json()) as { id: string };

      router.push(`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(prompt)}`);
    } catch {
      setIsCreating(false);
      toast.error("Không thể tạo website. Vui lòng thử lại.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 mt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Tạo website mới</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mô tả website bạn muốn tạo — AI sẽ xây dựng ngay lập tức
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        {isCreating ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
          </div>
        ) : (
          <Textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            rows={4}
            placeholder="Tạo landing page cho khóa học tiếng Anh online, có phần giới thiệu, bảng giá và form đăng ký"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none"
            disabled={isCreating}
          />
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Nhấn Ctrl+Enter để tạo website
        </p>

        <Button
          onClick={() => void handleSubmit()}
          disabled={!inputValue.trim() || isCreating}
          size="lg"
          className="w-full mt-3"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Tạo website
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
