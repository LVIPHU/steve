"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUsername } from "./action";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsernameValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await setUsername(username);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h1 className="mb-2 text-xl font-semibold">Chọn tên người dùng</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Tên người dùng sẽ xuất hiện trong URL website của bạn và không thể thay đổi sau này.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="onboarding-username">Tên người dùng</Label>
            <Input
              id="onboarding-username"
              type="text"
              placeholder="vd: nguyen-van-a"
              value={username}
              onChange={(e) => setUsernameValue(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              pattern="[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]"
            />
            <p className="text-xs text-muted-foreground">
              Chỉ chữ thường, số và dấu gạch ngang. Tối thiểu 3 ký tự.
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu tên người dùng"}
          </Button>
        </form>
      </motion.main>
    </div>
  );
}
