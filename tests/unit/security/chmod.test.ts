import { describe, expect, test } from "bun:test";
import { chmod600 } from "../../../src/security/chmod";
import { mkdtempSync, rmSync, writeFileSync, statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("chmod600", () => {
  test("sets 0600 on existing file", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-chmod-"));
    const path = join(dir, "key.env");
    writeFileSync(path, "X=1");
    chmod600(path);
    const mode = statSync(path).mode & 0o777;
    expect(mode).toBe(0o600);
    rmSync(dir, { recursive: true, force: true });
  });

  test("throws on missing file", () => {
    expect(() => chmod600("/nonexistent/path/xyz")).toThrow();
  });
});
