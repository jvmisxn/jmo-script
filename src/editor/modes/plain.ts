import type { EditorModeConfig, ElementType } from "@/types";
import {
  plainNodes,
  plainElementTypeToNodeName,
  plainNodeNameToElementType,
} from "@/editor/extensions/plain-nodes";

function getDefaultNextType(_currentType: ElementType | null): ElementType {
  return "paragraph";
}

function cycleElementType(
  _current: ElementType,
  _reverse: boolean = false
): ElementType {
  return "paragraph";
}

function formatElementText(_type: ElementType, text: string): string {
  return text.trim();
}

export const plainMode: EditorModeConfig = {
  documentType: "plain",
  nodes: plainNodes,

  elementTypes: [{ type: "paragraph", label: "Paragraph", shortcut: "1" }],

  placeholders: {
    paragraph: "Start writing...",
  },

  getDefaultNextType,
  cycleElementType,
  formatElementText,
  elementTypeToNodeName: plainElementTypeToNodeName,
  nodeNameToElementType: plainNodeNameToElementType,
  cssPrefix: "plain",
};
