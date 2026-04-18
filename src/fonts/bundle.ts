import { existsSync, copyFileSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

export function familyToSlug(family: string): string {
  return family.toLowerCase().replace(/\s+/g, "-");
}

export interface FontRequest {
  family: string;
  weight: number;
}

export interface BundleOptions {
  projectRoot: string;
  pluginRoot: string;
  families: FontRequest[];
}

export function bundleFonts(opts: BundleOptions): string[] {
  const copied: string[] = [];
  for (const { family } of opts.families) {
    const slug = familyToSlug(family);
    const srcDir = join(opts.pluginRoot, "fonts", slug);
    if (!existsSync(srcDir)) continue;
    const destDir = join(opts.projectRoot, "static/fonts", slug);
    mkdirSync(destDir, { recursive: true });
    for (const file of readdirSync(srcDir)) {
      if (!file.endsWith(".woff2")) continue;
      copyFileSync(join(srcDir, file), join(destDir, file));
      copied.push(join(destDir, file));
    }
  }
  return copied;
}
