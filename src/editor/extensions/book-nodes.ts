import { Node, mergeAttributes } from "@tiptap/core";
import type { BookElementType } from "@/types";

export const Chapter = Node.create({
  name: "chapter",
  group: "block",
  content: "text*",

  addAttributes() {
    return {
      elementType: { default: "chapter" },
      chapterNumber: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="chapter"]' }, { tag: "h2.book-chapter" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "h2",
      mergeAttributes(HTMLAttributes, {
        "data-type": "chapter",
        class: "book-element book-chapter",
      }),
      0,
    ];
  },
});

export const BookParagraph = Node.create({
  name: "bookParagraph",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "paragraph" } };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="paragraph"]' },
      { tag: "p.book-paragraph" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-type": "paragraph",
        class: "book-element book-paragraph",
      }),
      0,
    ];
  },
});

export const Quote = Node.create({
  name: "quote",
  group: "block",
  content: "text*",

  addAttributes() {
    return { elementType: { default: "quote" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="quote"]' }, { tag: "blockquote.book-quote" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        "data-type": "quote",
        class: "book-element book-quote",
      }),
      0,
    ];
  },
});

export const Break = Node.create({
  name: "break",
  group: "block",
  atom: true,

  addAttributes() {
    return { elementType: { default: "break" } };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="break"]' }, { tag: "hr.book-break" }];
  },

  renderHTML() {
    return ["hr", { "data-type": "break", class: "book-element book-break" }];
  },
});

export const bookNodes = [Chapter, BookParagraph, Quote, Break];

export const bookElementTypeToNodeName: Record<string, string> = {
  chapter: "chapter",
  paragraph: "bookParagraph",
  quote: "quote",
  break: "break",
};

export const bookNodeNameToElementType: Record<string, BookElementType> = {
  chapter: "chapter",
  bookParagraph: "paragraph",
  quote: "quote",
  break: "break",
};
