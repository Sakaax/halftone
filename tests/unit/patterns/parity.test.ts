import { describe, expect, test } from "bun:test";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

function patternVariants(slotDir: string): Array<{ slug: string; sk: boolean; astro: boolean }> {
  if (!existsSync(slotDir)) return [];
  const skDir = join(slotDir, "sveltekit");
  const astroDir = join(slotDir, "astro");
  const skSlugs = existsSync(skDir) ? readdirSync(skDir) : [];
  const astroSlugs = existsSync(astroDir) ? readdirSync(astroDir) : [];
  const all = new Set([...skSlugs, ...astroSlugs]);
  return [...all].map((slug) => ({
    slug,
    sk: skSlugs.includes(slug),
    astro: astroSlugs.includes(slug),
  }));
}

describe("cross-framework pattern parity", () => {
  const slots = ["heroes", "text-reveals"];
  for (const slot of slots) {
    test(`every ${slot} pattern has both sveltekit + astro`, () => {
      const variants = patternVariants(join("patterns", slot));
      for (const v of variants) {
        expect(v.sk).toBe(true);
        expect(v.astro).toBe(true);
      }
    });
  }
});
