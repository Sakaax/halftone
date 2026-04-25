import type { SlotName } from "../types";

export interface PreviewSlot {
  name: SlotName;
  initFn: string;
}

export interface PreviewScaffoldInput {
  title: string;
  slots: SlotName[];
  bodyFontHref?: string;
  displayFontHref?: string;
}

export interface PreviewScaffoldOutput {
  html: string;
  css: string;
  js: string;
}

export type ServerRunner = "bun" | "python3" | "npx";

export interface PreviewServerHandle {
  pid: number;
  url: string;
  runner: ServerRunner;
  port: number;
}

export const PREVIEW_PORT = 3737;
export const PREVIEW_DIR = "halftone/preview";
export const PREVIEW_PID_FILE = "halftone/.preview-pid";

export const SLOT_INIT_FN: Record<SlotName, string> = {
  hero: "initHero",
  "primary-motion": "initPrimaryMotion",
  footer: "initFooter",
  cursor: "initCursor",
  transition: "initTransition",
};
