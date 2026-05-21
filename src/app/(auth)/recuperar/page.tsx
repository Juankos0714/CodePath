"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Code2, ArrowLeft } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";
import { APP_NAME } from "@/shared/constants";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

export default function RecuperarPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
    });
    if (error) {
      toast.error("Error", { description: error.message });
    } else {
      setSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Code2 size={24} className="text-[var(--color-primary)]" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-bold">Recupera tu cuenta</h1>
        </div>

        {sent ? (
          <div className="rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-6 text-center">
            <p className="text-2xl">📬</p>
            <p className="mt-2 font-semibold">Revisa tu email</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Te enviamos un enlace para recuperar tu contraseña.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="tu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Enviar enlace
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
