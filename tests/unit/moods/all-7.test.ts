import { describe, expect, test } from "bun:test";
import { loadAllMoods } from "../../../src/moods/loader";

describe("all 7 moods", () => {
  test("loads exactly 7 moods from moods/", () => {
    const moods = loadAllMoods("moods");
    expect(moods).toHaveLength(7);
  });

  const expectedSlugs = [
    "editorial-warm",
    "brutalist-mono",
    "swiss-editorial",
    "organic-earth",
    "y2k-glitch",
    "dark-academic",
    "soft-pastel-print",
  ];

  test.each(expectedSlugs)("%s exists and validates", (slug) => {
    const moods = loadAllMoods("moods");
    expect(moods.find((m) => m.slug === slug)).toBeDefined();
  });
});
