import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";

const PATH = ".claude/skills/halftone/SKILL.md";

describe("main SKILL.md (v0.2)", () => {
  const raw = readFileSync(PATH, "utf-8");

  test("contains HARD RULES section", () => {
    expect(raw).toMatch(/HARD RULES/);
  });

  test("references the v0.2 internal skills", () => {
    const required = [
      "brief", "directions", "preview", "convert",
      "scaffold-sveltekit", "scaffold-astro",
      "motion", "typography",
      "responsive-audit", "a11y-audit",
    ];
    for (const s of required) {
      expect(raw).toContain(`internal-skills/${s}/SKILL.md`);
    }
  });

  test("does not reference the deprecated moodboard step in the dispatch table", () => {
    expect(raw).not.toMatch(/^\|\s*moodboard\s*\|/m);
    expect(raw).not.toMatch(/Step \d+ — Moodboard/i);
  });

  test("bans fonts explicitly", () => {
    expect(raw).toMatch(/Inter/);
    expect(raw).toMatch(/Roboto/);
    expect(raw).toMatch(/Montserrat/);
  });

  test("stays under 10KB", () => {
    expect(raw.length).toBeLessThan(10 * 1024);
  });
});
