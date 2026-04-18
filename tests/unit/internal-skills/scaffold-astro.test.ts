import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/scaffold-astro/SKILL.md";

describe("internal-skills/scaffold-astro", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-scaffold-astro");
  });
  test("mentions halftone:locked + slots + astro", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/halftone:locked/i);
    expect(raw).toMatch(/slot/i);
    expect(raw).toMatch(/astro/i);
  });
});
