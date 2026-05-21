import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/database";
import type { ProgressRepository } from "@/domain/ports/ProgressRepository";
import type {
  LessonProgress,
  ExerciseAttempt,
} from "@/domain/entities/Progress";
import {
  lessonProgressFromRow,
} from "@/domain/entities/Progress";

export class SupabaseProgressRepo implements ProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getLessonProgress(
    userId: string,
    lessonId: string
  ): Promise<LessonProgress | null> {
    const { data } = await this.supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    return data ? lessonProgressFromRow(data) : null;
  }

  async upsertLessonProgress(
    progress: Omit<LessonProgress, "id">
  ): Promise<LessonProgress> {
    const { data, error } = await this.supabase
      .from("user_lesson_progress")
      .upsert(
        {
          user_id: progress.userId,
          lesson_id: progress.lessonId,
          started_at: progress.startedAt.toISOString(),
          completed_at: progress.completedAt?.toISOString() ?? null,
          xp_earned: progress.xpEarned,
          attempts: progress.attempts,
        },
        { onConflict: "user_id,lesson_id" }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return lessonProgressFromRow(data);
  }

  async completeLesson(
    userId: string,
    lessonId: string,
    xpEarned: number
  ): Promise<void> {
    const { error } = await this.supabase.from("user_lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned,
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (error) throw new Error(error.message);

    // Update daily activity
    const today = new Date().toISOString().split("T")[0]!;
    await this.supabase.rpc("award_xp" as never, {
      p_user_id: userId,
      p_xp: 0,
    });
    await this.supabase
      .from("user_daily_activity")
      .upsert(
        {
          user_id: userId,
          activity_date: today,
          lessons_completed: 1,
          xp_earned: xpEarned,
        },
        {
          onConflict: "user_id,activity_date",
          ignoreDuplicates: false,
        }
      );
  }

  async recordExerciseAttempt(
    attempt: Omit<ExerciseAttempt, "id">
  ): Promise<void> {
    const { error } = await this.supabase
      .from("user_exercise_attempts")
      .insert({
        user_id: attempt.userId,
        exercise_id: attempt.exerciseId,
        submitted_code: attempt.submittedCode,
        is_correct: attempt.isCorrect,
        execution_time_ms: attempt.executionTimeMs,
        error_message: attempt.errorMessage,
        attempted_at: attempt.attemptedAt.toISOString(),
      });

    if (error) throw new Error(error.message);
  }

  async getUserCompletedLessonIds(userId: string): Promise<string[]> {
    const { data } = await this.supabase
      .from("user_lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .not("completed_at", "is", null);

    return (data ?? []).map((r) => r.lesson_id);
  }
}
