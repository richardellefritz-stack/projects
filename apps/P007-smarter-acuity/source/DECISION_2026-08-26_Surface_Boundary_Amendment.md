# Surface Boundary Amendment — 26 August 2026

**Status:** Operator GO required to take effect  
**Amends:** Operator GO 2026-08-25 (Surface Boundary)  
**Reason:** After the pure-static site went live at smarteracuity.com, Notion and the deployed site began to read as additional sources of truth. The original GO named two surfaces. This amendment names the third operational surface and limits Notion.

---

## Amendment A — Notion is status / coordination only

Notion may hold:

- status notes
- coordination checklists
- handoff summaries between agents and the operator
- non-binding working drafts clearly marked as such

Notion may **not** be treated as authoritative for:

- the master calendar or dual-ebook map
- tagging rules or controlled vocabulary
- the claims ledger or corpus
- deploy configuration or what is live on smarteracuity.com
- any Release Candidate or provenance decision

If a Notion page and a gated surface disagree, the gated surface governs. Notion must be corrected; the gated surface must not be rewritten to match Notion.

---

## Amendment B — Single deploy origin for the live site

Until an explicit **Astro cut-over GO**:

| Role | Surface |
|------|--------|
| **Sole deploy origin** for https://smarteracuity.com (and www) | Google Drive static folder `1kUOM5jAsACY_Oe67V26W8Y7VXoyrkrTJ` |
| Deploy method | Wrangler → Cloudflare Worker static assets |
| Monorepo `apps/P007-smarter-acuity/src/` | **Not** the live site. Draft content, schema, and future Astro home only |

Two origins must not both claim to feed the same production URL. Agents must not push monorepo HTML/MDX to production, and must not treat the live site as evidence that monorepo content has shipped.

When Astro cut-over is authorized, that GO will name the new single origin and retire the Drive static folder as production source in the same decision.

---

## Amendment C — Unchanged from 25 August GO

| Surface | Role |
|---------|------|
| **Drive (planning)** | Calendar, tagging rule, controlled vocabulary, tag change log. Outside provenance-gate. |
| **Monorepo (provenance)** | Corpus, claims ledger, citation crosswalk, MDX drafts, future Astro pipeline. Inside provenance-gate. |

This amendment does not move claims, corpus, or calendar authority.

---

## Operator signature

- [ ] GO — Rich Ellefritz  
- Date: _______________

Once checked, update `DRIVE_POINTERS.md` and `AGENTS.md` if any wording still implies Notion or dual deploy origins are authoritative.
