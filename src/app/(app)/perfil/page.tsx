import type { Metadata } from "next";
import { createClient } from "@/infrastructure/supabase/server";
import { XPBar } from "@/presentation/components/shared/XPBar";
import { StreakBadge } from "@/presentation/components/shared/StreakBadge";
import { getLevelTitle } from "@/shared/constants";
import { formatXP } from "@/shared/lib/utils";
import { Trophy, Star, Flame } from "lucide-react";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: badges }, { data: activity }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("user_badges")
        .select("*, badges(*)")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false }),
      supabase
        .from("user_daily_activity")
        .select("activity_date, xp_earned, lessons_completed, exercises_solved")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false })
        .limit(30),
    ]);

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-16 lg:pt-0 pt-14">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Mi perfil</h1>
      </header>

      {/* Profile card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-start gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-2xl font-bold text-[var(--color-primary)]">
              {(profile.display_name ?? profile.username ?? "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">
                {profile.display_name ?? profile.username}
              </h2>
              <StreakBadge streak={profile.current_streak} />
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              @{profile.username}
            </p>
            {profile.bio && (
              <p className="mt-2 text-sm">{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <XPBar totalXP={profile.total_xp} level={profile.current_level} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {[
            {
              value: formatXP(profile.total_xp),
              label: "XP Total",
              icon: Star,
              color: "text-amber-500",
            },
            {
              value: `Nv. ${profile.current_level}`,
              label: getLevelTitle(profile.current_level),
              icon: Trophy,
              color: "text-[var(--color-primary)]",
            },
            {
              value: `${profile.longest_streak}d`,
              label: "Mejor racha",
              icon: Flame,
              color: "text-orange-500",
            },
          ].map(({ value, label, icon: Icon, color }) => (
            <div key={label}>
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {badges && badges.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Badges ({badges.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((ub) => {
              const badge = ub.badges as {
                code: string;
                title: string;
                description: string;
                icon: string;
                rarity: string;
              } | null;
              if (!badge) return null;
              return (
                <div
                  key={ub.badge_code}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center"
                  title={badge.description}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <p className="text-sm font-semibold">{badge.title}</p>
                  <span className="text-xs text-[var(--color-muted-foreground)] capitalize">
                    {badge.rarity}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent activity */}
      {activity && activity.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Actividad reciente</h2>
          <div className="space-y-2">
            {activity.slice(0, 10).map((day) => (
              <div
                key={day.activity_date}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3"
              >
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {new Date(day.activity_date).toLocaleDateString("es", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-amber-600">
                    +{day.xp_earned} XP
                  </span>
                  {day.lessons_completed > 0 && (
                    <span className="text-[var(--color-muted-foreground)]">
                      {day.lessons_completed} lección
                      {day.lessons_completed !== 1 ? "es" : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
