import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import matter from "gray-matter";
import { DirectionSchema, type Direction } from "./schema";

export function writeDirection(path: string, data: Direction, body: string): void {
  DirectionSchema.parse(data); // validate before write
  mkdirSync(dirname(path), { recursive: true });
  const content = matter.stringify(body, data);
  writeFileSync(path, content, { encoding: "utf-8" });
}
