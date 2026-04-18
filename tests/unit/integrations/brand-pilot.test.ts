import { describe, expect, test } from "bun:test";
import { readBrandKit, hasBrandKit, detectBannedFonts } from "../../../src/integrations/brand-pilot";
import { mkdtempSync, mkdirSync, rmSync, cpSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("brand-pilot integration", () => {
  test("hasBrandKit false when absent", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-bp-"));
    expect(hasBrandKit(dir)).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });

  test("readBrandKit parses clean kit", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-bp-"));
    mkdirSync(join(dir, "brand-pilot"), { recursive: true });
    cpSync("tests/fixtures/integrations/brand-kit.md", join(dir, "brand-pilot/brand-kit.md"));
    const kit = readBrandKit(dir);
    expect(kit).not.toBeNull();
    expect(kit!.typography.display).toBe("PP Editorial New");
    rmSync(dir, { recursive: true, force: true });
  });

  test("detectBannedFonts catches Inter", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-bp-"));
    mkdirSync(join(dir, "brand-pilot"), { recursive: true });
    cpSync("tests/fixtures/integrations/brand-kit-banned-font.md", join(dir, "brand-pilot/brand-kit.md"));
    const kit = readBrandKit(dir)!;
    const banned = detectBannedFonts(kit);
    expect(banned).toContain("Inter");
    rmSync(dir, { recursive: true, force: true });
  });
});
