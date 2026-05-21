export const APP_NAME = "CodePath";
export const APP_DESCRIPTION =
  "Aprende programación en JavaScript desde cero, en español.";

export const XP_PER_LESSON = 20;
export const XP_PER_EXERCISE = 10;
export const XP_STREAK_BONUS = 5;

export const LEVEL_TITLES: Record<number, string> = {
  1: "Aprendiz",
  2: "Explorador",
  3: "Desarrollador Jr.",
  4: "Desarrollador",
  5: "Desarrollador Sr.",
  6: "Líder Técnico",
  7: "Arquitecto",
  8: "Experto",
  9: "Maestro",
  10: "CodePath Master",
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 10)] ?? "CodePath Master";
}

export const SANDBOX_TIMEOUT_MS = 3000;
export const MAX_OUTPUT_LINES = 50;

export const ROUTES = {
  home: "/",
  login: "/login",
  registro: "/registro",
  dashboard: "/dashboard",
  lecciones: "/lecciones",
  leccion: (slug: string) => `/lecciones/${slug}`,
  ejercicio: (id: string) => `/ejercicios/${id}`,
  perfil: "/perfil",
} as const;
