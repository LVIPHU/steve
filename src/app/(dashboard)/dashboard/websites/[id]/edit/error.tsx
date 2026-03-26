"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Editor Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h2 className="text-xl font-semibold">Đã xảy ra lỗi trong trình soạn thảo</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message || "Lỗi không xác định. Vui lòng thử lại."}
      </p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
