import type { ScriptProject } from "@/types";

export function exportToMarkdown(project: ScriptProject): string {
  const lines: string[] = [];

  lines.push(`# ${project.title}`);
  lines.push("");

  if (project.metadata.author) {
    lines.push(`*By ${project.metadata.author}*`);
    lines.push("");
  }

  for (const element of project.content.elements) {
    if (!element.text && element.type !== "break") continue;

    switch (element.type) {
      case "chapter":
        lines.push("");
        lines.push(`## ${element.text}`);
        lines.push("");
        break;
      case "paragraph":
      case "action":
        lines.push(element.text);
        lines.push("");
        break;
      case "quote":
        lines.push(`> ${element.text}`);
        lines.push("");
        break;
      case "break":
        lines.push("");
        lines.push("---");
        lines.push("");
        break;
      case "scene_heading":
        lines.push("");
        lines.push(`### ${element.text}`);
        lines.push("");
        break;
      case "dialogue":
        lines.push(`"${element.text}"`);
        lines.push("");
        break;
      case "character":
        lines.push(`**${element.text}**`);
        break;
      default:
        lines.push(element.text);
        lines.push("");
    }
  }

  return lines.join("\n");
}

export function exportToText(project: ScriptProject): string {
  const lines: string[] = [];

  lines.push(project.title);
  lines.push("=".repeat(project.title.length));
  lines.push("");

  for (const element of project.content.elements) {
    if (!element.text && element.type !== "break") continue;

    switch (element.type) {
      case "chapter":
        lines.push("");
        lines.push(element.text.toUpperCase());
        lines.push("");
        break;
      case "break":
        lines.push("");
        lines.push("* * *");
        lines.push("");
        break;
      default:
        lines.push(element.text);
        lines.push("");
    }
  }

  return lines.join("\n");
}
