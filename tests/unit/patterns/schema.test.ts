import { describe, expect, test } from "bun:test";
import { PatternManifestSchema } from "../../../src/patterns/schema";

const valid = {
  version: 1,
  generated_at: "2026-04-19T16:00:00Z",
  patterns: [
    {
      slug: "heroes/asymmetric-editorial",
      slot: "hero",
      frameworks: {
        sveltekit: { entry: "patterns/heroes/sveltekit/asymmetric-editorial/Hero.svelte", sha256: "abc123", deps: ["gsap"] },
        astro:     { entry: "patterns/heroes/astro/asymmetric-editorial/Hero.astro",     sha256: "def456", deps: ["gsap"] },
      },
      tokens_required: ["palette.bg"],
      motion_tags: ["text-reveal"],
      mood_compat: ["editorial-warm"],
    },
  ],
};

describe("PatternManifestSchema", () => {
  test("accepts valid manifest", () => {
    const parsed = PatternManifestSchema.parse(valid);
    expect(parsed.patterns).toHaveLength(1);
  });
  test("requires both framework entries per pattern", () => {
    const invalid = {
      ...valid,
      patterns: [{ ...valid.patterns[0], frameworks: { sveltekit: valid.patterns[0]!.frameworks.sveltekit } }],
    };
    expect(() => PatternManifestSchema.parse(invalid)).toThrow();
  });
  test("requires sha256 non-empty", () => {
    const invalid = JSON.parse(JSON.stringify(valid));
    invalid.patterns[0].frameworks.sveltekit.sha256 = "";
    expect(() => PatternManifestSchema.parse(invalid)).toThrow();
  });
});
