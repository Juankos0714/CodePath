import type { ProgressRepository } from "@/domain/ports/ProgressRepository";
import type { UserRepository } from "@/domain/ports/UserRepository";
import type { AnalyticsService } from "@/domain/ports/AnalyticsService";

export interface CompleteLessonInput {
  userId: string;
  lessonId: string;
  xpReward: number;
  lessonSlug: string;
  moduleId: string;
}

export interface CompleteLessonOutput {
  xpEarned: number;
  totalXP: number;
  leveledUp: boolean;
  newLevel: number;
  streakUpdated: boolean;
}

export class CompleteLesson {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly userRepo: UserRepository,
    private readonly analytics: AnalyticsService
  ) {}

  async execute(input: CompleteLessonInput): Promise<CompleteLessonOutput> {
    const existing = await this.progressRepo.getLessonProgress(
      input.userId,
      input.lessonId
    );

    // Idempotent: don't award XP twice
    const xpToAward = existing?.completedAt ? 0 : input.xpReward;

    await this.progressRepo.completeLesson(
      input.userId,
      input.lessonId,
      xpToAward
    );

    const userBefore = await this.userRepo.findById(input.userId);
    const levelBefore = userBefore?.currentLevel ?? 1;

    const totalXP = xpToAward > 0
      ? await this.userRepo.awardXP(input.userId, xpToAward)
      : (userBefore?.totalXP ?? 0);

    await this.userRepo.updateStreak(input.userId);

    const userAfter = await this.userRepo.findById(input.userId);
    const levelAfter = userAfter?.currentLevel ?? 1;

    this.analytics.track("lesson_completed", {
      lesson_id: input.lessonId,
      lesson_slug: input.lessonSlug,
      module_id: input.moduleId,
      xp_earned: xpToAward,
    });

    if (levelAfter > levelBefore) {
      this.analytics.track("level_up", {
        old_level: levelBefore,
        new_level: levelAfter,
      });
    }

    return {
      xpEarned: xpToAward,
      totalXP,
      leveledUp: levelAfter > levelBefore,
      newLevel: levelAfter,
      streakUpdated: true,
    };
  }
}
