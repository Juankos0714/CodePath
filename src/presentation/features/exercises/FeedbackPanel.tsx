"use client";

import { CheckCircle2, XCircle, Loader2, Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { WorkerResult } from "@/infrastructure/code-execution/sandbox";

interface FeedbackPanelProps {
  result: WorkerResult | null;
  isRunning: boolean;
}

export function FeedbackPanel({ result, isRunning }: FeedbackPanelProps) {
  if (isRunning) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
        <Loader2 size={16} className="animate-spin" />
        <span>Ejecutando código...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
        <Terminal size={16} />
        <span>Presiona "Ejecutar" para ver los resultados aquí</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
      {/* Output */}
      {result.output.length > 0 && (
        <div className="bg-zinc-900 px-4 py-3">
          <p className="mb-1.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Consola
          </p>
          <pre className="font-mono text-sm text-zinc-100 whitespace-pre-wrap">
            {result.output.join("\n")}
          </pre>
        </div>
      )}

      {/* Error */}
      {result.error && (
        <div className="bg-red-950/50 px-4 py-3 border-t border-red-900/30">
          <p className="mb-1 text-xs font-medium text-red-400 uppercase tracking-wider">
            Error
          </p>
          <pre className="font-mono text-sm text-red-300 whitespace-pre-wrap">
            {result.error}
          </pre>
        </div>
      )}

      {/* Test results */}
      <div className="bg-[var(--color-surface)] px-4 py-3 border-t border-[var(--color-border)]">
        <p className="mb-2 text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
          Tests ({result.testResults.filter((t) => t.passed).length}/
          {result.testResults.length} pasando)
        </p>
        <ul className="space-y-2">
          {result.testResults.map((test, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2 rounded-lg px-3 py-2 text-sm",
                test.passed
                  ? "bg-green-50 dark:bg-green-950/30"
                  : "bg-red-50 dark:bg-red-950/30"
              )}
            >
              {test.passed ? (
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                />
              ) : (
                <XCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                />
              )}
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium",
                    test.passed
                      ? "text-green-800 dark:text-green-300"
                      : "text-red-800 dark:text-red-300"
                  )}
                >
                  {test.description}
                </p>
                {!test.passed && test.expected && (
                  <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                    Esperado:{" "}
                    <code className="font-mono">{test.expected}</code>
                    {test.actual && (
                      <>
                        {" · "}Obtenido:{" "}
                        <code className="font-mono">{test.actual || "(vacío)"}</code>
                      </>
                    )}
                  </p>
                )}
                {test.error && (
                  <p className="mt-0.5 text-xs text-red-600 dark:text-red-400 font-mono">
                    {test.error}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-2 text-right">
          <span className="text-xs text-[var(--color-muted-foreground)]">
            {result.executionTimeMs}ms
          </span>
        </div>
      </div>
    </div>
  );
}
