# AGENTS.md — P007 SMARTER Acuity

Website + content pipeline deriving social posts, video assets, and dual living ebooks from a tiered source corpus and claims ledger. Nested rules here win for files under this directory. See root AGENTS.md for repo-wide rules.

## Current law (2026-09-02) — wins over dated calendar lines below

Screenwriter works from Heavy. Grok Bot is leverage. Screenwriter is always the final stamp.

Loop: Heavy drafts → Head Master runs Head Case / Jameson / Researchy / Librarian as named → production only on a named GO (Holds Status = Ready for GO, or Screenwriter in Grok Bot chat) → signed RECEIPT webhook back to Heavy. A webhook is not a GO. Webhook URLs and signing secrets never enter this repo.

Spine: month theme + one weekly living-fight thesis + daily pair interrogations. September = Architecture. W1 Rome / Colosseum / bread-and-circuses week is VOID. Pair names stay off the public surface.

Essays originate in Notion and leave only after Screenwriter KEEP + named GO. Repo agents never post and never deploy.

Superseded as going-forward calendar law: the 2026-08-27 line that W1 Colosseum is 1–12 September and Packet A occupies 6 September. First public day 1 September 2026 still happened; that week is not the month spine.

First-read outside git: Notion [LAW — Current iteration](https://app.notion.com/p/3d003ccbf1d4819da4b3efab7efd5122).

## Orientation
- Webpage-first dual-write: maintain working webpages → derive social posts (X + YouTube) and video assets → simultaneously advance the two living ebook manuscripts.
- Public system only. High-agency coaching layer is out of scope.
- No invented facts. Load-bearing claims on pages and books must trace to a Tier 1 or Tier 2 corpus source via the claims ledger, or be marked `TODO: SOURCE`. Captions and ledes follow `source/DECISION_2026-08-28_Public_Surface_Gates.md` and do not require a claim ID.
- Brand: SMARTER Acuity (display / products) / @SMARTER_Acuity (handle). Underscore only in the handle.

## Public surface gates (2026-08-28, Amendment A)

Standing law. Full text: `source/DECISION_2026-08-28_Public_Surface_Gates.md`.

Replaces Master Context v2.3 §4 for X captions, Instagram captions, YouTube titles, page ledes, and short-video scripts.

A public surface must clear all five: Relevant to a living reader · Informative · Helpful or inspiring or a defense shown in an object · Shareable · Source discipline without smothering. Dinner-table test is a hard fail.

G1 is not a news-cycle test and is not dated to 2026. Current fights, the last five to fifty years, and older history a non-specialist can still use all count. Fail is seminar fog with no takeaway. Fail is not “too old.”

Drafting may use free public URLs and the SMARTER Acuity Resources Notion page. Writing to `/corpus/` still needs operator GO. Repo agents never post and never deploy.

## Calendar, pairs, fallback (2026-08-26)

Standing law for the weekday cameras. Full text: `source/DECISION_2026-08-26_Weekday_Map_Fallback.md`. Machine-readable map: `src/content/weekday-map.ts`.

- One pair per public day, selected by weekday: Sun `science-sports`, Mon `math-motivation`, Tue `aesthetics-architecture`, Wed `reading-research`, Thu `technology-teaching`, Fri `environment-entertainment`, Sat `recreation-relaxation`. Morning A = first-named side. Evening B = reverse.
- The pair is two cameras on that week's living-fight thesis, not two new topics. When the pair does not sit on the week's thesis: weekly thesis → **that month's root** (do not hardcode Architecture) → how the pair advances or defends Western Civilization, or a sourced fact for that date.
- Monday A may use an original math puzzle (not clickbait, not copied) when math needs a door. A puzzle-as-problem may be invented. A world-fact may not.
- Secondary pair stays off unless the operator names a page and a `namedSpan`.
- A paragraph or essay may rest on one corpus source when later sentences elaborate meaning, context, application, or profundity. Statistics, quotations, dates, and factual claims still need a source or `TODO: SOURCE`.
- Amendment 2026-08-27 is **historical**. It is not going-forward September law. See Current law (2026-09-02) above.

## Production status (2026-08-25/26)

**Current public production** is the pure-static site at https://smarteracuity.com (and www), deployed via Wrangler as a Cloudflare Worker with static assets (`npx wrangler deploy`). DNSSEC is enabled.

**Sole deploy origin:** Google Drive static folder (see `DRIVE_POINTERS.md`). The monorepo does **not** deploy the public site until an explicit Astro cut-over GO.

**Notion** is the origin of essays and of named GOs. The Resources page is a drafting roster. See `source/DECISION_2026-08-26_Surface_Boundary_Amendment.md`.

This monorepo owns provenance, the claims ledger, content collections, and the intended future Astro + MDX pipeline. The pure-static site is the live public face; the monorepo is the source of truth for claims and the longer-term structured content system.

### Public page build

When constructing public webpages from essays, do not include internal project disclaimers such as "What this page does not claim" (heading or body). That material is internal (PREP, Drive, claims hygiene). Public HTML is essay body for readers only. Deploy Handoff provenance stays an HTML comment in View Source when required, not visible page copy. Do not restore the disclaimer on later ports.

## Provenance

Run `node tools/validate-provenance.mjs` before opening a PR. It refuses on ten rules; the table in `source/PROVENANCE.md` §6 says which are GATE, which are CONVENTION, and which stay with the operator.

R5 applies to page theses and ebook chapters. R5 does not apply to captions or ledes.

**`/corpus/` is read-only to agents.** Writing to it needs operator GO.

Publishing, merging to `main`, and any posting stay with the operator.

## Build / test / run

**Locked long-term site stack (2026-08-25):** Astro + MDX content collections.
- Content collections live under `src/content/`
- Pages under `src/pages/`

**Current production deploy (interim):** pure static via Wrangler from the Drive static folder only (see Production status and `DRIVE_POINTERS.md`). Do not deploy monorepo `src/` to production.

**Distribution scope (2026-08-25):**
- X and YouTube: automated / semi-automated allowed (always dry-run + operator GO)
- Instagram / Facebook: automated publishing is **out of scope** until Meta identity verification is resolved. Manual only for now.

Video toolchain and ebook toolchain remain open. Do not invent commands for them.

## Notes
- Prefer editing existing files over creating new ones.
- Production GO (merge to main, any external posting or deployment) remains with the human operator.
- Leave required checks green. All work proceeds via draft PRs.
