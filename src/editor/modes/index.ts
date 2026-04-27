import type { DocumentType, EditorModeConfig } from "@/types";
import { screenplayMode } from "./screenplay";
import { bookMode } from "./book";
import { plainMode } from "./plain";

export const editorModes: Record<DocumentType, EditorModeConfig> = {
  screenplay: screenplayMode,
  book: bookMode,
  plain: plainMode,
};

export function getEditorMode(documentType: DocumentType): EditorModeConfig {
  return editorModes[documentType] || editorModes.screenplay;
}

export function getDocumentTypes(): {
  type: DocumentType;
  label: string;
  description: string;
}[] {
  return [
    {
      type: "screenplay",
      label: "Screenplay",
      description: "Film, TV, or stage script format",
    },
    {
      type: "book",
      label: "Book / Novel",
      description: "Chapters, paragraphs, and quotes",
    },
    {
      type: "plain",
      label: "Plain Text",
      description: "Simple text without formatting",
    },
  ];
}
