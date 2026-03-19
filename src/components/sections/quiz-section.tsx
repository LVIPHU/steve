"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { resolveField } from "@/lib/ast-utils";
import { cn } from "@/lib/utils";
import type { Section, WebsiteTheme, QuizContent } from "@/types/website-ast";

interface QuizSectionProps {
  section: Section;
  theme: WebsiteTheme;
}

function QuizChoice({
  choice,
  index,
  selected,
  submitted,
  isCorrect,
  isSelectedWrong,
}: {
  choice: string;
  index: number;
  selected: boolean;
  submitted: boolean;
  isCorrect: boolean;
  isSelectedWrong: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border",
        submitted && isCorrect && "bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-400",
        submitted && isSelectedWrong && "bg-red-50 border-red-500 dark:bg-red-950 dark:border-red-400",
        !submitted && selected && "border-primary",
        !submitted && !selected && "border-border"
      )}
    >
      <RadioGroupItem value={String(index)} id={`choice-${index}`} />
      <Label htmlFor={`choice-${index}`} className="flex-1 cursor-pointer">
        {choice}
      </Label>
      {submitted && isCorrect && (
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.15 }}
          className="text-green-600 dark:text-green-400 font-medium text-sm"
        >
          Dung
        </motion.span>
      )}
    </div>
  );
}

export function QuizSection({ section, theme: _theme }: QuizSectionProps) {
  const title = resolveField<string>(section, "title") ?? "Cau hoi";
  const questions = resolveField<QuizContent["questions"]>(section, "questions") ?? [];

  const pathname = usePathname();
  const websiteSlug = pathname.split("/").pop() ?? "default";
  const storageKey = `quiz-${websiteSlug}-${section.id}`;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { answers: Record<number, number>; submitted: boolean };
        setAnswers(parsed.answers);
        setSubmitted(parsed.submitted);
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  function handleSelect(qIdx: number, choiceIdx: number) {
    if (submitted) return;
    const next = { ...answers, [qIdx]: choiceIdx };
    setAnswers(next);
    localStorage.setItem(storageKey, JSON.stringify({ answers: next, submitted: false }));
  }

  function handleSubmit() {
    setSubmitted(true);
    localStorage.setItem(storageKey, JSON.stringify({ answers, submitted: true }));
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    localStorage.removeItem(storageKey);
  }

  const correctCount = questions.reduce(
    (count, q, i) => (answers[i] === q.correctIndex ? count + 1 : count),
    0
  );

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {submitted && (
        <p className="text-lg font-medium mb-4">
          Ban dung {correctCount} / {questions.length} cau
        </p>
      )}
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="mb-8">
          <p className="font-medium mb-3">
            {qIdx + 1}. {q.question}
          </p>
          <RadioGroup
            value={String(mounted ? (answers[qIdx] ?? -1) : -1)}
            onValueChange={(val) => handleSelect(qIdx, Number(val))}
            disabled={submitted}
          >
            {q.choices.map((choice, cIdx) => (
              <QuizChoice
                key={cIdx}
                choice={choice}
                index={cIdx}
                selected={answers[qIdx] === cIdx}
                submitted={submitted}
                isCorrect={submitted && q.correctIndex === cIdx}
                isSelectedWrong={submitted && answers[qIdx] === cIdx && q.correctIndex !== cIdx}
              />
            ))}
          </RadioGroup>
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Nop bai
          </Button>
        ) : (
          <Button onClick={handleRetry} variant="outline">
            Lam lai
          </Button>
        )}
      </div>
    </section>
  );
}
