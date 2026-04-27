import { useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import { useProjectStore } from "@/stores/projectStore";
import { useEditorStore, tiptapToElements, elementsToTiptap } from "@/stores/editorStore";
import { getEditorMode } from "@/editor/modes";
import { extractScenes, extractCharacters, calculateStats } from "@/screenplay/analyzer";
import { ElementTypeBar } from "./ElementTypeBar";
import { EditorSidebar } from "./EditorSidebar";
import type { ElementType } from "@/types";

interface EditorViewProps {
  onBackToProjects: () => void;
}

export function EditorView({ onBackToProjects }: EditorViewProps) {
  const activeProject = useProjectStore((s) => s.activeProject)();
  const updateProject = useProjectStore((s) => s.updateProject);
  const currentElementType = useEditorStore((s) => s.currentElementType);
  const setCurrentElementType = useEditorStore((s) => s.setCurrentElementType);
  const setWordCount = useEditorStore((s) => s.setWordCount);
  const setPageCount = useEditorStore((s) => s.setPageCount);
  const setDirty = useEditorStore((s) => s.setDirty);
  const sidebarOpen = useEditorStore((s) => s.sidebarOpen);

  const mode = useMemo(
    () => getEditorMode(activeProject?.documentType || "screenplay"),
    [activeProject?.documentType]
  );

  // Build initial content from project elements
  const initialContent = useMemo(() => {
    if (!activeProject || activeProject.content.elements.length === 0) {
      return {
        type: "doc",
        content: [
          {
            type: mode.elementTypeToNodeName[mode.elementTypes[0].type],
            attrs: { elementType: mode.elementTypes[0].type },
            content: [],
          },
        ],
      };
    }
    return elementsToTiptap(
      activeProject.content.elements,
      mode.elementTypeToNodeName
    );
  }, [activeProject?.id]);

  const editor = useEditor({
    extensions: [
      Document.extend({ content: "block+" }),
      Text,
      History,
      Placeholder.configure({
        placeholder: ({ node }) => {
          const elementType = node.attrs.elementType as string;
          return mode.placeholders[elementType] || "Start writing...";
        },
      }),
      ...mode.nodes,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setDirty(true);

      // Sync content back to project
      if (activeProject) {
        const json = editor.getJSON();
        const elements = tiptapToElements(
          json as Record<string, unknown>,
          mode.nodeNameToElementType
        );
        updateProject(activeProject.id, {
          content: {
            documentType: activeProject.documentType,
            elements,
          },
        });

        // Update stats
        const stats = calculateStats({ elements });
        setWordCount(stats.wordCount);
        setPageCount(stats.estimatedPageCount);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Track current element type at cursor
      const { $from } = editor.state.selection;
      const node = $from.parent;
      const elementType = mode.nodeNameToElementType[node.type.name];
      if (elementType) {
        setCurrentElementType(elementType);
      }
    },
  });

  // Handle element type change from the type bar
  const handleChangeElementType = useCallback(
    (type: ElementType) => {
      if (!editor) return;
      setCurrentElementType(type);

      const nodeName = mode.elementTypeToNodeName[type];
      if (nodeName) {
        editor
          .chain()
          .focus()
          .setNode(nodeName, { elementType: type })
          .run();
      }
    },
    [editor, mode, setCurrentElementType]
  );

  // Derive analysis data
  const content = activeProject?.content || { elements: [] };
  const scenes = useMemo(() => extractScenes(content), [content]);
  const characters = useMemo(() => extractCharacters(content), [content]);
  const stats = useMemo(() => calculateStats(content), [content]);

  if (!activeProject) {
    return (
      <div className="editor-empty">
        <p>No project selected</p>
        <button className="jmo-btn" onClick={onBackToProjects}>
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="editor-view">
      <div className="editor-main">
        <ElementTypeBar
          mode={mode}
          currentType={currentElementType}
          onChangeType={handleChangeElementType}
        />
        <div className="editor-page">
          <div className="editor-page-inner">
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <EditorSidebar
          scenes={scenes}
          characters={characters}
          stats={stats}
        />
      )}
    </div>
  );
}
