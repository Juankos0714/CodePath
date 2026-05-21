export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  startedAt: Date;
  completedAt: Date | null;
  xpEarned: number;
  attempts: number;
}

export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  submittedCode: string;
  isCorrect: boolean;
  executionTimeMs: number | null;
  errorMessage: string | null;
  attemptedAt: Date;
}

export function lessonProgressFromRow(row: {
  id: string;
  user_id: string;
  lesson_id: string;
  started_at: string;
  completed_at: string | null;
  xp_earned: number;
  attempts: number;
}): LessonProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : null,
    xpEarned: row.xp_earned,
    attempts: row.attempts,
  };
}
