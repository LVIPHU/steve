"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebsitesPoller({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(id);
  }, [router]);

  return <>{children}</>;
}
