import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Clock,
  Star,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/infrastructure/supabase/server";
import { lessonFromRow } from "@/domain/entities/Lesson";
import { exerciseFromRow } from "@/domain/entities/Exercise";
import { LessonContent } from "@/presentation/features/lessons/LessonContent";
import { LessonExerciseSection } from "@/presentation/features/lessons/LessonExerciseSection";
import { formatDuration } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) return { title: "Lección no encontrada" };
  return {
    title: data.title,
    description: data.description ?? undefined,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch lesson
  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("*, modules(id, slug, title)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!lessonRow) notFound();

  const lesson = lessonFromRow(lessonRow);

  // Fetch exercises for this lesson
  const { data: exerciseRows } = await supabase
    .from("exercises")
    .select("*")
    .eq("lesson_id", lesson.id)
    .order("order_index");

  const exercises = (exerciseRows ?? []).map(exerciseFromRow);

  // Auth + progress
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyCompleted = false;
  if (user) {
    const { data: progress } = await supabase
      .from("user_lesson_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle();
    alreadyCompleted = !!progress?.completed_at;
  }

  // Fetch prev/next lessons in the same module
  const { data: siblings } = await supabase
    .from("lessons")
    .select("slug, title, order_index")
    .eq("module_id", lesson.moduleId)
    .eq("is_published", true)
    .order("order_index");

  const currentIdx = siblings?.findIndex((l) => l.slug === slug) ?? -1;
  const prevLesson = currentIdx > 0 ? siblings?.[currentIdx - 1] : null;
  const nextLesson =
    siblings && currentIdx < siblings.length - 1
      ? siblings[currentIdx + 1]
      : null;

  const module = lessonRow.modules as { id: string; slug: string; title: string } | null;

  return (
    <div className="space-y-8 pb-16 lg:pt-0 pt-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
        <Link href="/lecciones" className="hover:text-[var(--color-foreground)] transition-colors">
          Lecciones
        </Link>
        <span>/</span>
        {module && (
          <>
            <span>{module.title}</span>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--color-foreground)] font-medium truncate">
          {lesson.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {lesson.title}
          </h1>
          {alreadyCompleted && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
              <CheckCircle2 size={13} />
              Completada
            </span>
          )}
        </div>

        {lesson.description && (
          <p className="text-base text-[var(--color-muted-foreground)] leading-relaxed max-w-2xl">
            {lesson.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatDuration(lesson.estimatedMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={14} className="text-[var(--color-xp)]" />
            {lesson.xpReward} XP
          </span>
          {exercises.length > 0 && (
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} />
              {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      {/* Two-column layout on large screens */}
      <div className="grid gap-8 xl:grid-cols-2 xl:gap-12">
        {/* Left: Lesson content */}
        <section>
          <LessonContent markdown={lesson.contentMd} />
        </section>

        {/* Right: Exercises */}
        {exercises.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              Practica lo aprendido
            </h2>
            <LessonExerciseSection
              exercises={exercises}
              lessonId={lesson.id}
              lessonSlug={lesson.slug}
              moduleId={lesson.moduleId}
              xpReward={lesson.xpReward}
              isAuthenticated={!!user}
              alreadyCompleted={alreadyCompleted}
            />
          </section>
        )}
      </div>

      {/* Prev / Next navigation */}
      {(prevLesson ?? nextLesson) && (
        <nav
          className={cn(
            "grid gap-3 border-t border-[var(--color-border)] pt-6",
            prevLesson && nextLesson ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {prevLesson && (
            <Link
              href={`/lecciones/${prevLesson.slug}`}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] p-4 hover:bg-[var(--color-surface)] transition-colors group"
            >
              <ChevronLeft
                size={18}
                className="shrink-0 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors"
              />
              <span className="min-w-0">
                <span className="block text-xs text-[var(--color-muted-foreground)]">
                  Anterior
                </span>
                <span className="block text-sm font-medium truncate">
                  {prevLesson.title}
                </span>
              </span>
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/lecciones/${nextLesson.slug}`}
              className={cn(
                "flex items-center justify-end gap-2 rounded-xl border border-[var(--color-border)] p-4 hover:bg-[var(--color-surface)] transition-colors group",
                !prevLesson && "col-start-1"
              )}
            >
              <span className="min-w-0 text-right">
                <span className="block text-xs text-[var(--color-muted-foreground)]">
                  Siguiente
                </span>
                <span className="block text-sm font-medium truncate">
                  {nextLesson.title}
                </span>
              </span>
              <ChevronLeft
                size={18}
                className="shrink-0 rotate-180 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors"
              />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
