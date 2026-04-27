import type {
  ScriptProject,
  ScriptContent,
  ScriptElement,
  ScriptMetadata,
  ElementType,
} from "@/types";

/**
 * Export project to Fountain format
 */
export function exportToFountain(project: ScriptProject): string {
  const lines: string[] = [];

  // Title page metadata
  lines.push(`Title: ${project.title}`);
  if (project.metadata.author) lines.push(`Author: ${project.metadata.author}`);
  if (project.metadata.contact)
    lines.push(`Contact: ${project.metadata.contact}`);
  if (project.metadata.copyright)
    lines.push(`Copyright: ${project.metadata.copyright}`);
  if (project.metadata.draftDate) {
    const date = new Date(project.metadata.draftDate);
    lines.push(
      `Draft date: ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    );
  }
  if (project.metadata.notes) lines.push(`Notes: ${project.metadata.notes}`);

  lines.push("");
  lines.push("");

  let prevType: ElementType | null = null;
  for (const element of project.content.elements) {
    const formatted = formatElementToFountain(element, prevType);
    if (formatted !== null) lines.push(formatted);
    prevType = element.type;
  }

  return lines.join("\n");
}

function formatElementToFountain(
  element: ScriptElement,
  prevType: ElementType | null
): string | null {
  switch (element.type) {
    case "scene_heading": {
      const text = element.text.toUpperCase();
      const needsPrefix = !text.match(
        /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)/i
      );
      const prefix = prevType ? "\n" : "";
      return prefix + (needsPrefix ? "." : "") + text;
    }
    case "action":
      if (prevType === "dialogue" || prevType === "parenthetical")
        return "\n" + element.text;
      return element.text;
    case "character": {
      const text = element.text.toUpperCase();
      const needsPrefix = !text.match(/^[A-Z][A-Z0-9 .'()-]*$/);
      return "\n" + (needsPrefix ? "@" : "") + text;
    }
    case "dialogue":
      return element.text;
    case "parenthetical": {
      const t = element.text.trim();
      return !t.startsWith("(") ? `(${t})` : t;
    }
    case "transition": {
      const transText = element.text.toUpperCase();
      if (
        transText.endsWith("TO:") ||
        transText === "FADE OUT." ||
        transText === "FADE IN:"
      )
        return "\n" + transText;
      return "\n>" + transText;
    }
    case "centered":
      return "\n>" + element.text + "<";
    case "page_break":
      return "\n===";
    default:
      return element.text;
  }
}

/**
 * Parse Fountain format into script content
 */
export function parseFountain(fountainText: string): {
  content: ScriptContent;
  metadata: ScriptMetadata;
  title: string;
} {
  const elements: ScriptElement[] = [];
  const metadata: ScriptMetadata = {};
  let title = "Untitled";

  const lines = fountainText.split(/\r?\n/);
  let inTitlePage = true;
  let elementId = 0;
  let prevLineEmpty = true;
  let prevType: ElementType | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (inTitlePage) {
      if (trimmed === "") {
        const nextNonEmpty = lines.slice(i + 1).find((l) => l.trim() !== "");
        if (
          !nextNonEmpty ||
          !nextNonEmpty.includes(":") ||
          isSceneHeadingLine(nextNonEmpty.trim())
        ) {
          inTitlePage = false;
        }
        prevLineEmpty = true;
        continue;
      }

      const colonIndex = trimmed.indexOf(":");
      if (colonIndex > 0) {
        const key = trimmed.slice(0, colonIndex).toLowerCase().trim();
        const value = trimmed.slice(colonIndex + 1).trim();
        switch (key) {
          case "title":
            title = value;
            break;
          case "author":
          case "authors":
            metadata.author = value;
            break;
          case "contact":
            metadata.contact = value;
            break;
          case "copyright":
            metadata.copyright = value;
            break;
          case "draft date":
            metadata.draftDate = value;
            break;
          case "notes":
            metadata.notes = value;
            break;
        }
        prevLineEmpty = false;
        continue;
      }
    }

    inTitlePage = false;

    if (trimmed === "") {
      prevLineEmpty = true;
      continue;
    }

    const element = parseLineToElement(
      trimmed,
      prevLineEmpty,
      prevType,
      elementId++
    );
    if (element) {
      elements.push(element);
      prevType = element.type;
    }

    prevLineEmpty = false;
  }

  return { content: { elements }, metadata, title };
}

function parseLineToElement(
  trimmed: string,
  prevLineEmpty: boolean,
  prevType: ElementType | null,
  id: number
): ScriptElement | null {
  if (trimmed === "===" || trimmed.startsWith("==="))
    return { id: `f-${id}`, type: "page_break", text: "" };

  if (trimmed.startsWith(">") && trimmed.endsWith("<"))
    return {
      id: `f-${id}`,
      type: "centered",
      text: trimmed.slice(1, -1).trim(),
    };

  if (trimmed.startsWith(".") && !trimmed.startsWith(".."))
    return {
      id: `f-${id}`,
      type: "scene_heading",
      text: trimmed.slice(1).trim(),
    };

  if (prevLineEmpty && isSceneHeadingLine(trimmed))
    return { id: `f-${id}`, type: "scene_heading", text: trimmed };

  if (trimmed.startsWith(">") && !trimmed.endsWith("<"))
    return {
      id: `f-${id}`,
      type: "transition",
      text: trimmed.slice(1).trim(),
    };

  if (prevLineEmpty && isTransitionLine(trimmed))
    return { id: `f-${id}`, type: "transition", text: trimmed };

  if (trimmed.startsWith("@"))
    return {
      id: `f-${id}`,
      type: "character",
      text: trimmed.slice(1).trim(),
    };

  if (prevLineEmpty && isCharacterLine(trimmed))
    return { id: `f-${id}`, type: "character", text: trimmed };

  if (
    (prevType === "character" || prevType === "dialogue") &&
    trimmed.startsWith("(")
  )
    return { id: `f-${id}`, type: "parenthetical", text: trimmed };

  if (prevType === "character" || prevType === "parenthetical")
    return { id: `f-${id}`, type: "dialogue", text: trimmed };

  return { id: `f-${id}`, type: "action", text: trimmed };
}

function isSceneHeadingLine(text: string): boolean {
  return /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)[\s.]/.test(
    text.toUpperCase()
  );
}

function isTransitionLine(text: string): boolean {
  const upper = text.toUpperCase().trim();
  return (
    upper.endsWith("TO:") ||
    upper === "FADE OUT." ||
    upper === "FADE IN:" ||
    upper === "CUT TO BLACK." ||
    upper === "THE END"
  );
}

function isCharacterLine(text: string): boolean {
  const withoutExt = text.trim().replace(/\s*\([^)]+\)\s*$/, "");
  return /^[A-Z][A-Z0-9 .'#-]*$/.test(withoutExt) && withoutExt.length > 0;
}
