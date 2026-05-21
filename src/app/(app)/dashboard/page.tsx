import type { Metadata } from "next";
import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Star, Trophy } from "lucide-react";
import { XPBar } from "@/presentation/components/shared/XPBar";
import { StreakBadge } from "@/presentation/components/shared/StreakBadge";
import { getStreakMessage, formatXP } from "@/shared/lib/utils";
import { getLevelTitle } from "@/shared/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: modules }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single(),
    supabase
      .from("modules")
      .select("*, lessons(id, slug, title, xp_reward, order_index, is_published)")
      .eq("is_published", true)
      .order("order_index"),
    supabase
      .from("user_lesson_progress")
      .select("lesson_id, completed_at")
      .eq("user_id", user.id)
      .not("completed_at", "is", null),
  ]);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const displayName = profile?.display_name ?? profile?.username ?? "Programador";

  // Find next lesson to take
  const nextLesson = (() => {
    for (const mod of modules ?? []) {
      const lessons = (mod.lessons as { id: string; slug: string; title: string; is_published: boolean; order_index: number }[])
        ?.filter((l) => l.is_published)
        ?.sort((a, b) => a.order_index - b.order_index);
      for (const lesson of lessons ?? []) {
        if (!completedIds.has(lesson.id)) {
          return { ...lesson, moduleName: mod.title };
        }
      }
    }
    return null;
  })();

  const totalLessons = (modules ?? []).reduce(
    (acc, m) =>
      acc + ((m.lessons as unknown[]) ?? []).length,
    0
  );

  return (
    <div className="space-y-8 pb-16 lg:pt-0 pt-14">
      {/* Welcome */}
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Hola, {displayName} 👋
        </h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          {getStreakMessage(profile?.current_streak ?? 0)}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "XP Total",
            value: formatXP(profile?.total_xp ?? 0),
            icon: Star,
            color: "text-amber-500",
          },
          {
            label: "Nivel",
            value: `${profile?.current_level ?? 1} — ${getLevelTitle(profile?.current_level ?? 1)}`,
            icon: Trophy,
            color: "text-[var(--color-primary)]",
          },
          {
            label: "Racha actual",
            value: `${profile?.current_streak ?? 0} días`,
            icon: Flame,
            color: "text-orange-500",
          },
          {
            label: "Lecciones",
            value: `${completedIds.size} / ${totalLessons}`,
            icon: BookOpen,
            color: "text-[var(--color-success)]",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
          >
            <Icon size={18} className={color} />
            <p className="mt-2 text-xl font-bold leading-none">{value}</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      {profile && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
            Progreso al siguiente nivel
          </h2>
          <XPBar totalXP={profile.total_xp} level={profile.current_level} />
        </div>
      )}

      {/* Next lesson CTA */}
      {nextLesson && (
        <div className="rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Continúa donde lo dejaste
          </p>
          <h2 className="mt-1 text-lg font-bold">{nextLesson.title}</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {nextLesson.moduleName}
          </p>
          <Link
            href={`/lecciones/${nextLesson.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Ir a la lección
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {completedIds.size === totalLessons && totalLessons > 0 && (
        <div className="rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-5 text-center">
          <p className="text-2xl">🏆</p>
          <h2 className="mt-2 text-lg font-bold">¡Completaste todo el contenido!</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Eres un CodePath Master. Próximamente más módulos.
          </p>
        </div>
      )}

      {/* Modules overview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Módulos</h2>
        <div className="space-y-3">
          {(modules ?? []).map((mod) => {
            const lessons = (mod.lessons as { id: string; is_published: boolean }[] | null)
              ?.filter((l) => l.is_published) ?? [];
            const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;
            const percent = lessons.length > 0
              ? Math.round((completedCount / lessons.length) * 100)
              : 0;

            return (
              <div
                key={mod.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
              >
                <span className="text-2xl">{mod.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{mod.title}</p>
                    <span className="shrink-0 text-sm text-[var(--color-muted-foreground)]">
                      {completedCount}/{lessons.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
