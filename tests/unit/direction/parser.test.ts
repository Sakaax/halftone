import { describe, expect, test } from "bun:test";
import { parseDirection } from "../../../src/direction/parser";

describe("parseDirection", () => {
  test("parses valid direction.md file", () => {
    const { data, body } = parseDirection("tests/fixtures/direction/valid.md");
    expect(data.mood).toBe("editorial-warm");
    expect(data.framework).toBe("sveltekit");
    expect(body).toContain("Direction: Warm Editorial Studio");
  });
  test("throws on invalid frontmatter", () => {
    expect(() => parseDirection("tests/fixtures/moods/invalid.json")).toThrow();
  });
});
