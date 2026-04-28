import { useState, useCallback } from "react";
import { useKeyboardShortcuts, useAutosave } from "@jmo/core/hooks";
import type { AppMode } from "./types";
import { ScriptToolbar } from "./components/ScriptToolbar";
import { ScriptStatusBar } from "./components/ScriptStatusBar";
import { ProjectList } from "./components/ProjectList";
import { EditorView } from "./components/EditorView";
import { useProjectStore, createBlankProject } from "./stores/projectStore";
import { useEditorStore } from "./stores/editorStore";

export default function App() {
  const [mode, setMode] = useState<AppMode>("projects");
  const activeProject = useProjectStore((s) => s.activeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const addProject = useProjectStore((s) => s.addProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const isDirty = useEditorStore((s) => s.isDirty);
  const setDirty = useEditorStore((s) => s.setDirty);

  const openProject = useCallback(
    (id: string) => {
      setActiveProject(id);
      setMode("editor");
    },
    [setActiveProject]
  );

  const backToProjects = useCallback(() => {
    setActiveProject(null);
    setMode("projects");
  }, [setActiveProject]);

  /* ── File Operations ─────────────────────────────────────────────────── */

  const handleSave = useCallback(() => {
    const project = activeProject();
    if (!project) return;
    updateProject(project.id, { updatedAt: new Date().toISOString() });
    setDirty(false);
  }, [activeProject, updateProject, setDirty]);

  const handleNew = useCallback(() => {
    const title = prompt("Script title:");
    if (!title?.trim()) return;
    const project = createBlankProject(title.trim(), "screenplay");
    addProject(project);
    setActiveProject(project.id);
    setMode("editor");
  }, [addProject, setActiveProject]);

  /* ── Autosave (every 30s when dirty and editing) ─────────────────────── */

  useAutosave({
    interval: 30_000,
    canSave: isDirty && mode === "editor",
    onSave: handleSave,
  });

  /* ── Keyboard Shortcuts ──────────────────────────────────────────────── */
  // Note: Tiptap handles its own Ctrl+Z undo internally, so we only
  // wire file-level operations here.

  useKeyboardShortcuts([
    { key: "s", ctrl: true, action: handleSave, preventDefault: true },
    { key: "n", ctrl: true, action: handleNew, preventDefault: true },
  ]);

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="jmo-app-layout">
      <ScriptToolbar mode={mode} onSetMode={setMode} />
      <div className="panels-container">
        {mode === "projects" ? (
          <ProjectList onOpenProject={openProject} />
        ) : (
          <EditorView onBackToProjects={backToProjects} />
        )}
      </div>
      <ScriptStatusBar mode={mode} />
    </div>
  );
}
