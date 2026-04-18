import { describe, expect, test } from "bun:test";
import { parseDirection } from "../../src/direction/parser";
import { writeDirection } from "../../src/direction/writer";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("direction round-trip", () => {
  test("parse → write → parse produces identical data", () => {
    const src = parseDirection("tests/fixtures/direction/valid.md");
    const dir = mkdtempSync(join(tmpdir(), "halftone-rt-"));
    const out = join(dir, "direction.md");
    writeDirection(out, src.data, src.body);
    const reparsed = parseDirection(out);
    expect(reparsed.data).toEqual(src.data);
    rmSync(dir, { recursive: true, force: true });
  });
});
