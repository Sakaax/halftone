import { describe, expect, test } from "bun:test";
import { writeDirection } from "../../../src/direction/writer";
import { rmSync, mkdtempSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type { Direction } from "../../../src/direction/schema";

const direction: Direction = {
  version: 1,
  mood: "editorial-warm",
  format: "studio-landing",
  framework: "sveltekit",
  palette: {
    bg: "#0F0E0C", fg: "#E8E4DE", accent: "#D4622A",
    muted: "#8B7355", border: "rgba(232,228,222,0.08)",
  },
  typography: {
    display: { family: "PP Editorial New", weight: 400 },
    body:    { family: "Space Grotesk", weight: 400 },
    mono:    { family: "JetBrains Mono", weight: 400 },
  },
  motion: {
    language: "pinned scroll",
    patterns: {
      hero: "heroes/asymmetric-editorial@sha256:a",
      "primary-motion": "text-reveals/per-letter-gsap@sha256:b",
      footer: "footers/editorial-outro@sha256:c",
    },
  },
  moodboard: {
    source: "fallback",
    paths: [
      "halftone/moodboard/hero-bg.svg", "halftone/moodboard/texture.svg",
      "halftone/moodboard/ambient.svg", "halftone/moodboard/detail.svg",
      "halftone/moodboard/portrait.svg", "halftone/moodboard/abstract.svg",
    ],
  },
  locked_at: "2026-04-19T16:30:00Z",
};

describe("writeDirection", () => {
  test("writes direction.md with frontmatter + body", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-writer-"));
    const path = join(dir, "direction.md");
    writeDirection(path, direction, "# Direction: test\n\n## Rationale\nBecause.");
    const raw = readFileSync(path, "utf-8");
    expect(raw).toContain("mood: editorial-warm");
    expect(raw).toContain("# Direction: test");
    rmSync(dir, { recursive: true, force: true });
  });
});
