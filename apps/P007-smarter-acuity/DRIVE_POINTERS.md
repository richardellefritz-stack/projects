# Drive Artifact Pointers — P007

Canonical planning artifacts live in Google Drive, outside provenance-gate,
per Operator GO 2026-08-25 (Surface Boundary). This file records where they
are. Do not copy their contents into the repo except where a ruling requires
a mirror.

| Artifact | Type | Drive file ID / URL | Last modified (UTC) |
|---|---|---|---|
| 12-Month Master Calendar & Dual-Ebook Map | Google Doc | `1hXxze27iYyDCx3G7WuHCcDOy_kBVxyyCSsxBtLMEhxU` | 2026-08-25T21:36:08Z |
| 12mo_Master_Calendar_2026-27.csv (derived) | text/csv | `1raim4s5ooduSCJRsrKAsJqt-Pr3u2wy2` | 2026-08-25T21:54:52Z |
| Dual-Pair Tagging Rule (v2.1) | Google Doc | `123XJixpvMtVbKJ_vPgLbmQoi11GvlVB4lhB0YVJx4L0` | 2026-08-25T22:13:10Z |
| Controlled Vocabulary (v2) | text/markdown | `1oa7J_hQzbQUUPA0IIyRu_dHYWMGjSAhH` | 2026-08-25T22:22:39Z |
| Tag Change Log | text/markdown | `1DnzhGOYvNM5M13BBS-_OAa6Vdoz3o5y2` | 2026-08-25T22:09:35Z |
| Surface Boundary GO | text/markdown | `1a_2dGi0cR7WRmJRADkP8Pyo8Y1YM4c_A` | 2026-08-25T22:30:22Z |
| **Live static website (current production)** | Google Drive folder | [Folder ID `1kUOM5jAsACY_Oe67V26W8Y7VXoyrkrTJ`](https://drive.google.com/drive/folders/1kUOM5jAsACY_Oe67V26W8Y7VXoyrkrTJ) | 2026-08-26 |

## Live Production (2026-08-25/26)

- **Public URLs:** https://smarteracuity.com and https://www.smarteracuity.com
- **Temporary Workers URL:** https://smarter-acuity.richardellefritz.workers.dev
- **Deploy method:** Wrangler + Cloudflare Worker static assets (from the Drive folder above). Future deploys: `npx wrangler deploy`
- **DNS:** Cloudflare zone, WHOIS privacy on, DNSSEC enabled 25 Aug 2026
- **Current stack:** pure static HTML/CSS/JS (Grok Build). Monorepo remains the home of provenance, claims ledger, and the intended future Astro + MDX migration.

Precedence: the Master Calendar **Doc** is canonical. The CSV is derived from
it and regenerated on change; if they diverge, the Doc governs.

Mirrored into the repo (per ruling 4): Controlled Vocabulary v2, as the source
of the content-collection schema enums. The Drive copy remains authoritative
for the human-readable rule; the mirror must be regenerated whenever the
version number here changes.

## Notes

- True Drive revision IDs are not yet captured (connector limitation). File ID + timestamp is the current anchor. Real revision IDs should be added before the first Release Candidate that cites the calendar.
- Citation crosswalk migration is deliberately **not** included here; it will follow the “verify-then-retire” sequence once a real CSV lands in the monorepo.
- The pure-static site in the Drive folder is the current public face. Do not treat the monorepo `src/` as the live site until an explicit Astro port + cut-over GO.
