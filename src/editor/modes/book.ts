import type { EditorModeConfig, ElementType, BookElementType } from "@/types";
import {
  bookNodes,
  bookElementTypeToNodeName,
  bookNodeNameToElementType,
} from "@/editor/extensions/book-nodes";

function getDefaultNextType(currentType: ElementType | null): ElementType {
  const transitions: Record<string, ElementType> = {
    chapter: "paragraph",
    paragraph: "paragraph",
    quote: "paragraph",
    break: "paragraph",
  };
  if (currentType === null) return "chapter";
  return transitions[currentType] || "paragraph";
}

function cycleElementType(
  current: ElementType,
  reverse: boolean = false
): ElementType {
  const cycle: BookElementType[] = ["chapter", "paragraph", "quote", "break"];
  const currentIndex = cycle.indexOf(current as BookElementType);
  if (currentIndex === -1) return "paragraph";
  if (reverse) return cycle[(currentIndex - 1 + cycle.length) % cycle.length];
  return cycle[(currentIndex + 1) % cycle.length];
}

function formatElementText(_type: ElementType, text: string): string {
  return text.trim();
}

export const bookMode: EditorModeConfig = {
  documentType: "book",
  nodes: bookNodes,

  elementTypes: [
    { type: "chapter", label: "Chapter", shortcut: "1" },
    { type: "paragraph", label: "Paragraph", shortcut: "2" },
    { type: "quote", label: "Quote", shortcut: "3" },
    { type: "break", label: "Break", shortcut: "4" },
  ],

  placeholders: {
    chapter: "Chapter Title",
    paragraph: "Start writing...",
    quote: "Block quote...",
    break: "",
  },

  getDefaultNextType,
  cycleElementType,
  formatElementText,
  elementTypeToNodeName: bookElementTypeToNodeName,
  nodeNameToElementType: bookNodeNameToElementType,
  cssPrefix: "book",
};
