"use client";

import dynamic from "next/dynamic";
import { useEditorStore } from "@/presentation/stores/editorStore";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e]">
      <Loader2 size={20} className="animate-spin text-zinc-400" />
    </div>
  ),
});

interface CodeEditorProps {
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({ height = "280px", readOnly = false }: CodeEditorProps) {
  const { code, setCode } = useEditorStore();
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="overflow-hidden rounded-xl border border-[var(--color-border)]"
      style={{ height }}
    >
      <MonacoEditor
        height="100%"
        language="javascript"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
        value={code}
        onChange={(value) => setCode(value ?? "")}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          readOnly,
          renderLineHighlight: "line",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "hidden",
          },
        }}
        aria-label="Editor de código"
      />
    </div>
  );
}
