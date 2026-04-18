import { describe, expect, test } from "bun:test";
import { readUxBrief, hasUxBrief } from "../../../src/integrations/ux-pilot";
import { mkdtempSync, mkdirSync, rmSync, cpSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("ux-pilot integration", () => {
  test("hasUxBrief returns false when absent", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-ux-"));
    expect(hasUxBrief(dir)).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });

  test("readUxBrief parses valid brief", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-ux-"));
    mkdirSync(join(dir, "ux-pilot"), { recursive: true });
    cpSync("tests/fixtures/integrations/ux-brief.md", join(dir, "ux-pilot/ux-brief.md"));
    const brief = readUxBrief(dir);
    expect(brief).not.toBeNull();
    expect(brief!.audience).toContain("indie dev");
    expect(brief!.sections).toContain("hero");
    rmSync(dir, { recursive: true, force: true });
  });

  test("readUxBrief returns null when absent", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-ux-"));
    expect(readUxBrief(dir)).toBeNull();
    rmSync(dir, { recursive: true, force: true });
  });
});
