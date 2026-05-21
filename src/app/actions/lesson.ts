"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { SupabaseProgressRepo } from "@/infrastructure/supabase/repositories/SupabaseProgressRepo";
import { SupabaseUserRepo } from "@/infrastructure/supabase/repositories/SupabaseUserRepo";
import { CompleteLesson } from "@/domain/use-cases/CompleteLesson";
import { ValidateExercise } from "@/domain/use-cases/ValidateExercise";
import { analytics } from "@/infrastructure/analytics/PostHogService";
import type { WorkerResult } from "@/infrastructure/code-execution/sandbox";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const completeLessonSchema = z.object({
  lessonId: z.string().uuid(),
  lessonSlug: z.string().min(1),
  moduleId: z.string().uuid(),
  xpReward: z.number().int().positive(),
});

export async function completeLessonAction(input: z.infer<typeof completeLessonSchema>) {
  const parsed = completeLessonSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos inválidos", data: null };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado", data: null };
  }

  const progressRepo = new SupabaseProgressRepo(supabase);
  const userRepo = new SupabaseUserRepo(supabase);
  const useCase = new CompleteLesson(progressRepo, userRepo, analytics);

  try {
    const result = await useCase.execute({
      userId: user.id,
      ...parsed.data,
    });

    revalidatePath(`/lecciones/${parsed.data.lessonSlug}`);
    revalidatePath("/dashboard");

    return { data: result, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return { error: message, data: null };
  }
}

const validateExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  lessonId: z.string().uuid(),
  submittedCode: z.string().max(10_000),
  executionResult: z.object({
    success: z.boolean(),
    output: z.array(z.string()),
    error: z.string().optional(),
    executionTimeMs: z.number(),
    testResults: z.array(
      z.object({
        description: z.string(),
        passed: z.boolean(),
        expected: z.string().optional(),
        actual: z.string().optional(),
        error: z.string().optional(),
      })
    ),
  }),
  xpReward: z.number().int().nonnegative(),
});

export async function validateExerciseAction(
  input: z.infer<typeof validateExerciseSchema>
) {
  const parsed = validateExerciseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos inválidos", data: null };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado", data: null };
  }

  const progressRepo = new SupabaseProgressRepo(supabase);
  const userRepo = new SupabaseUserRepo(supabase);
  const useCase = new ValidateExercise(progressRepo, userRepo, analytics);

  try {
    const result = await useCase.execute({
      userId: user.id,
      exerciseId: parsed.data.exerciseId,
      lessonId: parsed.data.lessonId,
      submittedCode: parsed.data.submittedCode,
      executionResult: parsed.data.executionResult as WorkerResult,
      xpReward: parsed.data.xpReward,
    });

    return { data: result, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return { error: message, data: null };
  }
}

export async function startLessonAction(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_lesson_progress").upsert(
    { user_id: user.id, lesson_id: lessonId },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
  );

  analytics.track("lesson_started", { lesson_id: lessonId });
}
