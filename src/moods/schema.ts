import { z } from "zod";

const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$|^rgba?\(.+\)$/, "must be hex or rgba");

const TypographyPair = z.object({
  family: z.string().min(1),
  weights: z.array(z.number().int().min(100).max(900)).min(1),
});

const TypographyOption = z.object({
  display: TypographyPair,
  body: TypographyPair,
  mono: TypographyPair,
});

const MoodSlugEnum = z.enum([
  "editorial-warm",
  "brutalist-mono",
  "swiss-editorial",
  "organic-earth",
  "y2k-glitch",
  "dark-academic",
  "soft-pastel-print",
]);

export const MoodSchema = z.object({
  slug: MoodSlugEnum,
  name: z.string().min(1),
  description: z.string().min(1),
  palette: z.object({
    bg: HexColor,
    fg: HexColor,
    accent: HexColor,
    muted: HexColor,
    border: HexColor,
  }),
  typography_options: z.array(TypographyOption).min(1),
  fallback_assets_dir: z.string().min(1),
  motion_affinity: z.array(z.string()),
  format_affinity: z.array(z.enum(["studio-landing", "saas-premium", "creative-portfolio"])),
});

export type Mood = z.infer<typeof MoodSchema>;
