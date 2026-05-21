import Link from "next/link";
import {
  Code2,
  BookOpen,
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { APP_NAME, APP_DESCRIPTION } from "@/shared/constants";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-background)]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-[var(--color-primary)]" />
            <span className="font-bold">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-lg bg-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]">
          <Zap size={14} />
          100% en español · Gratis para empezar
        </div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Aprende a programar
          <br />
          <span className="text-[var(--color-primary)]">desde cero en JavaScript</span>
        </h1>
        <p className="mt-6 text-lg text-[var(--color-muted-foreground)] sm:text-xl">
          {APP_DESCRIPTION} Lecciones cortas, ejercicios con feedback inmediato
          y gamificación que te mantiene motivado.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/registro"
            className="rounded-xl bg-[var(--color-primary)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Comenzar ahora — es gratis
          </Link>
          <Link
            href="/lecciones"
            className="rounded-xl border border-[var(--color-border)] px-8 py-3 text-base font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            Ver el contenido
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            Diseñado para quienes aprenden de verdad
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Editor en el navegador",
                desc: "Escribe y ejecuta JavaScript sin instalar nada. Feedback inmediato en cada ejercicio.",
              },
              {
                icon: BookOpen,
                title: "10 módulos completos",
                desc: "De ¿qué es programar? hasta construir tu primera To-Do App. Progresión clara y estructurada.",
              },
              {
                icon: Flame,
                title: "Rachas diarias",
                desc: "Cada día que practiques mantiene tu racha activa. Perder la racha duele — eso te hace volver.",
              },
              {
                icon: Trophy,
                title: "XP y niveles",
                desc: "Gana XP por cada lección y ejercicio completado. Sube de nivel y desbloquea badges.",
              },
              {
                icon: Zap,
                title: "100% en español",
                desc: "Contenido en español neutro para toda LATAM. Sin barreras de idioma para aprender tech.",
              },
              {
                icon: CheckCircle2,
                title: "Test cases reales",
                desc: "Tus ejercicios se validan contra casos de prueba reales, no solo strings esperados.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
              >
                <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)]/10 p-2">
                  <Icon size={20} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="mb-1 text-base font-semibold">{title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Tu primera lección te espera
          </h2>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            Crea una cuenta gratis y empieza a programar en los próximos 5 minutos.
          </p>
          <Link
            href="/registro"
            className="mt-6 inline-block rounded-xl bg-[var(--color-primary)] px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Empezar gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted-foreground)]">
        <p>
          © {new Date().getFullYear()} {APP_NAME} · Hecho con ❤️ para LATAM
        </p>
      </footer>
    </div>
  );
}
