import type { EditorModeConfig } from "@/types";
import {
  screenplayNodes,
  elementTypeToNodeName,
  nodeNameToElementType,
} from "@/editor/extensions/screenplay-nodes";
import {
  getDefaultNextType,
  cycleElementType,
  formatElementText,
} from "@/screenplay/formatter";

export const screenplayMode: EditorModeConfig = {
  documentType: "screenplay",
  nodes: screenplayNodes,

  elementTypes: [
    { type: "scene_heading", label: "Scene", shortcut: "1" },
    { type: "action", label: "Action", shortcut: "2" },
    { type: "character", label: "Character", shortcut: "3" },
    { type: "dialogue", label: "Dialogue", shortcut: "4" },
    { type: "parenthetical", label: "Paren", shortcut: "5" },
    { type: "transition", label: "Transition", shortcut: "6" },
  ],

  placeholders: {
    scene_heading: "INT. LOCATION - DAY",
    action: "Action description...",
    character: "CHARACTER NAME",
    dialogue: "Dialogue...",
    parenthetical: "(parenthetical)",
    transition: "CUT TO:",
    centered: "Centered text",
    page_break: "",
  },

  getDefaultNextType,
  cycleElementType,
  formatElementText,
  elementTypeToNodeName,
  nodeNameToElementType,
  cssPrefix: "screenplay",
};
