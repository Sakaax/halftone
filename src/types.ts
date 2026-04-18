export type Framework = "sveltekit" | "astro";

export type Format = "studio-landing" | "saas-premium" | "creative-portfolio";

export type MoodSlug =
  | "editorial-warm"
  | "brutalist-mono"
  | "swiss-editorial"
  | "organic-earth"
  | "y2k-glitch"
  | "dark-academic"
  | "soft-pastel-print";

export type SlotName = "hero" | "primary-motion" | "footer" | "cursor" | "transition";

export type Step =
  | "init"
  | "brief"
  | "directions"
  | "moodboard"
  | "locked"
  | "scaffolded"
  | "coded";

export type PatternSlot = "hero" | "text-reveal" | "transition" | "cursor" | "scroll-trigger" | "footer";

export type MoodboardSource = "img-pilot" | "fallback";

export type AuditResult = "pass" | "warn" | "fail";

export type AuditMode = "static" | "deep";

export interface PaletteTokens {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  border: string;
}

export interface TypographyPair {
  family: string;
  weight: number;
}

export interface TypographyTokens {
  display: TypographyPair;
  body: TypographyPair;
  mono: TypographyPair;
}

// Custom error classes
export class SlotUnresolvedError extends Error {
  constructor(public slot: string, public patternSlug?: string) {
    super(`Slot '${slot}' could not be resolved${patternSlug ? ` (pattern: ${patternSlug})` : ""}`);
  }
}

export class TokenUnresolvedError extends Error {
  constructor(public tokenPath: string) {
    super(`Token path '${tokenPath}' is not recognized`);
  }
}

export class FSScopeViolationError extends Error {
  constructor(public attemptedPath: string) {
    super(`Attempted write outside Halftone scope: ${attemptedPath}`);
  }
}

export class StateGateViolationError extends Error {
  constructor(public currentStep: Step, public attempted: string) {
    super(`Cannot perform '${attempted}' while state is '${currentStep}'`);
  }
}

export class PromptInjectionError extends Error {
  constructor(public source: string, public match: string) {
    super(`Potential prompt injection in ${source}: matched '${match}'`);
  }
}
