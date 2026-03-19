"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
};

type ChatPhase = "greeting" | "waiting_q1" | "waiting_q2" | "confirm" | "creating";

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

export default function OnboardingChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [phase, setPhase] = useState<ChatPhase>("greeting");
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          role: "assistant",
          content: "Xin chao! Website cua ban ve chu de gi?",
          timestamp: new Date(),
        },
      ]);
      setPhase("waiting_q1");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  function handleSend() {
    const text = inputValue.trim();
    if (!text || phase === "confirm" || phase === "creating" || phase === "greeting") return;
    setInputValue("");

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    if (phase === "waiting_q1") {
      setTopic(text);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Muc tieu cua website nay la gi? (vi du: chia se kien thuc, ban san pham, portfolio...)",
            timestamp: new Date(),
          },
        ]);
        setPhase("waiting_q2");
      }, 500);
    } else if (phase === "waiting_q2") {
      setGoal(text);
      const currentTopic = topic; // captured from state set during q1
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Tuyet! Minh se tao website ve "${currentTopic}", muc tieu "${text}".`,
            timestamp: new Date(),
          },
        ]);
        setPhase("confirm");
      }, 500);
    }
  }

  async function handleCreate() {
    setIsCreating(true);
    setPhase("creating");
    try {
      const prompt = `Chu de: ${topic}. Muc tieu: ${goal}.`;
      const websiteName = topic.slice(0, 50) || "Website moi";

      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: websiteName }),
      });

      if (!res.ok) throw new Error("Failed to create website");
      const { id } = await res.json();

      router.push(`/dashboard/websites/${id}/edit?prompt=${encodeURIComponent(prompt)}`);
    } catch {
      setIsCreating(false);
      setPhase("confirm");
      toast.error("Khong the tao website. Vui long thu lai.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 mt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Tao website moi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tra loi 2 cau hoi ngan de chung toi hieu website ban can
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <ScrollArea className="h-[400px] p-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
          </AnimatePresence>

          {/* Bot thinking skeleton */}
          {phase === "greeting" && (
            <div className="flex justify-start mb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          )}

          {/* CTA button after summary */}
          {phase === "confirm" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dang tao...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tao website nay!
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {phase === "creating" && (
            <div className="flex justify-start mb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhap cau tra loi..."
              rows={2}
              className="flex-1 resize-none"
              disabled={
                phase === "confirm" ||
                phase === "creating" ||
                phase === "greeting"
              }
            />
            <Button
              onClick={handleSend}
              disabled={
                !inputValue.trim() ||
                phase === "confirm" ||
                phase === "creating" ||
                phase === "greeting"
              }
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
