import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/a11y-audit/SKILL.md";

describe("internal-skills/a11y-audit", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-a11y-audit");
  });
  test("scope is WCAG 2.1 AA + covers static + axe-core", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/WCAG 2\.1 AA/i);
    expect(raw).toMatch(/axe-core/i);
    expect(raw).toMatch(/static/i);
  });
});
