import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/motion/SKILL.md";

describe("internal-skills/motion", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-motion");
  });
  test("bans generic animations + requires prefers-reduced-motion", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/prefers-reduced-motion/i);
    expect(raw).toMatch(/cubic-bezier/i);
    expect(raw).toMatch(/NEVER/);
  });
});
