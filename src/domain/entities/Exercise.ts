import type { TestCase } from "@/shared/types/database";
import type { ExerciseType } from "@/shared/types/database";

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  title: string;
  prompt: string;
  starterCode: string | null;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[];
  commonMistakes: string[];
  difficulty: number;
  xpReward: number;
  orderIndex: number;
  createdAt: Date;
}

export function exerciseFromRow(row: {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  title: string;
  prompt: string;
  starter_code: string | null;
  solution_code: string;
  test_cases: unknown;
  hints: unknown;
  common_mistakes: unknown;
  difficulty: number;
  xp_reward: number;
  order_index: number;
  created_at: string;
}): Exercise {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    type: row.type,
    title: row.title,
    prompt: row.prompt,
    starterCode: row.starter_code,
    solutionCode: row.solution_code,
    testCases: row.test_cases as TestCase[],
    hints: row.hints as string[],
    commonMistakes: row.common_mistakes as string[],
    difficulty: row.difficulty,
    xpReward: row.xp_reward,
    orderIndex: row.order_index,
    createdAt: new Date(row.created_at),
  };
}
