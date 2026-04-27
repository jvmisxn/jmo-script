import { create } from "zustand";
import type { ScriptProject, DocumentType } from "@/types";

interface ProjectStoreState {
  projects: ScriptProject[];
  activeProjectId: string | null;

  // Derived
  activeProject: () => ScriptProject | null;

  // Actions
  addProject: (project: ScriptProject) => void;
  removeProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  updateProject: (id: string, updates: Partial<ScriptProject>) => void;
  setProjects: (projects: ScriptProject[]) => void;
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  projects: [],
  activeProjectId: null,

  activeProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId) || null;
  },

  addProject: (project) =>
    set((s) => ({ projects: [...s.projects, project] })),

  removeProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
    })),

  setActiveProject: (id) => set({ activeProjectId: id }),

  updateProject: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  setProjects: (projects) => set({ projects }),
}));

// Helper to create a new blank project
export function createBlankProject(
  title: string,
  documentType: DocumentType
): ScriptProject {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    documentType,
    createdAt: now,
    updatedAt: now,
    content: { documentType, elements: [] },
    metadata: {},
  };
}
