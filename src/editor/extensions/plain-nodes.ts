import { Node, mergeAttributes } from "@tiptap/core";
import type { PlainElementType } from "@/types";

export const PlainParagraph = Node.create({
  name: "plainParagraph",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "paragraph" } };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="paragraph"]' },
      { tag: "p.plain-paragraph" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-type": "paragraph",
        class: "plain-element plain-paragraph",
      }),
      0,
    ];
  },
});

export const plainNodes = [PlainParagraph];

export const plainElementTypeToNodeName: Record<string, string> = {
  paragraph: "plainParagraph",
};

export const plainNodeNameToElementType: Record<string, PlainElementType> = {
  plainParagraph: "paragraph",
};
