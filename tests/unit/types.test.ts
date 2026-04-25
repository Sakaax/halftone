import { describe, expect, test } from "bun:test";
import type { Framework, Format, MoodSlug, SlotName, Step } from "../../src/types";

describe("core types", () => {
  test("Framework accepts 'sveltekit' and 'astro'", () => {
    const a: Framework = "sveltekit";
    const b: Framework = "astro";
    expect([a, b]).toEqual(["sveltekit", "astro"]);
  });
  test("Format has 3 values", () => {
    const formats: Format[] = ["studio-landing", "saas-premium", "creative-portfolio"];
    expect(formats).toHaveLength(3);
  });
  test("MoodSlug has 7 values", () => {
    const moods: MoodSlug[] = [
      "editorial-warm", "brutalist-mono", "swiss-editorial",
      "organic-earth", "y2k-glitch", "dark-academic", "soft-pastel-print",
    ];
    expect(moods).toHaveLength(7);
  });
  test("SlotName covers expected slots", () => {
    const slots: SlotName[] = ["hero", "primary-motion", "footer", "cursor", "transition"];
    expect(slots).toContain("hero");
  });
  test("Step has 7 values (v0.2 flow)", () => {
    const steps: Step[] = ["init", "brief", "directions", "preview", "framework_chosen", "converted", "coded"];
    expect(steps).toHaveLength(7);
  });
});
