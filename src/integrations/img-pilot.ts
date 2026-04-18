import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export function hasImgPilotConfig(home: string = homedir()): boolean {
  return existsSync(join(home, ".config/img-pilot/config.toml"));
}

export async function isImgPilotCliAvailable(): Promise<boolean> {
  try {
    const proc = Bun.spawn(["bunx", "img-pilot", "--version"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
}

export async function isImgPilotAvailable(home: string = homedir()): Promise<boolean> {
  if (!hasImgPilotConfig(home)) return false;
  return await isImgPilotCliAvailable();
}
