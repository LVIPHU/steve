"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Send, Plus, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HtmlEditorClientProps {
  websiteId: string;
  websiteName: string;
  websiteSlug: string;
  initialPages: Record<string, string>;
  initialPrompt: string;
  websiteStatus: string;
  initialChatHistory: Record<string, Array<{ role: "user" | "assistant" | "error"; content: string; timestamp: string }>>;
}

// ─── Sub-components (module-scope to avoid re-render issues) ──────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className="max-w-[80%]">
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : isError
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-foreground"
          }`}
        >
          {message.content}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HtmlEditorClient(props: HtmlEditorClientProps) {
  // Multi-page state
  const [pages, setPages] = useState<Record<string, string>>(props.initialPages);
  const [currentPage, setCurrentPage] = useState<string>("index");
  const currentPageHtml = pages[currentPage] ?? "";

  // Per-page chat history
  const [allChatHistory, setAllChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    const result: Record<string, ChatMessage[]> = {};
    for (const [page, msgs] of Object.entries(props.initialChatHistory)) {
      result[page] = (msgs || []).map((item) => ({
        role: item.role,
        content: item.content,
        timestamp: new Date(item.timestamp),
      }));
    }
    return result;
  });
  const messages = allChatHistory[currentPage] ?? [];

  // Code tab state
  const [codeValue, setCodeValue] = useState<string>(currentPageHtml);

  // Page Manager dialog state
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageError, setNewPageError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [status, setStatus] = useState(props.websiteStatus);

  const autoGenTriggered = useRef(false);
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // setMessages wrapper — since messages is derived from allChatHistory[currentPage]
  function setMessages(updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) {
    setAllChatHistory((prev) => {
      const currentMsgs = prev[currentPage] ?? [];
      const newMsgs = typeof updater === "function" ? updater(currentMsgs) : updater;
      return { ...prev, [currentPage]: newMsgs };
    });
  }

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync codeValue on page switch (Pitfall 5)
  useEffect(() => {
    setCodeValue(pages[currentPage] ?? "");
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save chat history on message changes (skip initial render from DB load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const totalMsgs = Object.values(allChatHistory).reduce((sum, msgs) => sum + msgs.length, 0);
    if (totalMsgs > 0) {
      scheduleChatHistorySave(allChatHistory);
    }
  }, [allChatHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup chat save timeout on unmount
  useEffect(() => {
    return () => {
      if (chatSaveTimeoutRef.current) clearTimeout(chatSaveTimeoutRef.current);
    };
  }, []);

  // Auto-save helper (500ms debounce after generation)
  function scheduleAutoSave(html: string) {
    // Update pages state with new HTML for current page
    setPages((prev) => ({ ...prev, [currentPage]: html }));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void handleSave(html);
    }, 500);
  }

  // Chat history auto-save (500ms debounce after message changes)
  function scheduleChatHistorySave(allHistory: Record<string, ChatMessage[]>) {
    if (chatSaveTimeoutRef.current) clearTimeout(chatSaveTimeoutRef.current);
    chatSaveTimeoutRef.current = setTimeout(() => {
      void saveChatHistory(allHistory);
    }, 500);
  }

  async function saveChatHistory(allHistory: Record<string, ChatMessage[]>) {
    try {
      const serialized: Record<string, Array<{ role: string; content: string; timestamp: string }>> = {};
      for (const [page, msgs] of Object.entries(allHistory)) {
        serialized[page] = msgs.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp.toISOString(),
        }));
      }
      await fetch(`/api/websites/${props.websiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_history: serialized }),
      });
    } catch {
      // Silent fail for chat history save — not critical
    }
  }

  // Save pages to DB (immediate, for add/delete page)
  async function savePagesToDb(pagesObj: Record<string, string>) {
    try {
      await fetch(`/api/websites/${props.websiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: pagesObj }),
      });
    } catch {
      // silent fail
    }
  }

  // Step labels shown in chat during pipeline
  const STEP_LABELS: Record<string, string> = {
    analyze: "Phân tích yêu cầu...",
    components: "Chọn components phù hợp...",
    design: "Thiết kế visual identity...",
    generate: "Đang tạo HTML...",
    review: "Kiểm tra chất lượng...",
    refine: "Tinh chỉnh kết quả...",
    validate: "Kiểm tra kết quả...",
  };

  // Generate HTML via AI (SSE pipeline)
  async function handleGenerate(prompt: string) {
    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt, timestamp: new Date() },
    ]);

    // Track pipeline step message indices so we can update them in-place
    const stepMessageIndices: Record<string, number> = {};

    const addStepMessage = (content: string): number => {
      let index = -1;
      setMessages((prev) => {
        index = prev.length;
        return [...prev, { role: "assistant", content, timestamp: new Date() }];
      });
      return index;
    };

    const updateMessageAt = (index: number, content: string) => {
      setMessages((prev) =>
        prev.map((m, i) => (i === index ? { ...m, content } : m))
      );
    };

    try {
      const res = await fetch("/api/ai/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: props.websiteId,
          prompt,
          currentHtml: currentPageHtml || undefined,
          pageName: currentPage,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Generation failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const dataLine = line.startsWith("data: ") ? line.slice(6) : null;
          if (!dataLine) continue;

          const event = JSON.parse(dataLine) as {
            step: string;
            status: string;
            detail?: string;
            html?: string;
            fix_count?: number;
            error?: string;
          };

          if (event.step === "complete" && event.html) {
            setPages((prev) => ({ ...prev, [currentPage]: event.html! }));
            setCodeValue(event.html);
            setHasUnsaved(false);
            scheduleAutoSave(event.html);
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "✓ Xong! Preview đã cập nhật.", timestamp: new Date() },
            ]);
          } else if (event.step === "error") {
            setMessages((prev) => [
              ...prev,
              {
                role: "error",
                content: event.error ?? "Không thể tạo nội dung. Vui lòng thử lại.",
                timestamp: new Date(),
              },
            ]);
          } else if (event.status === "start" && STEP_LABELS[event.step]) {
            const idx = addStepMessage(`◆ ${STEP_LABELS[event.step]}`);
            stepMessageIndices[event.step] = idx;
          } else if (event.status === "done" && stepMessageIndices[event.step] !== undefined) {
            const detail = event.detail ? ` — ${event.detail}` : "";
            updateMessageAt(stepMessageIndices[event.step], `✓ ${STEP_LABELS[event.step].replace("...", "")}${detail}`);
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Không thể tạo nội dung. Vui lòng thử lại.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  // Save full pages object to DB
  async function handleSave(html?: string) {
    setIsSaving(true);
    try {
      const updatedPages = html !== undefined
        ? { ...pages, [currentPage]: html }
        : pages;
      const res = await fetch(`/api/websites/${props.websiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: updatedPages }),
      });
      if (!res.ok) throw new Error();
      setHasUnsaved(false);
      toast("Đã lưu!");
    } catch {
      toast.error("Lưu thất bại, thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  // Publish website (also clears all chat history in DB and UI)
  async function handlePublish() {
    const res = await fetch(`/api/websites/${props.websiteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published", chat_history: {} }),
    });
    if (res.ok) {
      setStatus("published");
      setAllChatHistory({});
      toast("Đã xuất bản!");
    }
  }

  // Export ZIP download
  async function handleExport() {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/websites/${props.websiteId}/export`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `website-${props.websiteSlug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Không thể tải ZIP. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  }

  // Switch page
  function switchPage(pageName: string) {
    setCurrentPage(pageName);
  }

  // Add page
  function handleAddPage() {
    const name = newPageName.trim().toLowerCase();
    if (!name) return;
    if (!/^[a-z0-9-]+$/.test(name)) {
      setNewPageError("Chỉ dùng chữ thường, số, dấu gạch ngang");
      return;
    }
    if (name in pages) {
      setNewPageError("Tên trang đã tồn tại");
      return;
    }
    const updatedPages = { ...pages, [name]: "" };
    setPages(updatedPages);
    setCurrentPage(name);
    setShowAddPageDialog(false);
    setNewPageName("");
    setNewPageError("");
    // Save to DB immediately
    void savePagesToDb(updatedPages);
  }

  // Delete page
  function handleDeletePage(pageName: string) {
    if (pageName === "index") return;
    const { [pageName]: _removed, ...rest } = pages;
    setPages(rest);
    // Also remove chat history for that page
    setAllChatHistory((prev) => {
      const { [pageName]: _removedChat, ...restChat } = prev;
      return restChat;
    });
    if (currentPage === pageName) {
      setCurrentPage("index");
    }
    setDeleteTarget(null);
    void savePagesToDb(rest);
  }

  // Send chat message
  function handleSend() {
    const prompt = inputValue.trim();
    if (!prompt || isGenerating) return;
    setInputValue("");
    void handleGenerate(prompt);
  }

  // Ctrl+Enter / Cmd+Enter to send
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  // Apply code tab HTML
  function handleApplyCode() {
    setPages((prev) => ({ ...prev, [currentPage]: codeValue }));
    void handleSave(codeValue);
    toast("Đã lưu!");
  }

  // Sync codeValue when switching to Code tab
  function handleTabChange(value: string) {
    if (value === "code") {
      setCodeValue(pages[currentPage] ?? "");
    }
  }

  // Auto-generate on mount when no html exists and prompt was provided
  useEffect(() => {
    const hasAnyHtml = Object.values(props.initialPages).some((h) => h && h.trim());
    if (!hasAnyHtml && props.initialPrompt && !autoGenTriggered.current) {
      autoGenTriggered.current = true;
      void handleGenerate(props.initialPrompt);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-40 flex flex-col h-screen bg-background overflow-hidden">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-4 border-b border-border bg-background">
        {/* Left: Back button */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/dashboard/websites" aria-label="Quay lại">
              <ArrowLeft />
            </Link>
          </Button>
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            AppGen
          </span>
        </div>

        {/* Center: Website name with unsaved indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">
          {hasUnsaved && <span className="text-muted-foreground mr-1">•</span>}
          {props.websiteName}
        </div>

        {/* Right: Save + Export ZIP + Publish buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="animate-spin" />}
            Lưu thay đổi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExport()}
            disabled={isExporting || !Object.values(pages).some((h) => h && h.trim())}
          >
            {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
            {isExporting ? "Đang tải..." : "Tải ZIP"}
          </Button>
          <Button
            size="sm"
            onClick={() => void handlePublish()}
            disabled={!Object.values(pages).some((h) => h && h.trim())}
            title={!Object.values(pages).some((h) => h && h.trim()) ? "Tạo nội dung trước khi xuất bản" : undefined}
          >
            {status === "published" ? "Đã xuất bản" : "Xuất bản"}
          </Button>
        </div>
      </header>

      {/* Content area (below topbar) */}
      <div className="flex flex-1 pt-12 overflow-hidden">
        {/* Left panel: iframe preview (60%) */}
        <div className="w-[60%] h-full bg-muted relative p-4">
          {/* Page Manager Tab Strip */}
          <div className="flex items-center h-9 border-b border-border bg-background rounded-t overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-2">
            {Object.keys(pages).map((pageName) => (
              <div key={pageName} className="relative flex items-center group">
                <button
                  className={cn(
                    "px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    currentPage === pageName
                      ? "text-foreground font-semibold border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => switchPage(pageName)}
                  aria-selected={currentPage === pageName}
                  role="tab"
                >
                  {pageName === "index" ? "Index" : pageName}
                </button>
                {pageName !== "index" && (
                  <button
                    className="absolute -right-1 top-1 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 transition-opacity"
                    aria-label={`Xóa trang ${pageName}`}
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(pageName); }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              className="px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Thêm trang mới"
              onClick={() => setShowAddPageDialog(true)}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Empty state */}
          {!currentPageHtml && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <p className="text-muted-foreground text-sm text-center px-8">
                {currentPage === "index"
                  ? "Mô tả website của bạn để bắt đầu"
                  : "Trang trống. Dùng Chat để tạo nội dung."}
              </p>
            </div>
          )}

          {/* iframe without restrictions — generated apps need localStorage access */}
          <iframe
            className="w-full h-full border border-border rounded bg-white"
            srcDoc={currentPageHtml || undefined}
            title="Website preview"
          />

          {/* Loading overlay during generation */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                key="loading-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded"
              >
                <Loader2 className="animate-spin mb-2" size={28} />
                <p className="text-sm text-muted-foreground">Đang tạo...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel: Chat + Code tabs (40%) */}
        <div className="w-[40%] h-full flex flex-col border-l border-border">
          <Tabs
            defaultValue="chat"
            className="flex flex-col h-full"
            onValueChange={handleTabChange}
          >
            <div className="px-4 pt-3 pb-0 border-b border-border">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>

            {/* Chat tab */}
            <TabsContent
              value="chat"
              className="flex flex-col flex-1 overflow-hidden m-0 p-0"
            >
              {/* Message list */}
              <div className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-24">
                    <p className="text-sm text-muted-foreground text-center">
                      Hãy mô tả website bạn muốn tạo
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="border-t border-border p-4 flex flex-col gap-2">
                <Textarea
                  placeholder="Mô tả thay đổi bạn muốn (vd: thêm dark mode, đổi màu nút)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  className="resize-none text-sm"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isGenerating}
                  size="sm"
                  className="self-end"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  {isGenerating ? "Đang tạo..." : "Gửi"}
                </Button>
              </div>
            </TabsContent>

            {/* Code tab */}
            <TabsContent
              value="code"
              className="flex flex-col flex-1 overflow-hidden m-0 p-0"
            >
              <div className="flex-1 overflow-auto p-4">
                <textarea
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  className="w-full h-full min-h-[400px] font-mono text-sm leading-relaxed bg-muted rounded p-3 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                  spellCheck={false}
                />
              </div>
              <div className="border-t border-border p-4">
                <Button
                  onClick={handleApplyCode}
                  disabled={isGenerating}
                  className="w-full"
                >
                  Áp dụng HTML
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Page Dialog */}
      <Dialog open={showAddPageDialog} onOpenChange={setShowAddPageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm trang mới</DialogTitle>
            <DialogDescription>Nhập tên cho trang mới của bạn.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="page-name" className="text-sm font-medium">Tên trang</label>
            <Input
              id="page-name"
              placeholder="vd: about, contact, pricing"
              value={newPageName}
              onChange={(e) => { setNewPageName(e.target.value); setNewPageError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddPage(); }}
            />
            <p className="text-xs text-muted-foreground">Chỉ dùng chữ thường, số, dấu gạch ngang</p>
            {newPageError && <p className="text-xs text-destructive">{newPageError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddPageDialog(false); setNewPageName(""); setNewPageError(""); }}>Hủy</Button>
            <Button onClick={handleAddPage} disabled={!newPageName.trim()}>Tạo trang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Page Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa trang?</DialogTitle>
            <DialogDescription>
              Trang &apos;{deleteTarget}&apos; và toàn bộ nội dung sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDeletePage(deleteTarget)}>Xóa trang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
