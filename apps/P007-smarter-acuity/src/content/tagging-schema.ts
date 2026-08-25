/**
 * Dual-Pair Tagging Schema — P007 SMARTER Acuity
 *
 * Encodes Dual-Pair Tagging Rule v2.1 as a Zod schema.
 * Intended for use in Astro content collection `schema` once the site is scaffolded.
 *
 * Rules enforced:
 * - Exactly one monthly root (from controlled vocabulary)
 * - Exactly one primary dual pair (from controlled vocabulary)
 * - Optional secondary dual pair
 * - If secondary is present, a namedSpan (string) is required
 * - Direction is a weave/asset concern, not part of the page tag
 */

import { z } from "zod";
import { ROOTS, PAIRS } from "./vocabulary";

const rootSchema = z.enum(ROOTS);
const pairSchema = z.enum(PAIRS);

/**
 * Core frontmatter / page-tag schema.
 * Use as the base for the Astro content collection schema.
 */
export const pageTagSchema = z
  .object({
    /** Monthly root slug (without `root:` prefix). */
    root: rootSchema,

    /** Primary dual-pair slug (without `pair:` prefix). Undirected. */
    primaryPair: pairSchema,

    /** Optional secondary dual-pair slug. */
    secondaryPair: pairSchema.optional(),

    /**
     * Required when secondaryPair is present.
     * Names the block/anchor within the page that accumulates to the secondary pair chapter.
     * Prevents whole-page duplication across ebook chapters.
     */
    namedSpan: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.secondaryPair !== undefined && !data.namedSpan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "secondaryPair requires a namedSpan (the specific block that accumulates to the secondary dual-pair chapter)",
        path: ["namedSpan"],
      });
    }
    if (data.namedSpan !== undefined && data.secondaryPair === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "namedSpan is only valid when secondaryPair is also present",
        path: ["namedSpan"],
      });
    }
    if (
      data.secondaryPair !== undefined &&
      data.secondaryPair === data.primaryPair
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "secondaryPair must be different from primaryPair",
        path: ["secondaryPair"],
      });
    }
  });

export type PageTags = z.infer<typeof pageTagSchema>;

/**
 * Helper: produce the full namespaced tags for logging / display.
 */
export function toNamespacedTags(tags: PageTags) {
  return {
    root: `root:${tags.root}` as const,
    primaryPair: `pair:${tags.primaryPair}` as const,
    secondaryPair: tags.secondaryPair
      ? (`pair:${tags.secondaryPair}` as const)
      : undefined,
    namedSpan: tags.namedSpan,
  };
}
