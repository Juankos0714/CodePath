"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorStore } from "@/presentation/stores/editorStore";
import { TestRunner } from "@/presentation/features/exercises/TestRunner";
import type { Exercise } from "@/domain/entities/Exercise";
import { completeLessonAction, startLessonAction } from "@/app/actions/lesson";
import { cn } from "@/shared/lib/utils";

interface LessonExerciseSectionProps {
  exercises: Exercise[];
  lessonId: string;
  lessonSlug: string;
  moduleId: string;
  xpReward: number;
  isAuthenticated: boolean;
  alreadyCompleted: boolean;
}

export function LessonExerciseSection({
  exercises,
  lessonId,
  lessonSlug,
  moduleId,
  xpReward,
  isAuthenticated,
  alreadyCompleted,
}: LessonExerciseSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set());
  const [lessonCompleted, setLessonCompleted] = useState(alreadyCompleted);
  const { reset } = useEditorStore();

  const currentExercise = exercises[currentIndex];
  const allSolved = exercises.every((ex) => solvedSet.has(ex.id));

  // Init lesson + first exercise
  useEffect(() => {
    if (isAuthenticated) {
      void startLessonAction(lessonId);
    }
    if (currentExercise) {
      reset(currentExercise.starterCode ?? "// Escribe tu código aquí\n");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When switching exercises, reset editor with the new starter code
  useEffect(() => {
    if (currentExercise) {
      reset(currentExercise.starterCode ?? "// Escribe tu código aquí\n");
    }
  }, [currentIndex, currentExercise, reset]);

  const handleSolved = (xpEarned: number) => {
    if (!currentExercise) return;
    setSolvedSet((prev) => new Set([...prev, currentExercise.id]));
    void checkLessonCompletion(xpEarned);
  };

  const checkLessonCompletion = async (latestXP: number) => {
    const newSolved = new Set([...solvedSet, currentExercise?.id ?? ""]);
    const nowAllSolved = exercises.every((ex) => newSolved.has(ex.id));

    if (nowAllSolved && !lessonCompleted && isAuthenticated) {
      setLessonCompleted(true);
      const { data, error } = await completeLessonAction({
        lessonId,
        lessonSlug,
        moduleId,
        xpReward,
      });

      if (data && !error) {
        toast.success(`¡Lección completada! +${data.xpEarned} XP`, {
          description: data.leveledUp
            ? `¡Subiste al nivel ${data.newLevel}! ⬆️`
            : "Sigue con la siguiente lección.",
          icon: "🏆",
          duration: 5000,
        });
      }
    }
  };

  if (!currentExercise) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Esta lección no tiene ejercicios.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      {exercises.length > 1 && (
        <div className="flex items-center gap-1.5">
          {exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === currentIndex
                  ? "w-6 bg-[var(--color-primary)]"
                  : solvedSet.has(ex.id)
                  ? "w-2 bg-[var(--color-success)]"
                  : "w-2 bg-[var(--color-muted)]"
              )}
              title={`Ejercicio ${i + 1}${solvedSet.has(ex.id) ? " ✓" : ""}`}
            />
          ))}
          <span className="ml-2 text-xs text-[var(--color-muted-foreground)]">
            {currentIndex + 1} / {exercises.length}
          </span>
          {allSolved && (
            <CheckCircle2
              size={16}
              className="ml-1 text-[var(--color-success)]"
            />
          )}
        </div>
      )}

      <TestRunner
        exercise={currentExercise}
        onSolved={handleSolved}
        isAuthenticated={isAuthenticated}
      />

      {/* Navigation */}
      {exercises.length > 1 && (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(exercises.length - 1, i + 1))
            }
            disabled={currentIndex === exercises.length - 1}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-40 transition-colors"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
