import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

describe("main SKILL.md stub", () => {
  const path = ".claude/skills/halftone/SKILL.md";
  test("file exists", () => {
    expect(existsSync(path)).toBe(true);
  });
  test("has frontmatter with name and description", () => {
    const raw = readFileSync(path, "utf-8");
    const { data } = matter(raw);
    expect(data.name).toBe("halftone");
    expect(typeof data.description).toBe("string");
    expect(data.description.length).toBeGreaterThan(50);
  });
  test("under 10KB", () => {
    const raw = readFileSync(path, "utf-8");
    expect(raw.length).toBeLessThan(10 * 1024);
  });
});
