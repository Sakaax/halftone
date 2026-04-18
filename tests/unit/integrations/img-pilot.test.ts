import { describe, expect, test } from "bun:test";
import { hasImgPilotConfig, isImgPilotAvailable } from "../../../src/integrations/img-pilot";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("img-pilot detection", () => {
  test("hasImgPilotConfig false when config absent", () => {
    const home = mkdtempSync(join(tmpdir(), "halftone-home-"));
    expect(hasImgPilotConfig(home)).toBe(false);
    rmSync(home, { recursive: true, force: true });
  });

  test("hasImgPilotConfig true when config present", () => {
    const home = mkdtempSync(join(tmpdir(), "halftone-home-"));
    mkdirSync(join(home, ".config/img-pilot"), { recursive: true });
    writeFileSync(join(home, ".config/img-pilot/config.toml"), "# stub");
    expect(hasImgPilotConfig(home)).toBe(true);
    rmSync(home, { recursive: true, force: true });
  });

  test("isImgPilotAvailable returns boolean", async () => {
    // result depends on environment; assert it doesn't throw
    const result = await isImgPilotAvailable();
    expect(typeof result).toBe("boolean");
  });
});
