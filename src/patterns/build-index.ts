#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, relative } from "path";
import { computeSha256 } from "./manifest";
import { PatternManifestSchema, type PatternManifest, type PatternEntry } from "./schema";

interface MetaJson {
  slug: string;
  slot: "hero" | "primary-motion" | "footer" | "cursor" | "transition";
  entry: string;
  framework: "sveltekit" | "astro";
  tokens_required: string[];
  motion_tags: string[];
  mood_compat: Array<
    | "editorial-warm" | "brutalist-mono" | "swiss-editorial"
    | "organic-earth" | "y2k-glitch" | "dark-academic" | "soft-pastel-print"
  >;
  deps: string[];
}

function walkPatterns(root: string): MetaJson[] {
  const results: MetaJson[] = [];
  function recurse(dir: string) {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        recurse(path);
      } else if (entry === "meta.json") {
        const raw = readFileSync(path, "utf-8");
        const meta = JSON.parse(raw) as MetaJson;
        const dirRel = relative(join(root), dir);
        meta.entry = join(dirRel, meta.entry);
        results.push(meta);
      }
    }
  }
  recurse(join(root, "patterns"));
  return results;
}

export async function buildIndex(pluginRoot: string): Promise<PatternManifest> {
  const metas = walkPatterns(pluginRoot);

  const bySlug = new Map<string, MetaJson[]>();
  for (const m of metas) {
    const arr = bySlug.get(m.slug) ?? [];
    arr.push(m);
    bySlug.set(m.slug, arr);
  }

  const patterns: PatternEntry[] = [];
  for (const [slug, group] of bySlug) {
    const sveltekit = group.find((g) => g.framework === "sveltekit");
    const astro = group.find((g) => g.framework === "astro");
    if (!sveltekit || !astro) {
      throw new Error(`Pattern ${slug} missing framework entry (sveltekit: ${!!sveltekit}, astro: ${!!astro})`);
    }

    patterns.push({
      slug,
      slot: sveltekit.slot,
      frameworks: {
        sveltekit: {
          entry: sveltekit.entry,
          sha256: await computeSha256(join(pluginRoot, sveltekit.entry)),
          deps: sveltekit.deps,
        },
        astro: {
          entry: astro.entry,
          sha256: await computeSha256(join(pluginRoot, astro.entry)),
          deps: astro.deps,
        },
      },
      tokens_required: sveltekit.tokens_required,
      motion_tags: sveltekit.motion_tags,
      mood_compat: sveltekit.mood_compat,
    });
  }

  const manifest: PatternManifest = {
    version: 1,
    generated_at: new Date().toISOString(),
    patterns,
  };

  PatternManifestSchema.parse(manifest);

  writeFileSync(
    join(pluginRoot, "patterns/index.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  return manifest;
}

if (import.meta.main) {
  const root = process.cwd();
  await buildIndex(root);
  console.log("manifest generated");
}
