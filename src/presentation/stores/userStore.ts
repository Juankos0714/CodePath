"use client";

import { create } from "zustand";
import type { User } from "@/domain/entities/User";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateXP: (totalXP: number, level: number) => void;
  updateStreak: (streak: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateXP: (totalXP, level) =>
    set((s) =>
      s.user ? { user: { ...s.user, totalXP, currentLevel: level } } : s
    ),
  updateStreak: (streak) =>
    set((s) =>
      s.user ? { user: { ...s.user, currentStreak: streak } } : s
    ),
}));
