import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/typography/SKILL.md";

describe("internal-skills/typography", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-typography");
  });
  test("bans bad fonts + requires clamp", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/Inter/);
    expect(raw).toMatch(/Roboto/);
    expect(raw).toMatch(/clamp\(/);
    expect(raw).toMatch(/NEVER/);
  });
});
