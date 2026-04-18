import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/moodboard/SKILL.md";

describe("internal-skills/moodboard", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-moodboard");
  });
  test("mentions img-pilot and fallback", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/img-pilot/i);
    expect(raw).toMatch(/fallback/i);
  });
});
