/**
 * Types generados manualmente a partir del schema SQL.
 * Reemplaza este archivo ejecutando:
 *   pnpm supabase:gen-types
 * o:
 *   supabase gen types typescript --project-id <PROJECT_ID> > src/shared/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type ExerciseType =
  | "fill_blank"
  | "order_blocks"
  | "code_challenge"
  | "quiz"
  | "debug";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          total_xp: number;
          current_level: number;
          current_streak: number;
          longest_streak: number;
          last_activity_at: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          total_xp?: number;
          current_level?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_at?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          total_xp?: number;
          current_level?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_at?: string | null;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string | null;
          order_index: number;
          difficulty: DifficultyLevel;
          estimated_minutes: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          icon?: string | null;
          order_index: number;
          difficulty: DifficultyLevel;
          estimated_minutes: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string;
          icon?: string | null;
          order_index?: number;
          difficulty?: DifficultyLevel;
          estimated_minutes?: number;
          is_published?: boolean;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          slug: string;
          title: string;
          description: string | null;
          content_md: string;
          order_index: number;
          xp_reward: number;
          estimated_minutes: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          slug: string;
          title: string;
          description?: string | null;
          content_md: string;
          order_index: number;
          xp_reward?: number;
          estimated_minutes?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          module_id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          content_md?: string;
          order_index?: number;
          xp_reward?: number;
          estimated_minutes?: number;
          is_published?: boolean;
        };
      };
      exercises: {
        Row: {
          id: string;
          lesson_id: string;
          type: ExerciseType;
          title: string;
          prompt: string;
          starter_code: string | null;
          solution_code: string;
          test_cases: Json;
          hints: Json;
          common_mistakes: Json;
          difficulty: number;
          xp_reward: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          type: ExerciseType;
          title: string;
          prompt: string;
          starter_code?: string | null;
          solution_code: string;
          test_cases?: Json;
          hints?: Json;
          common_mistakes?: Json;
          difficulty: number;
          xp_reward?: number;
          order_index: number;
          created_at?: string;
        };
        Update: {
          lesson_id?: string;
          type?: ExerciseType;
          title?: string;
          prompt?: string;
          starter_code?: string | null;
          solution_code?: string;
          test_cases?: Json;
          hints?: Json;
          common_mistakes?: Json;
          difficulty?: number;
          xp_reward?: number;
          order_index?: number;
        };
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          started_at: string;
          completed_at: string | null;
          xp_earned: number;
          attempts: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          started_at?: string;
          completed_at?: string | null;
          xp_earned?: number;
          attempts?: number;
        };
        Update: {
          completed_at?: string | null;
          xp_earned?: number;
          attempts?: number;
        };
      };
      user_exercise_attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          submitted_code: string;
          is_correct: boolean;
          execution_time_ms: number | null;
          error_message: string | null;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          submitted_code: string;
          is_correct: boolean;
          execution_time_ms?: number | null;
          error_message?: string | null;
          attempted_at?: string;
        };
        Update: never;
      };
      badges: {
        Row: {
          code: string;
          title: string;
          description: string;
          icon: string;
          xp_bonus: number;
          rarity: BadgeRarity;
        };
        Insert: {
          code: string;
          title: string;
          description: string;
          icon: string;
          xp_bonus?: number;
          rarity: BadgeRarity;
        };
        Update: {
          title?: string;
          description?: string;
          icon?: string;
          xp_bonus?: number;
          rarity?: BadgeRarity;
        };
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_code: string;
          unlocked_at: string;
        };
        Insert: {
          user_id: string;
          badge_code: string;
          unlocked_at?: string;
        };
        Update: never;
      };
      user_daily_activity: {
        Row: {
          user_id: string;
          activity_date: string;
          xp_earned: number;
          lessons_completed: number;
          exercises_solved: number;
        };
        Insert: {
          user_id: string;
          activity_date: string;
          xp_earned?: number;
          lessons_completed?: number;
          exercises_solved?: number;
        };
        Update: {
          xp_earned?: number;
          lessons_completed?: number;
          exercises_solved?: number;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          properties: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          properties?: Json;
          created_at?: string;
        };
        Update: never;
      };
    };
    Functions: {
      update_user_streak: {
        Args: { p_user_id: string };
        Returns: void;
      };
      award_xp: {
        Args: { p_user_id: string; p_xp: number };
        Returns: number;
      };
    };
    Enums: {
      difficulty_level: DifficultyLevel;
      exercise_type: ExerciseType;
    };
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type UserLessonProgress =
  Database["public"]["Tables"]["user_lesson_progress"]["Row"];
export type UserExerciseAttempt =
  Database["public"]["Tables"]["user_exercise_attempts"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type UserDailyActivity =
  Database["public"]["Tables"]["user_daily_activity"]["Row"];

// Composed types
export type LessonWithExercises = Lesson & {
  exercises: Exercise[];
};

export type ModuleWithLessons = Module & {
  lessons: (Lesson & { completed: boolean })[];
};

export type TestCase = {
  input: null | string;
  expected_output?: string;
  description: string;
  check_type?: "exact" | "pattern" | "no_error";
  pattern?: string;
};
