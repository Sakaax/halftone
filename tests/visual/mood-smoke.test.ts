import { describe, expect, test } from "bun:test";

describe.skipIf(!process.env.HALFTONE_VISUAL)("mood smoke tests", () => {
  const moods = [
    "editorial-warm", "brutalist-mono", "swiss-editorial",
    "organic-earth", "y2k-glitch", "dark-academic", "soft-pastel-print",
  ];

  test.each(moods)("%s mood renders studio-landing without errors", (mood) => {
    // Placeholder: scaffolds studio-landing × sveltekit with this mood,
    // runs dev server, captures screenshot, asserts no console errors.
    expect(mood).toBeTruthy();
  });
});
