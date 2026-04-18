import { describe, expect, test } from "bun:test";
import { loadMood, loadAllMoods } from "../../../src/moods/loader";

describe("loadMood", () => {
  test("loads valid mood JSON", () => {
    const mood = loadMood("tests/fixtures/moods/valid.json");
    expect(mood.slug).toBe("editorial-warm");
  });
  test("throws on invalid JSON", () => {
    expect(() => loadMood("tests/fixtures/moods/invalid.json")).toThrow();
  });
  test("throws on missing file", () => {
    expect(() => loadMood("tests/fixtures/moods/nonexistent.json")).toThrow();
  });
});

describe("loadAllMoods", () => {
  test("loads all moods from a directory", () => {
    const moods = loadAllMoods("tests/fixtures/moods");
    expect(moods.length).toBeGreaterThan(0);
  });
});
