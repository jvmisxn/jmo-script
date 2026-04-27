import type { ElementType } from "@/types";
import { SCENE_HEADING_PREFIXES, TRANSITIONS } from "./constants";

/**
 * Detect the element type from text content and context
 */
export function detectElementType(
  text: string,
  previousElementType: ElementType | null
): ElementType {
  const trimmed = text.trim();
  const upper = trimmed.toUpperCase();

  if (!trimmed) {
    return getDefaultNextType(previousElementType);
  }

  if (isSceneHeading(trimmed)) return "scene_heading";
  if (isTransition(upper)) return "transition";
  if (isParenthetical(trimmed, previousElementType)) return "parenthetical";
  if (isCharacterName(trimmed, previousElementType)) return "character";

  if (
    previousElementType === "character" ||
    previousElementType === "parenthetical"
  ) {
    return "dialogue";
  }

  if (trimmed.startsWith(">") && trimmed.endsWith("<")) return "centered";

  return "action";
}

function isSceneHeading(text: string): boolean {
  const upper = text.toUpperCase();
  for (const prefix of SCENE_HEADING_PREFIXES) {
    if (upper.startsWith(prefix)) {
      const afterPrefix = upper.slice(prefix.length).trim();
      if (afterPrefix.length > 0 || upper === prefix) return true;
    }
  }
  if (text.startsWith(".") && text.length > 1 && !text.startsWith("..")) {
    return true;
  }
  return false;
}

function isTransition(upperText: string): boolean {
  for (const transition of TRANSITIONS) {
    if (upperText === transition || upperText.startsWith(transition))
      return true;
  }
  if (/^[A-Z\s]+TO:$/.test(upperText)) return true;
  if (upperText.startsWith(">") && !upperText.endsWith("<")) return true;
  return false;
}

function isParenthetical(
  text: string,
  previousType: ElementType | null
): boolean {
  if (!text.startsWith("(") || !text.endsWith(")")) return false;
  return previousType === "character" || previousType === "dialogue";
}

function isCharacterName(
  text: string,
  previousType: ElementType | null
): boolean {
  const withoutExtension = text.replace(/\s*\([^)]+\)\s*$/, "").trim();
  if (withoutExtension !== withoutExtension.toUpperCase()) return false;
  if (!/[A-Z]/.test(withoutExtension)) return false;
  if (withoutExtension.length < 2 || withoutExtension.length > 40) return false;
  const wordCount = withoutExtension.split(/\s+/).length;
  if (wordCount > 4) return false;

  const validPrevious: (ElementType | null)[] = [
    "action",
    "dialogue",
    "scene_heading",
    "transition",
    null,
  ];
  return validPrevious.includes(previousType);
}

/**
 * Get the default next element type based on current type
 */
export function getDefaultNextType(
  currentType: ElementType | null
): ElementType {
  const transitions: Record<string, ElementType> = {
    scene_heading: "action",
    action: "action",
    character: "dialogue",
    dialogue: "action",
    parenthetical: "dialogue",
    transition: "scene_heading",
    centered: "action",
    page_break: "scene_heading",
  };
  if (currentType === null) return "scene_heading";
  return transitions[currentType] || "action";
}

/**
 * Format text based on element type
 */
export function formatElementText(type: ElementType, text: string): string {
  let formatted = text.trim();
  switch (type) {
    case "scene_heading":
    case "character":
    case "transition":
      formatted = formatted.toUpperCase();
      break;
    case "parenthetical":
      if (!formatted.startsWith("(")) formatted = "(" + formatted;
      if (!formatted.endsWith(")")) formatted = formatted + ")";
      formatted = formatted.toLowerCase();
      break;
  }
  return formatted;
}

/**
 * Parse a scene heading into components
 */
export function parseSceneHeading(text: string): {
  intExt: string;
  location: string;
  timeOfDay: string;
} {
  const upper = text.toUpperCase().trim();
  const clean = upper.startsWith(".") ? upper.slice(1).trim() : upper;

  const match = clean.match(
    /^(INT|EXT|INT\/EXT|INT\.\/EXT\.|I\/E)[\.\s]+(.+?)(?:\s*[-–—]\s*(.+))?$/
  );
  if (match) {
    return {
      intExt: match[1].replace(/\.$/, ""),
      location: match[2].trim(),
      timeOfDay: (match[3] || "DAY").trim(),
    };
  }

  for (const prefix of SCENE_HEADING_PREFIXES) {
    if (clean.startsWith(prefix)) {
      const rest = clean.slice(prefix.length).trim();
      const parts = rest.split(/\s*[-–—]\s*/);
      return {
        intExt: prefix.replace(/\.$/, ""),
        location: parts[0] || "",
        timeOfDay: parts[1] || "DAY",
      };
    }
  }

  return { intExt: "INT", location: clean, timeOfDay: "DAY" };
}

/**
 * Parse a character cue into name and extension
 */
export function parseCharacterCue(text: string): {
  name: string;
  extension: string | null;
} {
  const match = text.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return {
      name: match[1].trim().toUpperCase(),
      extension: match[2].trim().toUpperCase(),
    };
  }
  return { name: text.trim().toUpperCase(), extension: null };
}

/**
 * Get element type cycle order (Tab key cycling)
 */
export function getElementTypeCycle(): ElementType[] {
  return [
    "scene_heading",
    "action",
    "character",
    "dialogue",
    "parenthetical",
    "transition",
  ];
}

/**
 * Cycle to the next element type
 */
export function cycleElementType(
  current: ElementType,
  reverse: boolean = false
): ElementType {
  const cycle = getElementTypeCycle();
  const currentIndex = cycle.indexOf(current);
  if (currentIndex === -1) return cycle[0];
  if (reverse) return cycle[(currentIndex - 1 + cycle.length) % cycle.length];
  return cycle[(currentIndex + 1) % cycle.length];
}
