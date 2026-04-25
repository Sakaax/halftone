import { describe, expect, test } from "bun:test";
import { ensureGitignore } from "../../../src/security/gitignore";
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("ensureGitignore", () => {
  test("creates .gitignore with Halftone entries when absent", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-gi-"));
    ensureGitignore(dir);
    const content = readFileSync(join(dir, ".gitignore"), "utf-8");
    expect(content).toContain("/halftone/.state.json");
    expect(content).toContain("/halftone/.keys");
    expect(content).toContain("/halftone/preview/");
    expect(content).toContain("/halftone/.preview-pid");
    rmSync(dir, { recursive: true, force: true });
  });

  test("appends without duplicating", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-gi-"));
    writeFileSync(join(dir, ".gitignore"), "node_modules/\n");
    ensureGitignore(dir);
    ensureGitignore(dir); // twice
    const content = readFileSync(join(dir, ".gitignore"), "utf-8");
    const occurrences = (content.match(/\/halftone\/\.state\.json/g) || []).length;
    expect(occurrences).toBe(1);
    rmSync(dir, { recursive: true, force: true });
  });

  test("preserves existing lines", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-gi-"));
    writeFileSync(join(dir, ".gitignore"), "dist/\n*.log\n");
    ensureGitignore(dir);
    const content = readFileSync(join(dir, ".gitignore"), "utf-8");
    expect(content).toContain("dist/");
    expect(content).toContain("*.log");
    rmSync(dir, { recursive: true, force: true });
  });
});
