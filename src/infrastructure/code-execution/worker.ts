/**
 * Web Worker para ejecutar código JavaScript del usuario de forma segura.
 * Corre en un contexto aislado sin acceso a DOM, fetch, localStorage, etc.
 */

export type WorkerMessage = {
  code: string;
  testCases: WorkerTestCase[];
  timeoutMs: number;
};

export type WorkerTestCase = {
  input: null | string;
  expected_output?: string;
  description: string;
  check_type?: "exact" | "pattern" | "no_error";
  pattern?: string;
};

export type WorkerResult = {
  success: boolean;
  output: string[];
  error?: string;
  executionTimeMs: number;
  testResults: TestCaseResult[];
};

export type TestCaseResult = {
  description: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  error?: string;
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { code, testCases, timeoutMs } = event.data;
  const startTime = performance.now();
  const capturedOutput: string[] = [];

  try {
    // Override console.log to capture output
    const sandboxedConsole = {
      log: (...args: unknown[]) => {
        const line = args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
        capturedOutput.push(line);
      },
      error: (...args: unknown[]) => {
        const line = args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
        capturedOutput.push(`[error] ${line}`);
      },
      warn: (...args: unknown[]) => {
        const line = args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
        capturedOutput.push(`[warn] ${line}`);
      },
    };

    // Execute user code in isolated scope
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      "console",
      `
      "use strict";
      // Block dangerous globals
      const window = undefined;
      const document = undefined;
      const fetch = undefined;
      const XMLHttpRequest = undefined;
      const WebSocket = undefined;
      const localStorage = undefined;
      const sessionStorage = undefined;
      const indexedDB = undefined;
      const location = undefined;
      const history = undefined;
      const navigator = undefined;
      ${code}
    `
    );

    fn(sandboxedConsole);

    const executionTimeMs = Math.round(performance.now() - startTime);

    // Validate test cases
    const testResults: TestCaseResult[] = testCases.map((tc) => {
      const fullOutput = capturedOutput.join("\n");

      if (tc.check_type === "no_error") {
        return {
          description: tc.description,
          passed: true,
          actual: fullOutput,
        };
      }

      if (tc.check_type === "pattern" && tc.pattern) {
        const regex = new RegExp(tc.pattern);
        const passed = regex.test(fullOutput);
        return {
          description: tc.description,
          passed,
          expected: `Patrón: ${tc.pattern}`,
          actual: fullOutput,
        };
      }

      // Default: exact match
      const expected = tc.expected_output ?? "";
      const passed = fullOutput.trim() === expected.trim();
      return {
        description: tc.description,
        passed,
        expected,
        actual: fullOutput,
      };
    });

    const allPassed = testResults.every((r) => r.passed);

    self.postMessage({
      success: allPassed,
      output: capturedOutput,
      executionTimeMs,
      testResults,
    } satisfies WorkerResult);
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const error = err instanceof Error ? err.message : String(err);

    const testResults: TestCaseResult[] = testCases.map((tc) => ({
      description: tc.description,
      passed: false,
      error,
    }));

    self.postMessage({
      success: false,
      output: capturedOutput,
      error,
      executionTimeMs,
      testResults,
    } satisfies WorkerResult);
  }
};
