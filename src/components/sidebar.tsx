"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, LogOut, Menu } from "lucide-react";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarUser = {
  name: string;
  email: string;
  image?: string | null;
};

interface DashboardSidebarProps {
  user: SidebarUser;
  username: string;
  children: React.ReactNode;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/websites", label: "Websites", icon: Globe },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardSidebar({
  user,
  username,
  children,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const initials = (user.name?.[0] || user.email[0] || "?").toUpperCase();

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        {/* Brand area */}
        <div className="p-4 pb-2">
          <span className="text-base font-semibold">AppGen</span>
          <br />
          <span className="text-xs text-muted-foreground">Tao web tu note</span>
        </div>

        <Separator />

        {/* Nav section */}
        <nav className="px-3 py-2 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(href)
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User area */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 mt-2 text-muted-foreground"
            onClick={() =>
              authClient.signOut({
                fetchOptions: { onSuccess: () => { window.location.href = "/"; } },
              })
            }
          >
            <LogOut className="h-4 w-4" />
            Dang xuat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex md:w-[240px] md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile hamburger + Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 md:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0" showCloseButton={false}>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 md:ml-[240px]">{children}</main>
    </div>
  );
}
