import { describe, expect, test } from "bun:test";
import { installHook, uninstallHook, scanForKeys } from "../../../src/security/precommit-hook";
import { mkdtempSync, rmSync, existsSync, statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";

describe("scanForKeys", () => {
  test("detects sk-... pattern", () => {
    const hits = scanForKeys("OPENAI_KEY=sk-abcdefghijklmnopqrstuvwxyz012345");
    expect(hits.length).toBeGreaterThan(0);
  });
  test("detects AIza... pattern", () => {
    const hits = scanForKeys("GOOGLE=AIzaSyAbcdefghijklmnopqrstuvwxyz01234567");
    expect(hits.length).toBeGreaterThan(0);
  });
  test("ignores clean text", () => {
    expect(scanForKeys("this is a brief about editorial-warm")).toHaveLength(0);
  });
});

describe("installHook / uninstallHook", () => {
  test("installs hook as .git/hooks/pre-commit with exec perms", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-ph-"));
    spawnSync("git", ["init"], { cwd: dir });
    installHook(dir);
    const hookPath = join(dir, ".git/hooks/pre-commit");
    expect(existsSync(hookPath)).toBe(true);
    const mode = statSync(hookPath).mode & 0o777;
    expect(mode & 0o100).toBe(0o100);
    rmSync(dir, { recursive: true, force: true });
  });

  test("uninstallHook removes it", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-ph-"));
    spawnSync("git", ["init"], { cwd: dir });
    installHook(dir);
    uninstallHook(dir);
    expect(existsSync(join(dir, ".git/hooks/pre-commit"))).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });
});
