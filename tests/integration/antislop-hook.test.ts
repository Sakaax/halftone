import { describe, expect, test } from "bun:test";
import { spawn } from "child_process";
import { join, resolve } from "path";

const HOOK = resolve(import.meta.dir, "../../hooks/antislop-check.ts");

interface RunOutcome {
  code: number;
  stdout: string;
  stderr: string;
}

function runHook(input: object): Promise<RunOutcome> {
  return new Promise((resolveP, rejectP) => {
    const child = spawn("bun", [HOOK], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", rejectP);
    child.on("exit", (code) => resolveP({ code: code ?? -1, stdout, stderr }));
    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

describe("antislop hook (subprocess)", () => {
  test("exit 0 when path is out of scope", async () => {
    const r = await runHook({
      tool_name: "Write",
      tool_input: {
        file_path: "/x/src/index.ts",
        content: 'body { font-family: "Inter"; }',
      },
    });
    expect(r.code).toBe(0);
    expect(r.stderr).toBe("");
  });

  test("exit 0 on a clean preview file", async () => {
    const r = await runHook({
      tool_name: "Write",
      tool_input: {
        file_path: "/x/halftone/preview/styles.css",
        content: `:root { --bg: #0F0E0C; }
body { font-family: 'Newsreader', serif; }`,
      },
    });
    expect(r.code).toBe(0);
    expect(r.stderr).toBe("");
  });

  test("exit 2 with violation in stderr on banned font", async () => {
    const r = await runHook({
      tool_name: "Write",
      tool_input: {
        file_path: "/x/halftone/preview/styles.css",
        content: 'body { font-family: "Inter", sans-serif; }',
      },
    });
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/violation:.*Inter/);
  });

  test("exit 2 on Tailwind default", async () => {
    const r = await runHook({
      tool_name: "Edit",
      tool_input: {
        file_path: "/x/halftone/preview/index.html",
        new_string: '<div class="bg-blue-500"></div>',
      },
    });
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/violation:.*Tailwind default/);
  });

  test("warning surfaces on stderr but exit 0", async () => {
    const r = await runHook({
      tool_name: "Write",
      tool_input: {
        file_path: "/x/halftone/preview/motion.js",
        content: 'gsap.to(".x", { y: 100 });',
      },
    });
    expect(r.code).toBe(0);
    expect(r.stderr).toMatch(/warning:.*prefers-reduced-motion/);
  });

  test("exit 0 on malformed JSON input", async () => {
    const r = await new Promise<RunOutcome>((resolveP, rejectP) => {
      const child = spawn("bun", [HOOK], { stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));
      child.on("error", rejectP);
      child.on("exit", (code) => resolveP({ code: code ?? -1, stdout, stderr }));
      child.stdin.write("not json at all");
      child.stdin.end();
    });
    expect(r.code).toBe(0);
  });

  test("exit 0 on missing tool_input", async () => {
    const r = await runHook({ tool_name: "Write" });
    expect(r.code).toBe(0);
  });
});
