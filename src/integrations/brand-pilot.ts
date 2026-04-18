import { existsSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { z } from "zod";

const BrandKitSchema = z.object({
  version: z.number(),
  palette: z.record(z.string(), z.string()),
  typography: z.object({
    display: z.string(),
    body: z.string(),
  }),
  voice: z.string().optional(),
});

export type BrandKit = z.infer<typeof BrandKitSchema>;

const BRAND_KIT_PATH = "brand-pilot/brand-kit.md";

const BANNED_FONTS = [
  "Inter", "Arial", "Roboto", "Helvetica Neue",
  "Open Sans", "Lato", "Montserrat",
];

export function hasBrandKit(projectRoot: string): boolean {
  return existsSync(join(projectRoot, BRAND_KIT_PATH));
}

export function readBrandKit(projectRoot: string): BrandKit | null {
  const path = join(projectRoot, BRAND_KIT_PATH);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  const parsed = matter(raw);
  return BrandKitSchema.parse(parsed.data);
}

export function detectBannedFonts(kit: BrandKit): string[] {
  const used = [kit.typography.display, kit.typography.body];
  return BANNED_FONTS.filter((b) => used.includes(b));
}
