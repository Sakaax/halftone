import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { convertPreview } from "../../../src/convert/index";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-convert-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function setupPreview(htmlSlots = 3): string {
  const previewDir = join(dir, "halftone/preview");
  mkdirSync(previewDir, { recursive: true });
  const sections = [];
  if (htmlSlots >= 1) sections.push('<section data-slot="hero"><h1>Hi</h1></section>');
  if (htmlSlots >= 2) sections.push('<section data-slot="primary-motion"></section>');
  if (htmlSlots >= 3) sections.push('<section data-slot="footer"></section>');
  writeFileSync(
    join(previewDir, "index.html"),
    `<!doctype html><html><head><title>X</title></head><body><main>${sections.join("")}</main></body></html>`,
    "utf-8"
  );
  writeFileSync(join(previewDir, "styles.css"), ":root { --bg: #0F0E0C; }", "utf-8");
  writeFileSync(
    join(previewDir, "motion.js"),
    "function initHero() { gsap.from('.x', { y: 60 }); }",
    "utf-8"
  );
  return previewDir;
}

describe("convertPreview", () => {
  test("converts to SvelteKit and reports written paths", () => {
    setupPreview();
    const r = convertPreview({ projectRoot: dir, framework: "sveltekit" });
    expect(r.framework).toBe("sveltekit");
    expect(r.componentsWritten.length).toBeGreaterThanOrEqual(3);
    expect(r.parsed.slots).toHaveLength(3);
    expect(existsSync(r.pageWritten)).toBe(true);
    expect(existsSync(r.layoutWritten)).toBe(true);
  });

  test("converts to Astro and reports written paths", () => {
    setupPreview();
    const r = convertPreview({ projectRoot: dir, framework: "astro" });
    expect(r.framework).toBe("astro");
    expect(existsSync(r.pageWritten)).toBe(true);
    expect(r.pageWritten).toContain("src/pages/index.astro");
  });

  test("throws when preview directory is missing", () => {
    expect(() =>
      convertPreview({ projectRoot: dir, framework: "sveltekit" })
    ).toThrow(/Preview directory not found/);
  });

  test("throws when preview has no slots", () => {
    const previewDir = join(dir, "halftone/preview");
    mkdirSync(previewDir, { recursive: true });
    writeFileSync(
      join(previewDir, "index.html"),
      "<!doctype html><html><head><title>x</title></head><body></body></html>",
      "utf-8"
    );
    writeFileSync(join(previewDir, "styles.css"), "", "utf-8");
    writeFileSync(join(previewDir, "motion.js"), "", "utf-8");
    expect(() =>
      convertPreview({ projectRoot: dir, framework: "sveltekit" })
    ).toThrow(/no data-slot sections/);
  });

  test("copies preview/fonts into static/fonts on SvelteKit", () => {
    const previewDir = setupPreview();
    const fontsDir = join(previewDir, "fonts/newsreader");
    mkdirSync(fontsDir, { recursive: true });
    writeFileSync(join(fontsDir, "newsreader-400.woff2"), "stub", "utf-8");
    const r = convertPreview({ projectRoot: dir, framework: "sveltekit" });
    expect(r.fonts.copied).toBe(1);
    expect(existsSync(join(dir, "static/fonts/newsreader/newsreader-400.woff2"))).toBe(true);
  });

  test("copies preview/fonts into public/fonts on Astro", () => {
    const previewDir = setupPreview();
    mkdirSync(join(previewDir, "fonts"), { recursive: true });
    writeFileSync(join(previewDir, "fonts/x.woff2"), "stub", "utf-8");
    const r = convertPreview({ projectRoot: dir, framework: "astro" });
    expect(r.fonts.copied).toBe(1);
    expect(existsSync(join(dir, "public/fonts/x.woff2"))).toBe(true);
  });

  test("Hero component contains the initBody verbatim", () => {
    setupPreview();
    convertPreview({ projectRoot: dir, framework: "sveltekit" });
    const hero = readFileSync(join(dir, "src/lib/components/Hero.svelte"), "utf-8");
    expect(hero).toContain("gsap.from('.x'");
  });
});
