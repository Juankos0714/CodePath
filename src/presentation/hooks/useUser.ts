"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/infrastructure/supabase/client";
import { useUserStore } from "@/presentation/stores/userStore";
import { userFromRow } from "@/domain/entities/User";

export function useUser() {
  const { user, setUser } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      return profile ? userFromRow(profile) : null;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data !== undefined) setUser(data);
  }, [data, setUser]);

  return { user: user ?? data ?? null, isLoading };
}
