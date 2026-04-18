import { readFileSync } from "fs";
import matter from "gray-matter";
import { DirectionSchema, type Direction } from "./schema";

export interface ParsedDirection {
  data: Direction;
  body: string;
}

export function parseDirection(path: string): ParsedDirection {
  const raw = readFileSync(path, "utf-8");
  const parsed = matter(raw);
  const data = DirectionSchema.parse(parsed.data);
  return { data, body: parsed.content };
}
