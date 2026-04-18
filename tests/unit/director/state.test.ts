import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { readState, writeState, initState, transitionTo } from "../../../src/director/state";
import { mkdtempSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-state-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("state I/O", () => {
  test("initState creates a fresh state", () => {
    const s = initState(dir);
    expect(s.current_step).toBe("init");
    expect(s.history).toEqual([]);
    expect(existsSync(join(dir, "halftone/.state.json"))).toBe(true);
  });

  test("writeState then readState round-trips", () => {
    initState(dir);
    const s = readState(dir);
    s.current_step = "brief";
    writeState(dir, s);
    const s2 = readState(dir);
    expect(s2.current_step).toBe("brief");
  });

  test("transitionTo appends history", () => {
    initState(dir);
    transitionTo(dir, "brief");
    const s = readState(dir);
    expect(s.current_step).toBe("brief");
    expect(s.history).toHaveLength(1);
    expect(s.history[0]!.step).toBe("init");
  });
});
