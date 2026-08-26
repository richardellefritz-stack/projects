/**
 * Controlled Vocabulary — P007 SMARTER Acuity
 *
 * Mirror of the Drive-locked Controlled Vocabulary (v2).
 * Drive copy remains authoritative for the human-readable rule.
 * This file is the source of truth for build-time enums and schema.
 *
 * Regenerate / update this file whenever the Drive vocabulary version changes.
 * See DRIVE_POINTERS.md and Operator GO 2026-08-25 (Surface Boundary).
 */

/** The 12 canonical monthly-root slugs (without the `root:` prefix). */
export const ROOTS = [
  "architecture",
  "philosophy",
  "politics-law",
  "religion-myth",
  "science-time",
  "love-literature",
  "war-strategy",
  "technology-discovery",
  "art-music",
  "exploration",
  "liberty-revolution",
  "economics-markets",
] as const;

export type RootSlug = (typeof ROOTS)[number];

/** The 7 canonical dual-pair slugs (undirected, without the `pair:` prefix). */
export const PAIRS = [
  "science-sports",
  "reading-research",
  "math-motivation",
  "aesthetics-architecture",
  "technology-teaching",
  "environment-entertainment",
  "recreation-relaxation",
] as const;

export type PairSlug = (typeof PAIRS)[number];

/** Full namespaced tag forms required by the Tagging Rule. */
export const ROOT_TAGS = ROOTS.map((r) => `root:${r}` as const);
export const PAIR_TAGS = PAIRS.map((p) => `pair:${p}` as const);

export type RootTag = (typeof ROOT_TAGS)[number];
export type PairTag = (typeof PAIR_TAGS)[number];
