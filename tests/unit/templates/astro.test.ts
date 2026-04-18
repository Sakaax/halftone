import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { detectSlots } from "../../../src/templates/slots";

const FORMATS = ["studio-landing", "saas-premium", "creative-portfolio"];

describe("Astro templates", () => {
  test.each(FORMATS)("%s exists with astro.config.mjs", (format) => {
    const path = join("templates/astro", format);
    expect(existsSync(join(path, "package.json"))).toBe(true);
    expect(existsSync(join(path, "astro.config.mjs"))).toBe(true);
    expect(existsSync(join(path, "src/pages/index.astro"))).toBe(true);
  });

  test.each(FORMATS)("%s has hero + primary-motion + footer slots", (format) => {
    const slots = detectSlots(join("templates/astro", format));
    const names = slots.map((s) => s.name);
    expect(names).toContain("hero");
    expect(names).toContain("primary-motion");
    expect(names).toContain("footer");
  });
});
