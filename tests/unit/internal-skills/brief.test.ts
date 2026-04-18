import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "fs";
import matter from "gray-matter";

const PATH = "internal-skills/brief/SKILL.md";

describe("internal-skills/brief", () => {
  test("exists", () => expect(existsSync(PATH)).toBe(true));
  test("has required frontmatter", () => {
    const { data } = matter(readFileSync(PATH, "utf-8"));
    expect(data.name).toBe("halftone-brief");
    expect(data.purpose).toBeTruthy();
    expect(data.inputs).toBeTruthy();
    expect(data.outputs).toBeTruthy();
  });
  test("mentions 3 questions max", () => {
    const raw = readFileSync(PATH, "utf-8");
    expect(raw).toMatch(/MAX 3 questions/i);
  });
});
