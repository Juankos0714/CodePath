"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/infrastructure/supabase/client";

export function useProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      if (!userId) return [];
      const supabase = createClient();
      const { data } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed_at, xp_earned")
        .eq("user_id", userId)
        .not("completed_at", "is", null);
      return data ?? [];
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
}

export function useLessonProgress(userId: string | undefined, lessonId: string) {
  return useQuery({
    queryKey: ["progress", userId, lessonId],
    queryFn: async () => {
      if (!userId) return null;
      const supabase = createClient();
      const { data } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
  });
}
