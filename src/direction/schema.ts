import { z } from "zod";

const HexOrRgba = z.string().regex(/^#[0-9a-fA-F]{6}$|^rgba?\(.+\)$/);

const PaletteSchema = z.object({
  bg: HexOrRgba, fg: HexOrRgba, accent: HexOrRgba,
  muted: HexOrRgba, border: HexOrRgba,
});

const TypographyPairSchema = z.object({
  family: z.string().min(1),
  weight: z.number().int().min(100).max(900),
});

const TypographyTokensSchema = z.object({
  display: TypographyPairSchema,
  body: TypographyPairSchema,
  mono: TypographyPairSchema,
});

const PatternRefSchema = z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+@sha256:[a-z0-9]+$/);

const MotionPatternsSchema = z
  .object({
    hero: PatternRefSchema,
    "primary-motion": PatternRefSchema,
    footer: PatternRefSchema,
    cursor: PatternRefSchema.optional(),
    transition: PatternRefSchema.optional(),
  })
  .strict();

const MoodboardSchema = z.object({
  source: z.enum(["img-pilot", "fallback"]),
  paths: z.array(z.string()).length(6),
});

export const DirectionSchema = z.object({
  version: z.literal(1),
  mood: z.enum([
    "editorial-warm", "brutalist-mono", "swiss-editorial",
    "organic-earth", "y2k-glitch", "dark-academic", "soft-pastel-print",
  ]),
  format: z.enum(["studio-landing", "saas-premium", "creative-portfolio"]),
  framework: z.enum(["sveltekit", "astro"]),
  palette: PaletteSchema,
  typography: TypographyTokensSchema,
  motion: z.object({
    language: z.string().min(1),
    patterns: MotionPatternsSchema,
  }),
  moodboard: MoodboardSchema,
  locked_at: z.string().datetime(),
});

export type Direction = z.infer<typeof DirectionSchema>;
