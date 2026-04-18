import { describe, expect, test } from "bun:test";
import { resolveSlotContent } from "../../../src/patterns/resolver";
import { SlotUnresolvedError } from "../../../src/types";
import type { PatternManifest } from "../../../src/patterns/schema";

const manifest: PatternManifest = {
  version: 1,
  generated_at: "2026-04-19T00:00:00Z",
  patterns: [
    {
      slug: "heroes/asymmetric-editorial",
      slot: "hero",
      frameworks: {
        sveltekit: { entry: "patterns/heroes/sveltekit/asymmetric-editorial/Hero.svelte", sha256: "abc", deps: [] },
        astro:     { entry: "patterns/heroes/astro/asymmetric-editorial/Hero.astro",     sha256: "def", deps: [] },
      },
      tokens_required: ["palette.bg"],
      motion_tags: ["text-reveal"],
      mood_compat: ["editorial-warm"],
    },
  ],
};

describe("resolveSlotContent", () => {
  test("returns pattern entry for slot + framework", () => {
    const entry = resolveSlotContent(manifest, "heroes/asymmetric-editorial@sha256:abc", "sveltekit");
    expect(entry.entry).toContain("sveltekit");
    expect(entry.sha256).toBe("abc");
  });
  test("throws SlotUnresolvedError for unknown pattern", () => {
    expect(() =>
      resolveSlotContent(manifest, "heroes/nonexistent@sha256:xxx", "sveltekit")
    ).toThrow(SlotUnresolvedError);
  });
});
