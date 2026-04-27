import type { ScriptProject, ScriptContent, ScriptElement, ElementType } from "@/types";

const FDX_PARAGRAPH_TYPES: Record<string, string> = {
  scene_heading: "Scene Heading",
  action: "Action",
  character: "Character",
  dialogue: "Dialogue",
  parenthetical: "Parenthetical",
  transition: "Transition",
  centered: "General",
  page_break: "General",
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function exportToFdx(project: ScriptProject): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<FinalDraft DocumentType="Script" Template="No" Version="5">');
  lines.push("  <Content>");

  let sceneNumber = 0;
  for (const element of project.content.elements) {
    if (element.type === "scene_heading") sceneNumber++;
    lines.push(generateParagraph(element, sceneNumber));
  }

  lines.push("  </Content>");

  // Title page
  lines.push("  <TitlePage>");
  lines.push("    <Content>");
  lines.push('      <Paragraph Type="Title">');
  lines.push(
    `        <Text>${escapeXml(project.title.toUpperCase())}</Text>`
  );
  lines.push("      </Paragraph>");

  if (project.metadata.author) {
    lines.push('      <Paragraph Type="Title">');
    lines.push("        <Text>Written by</Text>");
    lines.push("      </Paragraph>");
    lines.push('      <Paragraph Type="Title">');
    lines.push(
      `        <Text>${escapeXml(project.metadata.author)}</Text>`
    );
    lines.push("      </Paragraph>");
  }

  if (project.metadata.contact) {
    lines.push('      <Paragraph Type="Title">');
    lines.push(
      `        <Text>${escapeXml(project.metadata.contact)}</Text>`
    );
    lines.push("      </Paragraph>");
  }

  if (project.metadata.copyright) {
    lines.push('      <Paragraph Type="Title">');
    lines.push(
      `        <Text>${escapeXml(project.metadata.copyright)}</Text>`
    );
    lines.push("      </Paragraph>");
  }

  lines.push("    </Content>");
  lines.push("  </TitlePage>");

  // Header / footer
  lines.push("  <HeaderAndFooter>");
  lines.push("    <Header><Paragraph><Text></Text></Paragraph></Header>");
  lines.push("    <Footer>");
  lines.push("      <Paragraph>");
  lines.push('        <DynamicLabel Type="Page #"/>');
  lines.push("        <Text>.</Text>");
  lines.push("      </Paragraph>");
  lines.push("    </Footer>");
  lines.push("  </HeaderAndFooter>");

  lines.push("  <ScriptNotes>");
  if (project.metadata.notes)
    lines.push(
      `    <ScriptNote>${escapeXml(project.metadata.notes)}</ScriptNote>`
    );
  lines.push("  </ScriptNotes>");

  lines.push("</FinalDraft>");

  return lines.join("\n");
}

function generateParagraph(element: ScriptElement, sceneNumber: number): string {
  const type = FDX_PARAGRAPH_TYPES[element.type] || "Action";

  if (element.type === "page_break") {
    return '    <Paragraph Type="Action" StartsNewPage="Yes">\n      <Text></Text>\n    </Paragraph>';
  }

  let attrs = `Type="${type}"`;
  if (element.type === "scene_heading") attrs += ` Number="${sceneNumber}"`;

  let text = element.text;
  if (
    element.type === "scene_heading" ||
    element.type === "character" ||
    element.type === "transition"
  ) {
    text = text.toUpperCase();
  }

  const textAttr =
    element.type === "centered" ? `Align="Center"` : "";

  return [
    `    <Paragraph ${attrs}>`,
    `      <Text${textAttr ? " " + textAttr : ""}>${escapeXml(text)}</Text>`,
    "    </Paragraph>",
  ].join("\n");
}

/**
 * Parse FDX file to script content
 */
export function parseFdx(fdxContent: string): ScriptContent {
  const elements: ScriptElement[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(fdxContent, "application/xml");

  const content = doc.querySelector("Content");
  if (!content) return { elements: [] };

  const paragraphs = content.querySelectorAll("Paragraph");
  let elementId = 0;

  paragraphs.forEach((para) => {
    const fdxType = para.getAttribute("Type") || "Action";
    const textNode = para.querySelector("Text");
    const text = textNode?.textContent || "";
    if (!text.trim() && fdxType !== "General") return;

    const mapping: Record<string, ElementType> = {
      "Scene Heading": "scene_heading",
      Action: "action",
      Character: "character",
      Dialogue: "dialogue",
      Parenthetical: "parenthetical",
      Transition: "transition",
      General: "action",
      Shot: "scene_heading",
    };

    elements.push({
      id: `fdx-${elementId++}`,
      type: mapping[fdxType] || "action",
      text: text.trim(),
    });
  });

  return { elements };
}
