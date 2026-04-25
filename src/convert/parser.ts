import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { parse } from "node-html-parser";
import type { SlotName } from "../types";
import { SLOT_INIT_FN } from "../preview/types";

export interface ParsedSlot {
  name: SlotName;
  innerHtml: string;
  position: "main" | "overlay";
  initBody: string;
}

export interface ParsedPreview {
  title: string;
  cssGlobal: string;
  fontLinks: string[];
  slots: ParsedSlot[];
  hasLenis: boolean;
}

const SLOT_NAMES: SlotName[] = ["hero", "primary-motion", "footer", "cursor", "transition"];

export function parsePreview(previewDir: string): ParsedPreview {
  const htmlPath = join(previewDir, "index.html");
  const cssPath = join(previewDir, "styles.css");
  const jsPath = join(previewDir, "motion.js");

  if (!existsSync(htmlPath)) throw new Error(`Preview HTML not found: ${htmlPath}`);

  const html = readFileSync(htmlPath, "utf-8");
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  const js = existsSync(jsPath) ? readFileSync(jsPath, "utf-8") : "";

  const root = parse(html);
  const titleNode = root.querySelector("title");
  const title = titleNode?.text.trim() ?? "Halftone site";

  const fontLinks = root
    .querySelectorAll('link[rel="stylesheet"]')
    .map((n) => n.getAttribute("href") ?? "")
    .filter((h) => h && !h.startsWith("./"));

  const slots: ParsedSlot[] = [];
  for (const name of SLOT_NAMES) {
    const node = root.querySelector(`[data-slot="${name}"]`);
    if (!node) continue;
    const isOverlay = node.tagName?.toLowerCase() === "div";
    slots.push({
      name,
      innerHtml: node.innerHTML.trim(),
      position: isOverlay ? "overlay" : "main",
      initBody: extractInitBody(js, SLOT_INIT_FN[name]),
    });
  }

  return {
    title,
    cssGlobal: css,
    fontLinks,
    slots,
    hasLenis: /new\s+(?:window\.)?Lenis\b/.test(js),
  };
}

export function extractInitBody(js: string, fnName: string): string {
  const re = new RegExp(`function\\s+${fnName}\\s*\\([^)]*\\)\\s*{`);
  const match = js.match(re);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  let depth = 1;
  let i = start;
  while (i < js.length && depth > 0) {
    const c = js[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  if (depth !== 0) return "";
  return js.slice(start, i - 1).trim();
}
