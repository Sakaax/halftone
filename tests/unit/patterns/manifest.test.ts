import { describe, expect, test, beforeAll } from "bun:test";
import { loadManifest, verifyPatternFile, computeSha256 } from "../../../src/patterns/manifest";
import { writeFileSync } from "fs";
import type { PatternManifest } from "../../../src/patterns/schema";

const ROOT = "tests/fixtures/patterns";

beforeAll(async () => {
  const sk = await computeSha256(`${ROOT}/heroes/sveltekit/sample/Hero.svelte`);
  const astro = await computeSha256(`${ROOT}/heroes/astro/sample/Hero.astro`);
  const manifest: PatternManifest = {
    version: 1,
    generated_at: "2026-04-19T00:00:00Z",
    patterns: [
      {
        slug: "heroes/sample",
        slot: "hero",
        frameworks: {
          sveltekit: { entry: `${ROOT}/heroes/sveltekit/sample/Hero.svelte`, sha256: sk, deps: [] },
          astro:     { entry: `${ROOT}/heroes/astro/sample/Hero.astro`,     sha256: astro, deps: [] },
        },
        tokens_required: [],
        motion_tags: [],
        mood_compat: ["editorial-warm"],
      },
    ],
  };
  writeFileSync(`${ROOT}/index-valid.json`, JSON.stringify(manifest, null, 2));
});

describe("loadManifest", () => {
  test("loads + validates", () => {
    const m = loadManifest(`${ROOT}/index-valid.json`);
    expect(m.patterns).toHaveLength(1);
  });
});

describe("verifyPatternFile", () => {
  test("returns true for matching sha256", async () => {
    const m = loadManifest(`${ROOT}/index-valid.json`);
    const p = m.patterns[0]!;
    const ok = await verifyPatternFile(p.frameworks.sveltekit.entry, p.frameworks.sveltekit.sha256);
    expect(ok).toBe(true);
  });
  test("returns false for mismatched sha256", async () => {
    const ok = await verifyPatternFile(`${ROOT}/heroes/sveltekit/sample/Hero.svelte`, "deadbeef");
    expect(ok).toBe(false);
  });
});
