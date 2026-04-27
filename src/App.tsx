import { useState, useCallback } from "react";
import type { AppMode } from "./types";
import { ScriptToolbar } from "./components/ScriptToolbar";
import { ScriptStatusBar } from "./components/ScriptStatusBar";
import { ProjectList } from "./components/ProjectList";
import { EditorView } from "./components/EditorView";
import { useProjectStore } from "./stores/projectStore";

export default function App() {
  const [mode, setMode] = useState<AppMode>("projects");
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

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
