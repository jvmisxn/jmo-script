import type { ScriptStats } from "@/types";

interface ScriptStatsPanelProps {
  stats: ScriptStats;
}

export function ScriptStatsPanel({ stats }: ScriptStatsPanelProps) {
  return (
    <div className="stats-panel">
      <table className="info-table">
        <tbody>
          <tr>
            <td>Words</td>
            <td>{stats.wordCount.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Est. Pages</td>
            <td>{stats.estimatedPageCount}</td>
          </tr>
          <tr>
            <td>Scenes</td>
            <td>{stats.sceneCount}</td>
          </tr>
          <tr>
            <td>Characters</td>
            <td>{stats.characterCount}</td>
          </tr>
          <tr>
            <td>Dialogue Lines</td>
            <td>{stats.dialogueCount}</td>
          </tr>
          <tr>
            <td>Action Blocks</td>
            <td>{stats.actionCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
