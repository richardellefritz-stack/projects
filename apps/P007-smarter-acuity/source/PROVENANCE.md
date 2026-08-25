# Source Provenance Model — P007 SMARTER Acuity

Status: Installed.
Supersedes: the "controlled copies of the ebooks under `source/ebooks/`" language in
`CLAUDE.md` §2 and the corresponding section of the nested `AGENTS.md`.

Repo destination: `apps/P007-smarter-acuity/source/PROVENANCE.md`

---

## 1. Why this document exists

The original model made the two living manuscripts the provenance floor: every claim
traced back to *The Triumph of Western Civilization* or *Why Western Civilization Works*.
Those manuscripts are simultaneously derived from the approved website pages. A page
therefore cited a manuscript that was written from the page.

That is circular, and circular citation is the cheapest possible target. A hostile reader
does not need to engage a single historical argument to discredit the project — they only
need to show that the footnote points back at the author. For a project that deliberately
invites scrutiny and relies on scholarship cutting against the prevailing academic
interpretation, this is the failure that costs everything.

This model moves the floor underneath the manuscripts.

---

## 2. The three tiers

Every source in the corpus carries exactly one tier. Tier is a claim about *defensibility
under hostile reading*, not about agreement or quality.

### Tier 1 — Primary and quantitative

Archives, texts in their original language, national accounts, statistical series, patent
and publication counts, contemporaneous documents, datasets with published methodology.

**Test:** a critic who disagrees with the project must argue with the record itself, not
with an interpreter. Tier 1 is neutral ground.

### Tier 2 — Credentialed scholarship, heterodox on interpretation

Peer-reviewed work and university-press or major-trade monographs by credentialed
scholars whose *interpretation* runs against the prevailing academic reading, but whose
*standing* is not in dispute.

**Test — the credential must be nameable.** A Tier 2 entry is invalid unless the
`credentialing` field states the specific basis: peer review, university press, the
author's academic post, or an equivalent. If you cannot name the credential in one
sentence, the source is Tier 3. This is deliberately a hard edge; it is the discriminator
that keeps the tier honest.

This tier is where the project's actual edge lives.

### Tier 3 — Polemical and movement sources

Advocacy writing, movement publications, commentary, opinion, self-published argument.

**Permitted use:** framing, audience, rhetorical register, identifying which arguments are
live, locating leads to chase down into Tier 1 or Tier 2.

**Prohibited use:** supporting any factual claim. Tier 3 never load-bears. The validator
refuses it.

### The tier-3 trap, stated plainly

The realistic way this project gets hurt is not a wrong thesis. It is one page where a
Tier 3 source carries a factual claim that Tier 1 or Tier 2 could have carried. That page
becomes the page everyone quotes, and the fifty well-sourced pages beside it never get
read. The gate exists specifically to make that page impossible to publish.

---

## 3. Layer model

The claim is the unit of provenance, not the page.

```
  CORPUS (Tier 1/2/3) at /corpus/corpus.json   ← shared across P005/P007/P013
       ↓ cited by (source_id + locator)
  CLAIMS LEDGER at source/claims/claims.json   ← per-project, stable IDs
       ↓ consumed by (claim_id)
  PAGES (canonical derived output)
       ↓ derived from
  SECOND-ORDER: X posts, Instagram, video scripts, MANUSCRIPTS
```

Manuscripts are derived artifacts, identical in kind to a social post. They are never cited.

---

## 4. Anti-circularity rules (enforced)

**R1.** A claim's support[] may reference corpus entries only. Never pages, manuscripts, snapshots, or other claims.

**R2.** A corpus entry's local_path may never resolve inside a project's derived output tree. The validator rejects the entry.

**R3.** Manuscripts are derived artifacts in the manifest. They are never cited.

**R4.** A claim marked load_bearing: true requires at least one support entry whose source is Tier 1 or Tier 2. Tier 3 may accompany; it may never stand alone.

**R5.** A claim of kind: interpretive requires a non-empty contested_by (strongest mainstream counter-position) and a non-empty response.

---

## 5. Snapshots, freeze, and re-sync

A snapshot is a SHA-stamped, dated capture of a living manuscript. It is a *record*, never a *source*.

Each snapshot carries commit_sha, taken_at, freeze_until, and resync_state (fresh | stale | expired).

Null commit_sha is permitted only while derived[] is empty. The first derived artifact makes a null SHA a hard failure.

---

## 6. GATE / CONVENTION / WORD

Ten gates are enforced by tools/validate-provenance.mjs and the provenance-gate CI job:

| Code | Refuses when |
|---|---|
| R1 | Claim cites something that is not a corpus source |
| R2 | Corpus entry points at project-derived output |
| R4 | Load-bearing claim rests on Tier 3 alone |
| R5 | Interpretive claim does not name and answer its counter-position |
| TIER2 | Tier 2 entry has no nameable credential |
| LOCATOR | Unresolved locator on a claim not marked TODO: SOURCE |
| SNAP | Null / stale / expired snapshot under a publishable artifact |
| TODO | Unverified claim under a release-candidate |
| REF | Dangling claim or source ID |
| VOICE | Forbidden "X is not Y, it's Z" construction |
| CORPUS | Shared corpus moved since this project stamped it |

Writing to /corpus/ remains WORD-class (operator GO). The CORPUS gate detects mutation after the fact via sha256 pin.

---

## 7. Cross-project sharing

Corpus lives at monorepo root /corpus/. Ratified rule (2026-08-25):

> Project agents may **read** from the monorepo-root `/corpus/` (the approved shared Tier 1/2 provenance floor). They may not write to or mutate the corpus without explicit operator GO. They may not reach outside the monorepo for any other source material. Project-local living content and snapshots remain under the project directory.

---

## 8. Install sequence (completed)

1. /corpus/ with schema + seed at monorepo root.
2. source/claims/ with schema + seed.
3. source/manifest.json rewritten for derived output.
4. tools/validate-provenance.mjs + CI workflow.
5. CLAUDE.md and nested AGENTS.md updated.
6. source/ebooks/ retired; source/snapshots/ designated.
7. Content work may begin only after this PR is merged and provenance-gate is a required status check on main.
