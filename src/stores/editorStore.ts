import { create } from "zustand";
import type { ElementType, CursorPosition, ScriptElement } from "@/types";

interface EditorStoreState {
  // State
  isDirty: boolean;
  currentElementType: ElementType;
  cursorPosition: CursorPosition;
  selectedSceneIndex: number | null;
  pageCount: number;
  currentPage: number;
  wordCount: number;
  sidebarTab: "scenes" | "characters" | "stats" | "metadata";
  sidebarOpen: boolean;

  // Auto-save timer
  _autoSaveTimer: ReturnType<typeof setTimeout> | null;

  // Actions
  setDirty: (dirty: boolean) => void;
  setCurrentElementType: (type: ElementType) => void;
  setCursorPosition: (pos: CursorPosition) => void;
  setSelectedSceneIndex: (index: number | null) => void;
  setPageCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setWordCount: (count: number) => void;
  setSidebarTab: (tab: EditorStoreState["sidebarTab"]) => void;
  toggleSidebar: () => void;

  // Auto-save
  scheduleAutoSave: (saveFn: () => void) => void;
  cancelAutoSave: () => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  isDirty: false,
  currentElementType: "action",
  cursorPosition: { line: 1, column: 1 },
  selectedSceneIndex: null,
  pageCount: 1,
  currentPage: 1,
  wordCount: 0,
  sidebarTab: "scenes",
  sidebarOpen: true,
  _autoSaveTimer: null,

  setDirty: (dirty) => set({ isDirty: dirty }),
  setCurrentElementType: (type) => set({ currentElementType: type }),
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  setSelectedSceneIndex: (index) => set({ selectedSceneIndex: index }),
  setPageCount: (count) => set({ pageCount: count }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setWordCount: (count) => set({ wordCount: count }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  scheduleAutoSave: (saveFn) => {
    const { _autoSaveTimer } = get();
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    const timer = setTimeout(() => {
      saveFn();
      set({ isDirty: false, _autoSaveTimer: null });
    }, 2000);
    set({ _autoSaveTimer: timer, isDirty: true });
  },

  cancelAutoSave: () => {
    const { _autoSaveTimer } = get();
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    set({ _autoSaveTimer: null });
  },
}));

// Helper: convert Tiptap JSON to ScriptElement[]
export function tiptapToElements(
  json: Record<string, unknown>,
  nodeNameToElementType: Record<string, ElementType>
): ScriptElement[] {
  const elements: ScriptElement[] = [];
  const content = (json.content || []) as Array<{
    type: string;
    content?: Array<{ text?: string }>;
    attrs?: Record<string, unknown>;
  }>;

  for (const node of content) {
    const elementType = nodeNameToElementType[node.type];
    if (!elementType) continue;

    const text =
      node.content?.map((c) => c.text || "").join("") || "";

    elements.push({
      id: crypto.randomUUID(),
      type: elementType,
      text,
      sceneNumber: (node.attrs?.sceneNumber as string) || undefined,
    });
  }

  return elements;
}

// Helper: convert ScriptElement[] to Tiptap JSON
export function elementsToTiptap(
  elements: ScriptElement[],
  elementTypeToNodeName: Record<string, string>
): Record<string, unknown> {
  return {
    type: "doc",
    content: elements.map((el) => {
      const nodeName = elementTypeToNodeName[el.type] || "paragraph";
      return {
        type: nodeName,
        attrs: { elementType: el.type },
        content: el.text ? [{ type: "text", text: el.text }] : [],
      };
    }),
  };
}
