import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/database";
import type { UserRepository } from "@/domain/ports/UserRepository";
import type { User } from "@/domain/entities/User";
import { userFromRow } from "@/domain/entities/User";

export class SupabaseUserRepo implements UserRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(id: string): Promise<User | null> {
    const { data } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return data ? userFromRow(data) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    return data ? userFromRow(data) : null;
  }

  async update(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User> {
    const { data: updated, error } = await this.supabase
      .from("profiles")
      .update({
        username: data.username,
        display_name: data.displayName,
        avatar_url: data.avatarUrl,
        bio: data.bio,
        onboarding_completed: data.onboardingCompleted,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return userFromRow(updated);
  }

  async awardXP(id: string, xp: number): Promise<number> {
    const { data, error } = await this.supabase.rpc("award_xp", {
      p_user_id: id,
      p_xp: xp,
    });

    if (error) throw new Error(error.message);
    return data as number;
  }

  async updateStreak(id: string): Promise<void> {
    const { error } = await this.supabase.rpc("update_user_streak", {
      p_user_id: id,
    });

    if (error) throw new Error(error.message);
  }
}
