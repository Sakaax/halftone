import { z } from "zod";

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
