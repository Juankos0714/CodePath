import type { ProgressRepository } from "@/domain/ports/ProgressRepository";
import type { UserRepository } from "@/domain/ports/UserRepository";
import type { AnalyticsService } from "@/domain/ports/AnalyticsService";
import type { WorkerResult } from "@/infrastructure/code-execution/sandbox";

export interface ValidateExerciseInput {
  userId: string;
  exerciseId: string;
  lessonId: string;
  submittedCode: string;
  executionResult: WorkerResult;
  xpReward: number;
}

export interface ValidateExerciseOutput {
  isCorrect: boolean;
  xpEarned: number;
  firstSolve: boolean;
}

export class ValidateExercise {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly userRepo: UserRepository,
    private readonly analytics: AnalyticsService
  ) {}

  async execute(input: ValidateExerciseInput): Promise<ValidateExerciseOutput> {
    const isCorrect = input.executionResult.success;

    await this.progressRepo.recordExerciseAttempt({
      userId: input.userId,
      exerciseId: input.exerciseId,
      submittedCode: input.submittedCode,
      isCorrect,
      executionTimeMs: input.executionResult.executionTimeMs,
      errorMessage: input.executionResult.error ?? null,
      attemptedAt: new Date(),
    });

    this.analytics.track(isCorrect ? "exercise_solved" : "exercise_failed", {
      exercise_id: input.exerciseId,
      lesson_id: input.lessonId,
      execution_time_ms: input.executionResult.executionTimeMs,
    });

    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = input.xpReward;
      await this.userRepo.awardXP(input.userId, xpEarned);
    }

    return { isCorrect, xpEarned, firstSolve: isCorrect };
  }
}
