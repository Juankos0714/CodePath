"use client";

import { xpToNextLevel, formatXP } from "@/shared/lib/utils";
import { getLevelTitle } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

interface XPBarProps {
  totalXP: number;
  level: number;
  className?: string;
  showLabel?: boolean;
}

export function XPBar({ totalXP, level, className, showLabel = true }: XPBarProps) {
  const { current, needed, percent } = xpToNextLevel(totalXP);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--color-foreground)]">
            Nv. {level} — {getLevelTitle(level)}
          </span>
          <span className="text-[var(--color-muted-foreground)]">
            {formatXP(current)} / {formatXP(needed)} XP
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP: ${current} de ${needed}`}
        />
      </div>
    </div>
  );
}
