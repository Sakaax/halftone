import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "fs";
import { join } from "path";
import type { Framework } from "../types";

export interface FontCopyResult {
  copied: number;
  destinationDir: string;
}

export function copyPreviewFonts(
  previewDir: string,
  projectRoot: string,
  framework: Framework
): FontCopyResult {
  const sourceDir = join(previewDir, "fonts");
  if (!existsSync(sourceDir)) {
    return { copied: 0, destinationDir: "" };
  }

  const destinationDir =
    framework === "sveltekit"
      ? join(projectRoot, "static/fonts")
      : join(projectRoot, "public/fonts");

  mkdirSync(destinationDir, { recursive: true });
  const copied = copyTree(sourceDir, destinationDir);
  return { copied, destinationDir };
}

function copyTree(src: string, dst: string): number {
  let count = 0;
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const dstPath = join(dst, entry);
    const st = statSync(srcPath);
    if (st.isDirectory()) {
      mkdirSync(dstPath, { recursive: true });
      count += copyTree(srcPath, dstPath);
    } else if (st.isFile()) {
      copyFileSync(srcPath, dstPath);
      count++;
    }
  }
  return count;
}
