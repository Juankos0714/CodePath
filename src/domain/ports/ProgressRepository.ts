import type { LessonProgress, ExerciseAttempt } from "@/domain/entities/Progress";

export interface ProgressRepository {
  getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null>;
  upsertLessonProgress(progress: Omit<LessonProgress, "id">): Promise<LessonProgress>;
  completeLesson(userId: string, lessonId: string, xpEarned: number): Promise<void>;
  recordExerciseAttempt(attempt: Omit<ExerciseAttempt, "id">): Promise<void>;
  getUserCompletedLessonIds(userId: string): Promise<string[]>;
}
