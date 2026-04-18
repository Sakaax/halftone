import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";

const PATH = ".claude/skills/halftone/SKILL.md";

describe("main SKILL.md (finalized)", () => {
  const raw = readFileSync(PATH, "utf-8");

  test("contains HARD RULES section", () => {
    expect(raw).toMatch(/HARD RULES/);
  });

  test("references all 9 internal skills", () => {
    const internalSkills = [
      "brief", "directions", "moodboard",
      "scaffold-sveltekit", "scaffold-astro",
      "motion", "typography",
      "responsive-audit", "a11y-audit",
    ];
    for (const s of internalSkills) {
      expect(raw).toContain(`internal-skills/${s}/SKILL.md`);
    }
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
