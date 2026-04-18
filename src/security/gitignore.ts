import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const HALFTONE_ENTRIES = [
  "",
  "# Halftone",
  "/halftone/.state.json",
  "/halftone/.keys",
  "/halftone/.env",
  "/halftone/moodboard/",
  "/halftone/audit/",
  "halftone/**/.secrets*",
];

export function ensureGitignore(projectRoot: string): void {
  const path = join(projectRoot, ".gitignore");
  const existing = existsSync(path) ? readFileSync(path, "utf-8") : "";
  const missing = HALFTONE_ENTRIES.filter((line) => {
    if (line === "" || line.startsWith("#")) return false;
    return !existing.split("\n").some((l) => l.trim() === line);
  });
  if (missing.length === 0) return;
  const addition = ["", "# Halftone", ...missing].join("\n") + "\n";
  writeFileSync(path, existing + addition, "utf-8");
}
