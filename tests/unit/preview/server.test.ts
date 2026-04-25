import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, rmSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  pickRunner,
  startServer,
  killExistingPreview,
} from "../../../src/preview/server";
import { PREVIEW_DIR, PREVIEW_PID_FILE } from "../../../src/preview/types";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-srv-"));
  mkdirSync(join(dir, PREVIEW_DIR), { recursive: true });
  writeFileSync(join(dir, PREVIEW_DIR, "index.html"), "<!doctype html><html></html>", "utf-8");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("pickRunner", () => {
  test("prefers bun over python3 and npx when available", () => {
    const r = pickRunner(() => "/usr/local/bin/anything");
    expect(r?.runner).toBe("bun");
  });

  test("falls back to python3 if bun missing", () => {
    const r = pickRunner((cmd) => (cmd === "bun" ? null : "/usr/bin/python3"));
    expect(r?.runner).toBe("python3");
  });

  test("falls back to npx if bun and python3 missing", () => {
    const r = pickRunner((cmd) =>
      cmd === "bun" || cmd === "python3" ? null : "/usr/bin/npx"
    );
    expect(r?.runner).toBe("npx");
  });

  test("returns null when no runner is present", () => {
    const r = pickRunner(() => null);
    expect(r).toBeNull();
  });
});

describe("startServer", () => {
  test("writes PID and returns handle on a fake spawn", () => {
    const fakeSpawn = (() => ({
      pid: 99999,
      unref: () => {},
    })) as unknown as Parameters<typeof startServer>[0]["spawnFn"];

    const handle = startServer({
      projectRoot: dir,
      resolveCommand: () => "/fake/bun",
      spawnFn: fakeSpawn,
      openFn: () => {},
    });

    expect(handle.pid).toBe(99999);
    expect(handle.runner).toBe("bun");
    expect(handle.url).toBe("http://localhost:3737");
    expect(existsSync(join(dir, PREVIEW_PID_FILE))).toBe(true);
    expect(readFileSync(join(dir, PREVIEW_PID_FILE), "utf-8")).toBe("99999");
  });

  test("throws when preview directory is missing", () => {
    rmSync(join(dir, PREVIEW_DIR), { recursive: true, force: true });
    expect(() =>
      startServer({
        projectRoot: dir,
        resolveCommand: () => "/fake/bun",
        spawnFn: ((() => ({ pid: 1, unref: () => {} })) as unknown) as Parameters<typeof startServer>[0]["spawnFn"],
        openFn: () => {},
      })
    ).toThrow(/Preview directory not found/);
  });

  test("throws when no runner is resolvable", () => {
    expect(() =>
      startServer({
        projectRoot: dir,
        resolveCommand: () => null,
        spawnFn: ((() => ({ pid: 1, unref: () => {} })) as unknown) as Parameters<typeof startServer>[0]["spawnFn"],
        openFn: () => {},
      })
    ).toThrow(/No supported server runner/);
  });

  test("kills the previous preview before starting a new one", () => {
    writeFileSync(join(dir, PREVIEW_PID_FILE), "1234567890", "utf-8");

    const fakeSpawn = (() => ({
      pid: 42,
      unref: () => {},
    })) as unknown as Parameters<typeof startServer>[0]["spawnFn"];

    startServer({
      projectRoot: dir,
      resolveCommand: () => "/fake/bun",
      spawnFn: fakeSpawn,
      openFn: () => {},
    });

    expect(readFileSync(join(dir, PREVIEW_PID_FILE), "utf-8")).toBe("42");
  });
});

describe("killExistingPreview", () => {
  test("returns false when no PID file exists", () => {
    expect(killExistingPreview(dir)).toBe(false);
  });

  test("removes the PID file even if the process is gone", () => {
    writeFileSync(join(dir, PREVIEW_PID_FILE), "999999999", "utf-8");
    killExistingPreview(dir);
    expect(existsSync(join(dir, PREVIEW_PID_FILE))).toBe(false);
  });

  test("ignores garbage PID content", () => {
    writeFileSync(join(dir, PREVIEW_PID_FILE), "not-a-number\n", "utf-8");
    expect(() => killExistingPreview(dir)).not.toThrow();
    expect(existsSync(join(dir, PREVIEW_PID_FILE))).toBe(false);
  });
});
