import { useState } from "react";
import { Plus, FileText, BookOpen, PenTool, Trash2 } from "lucide-react";
import { IconButton } from "@jmo/core/components";
import type { DocumentType } from "@/types";
import { useProjectStore, createBlankProject } from "@/stores/projectStore";
import { getDocumentTypes } from "@/editor/modes";

interface ProjectListProps {
  onOpenProject: (id: string) => void;
}

export function ProjectList({ onOpenProject }: ProjectListProps) {
  const projects = useProjectStore((s) => s.projects);
  const addProject = useProjectStore((s) => s.addProject);
  const removeProject = useProjectStore((s) => s.removeProject);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<DocumentType>("screenplay");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const project = createBlankProject(newTitle.trim(), newType);
    addProject(project);
    setNewTitle("");
    setShowCreate(false);
    onOpenProject(project.id);
  };

  const DocTypeIcon = ({ type }: { type: DocumentType }) => {
    switch (type) {
      case "screenplay":
        return <FileText size={20} />;
      case "book":
        return <BookOpen size={20} />;
      case "plain":
        return <PenTool size={20} />;
    }
  };

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>Projects</h2>
        <IconButton
          icon={Plus}
          label="New project"
          onClick={() => setShowCreate(true)}
        />
      </div>

      {showCreate && (
        <div className="create-project-form">
          <input
            className="jmo-input"
            type="text"
            placeholder="Project title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <div className="create-project-types">
            {getDocumentTypes().map((dt) => (
              <button
                key={dt.type}
                className={`type-chip ${newType === dt.type ? "active" : ""}`}
                onClick={() => setNewType(dt.type)}
              >
                {dt.label}
              </button>
            ))}
          </div>
          <div className="create-project-actions">
            <button className="jmo-btn jmo-btn-accent" onClick={handleCreate}>
              Create
            </button>
            <button
              className="jmo-btn"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !showCreate && (
        <div className="project-empty">
          <PenTool size={48} strokeWidth={1} />
          <p>No projects yet</p>
          <button
            className="jmo-btn jmo-btn-accent"
            onClick={() => setShowCreate(true)}
          >
            Create your first project
          </button>
        </div>
      )}

      <div className="project-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onOpenProject(project.id)}
          >
            <div className="project-card-icon">
              <DocTypeIcon type={project.documentType} />
            </div>
            <div className="project-card-info">
              <span className="project-card-title">{project.title}</span>
              <span className="project-card-meta">
                {project.documentType} &middot;{" "}
                {project.content.elements.length} elements
              </span>
              <span className="project-card-date">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className="jmo-icon-btn"
              title="Delete project"
              onClick={(e) => {
                e.stopPropagation();
                removeProject(project.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
