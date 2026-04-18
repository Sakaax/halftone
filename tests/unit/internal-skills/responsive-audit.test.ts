import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/responsive-audit/SKILL.md";

describe("internal-skills/responsive-audit", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-responsive-audit");
  });
  test("covers static + deep modes", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/static/i);
    expect(raw).toMatch(/deep/i);
    expect(raw).toMatch(/playwright/i);
    expect(raw).toMatch(/clamp/i);
  });
});
