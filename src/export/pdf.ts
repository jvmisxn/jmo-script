import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions, Content, ContentText } from "pdfmake/interfaces";
import type { ScriptProject, ScriptContent, ScriptElement, ExportOptions } from "@/types";
import { FORMATTING } from "@/screenplay/constants";

const fonts = {
  Courier: {
    normal: "Courier",
    bold: "Courier-Bold",
    italics: "Courier-Oblique",
    bolditalics: "Courier-BoldOblique",
  },
};

const PPI = 72;
const LINE_HEIGHT = 12;

function inchesToPoints(inches: number): number {
  return inches * PPI;
}

export async function exportToPdf(
  project: ScriptProject,
  options: ExportOptions = {
    includeSceneNumbers: true,
    includePageNumbers: true,
    includeTitlePage: true,
    paperSize: "letter",
  }
): Promise<Blob> {
  const content: Content[] = [];

  if (options.includeTitlePage) {
    content.push(...generateTitlePage(project));
  }

  content.push(...generateScreenplayContent(project.content, options));

  const pageSize = options.paperSize === "a4" ? "A4" : "LETTER";

  const docDefinition: TDocumentDefinitions = {
    pageSize,
    pageMargins: [
      inchesToPoints(FORMATTING.margins.left),
      inchesToPoints(FORMATTING.margins.top),
      inchesToPoints(FORMATTING.margins.right),
      inchesToPoints(FORMATTING.margins.bottom),
    ],
    defaultStyle: {
      font: "Courier",
      fontSize: 12,
      lineHeight: 1,
    },
    content,
    footer: options.includePageNumbers ? generatePageFooter : undefined,
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(
        docDefinition,
        undefined,
        fonts
      );
      pdfDocGenerator.getBlob((blob: Blob) => resolve(blob));
    } catch (error) {
      reject(error);
    }
  });
}

function generateTitlePage(project: ScriptProject): Content[] {
  const content: Content[] = [];

  content.push({
    text: project.title.toUpperCase(),
    alignment: "center",
    fontSize: 12,
    bold: true,
    margin: [0, inchesToPoints(3), 0, LINE_HEIGHT * 2],
  });

  if (project.metadata.author) {
    content.push({
      text: "Written by",
      alignment: "center",
      fontSize: 12,
      margin: [0, 0, 0, LINE_HEIGHT],
    });
    content.push({
      text: project.metadata.author,
      alignment: "center",
      fontSize: 12,
      margin: [0, 0, 0, LINE_HEIGHT * 4],
    });
  }

  const contactLines: string[] = [];
  if (project.metadata.contact) contactLines.push(project.metadata.contact);
  if (project.metadata.copyright) contactLines.push(project.metadata.copyright);
  if (project.metadata.draftDate) {
    const date = new Date(project.metadata.draftDate);
    contactLines.push(
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }

  if (contactLines.length > 0) {
    content.push({
      text: contactLines.join("\n"),
      alignment: "left",
      fontSize: 12,
      margin: [0, inchesToPoints(2), 0, 0],
    });
  }

  content.push({ text: "", pageBreak: "after" });

  return content;
}

function generateScreenplayContent(
  scriptContent: ScriptContent,
  options: ExportOptions
): Content[] {
  const content: Content[] = [];
  let sceneNumber = 0;

  for (let i = 0; i < scriptContent.elements.length; i++) {
    const element = scriptContent.elements[i];
    const prevElement = i > 0 ? scriptContent.elements[i - 1] : null;

    const formatted = formatElement(element, prevElement);
    if (formatted) {
      if (element.type === "scene_heading") {
        sceneNumber++;
        if (options.includeSceneNumbers) {
          const sceneText = formatted as ContentText;
          sceneText.text = `${sceneNumber}. ${sceneText.text}`;
        }
      }
      content.push(formatted);
    }
  }

  return content;
}

function formatElement(
  element: ScriptElement,
  prevElement: ScriptElement | null
): Content | null {
  const formatting =
    FORMATTING.elements[element.type as keyof typeof FORMATTING.elements];
  if (!formatting) return null;

  const marginTop = calculateTopMargin(element, prevElement);
  const leftMargin = inchesToPoints(formatting.leftMargin);
  const rightMargin = inchesToPoints(formatting.rightMargin);

  let text = element.text;
  if (formatting.textTransform === "uppercase") text = text.toUpperCase();

  const result: ContentText = {
    text,
    margin: [leftMargin, marginTop, rightMargin, 0],
    fontSize: 12,
    bold: formatting.fontWeight === "bold",
  };

  if ("textAlign" in formatting) {
    result.alignment = formatting.textAlign;
  }

  return result;
}

function calculateTopMargin(
  element: ScriptElement,
  prevElement: ScriptElement | null
): number {
  const formatting =
    FORMATTING.elements[element.type as keyof typeof FORMATTING.elements];
  if (!formatting || !prevElement) return 0;
  return formatting.marginTop * LINE_HEIGHT;
}

function generatePageFooter(
  currentPage: number,
  _pageCount: number
): Content {
  if (currentPage === 1) return { text: "" };
  return {
    text: `${currentPage - 1}.`,
    alignment: "right",
    margin: [0, 0, inchesToPoints(FORMATTING.margins.right), 0],
    fontSize: 12,
  };
}
