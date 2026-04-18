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

const StepEnum = z.enum([
  "init", "brief", "directions", "moodboard",
  "locked", "scaffolded", "coded",
]);

export const StateSchema = z.object({
  current_step: StepEnum,
  history: z.array(
    z.object({
      step: StepEnum,
      completed_at: z.string().datetime(),
      chosen: z.number().int().optional(),
    })
  ),
  framework_override: z.enum(["sveltekit", "astro"]).nullable(),
  moodboard_source: z.enum(["img-pilot", "fallback"]).nullable(),
});

export type State = z.infer<typeof StateSchema>;

export const BriefSchema = z.object({
  version: z.literal(1),
  created_at: z.string().datetime(),
  audience: z.string().min(1),
  site_goal: z.string().min(1),
  mood_preference: z.union([
    z.enum([
      "editorial-warm", "brutalist-mono", "swiss-editorial",
      "organic-earth", "y2k-glitch", "dark-academic", "soft-pastel-print",
    ]),
    z.literal("surprise-me"),
  ]),
  format: z.enum(["studio-landing", "saas-premium", "creative-portfolio"]),
  has_existing_ux_brief: z.boolean(),
  has_existing_brand_kit: z.boolean(),
});

export type Brief = z.infer<typeof BriefSchema>;
