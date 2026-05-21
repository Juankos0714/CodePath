"use client";

import type {
  WorkerMessage,
  WorkerResult,
  WorkerTestCase,
} from "./worker";

export type { WorkerResult, WorkerTestCase };

export async function executeCode(
  code: string,
  testCases: WorkerTestCase[],
  timeoutMs = 3000
): Promise<WorkerResult> {
  return new Promise((resolve) => {
    let settled = false;

    const worker = new Worker(
      new URL("./worker.ts", import.meta.url),
      { type: "module" }
    );

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      resolve({
        success: false,
        output: [],
        error: `Tiempo de ejecución agotado (${timeoutMs / 1000}s). ¿Tu código tiene un bucle infinito?`,
        executionTimeMs: timeoutMs,
        testResults: testCases.map((tc) => ({
          description: tc.description,
          passed: false,
          error: "Tiempo agotado",
        })),
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };

    worker.onerror = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve({
        success: false,
        output: [],
        error: error.message,
        executionTimeMs: 0,
        testResults: testCases.map((tc) => ({
          description: tc.description,
          passed: false,
          error: error.message,
        })),
      });
    };

    const message: WorkerMessage = { code, testCases, timeoutMs };
    worker.postMessage(message);
  });
}
