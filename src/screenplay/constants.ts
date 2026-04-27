// Industry-standard screenplay formatting constants
// Based on Final Draft and standard Hollywood screenplay format

export const FORMATTING = {
  font: {
    family: "'Courier Prime', 'Courier New', Courier, monospace",
    size: "12pt",
    lineHeight: 1,
  },

  page: {
    width: 8.5,
    height: 11,
    linesPerPage: 55,
    charsPerLine: 60,
  },

  margins: {
    top: 1,
    bottom: 1,
    left: 1.5,
    right: 1,
  },

  elements: {
    scene_heading: {
      leftMargin: 0,
      rightMargin: 0,
      marginTop: 2,
      marginBottom: 1,
      textTransform: "uppercase" as const,
      fontWeight: "bold" as const,
    },
    action: {
      leftMargin: 0,
      rightMargin: 0,
      marginTop: 1,
      marginBottom: 0,
      textTransform: "none" as const,
      fontWeight: "normal" as const,
    },
    character: {
      leftMargin: 2.2,
      rightMargin: 0,
      marginTop: 1,
      marginBottom: 0,
      textTransform: "uppercase" as const,
      fontWeight: "normal" as const,
    },
    parenthetical: {
      leftMargin: 1.6,
      rightMargin: 2.1,
      marginTop: 0,
      marginBottom: 0,
      maxWidth: 2.5,
      textTransform: "none" as const,
      fontWeight: "normal" as const,
    },
    dialogue: {
      leftMargin: 1.0,
      rightMargin: 1.5,
      marginTop: 0,
      marginBottom: 0,
      maxWidth: 3.5,
      textTransform: "none" as const,
      fontWeight: "normal" as const,
    },
    transition: {
      leftMargin: 4.0,
      rightMargin: 0,
      marginTop: 1,
      marginBottom: 1,
      textTransform: "uppercase" as const,
      fontWeight: "normal" as const,
      textAlign: "right" as const,
    },
    centered: {
      leftMargin: 0,
      rightMargin: 0,
      marginTop: 1,
      marginBottom: 1,
      textTransform: "none" as const,
      fontWeight: "normal" as const,
      textAlign: "center" as const,
    },
  },
} as const;

export const SCENE_HEADING_PREFIXES = [
  "INT.",
  "EXT.",
  "INT./EXT.",
  "I/E.",
  "INT",
  "EXT",
];

export const TRANSITIONS = [
  "CUT TO:",
  "FADE IN:",
  "FADE OUT.",
  "FADE TO:",
  "DISSOLVE TO:",
  "SMASH CUT TO:",
  "MATCH CUT TO:",
  "JUMP CUT TO:",
  "TIME CUT:",
  "IRIS IN:",
  "IRIS OUT:",
];

export const CHARACTER_EXTENSIONS = [
  "V.O.",
  "O.S.",
  "O.C.",
  "CONT'D",
  "PRE-LAP",
  "FILTER",
];

export const TIME_OF_DAY = [
  "DAY",
  "NIGHT",
  "MORNING",
  "AFTERNOON",
  "EVENING",
  "DUSK",
  "DAWN",
  "LATER",
  "CONTINUOUS",
  "SAME",
  "MOMENTS LATER",
];
