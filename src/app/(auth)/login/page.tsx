"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Code2 } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";
import { APP_NAME } from "@/shared/constants";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Error al iniciar sesión", {
        description: "Revisa tu email y contraseña.",
      });
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Code2 size={24} className="text-[var(--color-primary)]" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-bold">Inicia sesión</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="tu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Iniciar sesión
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--color-background)] px-2 text-xs text-[var(--color-muted-foreground)]">
              O continúa con
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium transition hover:bg-[var(--color-surface)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <p className="text-center text-xs text-[var(--color-muted-foreground)]">
          <Link href="/recuperar" className="hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
}
