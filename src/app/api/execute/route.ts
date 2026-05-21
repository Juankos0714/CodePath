import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/infrastructure/supabase/server";
import { z } from "zod";

const schema = z.object({
  code: z.string().max(10_000),
  exerciseId: z.string().uuid(),
});

/**
 * Server-side validation for capstone exercises to prevent XP farming.
 * Regular exercises use the client-side sandbox.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data: exercise } = await supabase
    .from("exercises")
    .select("solution_code, test_cases, xp_reward")
    .eq("id", parsed.data.exerciseId)
    .single();

  if (!exercise) {
    return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Validación server-side — implementar en v2 con Deno/Edge" });
}
