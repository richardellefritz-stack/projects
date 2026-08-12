# Production Workflow

The gated production graph used for every product in this monorepo. Governed by [`docs/operating-baseline.md`](operating-baseline.md).

## The Graph

1. **Opportunity Sensing**
   Identify a candidate product: a market gap, an underserved niche, or a repeatable format with demonstrated demand. Output: a short opportunity doc under `docs/opportunities/`.

2. **Research**
   Validate and deepen the opportunity — audience, positioning, competitive landscape, source material. Primarily NotebookLM-driven, with Claude/Grok support as needed.

3. **Architecture**
   Define the concrete shape of the product: format, components, tech and tooling choices, deliverable structure, and the spec each generation agent works from.

   Two required outputs before generation begins:
   - **Entitlement design**, for any product with a paid tier — what gates access, how entitlement is verified, what failed verification does, and the known bypass surface (Agreement D).
   - **Frozen interface contract** for anything shared across workstreams: benchmark values, formulas, terminology, feature boundaries (Agreement E).

   Also initialise the deliverables manifest from [`docs/templates/deliverables-manifest.md`](templates/deliverables-manifest.md).

4. **Parallel Generation**
   Execution agents produce the product's components in parallel against the architecture spec and the frozen contract. Text is completed and frozen before figures, sales copy, or other derivatives are generated from it (Agreement F).

5. **Quality Gate**
   Review against the spec and rubric; decide continue, revise, escalate, or terminate.

   **The gate inspects built artifacts, not sources.** Comparing repository files to each other will pass a build that was never made from them. Where a built artifact does not yet exist, the gate reviews what does exist and records that limitation explicitly (Agreement G).

6. **Release Candidate**
   One named artifact set. For each deliverable: file path plus commit SHA, or deploy URL. This is the product.

   Two-sided sign-off, both required:
   - **Build identity** (Grok Build): the named artifact is what will actually ship, and it was built from the agreed source.
   - **Content and claims** (Claude): every claim made anywhere public is true of *this* artifact, verified by reading it — not the manuscript it came from.

   Deliverables manifest reconciled: anything not `built` and seen does not appear in sales copy. If the artifact changes after sign-off, claims are regenerated and the gate is re-run. Checklist: [`docs/templates/release-checklist.md`](templates/release-checklist.md).

7. **Productize**
   Package the signed-off artifact into a sellable deliverable: listing copy, pricing, distribution setup, purchase and delivery flow. Sales copy is generated from the release candidate and from nothing else.

8. **Distribute**
   Derivative channels — newsletter, podcast, slides, video. Corpus is the product, never the research behind it. Sequence channels by cost: cheapest first, add a channel only when the previous one shows traction.

9. **Feedback**
   Post-launch signal — sales, conversion, reviews, refunds — feeds back into Opportunity Sensing for the next cycle.

## Human Checkpoints

Kickoff, any stuck-loop or terminate escalation, Release Candidate sign-off, and final deliverable approval. All other stages run autonomously within the loop.
