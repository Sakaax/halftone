import { z } from "zod";

const FrameworkEntrySchema = z.object({
  entry: z.string().min(1),
  sha256: z.string().min(1),
  deps: z.array(z.string()),
});

const PatternEntrySchema = z.object({
  slug: z.string().regex(/^[a-z-]+\/[a-z0-9-]+$/),
  slot: z.enum(["hero", "primary-motion", "footer", "cursor", "transition"]),
  frameworks: z
    .object({
      sveltekit: FrameworkEntrySchema,
      astro: FrameworkEntrySchema,
    })
    .strict(),
  tokens_required: z.array(z.string()),
  motion_tags: z.array(z.string()),
  mood_compat: z.array(z.enum([
    "editorial-warm", "brutalist-mono", "swiss-editorial",
    "organic-earth", "y2k-glitch", "dark-academic", "soft-pastel-print",
  ])),
});

export const PatternManifestSchema = z.object({
  version: z.literal(1),
  generated_at: z.string().datetime(),
  patterns: z.array(PatternEntrySchema),
});

export type PatternManifest = z.infer<typeof PatternManifestSchema>;
export type PatternEntry = z.infer<typeof PatternEntrySchema>;
export type FrameworkEntry = z.infer<typeof FrameworkEntrySchema>;
