import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { MoodSchema, type Mood } from "./schema";

export function loadMood(path: string): Mood {
  if (!existsSync(path)) {
    throw new Error(`Mood file not found: ${path}`);
  }
  const raw = readFileSync(path, "utf-8");
  const parsed = JSON.parse(raw);
  return MoodSchema.parse(parsed);
}

export function loadAllMoods(dir: string): Mood[] {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const moods: Mood[] = [];
  for (const f of files) {
    try {
      moods.push(loadMood(join(dir, f)));
    } catch {
      // skip invalid files (tests/fixtures intentionally has them)
    }
  }
  return moods;
}
