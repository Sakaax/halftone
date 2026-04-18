import type { PatternManifest, FrameworkEntry } from "./schema";
import type { Framework } from "../types";
import { SlotUnresolvedError } from "../types";

export function resolveSlotContent(
  manifest: PatternManifest,
  patternRef: string,
  framework: Framework
): FrameworkEntry {
  const slug = patternRef.split("@")[0];
  const pattern = manifest.patterns.find((p) => p.slug === slug);
  if (!pattern) {
    throw new SlotUnresolvedError("pattern", patternRef);
  }
  const entry = pattern.frameworks[framework];
  if (!entry) {
    throw new SlotUnresolvedError(`framework:${framework}`, patternRef);
  }
  return entry;
}
