import { Node, mergeAttributes } from "@tiptap/core";
import type { ElementType } from "@/types";

// --- Scene Heading ----------------------------------------------------------

export const SceneHeading = Node.create({
  name: "sceneHeading",
  group: "block",
  content: "text*",

  addAttributes() {
    return {
      elementType: { default: "scene_heading" },
      sceneNumber: { default: null },
      intExt: { default: "INT" },
      location: { default: "" },
      timeOfDay: { default: "DAY" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="scene_heading"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "scene_heading",
        class: "screenplay-element screenplay-scene-heading",
      }),
      0,
    ];
  },
});

// --- Action -----------------------------------------------------------------

export const Action = Node.create({
  name: "action",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "action" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="action"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "action",
        class: "screenplay-element screenplay-action",
      }),
      0,
    ];
  },
});

// --- Character --------------------------------------------------------------

export const Character = Node.create({
  name: "character",
  group: "block",
  content: "text*",

  addAttributes() {
    return {
      elementType: { default: "character" },
      extension: { default: null },
      isDualDialogue: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="character"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "character",
        class: "screenplay-element screenplay-character",
      }),
      0,
    ];
  },
});

// --- Dialogue ---------------------------------------------------------------

export const Dialogue = Node.create({
  name: "dialogue",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "dialogue" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="dialogue"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "dialogue",
        class: "screenplay-element screenplay-dialogue",
      }),
      0,
    ];
  },
});

// --- Parenthetical ----------------------------------------------------------

export const Parenthetical = Node.create({
  name: "parenthetical",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "parenthetical" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="parenthetical"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "parenthetical",
        class: "screenplay-element screenplay-parenthetical",
      }),
      0,
    ];
  },
});

// --- Transition -------------------------------------------------------------

export const Transition = Node.create({
  name: "transition",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "transition" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="transition"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "transition",
        class: "screenplay-element screenplay-transition",
      }),
      0,
    ];
  },
});

// --- Centered ---------------------------------------------------------------

export const Centered = Node.create({
  name: "centered",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "centered" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="centered"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "centered",
        class: "screenplay-element screenplay-centered",
      }),
      0,
    ];
  },
});

// --- Exports ----------------------------------------------------------------

export const screenplayNodes = [
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
  Centered,
];

export const elementTypeToNodeName: Record<string, string> = {
  scene_heading: "sceneHeading",
  action: "action",
  character: "character",
  dialogue: "dialogue",
  parenthetical: "parenthetical",
  transition: "transition",
  centered: "centered",
  page_break: "horizontalRule",
};

export const nodeNameToElementType: Record<string, ElementType> = {
  sceneHeading: "scene_heading",
  action: "action",
  character: "character",
  dialogue: "dialogue",
  parenthetical: "parenthetical",
  transition: "transition",
  centered: "centered",
  horizontalRule: "page_break",
};
