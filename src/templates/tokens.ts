import type { Direction } from "../direction/schema";
import { TokenUnresolvedError } from "../types";

const TOKEN_RE = /\{\{\s*tokens\.([a-z0-9.]+)\s*\}\}/gi;

function resolvePath(path: string, direction: Direction): string {
  const parts = path.split(".");
  if (parts[0] === "palette" && parts.length === 2) {
    const key = parts[1]! as keyof Direction["palette"];
    const v = direction.palette[key];
    if (v) return v;
  }
  if (parts[0] === "typography" && parts.length === 3) {
    const role = parts[1]! as keyof Direction["typography"];
    const attr = parts[2]!;
    const pair = direction.typography[role];
    if (pair && (attr === "family" || attr === "weight")) {
      return String(pair[attr]);
    }
  }
  if (parts[0] === "motion" && parts[1] === "language" && parts.length === 2) {
    return direction.motion.language;
  }
  throw new TokenUnresolvedError(path);
}

export function injectTokens(source: string, direction: Direction): string {
  return source.replace(TOKEN_RE, (_full, path: string) => resolvePath(path, direction));
}
