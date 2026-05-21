"use client";

import { useCallback } from "react";
import { useEditorStore } from "@/presentation/stores/editorStore";
import { executeCode } from "@/infrastructure/code-execution/sandbox";
import type { WorkerTestCase } from "@/infrastructure/code-execution/sandbox";
import { SANDBOX_TIMEOUT_MS } from "@/shared/constants";
import { useAnalytics } from "./useAnalytics";

export function useCodeExecution(exerciseId: string) {
  const { code, setIsRunning, setLastResult } = useEditorStore();
  const { track } = useAnalytics();

  const run = useCallback(
    async (testCases: WorkerTestCase[]) => {
      setIsRunning(true);
      setLastResult(null);

      try {
        const result = await executeCode(code, testCases, SANDBOX_TIMEOUT_MS);
        setLastResult(result);
        track("exercise_attempted", {
          exercise_id: exerciseId,
          success: result.success,
          execution_time_ms: result.executionTimeMs,
        });
        return result;
      } finally {
        setIsRunning(false);
      }
    },
    [code, exerciseId, setIsRunning, setLastResult, track]
  );

  return { run };
}
