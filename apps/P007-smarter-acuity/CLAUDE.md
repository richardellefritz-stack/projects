# CLAUDE.md — P007 SMARTER Acuity Orientation

You are Claude working inside the SMARTER Acuity project (P007) in the monorepo `richardellefritz-stack/projects`. Nested rules in this directory’s AGENTS.md win over the root AGENTS.md. Always read AGENTS.md first for day-to-day conventions.

## 1. Purpose, Scope & Goals

**Purpose**  
SMARTER Acuity is a public content system (and private high-agency coaching layer) that educates a general audience on the achievements of Western Civilization through rigorous, accessible, visually strong content. The public face (@SMARTER_Acuity) produces daily, high-accuracy material that scales across platforms. The private high-agency coaching layer is **out of scope** for this monorepo.

**Core content model (locked)**  
Webpage-first dual-write:
1. Create and maintain working website pages (≤5-minute read, primary-source grounded).
2. From those approved pages, derive social posts for X (@SMARTER_Acuity) and Instagram.
3. From the same pages, produce video assets (image + voiceover + text overlays).
4. Simultaneously advance two parallel living ebook manuscripts:
   - *The Triumph of Western Civilization* (14-chapter premium illustrated volume, higher price, richer illustration package)
   - *Why Western Civilization Works* (9-chapter companion focused on the permanent dual pairs)

**Scope of this monorepo project (P007)**  
- Website pages as the canonical content source  
- Automated (or semi-automated) derivation of social posts and video assets  
- Publishing pipeline to X and Instagram (never without operator GO)  
- Provenance of every claim back to controlled source ebooks  
- The multi-agent control plane itself

**Out of scope**  
Private coaching client work, Meta identity verification for restricted platforms, any live posting, deployment, or external side-effect without explicit human approval.

**Near-term goal**  
All socials ready + preferred automated process by / before 6 September 2026 launch (Science ↔ Sports under the September Architecture root).

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

**Source provenance (recoverable convention)**  
- The two ebooks exist as controlled copies under `source/ebooks/`.  
- `source/manifest.json` records the originating commit SHA (or equivalent) + copy timestamp.  
- Every generated asset must reference the relevant manifest entry.  
- Do not reach outside this project for source material once the copies exist.  
- Missing sources are marked `TODO: SOURCE`. Never invent claims or fill gaps.

**Non-negotiables**  
- No secrets in the repo.  
- No invented facts.  
- No external side-effects (posting, sending, deploying, purchasing) from agent action.  
- Prefer editing existing files over creating new ones.  
- Do not add dependencies without asking.

## 3. Current Status (2026-08-25)

- Directory layout (`apps/P007-smarter-acuity/`) and source model are locked.  
- Scaffold is live in draft PR #6 (CI green): https://github.com/richardellefritz-stack/projects/pull/6  
  - Contains nested AGENTS.md, this CLAUDE.md, source/ scaffold, and starter manifest.json.  
- Stack is not yet locked. Current team recommendation:  
  - Site: Astro + MDX content collections  
  - Video: FFmpeg + Node/TypeScript orchestration  
  - Posting: Official X API v2 + Meta Graph API (always dry-run + operator GO)  
- Website production uses Grok Build. First several working webpages are constructed manually to establish quality before automation.  
- Actual controlled copies of the ebooks and first content generation have not yet occurred. Manifest SHAs are currently null.  
- `TODO: SOURCE` CI gate is deferred until generated assets exist.

## 4. How Claude should work here

- Always begin by reading the nearest AGENTS.md (nested wins).  
- Treat the source provenance and “no invented facts” rules as binding.  
- When asked to generate content, pages, posts, or video scripts, require a valid manifest reference or mark `TODO: SOURCE`.  
- Prefer small, verifiable draft-PR increments.  
- Your strengths (technical inspection, refinement, careful review, structured thinking, second-brain synthesis) are expected to be applied to code, content structure, process documents, and Obsidian notes related to this project.  
- When collaborating with Grok or other agents, treat the monorepo as the single source of truth; do not rely on conversation memory alone.  
- For Obsidian second-brain work or cross-project synthesis, coordinate via the human or the designated multi-model loop; do not assume write access outside this project directory unless explicitly instructed.

This document is the durable orientation. Update it only when a demonstrated gap appears.
