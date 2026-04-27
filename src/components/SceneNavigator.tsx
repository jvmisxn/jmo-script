import type { ExtractedScene } from "@/types";
import { formatSceneLabel } from "@/screenplay/analyzer";

interface SceneNavigatorProps {
  scenes: ExtractedScene[];
  selectedIndex: number | null;
  onSelectScene: (index: number) => void;
}

export function SceneNavigator({
  scenes,
  selectedIndex,
  onSelectScene,
}: SceneNavigatorProps) {
  if (scenes.length === 0) {
    return (
      <div className="sidebar-empty">
        <p>No scenes yet</p>
        <p className="sidebar-hint">
          Start typing a scene heading (INT. or EXT.)
        </p>
      </div>
    );
  }

  return (
    <div className="scene-navigator">
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className={`scene-item ${selectedIndex === index ? "active" : ""}`}
          onClick={() => onSelectScene(index)}
        >
          <span className="scene-label">{formatSceneLabel(scene)}</span>
          <span className="scene-meta">
            {scene.characters.length} char &middot; {scene.dialogueCount} dlg
          </span>
        </div>
      ))}
    </div>
  );
}
