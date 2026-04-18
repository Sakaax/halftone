import { copyFileSync, existsSync, chmodSync, rmSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOOK_SRC = join(__dirname, "..", "..", "hooks", "pre-commit.sh");

const KEY_PATTERNS: RegExp[] = [
  /sk-[A-Za-z0-9]{32,}/g,
  /AIza[0-9A-Za-z_-]{35}/g,
  /api_key\s*=\s*"[^"]{20,}"/g,
  /IMG_PILOT_KEY=\S{20,}/g,
  /RUNWAY_API_KEY=\S{20,}/g,
  /KLING_[A-Z_]+=\S{20,}/g,
];

export function scanForKeys(text: string): string[] {
  const hits: string[] = [];
  for (const p of KEY_PATTERNS) {
    const matches = text.match(p);
    if (matches) hits.push(...matches);
  }
  return hits;
}

export function installHook(projectRoot: string): void {
  const hooksDir = join(projectRoot, ".git/hooks");
  mkdirSync(hooksDir, { recursive: true });
  const dest = join(hooksDir, "pre-commit");
  copyFileSync(HOOK_SRC, dest);
  chmodSync(dest, 0o755);
}

export function uninstallHook(projectRoot: string): void {
  const dest = join(projectRoot, ".git/hooks/pre-commit");
  if (existsSync(dest)) rmSync(dest);
}
