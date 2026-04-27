// ============================================================================
// JMO Script — Type Definitions
// ============================================================================

// --- Document Types ---------------------------------------------------------

export type DocumentType = "screenplay" | "book" | "plain";

export type AppMode = "projects" | "editor";

// --- Element Types ----------------------------------------------------------

export type ScreenplayElementType =
  | "scene_heading"
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical"
  | "transition"
  | "centered"
  | "page_break";

export type BookElementType = "chapter" | "paragraph" | "quote" | "break";

export type PlainElementType = "paragraph";

export type ElementType =
  | ScreenplayElementType
  | BookElementType
  | PlainElementType;

// --- Script Elements --------------------------------------------------------

export interface ScriptElement {
  id: string;
  type: ElementType;
  text: string;
  sceneNumber?: string;
  metadata?: Record<string, unknown>;
}

export interface ScriptContent {
  documentType?: DocumentType;
  elements: ScriptElement[];
}

export interface ScriptMetadata {
  author?: string;
  contact?: string;
  copyright?: string;
  notes?: string;
  draftDate?: string;
  pageCount?: number;
}

// --- Project ----------------------------------------------------------------

export interface ScriptProject {
  id: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
  content: ScriptContent;
  metadata: ScriptMetadata;
}

// --- Editor State -----------------------------------------------------------

export interface CursorPosition {
  line: number;
  column: number;
}

// --- Export Options ----------------------------------------------------------

export interface ExportOptions {
  includeSceneNumbers: boolean;
  includePageNumbers: boolean;
  includeTitlePage: boolean;
  paperSize: "letter" | "a4";
}

// --- Scene & Character Analysis ---------------------------------------------

export interface ExtractedScene {
  id: string;
  sceneNumber: string;
  heading: string;
  intExt: string;
  location: string;
  timeOfDay: string;
  elementStartIndex: number;
  elementEndIndex: number;
  characters: string[];
  dialogueCount: number;
}

export interface ExtractedCharacter {
  name: string;
  appearances: number;
  dialogueCount: number;
  firstAppearanceScene: string;
  scenes: string[];
}

export interface ScriptStats {
  sceneCount: number;
  characterCount: number;
  dialogueCount: number;
  actionCount: number;
  estimatedPageCount: number;
  wordCount: number;
}

// --- Editor Mode Interface --------------------------------------------------

export interface EditorModeConfig {
  documentType: DocumentType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: any[];
  elementTypes: { type: ElementType; label: string; shortcut: string }[];
  placeholders: Record<string, string>;
  getDefaultNextType: (current: ElementType | null) => ElementType;
  cycleElementType: (current: ElementType, reverse: boolean) => ElementType;
  formatElementText: (type: ElementType, text: string) => string;
  elementTypeToNodeName: Record<string, string>;
  nodeNameToElementType: Record<string, ElementType>;
  cssPrefix: string;
}
