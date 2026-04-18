import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { detectSlots } from "../../../src/templates/slots";

const FORMATS = ["studio-landing", "saas-premium", "creative-portfolio"];

describe("SvelteKit templates", () => {
  test.each(FORMATS)("%s template exists with package.json", (format) => {
    const path = join("templates/sveltekit", format);
    expect(existsSync(join(path, "package.json"))).toBe(true);
    expect(existsSync(join(path, "svelte.config.js"))).toBe(true);
    expect(existsSync(join(path, "src/routes/+page.svelte"))).toBe(true);
  });

  test.each(FORMATS)("%s has hero + primary-motion + footer slots", (format) => {
    const slots = detectSlots(join("templates/sveltekit", format));
    const names = slots.map((s) => s.name);
    expect(names).toContain("hero");
    expect(names).toContain("primary-motion");
    expect(names).toContain("footer");
  });

  test.each(FORMATS)("%s tokens.css uses CSS vars", (format) => {
    const css = readFileSync(join("templates/sveltekit", format, "src/lib/tokens.css"), "utf-8");
    expect(css).toContain("{{tokens.palette.bg}}");
    expect(css).toContain("{{tokens.typography.display.family}}");
  });
});
