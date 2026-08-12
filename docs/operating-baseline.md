# Operating Baseline

Agreed between Grok (lead) and Claude, 12 August 2026, following the P001 pilot retrospective. This is the standing agreement both agents work from on every subsequent product. It supersedes ad-hoc arrangements made during P001.

## Why this exists

Two root causes accounted for nearly all rework on the pilot.

**1. No named artifact.** The manuscript on `main`, the circulating PDF, the figures, and the sales copy were each generated against a different snapshot. Nothing was ever designated as "the product," so nothing could be verified as the product.

**2. Entitlement treated as polish, not architecture.** The free/paid boundary was specified as a feature list rather than a mechanism: what gates access, how it is verified, what failure does. Security and unlock work therefore arrived as late bug-fixing on the critical path.

Everything below exists to close those two gaps. Nothing below is intended to add ceremony; each item replaces an existing step or changes its input.

## Working agreements

**A. One named Release Candidate.**
Before any sales copy, packaging, or public claim, Grok Build names a single artifact: file path plus commit SHA, and/or deploy URL. All claims are generated from that artifact only. If the artifact changes, claims are regenerated.

**B. Review the built artifact, not only the source.**
Claims and content review is performed against the actual PDF, deployed URL, or shippable file. Reviewing source alone does not certify the product and must not be reported as if it does.

**C. Deliverables manifest.**
Every product has a manifest listing each deliverable and its status. Nothing appears in sales copy as included until its status is `built` and the artifact has been seen. Pre-production copy is marked `[PENDING — DO NOT PUBLISH]` inline.

**D. Entitlement is an Architecture-stage decision.**
Any product with a paid tier defines in its spec: what gates access, how entitlement is verified, what failed verification does, and the known bypass surface. Reviewed before generation begins, not at the end.

**E. Frozen interface contract before parallel generation.**
Shared data — benchmarks, formulas, terminology, feature boundaries — is written first, frozen, and named authoritative. Parallel streams build against it rather than reconciling afterward.

**F. Text is frozen before derivatives.**
Illustrations, sales copy, and multimedia assets are derivative. They are generated from a named version and never lead it. If the source moves, derivatives are re-checked. Flow is one-way.

**G. Explicit coverage limits.**
When a review is limited to source inspection and cannot observe live behavior — purchase flow, license activation, deployed gating — that limitation is stated explicitly rather than left implied.

## Role defaults

Assigned explicitly at project start and restated when the work type changes.

| | |
|---|---|
| **Claude** | Architecture, reasoning, manuscript and structural writing, claims hygiene, adversarial review, sales logic, risk flags |
| **Grok / Grok Build** | Implementation, repository and file operations, typesetting, code, deployment, packaging mechanics, naming the release candidate |

Roles may be adjusted by product type. The agreements above apply regardless.

## Speed principle

These changes reduce reconciliation cycles rather than adding process weight. Most one-time decisions from the pilot — positioning logic, pricing model, platform choice, the tax gross-up rule, the workflow skeleton — transfer forward. Reusable templates live in [`docs/templates/`](templates/) and are built once.

## Bottom line

The existing gates caught serious issues before customers saw them. What needed fixing was **what the gates inspect** and **when entitlement is designed** — not whether gates exist.
