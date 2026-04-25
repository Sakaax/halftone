import { z } from "zod";

const StepEnum = z.enum([
  "init", "brief", "directions", "preview",
  "framework_chosen", "converted", "coded",
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
  chosen_direction: z.number().int().min(1).max(3).nullable(),
  framework_choice: z.enum(["sveltekit", "astro"]).nullable(),
});

export type State = z.infer<typeof StateSchema>;

export const BriefSchema = z.object({
  version: z.literal(2),
  created_at: z.string().datetime(),
  feeling: z.string().min(1).max(40),
  loved_site: z.object({
    url: z.string().url(),
    why: z.string().min(1).max(40),
  }),
  non_negotiable: z.string().min(1).max(200),
  format: z.enum(["studio-landing", "saas-premium", "creative-portfolio"]),
  has_existing_ux_brief: z.boolean(),
  has_existing_brand_kit: z.boolean(),
});

export type Brief = z.infer<typeof BriefSchema>;
