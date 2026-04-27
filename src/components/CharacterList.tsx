import type { ExtractedCharacter } from "@/types";

interface CharacterListProps {
  characters: ExtractedCharacter[];
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="sidebar-empty">
        <p>No characters yet</p>
        <p className="sidebar-hint">
          Type a character name in ALL CAPS
        </p>
      </div>
    );
  }

  return (
    <div className="character-list">
      {characters.map((char) => (
        <div key={char.name} className="character-item">
          <span className="character-name">{char.name}</span>
          <span className="character-stats">
            {char.dialogueCount} lines &middot; {char.scenes.length} scene
            {char.scenes.length !== 1 ? "s" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
