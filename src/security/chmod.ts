import { chmodSync, existsSync } from "fs";

export function chmod600(path: string): void {
  if (!existsSync(path)) throw new Error(`Cannot chmod: file not found: ${path}`);
  chmodSync(path, 0o600);
}
