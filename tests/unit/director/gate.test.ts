import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { assertCanWriteCode, initState, writeState } from "../../../src/director/state";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { StateGateViolationError } from "../../../src/types";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-gate-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("assertCanWriteCode", () => {
  test("throws when state is init", () => {
    initState(dir);
    expect(() => assertCanWriteCode(dir, "scaffold")).toThrow(StateGateViolationError);
  });
  test("throws when state is brief", () => {
    const s = initState(dir);
    s.current_step = "brief";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "scaffold")).toThrow();
  });
  test("passes when state is locked", () => {
    const s = initState(dir);
    s.current_step = "locked";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "scaffold")).not.toThrow();
  });
  test("passes when state is scaffolded", () => {
    const s = initState(dir);
    s.current_step = "scaffolded";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "code-fill")).not.toThrow();
  });
});
