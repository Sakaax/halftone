import { existsSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { z } from "zod";

const UxBriefSchema = z.object({
  version: z.number(),
  audience: z.string(),
  site_goal: z.string(),
  sections: z.array(z.string()).optional(),
  ctas: z.array(z.string()).optional(),
});

export type UxBrief = z.infer<typeof UxBriefSchema>;

const UX_BRIEF_PATH = "ux-pilot/ux-brief.md";

export function hasUxBrief(projectRoot: string): boolean {
  return existsSync(join(projectRoot, UX_BRIEF_PATH));
}

export function readUxBrief(projectRoot: string): UxBrief | null {
  const path = join(projectRoot, UX_BRIEF_PATH);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  const parsed = matter(raw);
  return UxBriefSchema.parse(parsed.data);
}
