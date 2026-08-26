# CLAUDE.md — P007 SMARTER Acuity Orientation

You are Claude working inside the SMARTER Acuity project (P007) in the monorepo `richardellefritz-stack/projects`. Nested rules in this directory’s AGENTS.md win over the root AGENTS.md. Always read AGENTS.md first for day-to-day conventions.

## 1. Purpose, Scope & Goals

**Purpose**  
SMARTER Acuity is a public content system (and private high-agency coaching layer) that educates a general audience on the achievements of Western Civilization through rigorous, accessible, visually strong content. The public face (@SMARTER_Acuity) produces daily, high-accuracy material that scales across platforms. The private high-agency coaching layer is **out of scope** for this monorepo.

**Core content model (locked)**  
Webpage-first dual-write:
1. Create and maintain working website pages (≤5-minute read, primary-source grounded).
2. From those approved pages, derive social posts for X (@SMARTER_Acuity) and (when unblocked) other platforms.
3. From the same pages, produce video assets (image + voiceover + text overlays).
4. Simultaneously advance two parallel living ebook manuscripts:
   - *The Triumph of Western Civilization* (14-chapter premium illustrated volume, higher price, richer illustration package)
   - *Why Western Civilization Works* (9-chapter companion focused on the permanent dual pairs)

**Scope of this monorepo project (P007)**  
- Website pages as the canonical content source  
- Automated (or semi-automated) derivation of social posts and video assets  
- Publishing pipeline to X and YouTube (never without operator GO)  
- Provenance of every claim back to the tiered corpus and claims ledger  
- The multi-agent control plane itself

**Out of scope**  
Private coaching client work, Meta identity verification for restricted platforms, Instagram / Facebook automated publishing (until identity verification is resolved — manual only for now), any live posting, deployment, or external side-effect without explicit human approval.

**Near-term goal**  
All viable socials ready + preferred automated process by / before 6 September 2026 launch (Science ↔ Sports under the September Architecture root).

**Brand rule (locked)**  
- Display / product name: SMARTER Acuity or S.M.A.R.T.E.R. Acuity (no underscore)  
- Handle only: @SMARTER_Acuity  
Never use the underscore in prose, titles, website copy, ebook titles, or product names.

**Non-negotiable Human Voice Directive**  
Never use the construction “X is not Y, it’s Z” or “It’s not just X… it’s Y.” These are dead giveaways of LLM output. Write in a confident, grounded, natural human voice—like a passionate historian explaining to a smart friend. Favor concrete examples, historical progression, and clear stakes over formulaic antitheses.

## 2. Control-Plane Workflow (binding)

This is the first production project that fully exercises the multi-agent control plane designed around AGENTS.md.

**GATE vs CONVENTION**  
- True non-recoverable rules live in platform enforcement (branch protection, required CI checks, credential scoping).  
- AGENTS.md holds only recoverable conventions + orientation.  
- Expand AGENTS.md only when a demonstrated failure shows the current text is insufficient. Prefer deletion of unused rules.

**Shared state discipline**  
- Work on a feature branch.  
- Open a **draft** PR.  
- Leave required checks green. If a check fails and you cannot fix it, say so in the PR description rather than disabling or weakening the check.  
- The human reviews the actual artifact and CI logs, not a completion report.  
- Production “GO” (merge to main, any posting, any deployment) stays with the human operator.

**Source provenance (see `source/PROVENANCE.md` for the full model)**  
- The provenance floor is the tiered corpus at `/corpus/corpus.json` — Tier 1 primary and quantitative sources, Tier 2 credentialed scholarship heterodox on interpretation. Tier 3 polemical and movement sources are permitted for framing and never load-bear a factual claim.  
- The two ebooks are **derived outputs, not sources.** They are never cited. Versioned SHA-stamped snapshots live under `source/snapshots/` and exist to record which manuscript version an artifact corresponded to.  
- The unit of provenance is the **claim**, not the page. Claims carry stable IDs in `source/claims/claims.json` and cite corpus entries with a locator. Every derived artifact — page, post, video script, manuscript chapter — references claim IDs.  
- **Corpus access rule (ratified 2026-08-25).** Project agents may **read** from the monorepo-root `/corpus/` (the approved shared Tier 1/2 provenance floor). They may not write to or mutate the corpus without explicit operator GO. They may not reach outside the monorepo for any other source material. Project-local living content and snapshots remain under the project directory.  
- Missing sources are marked `TODO: SOURCE`. Never invent claims or fill gaps.  
- `tools/validate-provenance.mjs` is a required CI check and refuses violations. Do not weaken or skip it; if it fails and you cannot fix it, say so in the PR description.

**Non-negotiables**  
- No secrets in the repo.  
- No invented facts.  
- No external side-effects (posting, sending, deploying, purchasing) from agent action.  
- Prefer editing existing files over creating new ones.  
- Do not add dependencies without asking.

## 3. Current Status (2026-08-25)

- Directory layout (`apps/P007-smarter-acuity/`) is locked.  
- Provenance model installed (`source/PROVENANCE.md`); corpus, claims ledger, and validator landed before first content generation.  
- Snapshot SHAs are null and permitted to be null **only while `derived[]` is empty.** The first derived artifact makes a null SHA a hard CI failure.  
- Corpus and claims files are seeded, not populated. Seed bibliographic details are marked `operator-to-confirm` and must be checked against the sources themselves.  
- **Site stack locked (2026-08-25):** Astro + MDX content collections. Content under `src/content/`, pages under `src/pages/`. Exact build commands filled once the Astro project is scaffolded.  
- **Distribution scope (2026-08-25):** X and YouTube automated / semi-automated allowed (dry-run + operator GO). Instagram / Facebook automated publishing is **out of scope** until Meta identity verification is resolved — manual only.  
- Video toolchain and ebook toolchain remain open.  
- Website production uses Grok Build. First several working webpages are constructed manually to establish quality before automation.

## 4. How Claude should work here

- Always begin by reading the nearest AGENTS.md (nested wins).  
- Treat the source provenance and “no invented facts” rules as binding.  
- Before generating any page, post, or script: confirm each factual assertion resolves to a claim ID whose support is Tier 1 or Tier 2. Where it does not, write `TODO: SOURCE` and stop. Do not promote a Tier 3 source to cover a gap, and do not synthesize an unsourced node — gap identification and search targets are in lane; manufacture is not.  
- Prefer small, verifiable draft-PR increments.  
- Your strengths (technical inspection, refinement, careful review, structured thinking, second-brain synthesis) are expected to be applied to code, content structure, process documents, and Obsidian notes related to this project.  
- When collaborating with Grok or other agents, treat the monorepo as the single source of truth; do not rely on conversation memory alone.  
- For Obsidian second-brain work or cross-project synthesis, coordinate via the human or the designated multi-model loop; do not assume write access outside this project directory unless explicitly instructed.

This document is the durable orientation. Update it only when a demonstrated gap appears.
