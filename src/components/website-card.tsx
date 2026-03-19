"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { MoreVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Website } from "@/db/schema";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      aria-label={`Trang thai: ${status}`}
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "published" &&
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        status === "draft" &&
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        status === "archived" &&
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      )}
    >
      {status === "published"
        ? "Published"
        : status === "draft"
          ? "Draft"
          : "Archived"}
    </span>
  );
}

interface WebsiteCardProps {
  website: Website;
  index: number;
}

export default function WebsiteCard({ website, index }: WebsiteCardProps) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(website.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setStatusMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleRename() {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === website.name) {
      setRenaming(false);
      setRenameValue(website.name);
      return;
    }
    await fetch(`/api/websites/${website.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setRenaming(false);
    router.refresh();
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    } else if (e.key === "Escape") {
      setRenaming(false);
      setRenameValue(website.name);
    }
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/websites/${website.id}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  async function handleStatusChange(newStatus: string) {
    setMenuOpen(false);
    setStatusMenuOpen(false);
    await fetch(`/api/websites/${website.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Card className="relative group hover:border-border/80 hover:shadow-md transition-shadow cursor-pointer">
        {/* Three-dot menu button — hover reveal */}
        <div ref={menuRef} className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Mo menu"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="size-4" />
          </Button>

          {/* Dropdown menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className="absolute top-10 right-0 z-50 min-w-[140px] bg-popover border border-border rounded-lg shadow-md py-1"
              role="menu"
            >
              {/* Rename */}
              <button
                role="menuitem"
                className="px-3 py-1.5 text-sm cursor-pointer hover:bg-muted w-full text-left"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRenaming(true);
                  setMenuOpen(false);
                }}
              >
                Doi ten
              </button>

              {/* Status change */}
              <div className="relative">
                <button
                  role="menuitem"
                  className="px-3 py-1.5 text-sm cursor-pointer hover:bg-muted w-full text-left"
                  onMouseEnter={() => setStatusMenuOpen(true)}
                  onMouseLeave={() => setStatusMenuOpen(false)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Doi trang thai
                </button>
                {statusMenuOpen && (
                  <div
                    className="absolute left-full top-0 ml-1 min-w-[120px] bg-popover border border-border rounded-lg shadow-md py-1"
                    onMouseEnter={() => setStatusMenuOpen(true)}
                    onMouseLeave={() => setStatusMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start rounded-none px-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatusChange("draft");
                      }}
                    >
                      Draft
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start rounded-none px-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatusChange("published");
                      }}
                    >
                      Published
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start rounded-none px-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStatusChange("archived");
                      }}
                    >
                      Archived
                    </Button>
                  </div>
                )}
              </div>

              {/* Delete */}
              <button
                role="menuitem"
                className="px-3 py-1.5 text-sm cursor-pointer hover:bg-muted w-full text-left text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmDelete(true);
                  setMenuOpen(false);
                }}
              >
                Xoa
              </button>
            </motion.div>
          )}
        </div>

        {/* Card body link */}
        <Link href={`/dashboard/websites/${website.id}`} className="block">
          <CardHeader className="pb-2">
            {renaming ? (
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={() => {
                  setRenaming(false);
                  setRenameValue(website.name);
                }}
                autoFocus
                aria-label="Doi ten website"
                className="text-sm h-7"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            ) : (
              <CardTitle className="text-sm">{website.name}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-1">
              <StatusBadge status={website.status} />
            </div>
          </CardContent>
        </Link>

        {/* Delete confirm panel */}
        {confirmDelete && (
          <div className="px-6 pb-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Xoa website nay?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Hanh dong nay khong the hoan tac.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                >
                  Huy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  Xoa
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
