import { spawn, type ChildProcess } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { mkdirSync } from "fs";
import {
  PREVIEW_DIR,
  PREVIEW_PID_FILE,
  PREVIEW_PORT,
  type PreviewServerHandle,
  type ServerRunner,
} from "./types";

export interface ServerOptions {
  projectRoot: string;
  port?: number;
  open?: boolean;
  resolveCommand?: (cmd: string) => string | null;
  spawnFn?: typeof spawn;
  openFn?: (url: string) => void;
}

export interface ResolvedRunner {
  runner: ServerRunner;
  command: string;
  args: (port: number, dir: string) => string[];
}

const RUNNER_PRIORITY: ResolvedRunner[] = [
  {
    runner: "bun",
    command: "bun",
    args: () => ["x", "serve", "--port", String(PREVIEW_PORT)],
  },
  {
    runner: "python3",
    command: "python3",
    args: (port, dir) => ["-m", "http.server", String(port), "--directory", dir],
  },
  {
    runner: "npx",
    command: "npx",
    args: (port) => ["--yes", "serve", "-l", String(port)],
  },
];

export function pickRunner(
  resolveCommand: (cmd: string) => string | null = which
): ResolvedRunner | null {
  for (const candidate of RUNNER_PRIORITY) {
    if (resolveCommand(candidate.command)) return candidate;
  }
  return null;
}

export function startServer(opts: ServerOptions): PreviewServerHandle {
  const port = opts.port ?? PREVIEW_PORT;
  const previewPath = join(opts.projectRoot, PREVIEW_DIR);
  if (!existsSync(previewPath)) {
    throw new Error(`Preview directory not found: ${previewPath}`);
  }

  killExistingPreview(opts.projectRoot);

  const resolved = pickRunner(opts.resolveCommand);
  if (!resolved) {
    throw new Error(
      "No supported server runner found. Install bun, python3, or npx."
    );
  }

  const spawner = opts.spawnFn ?? spawn;
  const child: ChildProcess = spawner(resolved.command, resolved.args(port, previewPath), {
    cwd: previewPath,
    stdio: "ignore",
    detached: true,
  });
  if (typeof child.unref === "function") child.unref();
  if (!child.pid) throw new Error("Failed to spawn preview server");

  writePid(opts.projectRoot, child.pid);

  const url = `http://localhost:${port}`;
  if (opts.open !== false) {
    (opts.openFn ?? openUrl)(url);
  }

  return { pid: child.pid, url, runner: resolved.runner, port };
}

export function killExistingPreview(projectRoot: string): boolean {
  const pidPath = join(projectRoot, PREVIEW_PID_FILE);
  if (!existsSync(pidPath)) return false;
  const raw = readFileSync(pidPath, "utf-8").trim();
  const pid = Number.parseInt(raw, 10);
  let killed = false;
  if (Number.isFinite(pid) && pid > 0) {
    try {
      process.kill(pid, "SIGTERM");
      killed = true;
    } catch {
      // process already gone
    }
  }
  try {
    unlinkSync(pidPath);
  } catch {
    // already removed
  }
  return killed;
}

function writePid(projectRoot: string, pid: number): void {
  const pidPath = join(projectRoot, PREVIEW_PID_FILE);
  mkdirSync(dirname(pidPath), { recursive: true });
  writeFileSync(pidPath, String(pid), "utf-8");
}

function which(cmd: string): string | null {
  const paths = (process.env.PATH ?? "").split(":");
  for (const p of paths) {
    const full = join(p, cmd);
    if (existsSync(full)) return full;
  }
  return null;
}

function openUrl(url: string): void {
  const platform = process.platform;
  const command =
    platform === "darwin" ? "open" :
    platform === "win32"  ? "start" :
                            "xdg-open";
  try {
    spawn(command, [url], { stdio: "ignore", detached: true }).unref();
  } catch {
    // best effort — if no opener, user can paste URL manually
  }
}
