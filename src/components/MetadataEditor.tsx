import type { ScriptMetadata } from "@/types";

interface MetadataEditorProps {
  metadata: ScriptMetadata;
  onChange: (metadata: ScriptMetadata) => void;
}

export function MetadataEditor({ metadata, onChange }: MetadataEditorProps) {
  const update = (key: keyof ScriptMetadata, value: string) => {
    onChange({ ...metadata, [key]: value || undefined });
  };

  return (
    <div className="metadata-editor">
      <div className="metadata-field">
        <label>Author</label>
        <input
          className="jmo-input"
          type="text"
          value={metadata.author || ""}
          onChange={(e) => update("author", e.target.value)}
          placeholder="Author name"
        />
      </div>
      <div className="metadata-field">
        <label>Contact</label>
        <input
          className="jmo-input"
          type="text"
          value={metadata.contact || ""}
          onChange={(e) => update("contact", e.target.value)}
          placeholder="Contact info"
        />
      </div>
      <div className="metadata-field">
        <label>Copyright</label>
        <input
          className="jmo-input"
          type="text"
          value={metadata.copyright || ""}
          onChange={(e) => update("copyright", e.target.value)}
          placeholder="Copyright notice"
        />
      </div>
      <div className="metadata-field">
        <label>Draft Date</label>
        <input
          className="jmo-input"
          type="date"
          value={metadata.draftDate || ""}
          onChange={(e) => update("draftDate", e.target.value)}
        />
      </div>
      <div className="metadata-field">
        <label>Notes</label>
        <textarea
          className="jmo-input jmo-textarea"
          value={metadata.notes || ""}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>
    </div>
  );
}
