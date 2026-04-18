import { readFileSync } from "fs";
import { PatternManifestSchema, type PatternManifest } from "./schema";

export function loadManifest(path: string): PatternManifest {
  const raw = readFileSync(path, "utf-8");
  return PatternManifestSchema.parse(JSON.parse(raw));
}

export async function computeSha256(path: string): Promise<string> {
  const file = Bun.file(path);
  const buf = await file.arrayBuffer();
  const hash = new Bun.CryptoHasher("sha256");
  hash.update(buf);
  return hash.digest("hex");
}

export async function verifyPatternFile(path: string, expected: string): Promise<boolean> {
  try {
    const actual = await computeSha256(path);
    return actual === expected;
  } catch {
    return false;
  }
}
