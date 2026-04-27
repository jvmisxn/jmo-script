import { Toolbar, ToolbarGroup, ToolbarSeparator, AppTitle } from "@jmo/core/components";
import { IconButton } from "@jmo/core/components";
import {
  FolderOpen,
  Save,
  Download,
  FileText,
  BookOpen,
  PenTool,
  ChevronLeft,
} from "lucide-react";
import type { AppMode } from "@/types";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore } from "@/stores/editorStore";

interface ScriptToolbarProps {
  mode: AppMode;
  onSetMode: (mode: AppMode) => void;
}

export function ScriptToolbar({ mode, onSetMode }: ScriptToolbarProps) {
  const activeProject = useProjectStore((s) => s.activeProject)();
  const isDirty = useEditorStore((s) => s.isDirty);

  const DocTypeIcon =
    activeProject?.documentType === "screenplay"
      ? FileText
      : activeProject?.documentType === "book"
        ? BookOpen
        : PenTool;

  return (
    <Toolbar>
      <ToolbarGroup>
        {mode === "editor" && (
          <IconButton
            icon={ChevronLeft}
            label="Back to projects"
            onClick={() => onSetMode("projects")}
          />
        )}
        <AppTitle appName="Script" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        {mode === "editor" && activeProject && (
          <span className="toolbar-project-title">
            <DocTypeIcon size={14} />
            <span>{activeProject.title}</span>
            {isDirty && <span className="dirty-indicator">*</span>}
          </span>
        )}
      </ToolbarGroup>

      <div style={{ flex: 1 }} />

      <ToolbarGroup>
        {mode === "editor" && (
          <>
            <IconButton icon={Save} label="Save (Ctrl+S)" onClick={() => {}} />
            <IconButton icon={Download} label="Export" onClick={() => {}} />
          </>
        )}
        {mode === "projects" && (
          <IconButton
            icon={FolderOpen}
            label="Open file"
            onClick={() => {}}
          />
        )}
      </ToolbarGroup>
    </Toolbar>
  );
}
