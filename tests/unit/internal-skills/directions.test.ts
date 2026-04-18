import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/directions/SKILL.md";

describe("internal-skills/directions", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-directions");
  });
  test("mentions 3 parallel subagents", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/3 (parallel|directions)/i);
  });
});
