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
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
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

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          display_name: data.username,
        },
      },
    });

    if (error) {
      toast.error("Error al registrarse", {
        description: error.message,
      });
      setIsLoading(false);
      return;
    }

    toast.success("¡Cuenta creada!", {
      description: "Revisa tu email para confirmar tu cuenta.",
    });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Code2 size={24} className="text-[var(--color-primary)]" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(
            [
              {
                id: "username",
                label: "Nombre de usuario",
                type: "text",
                placeholder: "mi_usuario",
                autocomplete: "username",
                error: errors.username?.message,
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "tu@email.com",
                autocomplete: "email",
                error: errors.email?.message,
              },
              {
                id: "password",
                label: "Contraseña",
                type: "password",
                placeholder: "••••••••",
                autocomplete: "new-password",
                error: errors.password?.message,
              },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor={field.id}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                autoComplete={field.autocomplete}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                {...register(field.id)}
              />
              {field.error && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {field.error}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Crear cuenta gratis
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-muted-foreground)]">
          Al registrarte aceptas nuestros Términos de Uso y Política de
          Privacidad.
        </p>
      </div>
    </div>
  );
}
