import { describe, expect, test } from "bun:test";
import { spawnSync } from "child_process";

function runCLI(args: string[]): { stdout: string; stderr: string; code: number } {
  const res = spawnSync("bun", ["src/index.ts", ...args], { encoding: "utf-8" });
  return { stdout: res.stdout ?? "", stderr: res.stderr ?? "", code: res.status ?? 1 };
}

describe("CLI dispatcher", () => {
  test("--version prints version", () => {
    const r = runCLI(["--version"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("0.1.0");
  });

  test("mood list prints 7 moods", () => {
    const r = runCLI(["mood", "list"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/editorial-warm/);
    expect(r.stdout).toMatch(/brutalist-mono/);
  });

  test("unknown command exits 1", () => {
    const r = runCLI(["bogus"]);
    expect(r.code).toBe(1);
  });
});
