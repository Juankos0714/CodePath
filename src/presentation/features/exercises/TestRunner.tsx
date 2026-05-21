"use client";

import { useState } from "react";
import { Play, RotateCcw, Lightbulb, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useEditorStore } from "@/presentation/stores/editorStore";
import { useCodeExecution } from "@/presentation/hooks/useCodeExecution";
import { CodeEditor } from "./CodeEditor";
import { FeedbackPanel } from "./FeedbackPanel";
import type { Exercise } from "@/domain/entities/Exercise";
import { validateExerciseAction } from "@/app/actions/lesson";
import { cn } from "@/shared/lib/utils";

interface TestRunnerProps {
  exercise: Exercise;
  onSolved?: (xpEarned: number) => void;
  isAuthenticated: boolean;
}

export function TestRunner({ exercise, onSolved, isAuthenticated }: TestRunnerProps) {
  const { code, setCode, isRunning, lastResult, hintsRevealed, revealNextHint, reset } =
    useEditorStore();
  const { run } = useCodeExecution(exercise.id);
  const [solved, setSolved] = useState(false);

  const handleRun = async () => {
    const result = await run(exercise.testCases);

    if (result.success && !solved && isAuthenticated) {
      setSolved(true);
      const { data, error } = await validateExerciseAction({
        exerciseId: exercise.id,
        lessonId: exercise.lessonId,
        submittedCode: code,
        executionResult: result,
        xpReward: exercise.xpReward,
      });

      if (data && !error) {
        toast.success(`+${data.xpEarned} XP`, {
          description: "¡Ejercicio resuelto! Sigue así.",
          icon: "🎉",
          duration: 4000,
        });
        onSolved?.(data.xpEarned);
      }
    }
  };

  const handleReset = () => {
    reset(exercise.starterCode ?? "");
    setSolved(false);
  };

  const handleHint = () => {
    if (hintsRevealed < exercise.hints.length) {
      revealNextHint();
    }
  };

  const visibleHints = exercise.hints.slice(0, hintsRevealed);

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h3 className="mb-1 text-base font-semibold">{exercise.title}</h3>
        <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
          {exercise.prompt}
        </p>
      </div>

      {/* Editor */}
      <CodeEditor height="240px" />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning || solved}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            solved
              ? "bg-[var(--color-success)] text-white cursor-default"
              : "bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50"
          )}
        >
          {solved ? (
            <>
              <CheckCircle2 size={16} />
              Resuelto
            </>
          ) : (
            <>
              <Play size={16} />
              {isRunning ? "Ejecutando..." : "Ejecutar"}
            </>
          )}
        </button>

        {exercise.hints.length > 0 && hintsRevealed < exercise.hints.length && !solved && (
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <Lightbulb size={14} />
            Pista ({hintsRevealed}/{exercise.hints.length})
          </button>
        )}

        <button
          onClick={handleReset}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          title="Reiniciar código"
        >
          <RotateCcw size={14} />
          Reiniciar
        </button>
      </div>

      {/* Hints */}
      {visibleHints.length > 0 && (
        <div className="space-y-2">
          {visibleHints.map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-800 dark:text-amber-300"
            >
              <Lightbulb size={14} className="mt-0.5 shrink-0" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      <FeedbackPanel result={lastResult} isRunning={isRunning} />

      {/* Common mistakes (accordion — show only if failed at least once) */}
      {lastResult && !lastResult.success && exercise.commonMistakes.length > 0 && (
        <details className="group rounded-xl border border-[var(--color-border)]">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium list-none">
            Errores comunes
            <span className="text-[var(--color-muted-foreground)] group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <ul className="border-t border-[var(--color-border)] px-4 py-3 space-y-1.5">
            {exercise.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-muted-foreground)]">
                <span className="mt-0.5 text-[var(--color-danger)]">✗</span>
                {mistake}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
