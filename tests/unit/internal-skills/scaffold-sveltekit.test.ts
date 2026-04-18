import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/scaffold-sveltekit/SKILL.md";

describe("internal-skills/scaffold-sveltekit", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-scaffold-sveltekit");
  });
  test("mentions halftone:locked + slots", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/halftone:locked/i);
    expect(raw).toMatch(/slot/i);
  });
});
