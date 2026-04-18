import { resolve, relative } from "path";
import { FSScopeViolationError } from "../types";

const ALLOWED_PREFIXES = [
  "halftone/",
  "src/halftone-generated/",
  "src/lib/",
  "src/styles/",
  "src/routes/",
  "static/",
  "public/",
  "package.json",
  ".gitignore",
];

const DENIED_PREFIXES = [".git/", ".ssh/"];

export function assertWithinScope(projectRoot: string, target: string): void {
  const absRoot = resolve(projectRoot);
  const absTarget = resolve(target);
  const rel = relative(absRoot, absTarget);

  if (rel.startsWith("..") || rel.startsWith("/")) {
    throw new FSScopeViolationError(target);
  }

  for (const denied of DENIED_PREFIXES) {
    if (rel === denied.replace(/\/$/, "") || rel.startsWith(denied)) {
      throw new FSScopeViolationError(target);
    }
  }

  const isAllowed = ALLOWED_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? rel.startsWith(prefix) : rel === prefix
  );

  if (!isAllowed) {
    throw new FSScopeViolationError(target);
  }
}
