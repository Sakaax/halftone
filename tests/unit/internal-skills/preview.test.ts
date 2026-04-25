import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/preview/SKILL.md";

describe("internal-skills/preview", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));

  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-preview");
    expect(data.purpose).toBeTruthy();
  });

  test("references vanilla preview output paths", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/halftone\/preview\//);
    expect(raw).toMatch(/index\.html/);
    expect(raw).toMatch(/styles\.css/);
    expect(raw).toMatch(/motion\.js/);
  });

  test("forbids framework code in this phase", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/vanilla/i);
    expect(raw).toMatch(/No SvelteKit/i);
  });

  test("documents what is deferred to conversion", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/routing/i);
    expect(raw).toMatch(/sitemap/i);
  });
});
