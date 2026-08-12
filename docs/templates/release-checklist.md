# Release Candidate Checklist — [Product]

Stage 6. Nothing is sold, listed, or publicly claimed until both sign-offs are complete.

## The named artifact

One artifact set. This is the product. Anything not listed here is not shipping.

| Deliverable | Path + commit SHA, or deploy URL |
|---|---|
| | |

If any line changes after sign-off, claims are regenerated and this checklist is re-run.

## Sign-off 1 — Build identity (Grok Build)

- [ ] Each artifact above is the file that will actually ship — not a working copy, not a prior build
- [ ] Each was built from the agreed source, at the stated commit
- [ ] No untracked or stale build is circulating under the same name
- [ ] Derivatives (figures, assets) were generated from the same source version as the text they accompany
- [ ] Deployed components are live at the stated URL and serve the same build

## Sign-off 2 — Content and claims (Claude)

- [ ] The artifact has been **read**, not inferred from source
- [ ] Every claim in public copy is true of this artifact: counts, contents, page and chapter numbers, feature lists
- [ ] Deliverables manifest reconciled — nothing claimed that is not `built` and seen
- [ ] `claims.md` checked: no outcome promises, no fabricated proof, protected figures carry their assumptions
- [ ] Required disclaimers present on the product page and in the artifact
- [ ] Cross-references inside the artifact resolve correctly
- [ ] Coverage limits stated: anything not verifiable by inspection is listed below for live testing

## Cannot be verified by inspection

Requires exercising the live product. Assign an owner.

| Item | How to verify | Owner |
|---|---|---|
| Free tier behaves as claimed | Load as anonymous visitor | |
| Paid unlock works end to end | Real transaction | |
| Bypass surfaces closed in the deployed build | Attempt each documented bypass | |

## Preconditions for listing activation

Hard blockers. The listing does not go live until every box is checked.

- [ ] Payment platform approved and live
- [ ] Environment variables set in production
- [ ] Purchase → delivery → unlock tested with a real transaction
- [ ] Refund policy published in full terms

> If entitlement verification is fail-closed, activating the listing before these are complete means buyers pay and receive nothing. Treat as a hard precondition, not a parallel task.

## Accepted limitations

Known gaps being shipped deliberately. Record them so they are decisions rather than oversights.

- 
