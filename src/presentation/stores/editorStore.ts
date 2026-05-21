"use client";

import { create } from "zustand";
import type { WorkerResult } from "@/infrastructure/code-execution/sandbox";

interface EditorStore {
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  lastResult: WorkerResult | null;
  setLastResult: (result: WorkerResult | null) => void;
  hintsRevealed: number;
  revealNextHint: () => void;
  reset: (starterCode: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: "",
  setCode: (code) => set({ code }),
  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),
  lastResult: null,
  setLastResult: (lastResult) => set({ lastResult }),
  hintsRevealed: 0,
  revealNextHint: () => set((s) => ({ hintsRevealed: s.hintsRevealed + 1 })),
  reset: (starterCode) =>
    set({ code: starterCode, lastResult: null, hintsRevealed: 0 }),
}));
