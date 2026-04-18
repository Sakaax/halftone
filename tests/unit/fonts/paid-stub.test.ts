import { describe, expect, test } from "bun:test";
import { writeReadmeFonts, PAID_FONTS } from "../../../src/fonts/paid-stub";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("PAID_FONTS", () => {
  test("includes PP Editorial New, Migra, GT America, PP Right Grotesk", () => {
    const families = PAID_FONTS.map((f) => f.family);
    expect(families).toContain("PP Editorial New");
    expect(families).toContain("Migra");
    expect(families).toContain("GT America");
    expect(families).toContain("PP Right Grotesk");
  });
});

describe("writeReadmeFonts", () => {
  test("writes README-fonts.md listing paid families actually in use", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-pf-"));
    writeReadmeFonts(dir, ["PP Editorial New"]);
    const path = join(dir, "halftone/README-fonts.md");
    expect(existsSync(path)).toBe(true);
    const raw = readFileSync(path, "utf-8");
    expect(raw).toContain("PP Editorial New");
    expect(raw).toContain("pangrampangram.com");
    expect(raw).toContain("pp-editorial-new-400.woff2");
    rmSync(dir, { recursive: true, force: true });
  });

  test("writes nothing when no paid fonts in use", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-pf-"));
    writeReadmeFonts(dir, []);
    expect(existsSync(join(dir, "halftone/README-fonts.md"))).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });
});
