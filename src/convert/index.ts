import { existsSync } from "fs";
import { join } from "path";
import type { Framework } from "../types";
import { parsePreview, type ParsedPreview } from "./parser";
import { convertToSvelteKit } from "./sveltekit";
import { convertToAstro } from "./astro";
import { copyPreviewFonts } from "./fonts";

export interface ConvertOptions {
  projectRoot: string;
  framework: Framework;
  previewDir?: string;
}

export interface ConvertResult {
  framework: Framework;
  componentsWritten: string[];
  pageWritten: string;
  layoutWritten: string;
  packageJsonUpdated: string;
  fonts: { copied: number; destinationDir: string };
  parsed: ParsedPreview;
}

export function convertPreview(opts: ConvertOptions): ConvertResult {
  const previewDir =
    opts.previewDir ?? join(opts.projectRoot, "halftone/preview");

  if (!existsSync(previewDir)) {
    throw new Error(`Preview directory not found: ${previewDir}`);
  }

  const parsed = parsePreview(previewDir);

  if (parsed.slots.length === 0) {
    throw new Error(
      `Preview has no data-slot sections — cannot convert. Re-run the preview phase.`
    );
  }

  const framework = opts.framework;
  const result =
    framework === "sveltekit"
      ? convertToSvelteKit(parsed, opts.projectRoot)
      : convertToAstro(parsed, opts.projectRoot);

  const fonts = copyPreviewFonts(previewDir, opts.projectRoot, framework);

  return {
    framework,
    componentsWritten: result.componentsWritten,
    pageWritten: result.pageWritten,
    layoutWritten: result.layoutWritten,
    packageJsonUpdated: result.packageJsonUpdated,
    fonts,
    parsed,
  };
}
