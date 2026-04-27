import type { ElementType, EditorModeConfig } from "@/types";

interface ElementTypeBarProps {
  mode: EditorModeConfig;
  currentType: ElementType;
  onChangeType: (type: ElementType) => void;
}

export function ElementTypeBar({
  mode,
  currentType,
  onChangeType,
}: ElementTypeBarProps) {
  return (
    <div className="element-type-bar">
      {mode.elementTypes.map((et) => (
        <button
          key={et.type}
          className={`element-type-btn ${currentType === et.type ? "active" : ""}`}
          onClick={() => onChangeType(et.type)}
          title={`${et.label} (${et.shortcut})`}
        >
          <span className="element-type-shortcut">{et.shortcut}</span>
          <span className="element-type-label">{et.label}</span>
        </button>
      ))}
    </div>
  );
}
