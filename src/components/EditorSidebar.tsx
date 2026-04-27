import { Map, Users, BarChart2, Info } from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { SceneNavigator } from "./SceneNavigator";
import { CharacterList } from "./CharacterList";
import { ScriptStatsPanel } from "./ScriptStatsPanel";
import { MetadataEditor } from "./MetadataEditor";
import type { ExtractedScene, ExtractedCharacter, ScriptStats } from "@/types";

interface EditorSidebarProps {
  scenes: ExtractedScene[];
  characters: ExtractedCharacter[];
  stats: ScriptStats;
}

const TABS = [
  { id: "scenes" as const, icon: Map, label: "Scenes" },
  { id: "characters" as const, icon: Users, label: "Characters" },
  { id: "stats" as const, icon: BarChart2, label: "Stats" },
  { id: "metadata" as const, icon: Info, label: "Metadata" },
];

export function EditorSidebar({
  scenes,
  characters,
  stats,
}: EditorSidebarProps) {
  const sidebarTab = useEditorStore((s) => s.sidebarTab);
  const setSidebarTab = useEditorStore((s) => s.setSidebarTab);
  const selectedSceneIndex = useEditorStore((s) => s.selectedSceneIndex);
  const setSelectedSceneIndex = useEditorStore((s) => s.setSelectedSceneIndex);
  const activeProject = useProjectStore((s) => s.activeProject)();
  const updateProject = useProjectStore((s) => s.updateProject);

  return (
    <div className="editor-sidebar">
      <div className="sidebar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${sidebarTab === tab.id ? "active" : ""}`}
            onClick={() => setSidebarTab(tab.id)}
            title={tab.label}
          >
            <tab.icon size={14} />
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {sidebarTab === "scenes" && (
          <SceneNavigator
            scenes={scenes}
            selectedIndex={selectedSceneIndex}
            onSelectScene={setSelectedSceneIndex}
          />
        )}

        {sidebarTab === "characters" && (
          <CharacterList characters={characters} />
        )}

        {sidebarTab === "stats" && <ScriptStatsPanel stats={stats} />}

        {sidebarTab === "metadata" && activeProject && (
          <MetadataEditor
            metadata={activeProject.metadata}
            onChange={(metadata) =>
              updateProject(activeProject.id, { metadata })
            }
          />
        )}
      </div>
    </div>
  );
}
