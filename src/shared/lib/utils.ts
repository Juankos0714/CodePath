import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function xpToNextLevel(currentXP: number): {
  current: number;
  needed: number;
  percent: number;
  level: number;
} {
  const level = Math.floor(Math.sqrt(currentXP / 100)) + 1;
  const xpForCurrentLevel = (level - 1) ** 2 * 100;
  const xpForNextLevel = level ** 2 * 100;
  const current = currentXP - xpForCurrentLevel;
  const needed = xpForNextLevel - xpForCurrentLevel;
  return {
    current,
    needed,
    percent: Math.min(100, Math.round((current / needed) * 100)),
    level,
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Empieza hoy tu racha";
  if (streak === 1) return "¡Primer día!";
  if (streak < 7) return `${streak} días seguidos`;
  if (streak < 30) return `${streak} días 🔥`;
  return `${streak} días ⚡ ¡Increíble!`;
}
