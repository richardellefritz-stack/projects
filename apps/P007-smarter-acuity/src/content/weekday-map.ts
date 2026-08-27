/**
 * Weekday → dual-pair map — P007 SMARTER Acuity
 *
 * Standing law per Master Context v2–v2.3 and
 * source/DECISION_2026-08-26_Weekday_Map_Fallback.md (operator GO 2026-08-26).
 *
 * Page tags remain the undirected pair slug. Direction is a weave attribute.
 */

import { type PairSlug } from "./vocabulary";

export const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Undirected pair slug selected by weekday. Repeats every week. */
export const WEEKDAY_PAIR = {
  sunday: "science-sports",
  monday: "math-motivation",
  tuesday: "aesthetics-architecture",
  wednesday: "reading-research",
  thursday: "technology-teaching",
  friday: "environment-entertainment",
  saturday: "recreation-relaxation",
} as const satisfies Record<Weekday, PairSlug>;

export type WeekdayPair = (typeof WEEKDAY_PAIR)[Weekday];

/** First-named side leads the morning (A). Second-named side answers at evening (B). */
export const WEEKDAY_WEAVE = {
  sunday: { a: "Sci→Sports", b: "Sports→Sci" },
  monday: { a: "Math→Motivation", b: "Motivation→Math" },
  tuesday: { a: "Aesthetics→Architecture", b: "Architecture→Aesthetics" },
  wednesday: { a: "Reading→Research", b: "Research→Reading" },
  thursday: { a: "Technology→Teaching", b: "Teaching→Technology" },
  friday: { a: "Environment→Entertainment", b: "Entertainment→Environment" },
  saturday: { a: "Recreation→Relaxation", b: "Relaxation→Recreation" },
} as const satisfies Record<Weekday, { a: string; b: string }>;
