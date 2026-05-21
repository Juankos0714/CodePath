"use client";

import { cn } from "@/shared/lib/utils";
import { getStreakMessage } from "@/shared/lib/utils";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ streak, className, size = "md" }: StreakBadgeProps) {
  const sizeClasses = {
    sm: "text-xs gap-1 px-2 py-0.5",
    md: "text-sm gap-1.5 px-3 py-1",
    lg: "text-base gap-2 px-4 py-1.5",
  };

  const iconSizes = { sm: 12, md: 14, lg: 18 };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        streak > 0
          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
          : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
        sizeClasses[size],
        className
      )}
      title={getStreakMessage(streak)}
    >
      <Flame
        size={iconSizes[size]}
        className={cn(streak >= 3 && "streak-flame text-orange-500")}
        aria-hidden
      />
      <span>{streak}</span>
    </div>
  );
}
