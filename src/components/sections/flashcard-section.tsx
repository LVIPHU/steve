"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";
import type { Section, WebsiteTheme, FlashcardContent } from "@/types/website-ast";

interface FlashcardSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

function CardFace({
  children,
  isBack,
  isFlipped,
  className,
}: {
  children: React.ReactNode;
  isBack: boolean;
  isFlipped: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 flex items-center justify-center p-6 rounded-xl border",
        className
      )}
      style={{ backfaceVisibility: "hidden" }}
      animate={{ rotateY: isBack ? (isFlipped ? 0 : -180) : (isFlipped ? 180 : 0) }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function FlashcardSection({ section, theme: _theme }: FlashcardSectionProps) {
  const title = resolveField<string>(section, "title") ?? "The hoc";
  const cards = resolveField<FlashcardContent["cards"]>(section, "cards") ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipped, cards.length, handlePrev, handleNext, handleFlip]);

  if (cards.length === 0) {
    return (
      <section className="py-12 px-4">
        <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>
        <p className="text-center text-muted-foreground">
          Chua co the hoc nao. Hay tao noi dung de tu dong sinh the.
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>
      <div
        style={{ perspective: "1000px" }}
        className="relative mx-auto max-w-md h-[280px] cursor-pointer"
        onClick={handleFlip}
      >
        <CardFace isBack={false} isFlipped={isFlipped} className="bg-card">
          <p className="text-lg text-center">{cards[currentIndex].front}</p>
        </CardFace>
        <CardFace isBack={true} isFlipped={isFlipped} className="bg-primary text-primary-foreground">
          <p className="text-lg text-center">{cards[currentIndex].back}</p>
        </CardFace>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          Truoc
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Tiep theo
        </Button>
      </div>
      <div className="text-center mt-3">
        <Button variant="ghost" onClick={handleFlip}>
          Lat the
        </Button>
      </div>
    </section>
  );
}
