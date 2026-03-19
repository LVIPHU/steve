"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function DashboardNav({ user }: { user: User }) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="border-b border-border bg-card"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <a href="/dashboard" className="font-medium">
          AppGen
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard/websites"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Websites
          </a>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              })
            }
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
