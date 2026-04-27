import type {
  ScriptContent,
  ExtractedScene,
  ExtractedCharacter,
  ScriptStats,
} from "@/types";
import { parseSceneHeading, parseCharacterCue } from "./formatter";

let _idCounter = 0;
function uid(): string {
  return `scene-${Date.now()}-${++_idCounter}`;
}

// ============================================================================
// Scene Extraction
// ============================================================================

export function extractScenes(content: ScriptContent): ExtractedScene[] {
  const scenes: ExtractedScene[] = [];
  let currentScene: ExtractedScene | null = null;
  let sceneCount = 0;

  for (let index = 0; index < content.elements.length; index++) {
    const element = content.elements[index];

    if (element.type === "scene_heading") {
      if (currentScene) {
        currentScene.elementEndIndex = index - 1;
        scenes.push(currentScene);
      }

      sceneCount++;
      const parsed = parseSceneHeading(element.text);

      currentScene = {
        id: uid(),
        sceneNumber: String(sceneCount),
        heading: element.text,
        intExt: parsed.intExt,
        location: parsed.location,
        timeOfDay: parsed.timeOfDay,
        elementStartIndex: index,
        elementEndIndex: index,
        characters: [],
        dialogueCount: 0,
      };
    } else if (currentScene) {
      if (element.type === "character") {
        const { name } = parseCharacterCue(element.text);
        if (!currentScene.characters.includes(name)) {
          currentScene.characters.push(name);
        }
      }
      if (element.type === "dialogue") {
        currentScene.dialogueCount++;
      }
    }
  }

  if (currentScene) {
    currentScene.elementEndIndex = content.elements.length - 1;
    scenes.push(currentScene);
  }

  return scenes;
}

// ============================================================================
// Character Extraction
// ============================================================================

export function extractCharacters(
  content: ScriptContent
): ExtractedCharacter[] {
  const characterMap = new Map<
    string,
    {
      appearances: number;
      dialogueCount: number;
      firstAppearanceScene: string;
      scenes: Set<string>;
    }
  >();

  let currentSceneNumber = "0";
  let lastCharacterName = "";

  content.elements.forEach((element) => {
    if (element.type === "scene_heading") {
      const match = element.text.match(/^(\d+)/);
      if (match) {
        currentSceneNumber = match[1];
      } else {
        currentSceneNumber = String(parseInt(currentSceneNumber) + 1);
      }
    } else if (element.type === "character") {
      const { name } = parseCharacterCue(element.text);
      lastCharacterName = name;

      if (!characterMap.has(name)) {
        characterMap.set(name, {
          appearances: 0,
          dialogueCount: 0,
          firstAppearanceScene: currentSceneNumber,
          scenes: new Set(),
        });
      }

      const char = characterMap.get(name)!;
      char.appearances++;
      char.scenes.add(currentSceneNumber);
    } else if (element.type === "dialogue" && lastCharacterName) {
      const char = characterMap.get(lastCharacterName);
      if (char) char.dialogueCount++;
    }
  });

  return Array.from(characterMap.entries())
    .map(([name, data]) => ({
      name,
      appearances: data.appearances,
      dialogueCount: data.dialogueCount,
      firstAppearanceScene: data.firstAppearanceScene,
      scenes: Array.from(data.scenes),
    }))
    .sort((a, b) => b.dialogueCount - a.dialogueCount);
}

// ============================================================================
// Script Statistics
// ============================================================================

export function calculateStats(content: ScriptContent): ScriptStats {
  let sceneCount = 0;
  let dialogueCount = 0;
  let actionCount = 0;
  let wordCount = 0;
  const characters = new Set<string>();

  content.elements.forEach((element) => {
    if (element.text) {
      wordCount += element.text
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
    }

    switch (element.type) {
      case "scene_heading":
        sceneCount++;
        break;
      case "character": {
        const { name } = parseCharacterCue(element.text);
        characters.add(name);
        break;
      }
      case "dialogue":
        dialogueCount++;
        break;
      case "action":
        actionCount++;
        break;
    }
  });

  const estimatedPageCount = Math.max(1, Math.ceil(wordCount / 250));

  return {
    sceneCount,
    characterCount: characters.size,
    dialogueCount,
    actionCount,
    estimatedPageCount,
    wordCount,
  };
}

// ============================================================================
// Scene Navigation
// ============================================================================

export function findSceneAtIndex(
  scenes: ExtractedScene[],
  elementIndex: number
): ExtractedScene | null {
  return (
    scenes.find(
      (scene) =>
        elementIndex >= scene.elementStartIndex &&
        elementIndex <= scene.elementEndIndex
    ) || null
  );
}

export function formatSceneLabel(scene: ExtractedScene): string {
  const prefix = scene.intExt.replace(/\.$/, "");
  const location =
    scene.location.length > 25
      ? scene.location.slice(0, 22) + "..."
      : scene.location;
  return `${scene.sceneNumber}. ${prefix}. ${location}`;
}
