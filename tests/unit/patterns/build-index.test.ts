import { describe, expect, test } from "bun:test";
import { buildIndex } from "../../../src/patterns/build-index";
import { loadManifest } from "../../../src/patterns/manifest";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("buildIndex", () => {
  test("scans patterns/ and writes index.json", async () => {
    const pluginRoot = mkdtempSync(join(tmpdir(), "halftone-bi-"));
    const sk = join(pluginRoot, "patterns/heroes/sveltekit/sample");
    const astro = join(pluginRoot, "patterns/heroes/astro/sample");
    mkdirSync(sk, { recursive: true });
    mkdirSync(astro, { recursive: true });
    writeFileSync(join(sk, "Hero.svelte"), "<div>sk</div>");
    writeFileSync(join(astro, "Hero.astro"), "<div>astro</div>");
    writeFileSync(join(sk, "meta.json"), JSON.stringify({
      slug: "heroes/sample",
      slot: "hero",
      entry: "Hero.svelte",
      framework: "sveltekit",
      tokens_required: ["palette.bg"],
      motion_tags: ["text-reveal"],
      mood_compat: ["editorial-warm"],
      deps: [],
    }));
    writeFileSync(join(astro, "meta.json"), JSON.stringify({
      slug: "heroes/sample",
      slot: "hero",
      entry: "Hero.astro",
      framework: "astro",
      tokens_required: ["palette.bg"],
      motion_tags: ["text-reveal"],
      mood_compat: ["editorial-warm"],
      deps: [],
    }));

    await buildIndex(pluginRoot);
    const m = loadManifest(join(pluginRoot, "patterns/index.json"));
    expect(m.patterns).toHaveLength(1);
    expect(m.patterns[0]!.slug).toBe("heroes/sample");
    expect(m.patterns[0]!.frameworks.sveltekit.sha256).toBeTruthy();

    rmSync(pluginRoot, { recursive: true, force: true });
  });
});
