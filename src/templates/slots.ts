import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

export interface Slot {
  name: string;
  file: string;
  line: number;
  column: number;
  raw: string;
}

const SLOT_RE = /<!--\s*slot:([a-z0-9-]+)\s*-->/g;
const EXTS = new Set([".svelte", ".astro", ".html"]);

function walk(dir: string): string[] {
  const results: string[] = [];
  function recurse(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) {
        recurse(p);
      } else {
        const dot = e.lastIndexOf(".");
        const ext = dot >= 0 ? e.slice(dot) : "";
        if (EXTS.has(ext)) results.push(p);
      }
    }
  }
  recurse(dir);
  return results;
}

export function detectSlots(templatePath: string): Slot[] {
  const slots: Slot[] = [];
  for (const file of walk(templatePath)) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const re = new RegExp(SLOT_RE.source, "g");
      let match: RegExpExecArray | null;
      while ((match = re.exec(line)) !== null) {
        slots.push({
          name: match[1]!,
          file,
          line: i + 1,
          column: match.index + 1,
          raw: match[0],
        });
      }
    }
  }
  return slots;
}
