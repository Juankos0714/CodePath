import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/infrastructure/supabase/server";
import { Clock, CheckCircle2, Lock } from "lucide-react";
import { formatDuration } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

export const metadata: Metadata = { title: "Lecciones" };

export default async function LeccionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: modules }, { data: progress }] = await Promise.all([
    supabase
      .from("modules")
      .select("*, lessons(id, slug, title, description, xp_reward, estimated_minutes, order_index, is_published)")
      .eq("is_published", true)
      .order("order_index"),
    user
      ? supabase
          .from("user_lesson_progress")
          .select("lesson_id, completed_at")
          .eq("user_id", user.id)
          .not("completed_at", "is", null)
      : Promise.resolve({ data: [] }),
  ]);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));

  return (
    <div className="space-y-10 pb-16 lg:pt-0 pt-14">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Lecciones</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          10 módulos · aprende a tu ritmo · en español
        </p>
      </header>

      {(modules ?? []).map((mod) => {
        type LessonItem = {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          xp_reward: number;
          estimated_minutes: number;
          order_index: number;
          is_published: boolean;
        };
        const lessons = ((mod.lessons as LessonItem[] | null) ?? [])
          .filter((l) => l.is_published)
          .sort((a, b) => a.order_index - b.order_index);
        const completedCount = lessons.filter((l) => completedIds.has(l.id)).length;

        return (
          <section key={mod.id}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">{mod.icon}</span>
              <div>
                <h2 className="text-lg font-bold">{mod.title}</h2>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {completedCount}/{lessons.length} completadas ·{" "}
                  {formatDuration(mod.estimated_minutes)}
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {lessons.map((lesson, i) => {
                const isCompleted = completedIds.has(lesson.id);
                const isUnlocked = i === 0 || completedIds.has(lessons[i - 1]?.id ?? "");

                return (
                  <Link
                    key={lesson.id}
                    href={isUnlocked ? `/lecciones/${lesson.slug}` : "#"}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 transition-all",
                      isUnlocked
                        ? "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/40 hover:shadow-sm"
                        : "border-[var(--color-border)] bg-[var(--color-muted)] opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        isCompleted
                          ? "bg-[var(--color-success)] text-white"
                          : isUnlocked
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} />
                      ) : !isUnlocked ? (
                        <Lock size={14} />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                        <Clock size={11} />
                        {formatDuration(lesson.estimated_minutes)}
                        <span>·</span>
                        <span className="text-amber-600 font-medium">
                          +{lesson.xp_reward} XP
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
