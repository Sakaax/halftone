import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { StateSchema, type State } from "./schema";
import type { Step } from "../types";
import { StateGateViolationError } from "../types";

const STATE_PATH = "halftone/.state.json";

export function statePath(projectRoot: string): string {
  return join(projectRoot, STATE_PATH);
}

export function initState(projectRoot: string): State {
  const initial: State = {
    current_step: "init",
    history: [],
    framework_override: null,
    moodboard_source: null,
  };
  writeState(projectRoot, initial);
  return initial;
}

export function readState(projectRoot: string): State {
  const path = statePath(projectRoot);
  if (!existsSync(path)) {
    throw new Error(`State file not found: ${path}. Run /halftone to initialize.`);
  }
  const raw = readFileSync(path, "utf-8");
  return StateSchema.parse(JSON.parse(raw));
}

export function writeState(projectRoot: string, state: State): void {
  StateSchema.parse(state);
  const path = statePath(projectRoot);
  mkdirSync(join(projectRoot, "halftone"), { recursive: true });
  writeFileSync(path, JSON.stringify(state, null, 2), "utf-8");
}

export function transitionTo(projectRoot: string, next: Step, meta?: { chosen?: number }): State {
  const current = readState(projectRoot);
  const updated: State = {
    ...current,
    current_step: next,
    history: [
      ...current.history,
      {
        step: current.current_step,
        completed_at: new Date().toISOString(),
        ...(meta?.chosen !== undefined ? { chosen: meta.chosen } : {}),
      },
    ],
  };
  writeState(projectRoot, updated);
  return updated;
}

export function assertCanWriteCode(projectRoot: string, attempted: string): void {
  const state = readState(projectRoot);
  const allowed = ["locked", "scaffolded", "coded"];
  if (!allowed.includes(state.current_step)) {
    throw new StateGateViolationError(state.current_step, attempted);
  }
}
