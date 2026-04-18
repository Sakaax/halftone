import { describe, expect, test } from "bun:test";
import { existsSync } from "fs";
import { join } from "path";

const MOODS = [
  "editorial-warm",
  "brutalist-mono",
  "swiss-editorial",
  "organic-earth",
  "y2k-glitch",
  "dark-academic",
  "soft-pastel-print",
];
const BRIEFS = ["hero-bg", "texture", "ambient", "detail", "portrait", "abstract"];

describe("fallback assets", () => {
  test.each(MOODS)("%s has 6 SVG files", (mood) => {
    for (const brief of BRIEFS) {
      const path = join("fallback-assets", mood, `${brief}.svg`);
      expect(existsSync(path), `missing ${path}`).toBe(true);
    }
  });
});
