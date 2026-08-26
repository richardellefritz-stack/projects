# Deploy Handoff Rule — MDX (monorepo) → Live static site (Drive)

**Status:** GO 2026-08-26
**Amends:** Surface Boundary Amendment 2026-08-26 (sole deploy origin = Drive static folder)

## Problem

Provenance-gate validates content in the monorepo. Production is a pure-static
site deployed from a Drive folder the gate cannot see. Copying reviewed MDX into
Drive without a recorded correspondence is the P001 failure mode: the artifact
shipped is not demonstrably the artifact reviewed.

## Rule

1. **No page ships to production unless** it exists as reviewed content in the
   monorepo under `apps/P007-smarter-acuity/` with a green provenance-gate on
   the commit that will be cited.

2. **Correspondence record (required on every deployed page):**
   - HTML comment in the deployed file, or visible footer line:
     `<!-- provenance: commit <full SHA> ; claims: CLM-… ; reviewed: <date> -->`
   - The SHA must be a commit on `main` (or a named RC tag) that contains the
     reviewed source for that page.

3. **Handoff steps**
   - [ ] Claim status and locators satisfy the gate for any load-bearing claim the
         page uses (CONFIRM passes if claims are `verified`).
   - [ ] Page MDX (or export) reviewed on a PR; PR merged to `main`.
   - [ ] Operator (or script under GO) copies the **exact** reviewed body into
         the Drive static folder path for that URL.
   - [ ] Insert provenance comment with the merge commit SHA.
   - [ ] Deploy via Wrangler from Drive only.
   - [ ] Spot-check live HTML contains the same SHA comment.

4. **Forbidden**
   - Editing production HTML in Drive without a new monorepo commit + new SHA.
   - Deploying monorepo `src/` directly to Cloudflare until Astro cut-over GO.
   - Treating Notion or chat as the review record.

5. **Astro cut-over**
   When Astro is the sole origin, this hand-off rule is retired by that GO;
   provenance moves to build-time embedding of commit SHA in the generated site.

## Operator signature

- [x] GO — Rich Ellefritz
- Date: 2026-08-26
