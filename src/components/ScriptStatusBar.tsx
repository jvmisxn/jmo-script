import { StatusBar, PerfMonitor } from "@jmo/core/components";
import type { AppMode } from "@/types";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";

interface ScriptStatusBarProps {
  mode: AppMode;
}

export function ScriptStatusBar({ mode }: ScriptStatusBarProps) {
  const cursorPosition = useEditorStore((s) => s.cursorPosition);
  const currentElementType = useEditorStore((s) => s.currentElementType);
  const wordCount = useEditorStore((s) => s.wordCount);
  const pageCount = useEditorStore((s) => s.pageCount);
  const activeProject = useProjectStore((s) => s.activeProject)();
  const projects = useProjectStore((s) => s.projects);

  if (mode === "projects") {
    return (
      <StatusBar
        left={
          <span>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
        }
        right={<PerfMonitor />}
      />
    );
  }

  const elementLabel = currentElementType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <StatusBar
      left={<span className="status-element-type">{elementLabel}</span>}
      center={
        <>
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span className="status-separator">|</span>
          <span>{wordCount.toLocaleString()} words</span>
          <span className="status-separator">|</span>
          <span>~{pageCount} pg</span>
        </>
      }
      right={
        <>
          {activeProject && (
            <span className="status-doctype">{activeProject.documentType}</span>
          )}
          <PerfMonitor />
        </>
      }
    />
  );
}
