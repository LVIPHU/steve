"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  initialHtml: string | null;
  initialPrompt: string;
  websiteStatus: string;
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
  const [htmlContent, setHtmlContent] = useState<string>(props.initialHtml ?? "");
  const [codeValue, setCodeValue] = useState<string>(props.initialHtml ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [status, setStatus] = useState(props.websiteStatus);

  const autoGenTriggered = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-save helper (500ms debounce after generation)
  function scheduleAutoSave(html: string) {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void handleSave(html);
    }, 500);
  }

  // Generate HTML via AI
  async function handleGenerate(prompt: string) {
    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt, timestamp: new Date() },
    ]);

    try {
      const res = await fetch("/api/ai/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: props.websiteId,
          prompt,
          currentHtml: htmlContent || undefined,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = (await res.json()) as { html: string };

      setHtmlContent(data.html);
      setCodeValue(data.html);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Đã cập nhật!", timestamp: new Date() },
      ]);
      setHasUnsaved(false); // API already saved it
      scheduleAutoSave(data.html); // Redundant save for safety
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

  // Save HTML to DB
  async function handleSave(html?: string) {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/websites/${props.websiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html_content: html ?? htmlContent }),
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

  // Publish website
  async function handlePublish() {
    const res = await fetch(`/api/websites/${props.websiteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    if (res.ok) {
      setStatus("published");
      toast("Đã xuất bản!");
    }
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
    setHtmlContent(codeValue);
    void handleSave(codeValue);
    toast("Đã lưu!");
  }

  // Sync codeValue when switching to Code tab
  function handleTabChange(value: string) {
    if (value === "code") {
      setCodeValue(htmlContent);
    }
  }

  // Auto-generate on mount when no html exists and prompt was provided
  useEffect(() => {
    if (!props.initialHtml && props.initialPrompt && !autoGenTriggered.current) {
      autoGenTriggered.current = true;
      void handleGenerate(props.initialPrompt);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-12 z-10 flex items-center justify-between px-4 border-b border-border bg-background">
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

        {/* Right: Save + Publish buttons */}
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
            size="sm"
            onClick={() => void handlePublish()}
            disabled={!htmlContent}
            title={!htmlContent ? "Tạo nội dung trước khi xuất bản" : undefined}
          >
            {status === "published" ? "Đã xuất bản" : "Xuất bản"}
          </Button>
        </div>
      </header>

      {/* Content area (below topbar) */}
      <div className="flex flex-1 pt-12 overflow-hidden">
        {/* Left panel: iframe preview (60%) */}
        <div className="w-[60%] h-full bg-muted relative p-4">
          {/* Empty state */}
          {!htmlContent && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <p className="text-muted-foreground text-sm text-center px-8">
                Mô tả website của bạn để bắt đầu
              </p>
            </div>
          )}

          {/* iframe — no sandbox so generated apps can use localStorage */}
          <iframe
            className="w-full h-full border border-border rounded bg-white"
            srcDoc={htmlContent || undefined}
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
              <ScrollArea className="flex-1 px-4 py-3">
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
              </ScrollArea>

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
    </div>
  );
}
