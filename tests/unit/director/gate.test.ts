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

describe("assertCanWriteCode (v0.2 gates)", () => {
  test("throws when state is init", () => {
    initState(dir);
    expect(() => assertCanWriteCode(dir, "convert")).toThrow(StateGateViolationError);
  });
  test("throws when state is brief", () => {
    const s = initState(dir);
    s.current_step = "brief";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "convert")).toThrow();
  });
  test("throws when state is directions", () => {
    const s = initState(dir);
    s.current_step = "directions";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "convert")).toThrow();
  });
  test("throws when state is preview (still iterating)", () => {
    const s = initState(dir);
    s.current_step = "preview";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "convert")).toThrow();
  });
  test("passes when state is framework_chosen", () => {
    const s = initState(dir);
    s.current_step = "framework_chosen";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "convert")).not.toThrow();
  });
  test("passes when state is converted", () => {
    const s = initState(dir);
    s.current_step = "converted";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "code-fill")).not.toThrow();
  });
  test("passes when state is coded", () => {
    const s = initState(dir);
    s.current_step = "coded";
    writeState(dir, s);
    expect(() => assertCanWriteCode(dir, "audit")).not.toThrow();
  });
});
