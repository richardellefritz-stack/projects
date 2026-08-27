# Weekday Pair Map, Fallback Chain, and September Cadence

**Status:** GO 2026-08-26
**Operator:** Rich Ellefritz
**Amends:** Planning practice only. Does not repeal provenance-gate, Open Load-Bearing, Surface Boundary, or Deploy Handoff.
**Why this file exists:** Master Context v2–v2.3 already locked the weekday pair table (6 August 2026). The 25 August Calendar Doc, Tagging Rule v2.1, and live `/system` page did not reprint it. Agents then treated daily rotation as missing. Nested `AGENTS.md` says expand only after a demonstrated failure. This is that failure.

---

## 1. Weekday pair map (standing law)

One public day occupies exactly one undirected pair from the controlled vocabulary. The day of the week selects the pair. The map repeats every week, every month.

| Weekday | Pair slug | Morning A (weave) | Evening B (weave) |
|---|---|---|---|
| Sunday | `science-sports` | Sci→Sports | Sports→Sci |
| Monday | `math-motivation` | Math→Motivation | Motivation→Math |
| Tuesday | `aesthetics-architecture` | Aesthetics→Architecture | Architecture→Aesthetics |
| Wednesday | `reading-research` | Reading→Research | Research→Reading |
| Thursday | `technology-teaching` | Technology→Teaching | Teaching→Technology |
| Friday | `environment-entertainment` | Environment→Entertainment | Entertainment→Environment |
| Saturday | `recreation-relaxation` | Recreation→Relaxation | Relaxation→Recreation |

Machine-readable copy: `src/content/weekday-map.ts`.
Page tags stay undirected (`pair:science-sports`). Direction is a weave/asset attribute, per Tagging Rule v2.1 Amendment 2.

---

## 2. Fallback chain (standing law)

When a day's pair does not sit naturally on that week's arc:

1. Weekly arc
2. **That month's root** (never hardcode Architecture)
3. How the pair advances or defends Western Civilization, or a sourced historically relevant fact for that date

September root = Architecture. October root = Philosophy. Thereafter follow the 12-Month Master Calendar Doc.

---

## 3. Monday-morning math device

If Monday A needs a door that the weekly arc and the monthly root do not already open, write an original math puzzle for the Math side.

- Original. Not a recycled feed puzzle.
- No clickbait. No “only 1% can solve this.”
- Optional, not mandatory on every Monday.
- A puzzle-as-problem may be invented. A claim about the world may not.
- Evening B (Motivation→Math) may answer the morning puzzle.

---

## 4. Cadence and September 2026 windows

- Daily dual-write, always. Morning A, evening B. Two pages per public day.
- Launch: Sunday 6 September 2026.
- September windows (locked; W4 clipped):
  - W1 Colosseum: 2026-09-06 → 2026-09-12
  - W2 Sports Arenas: 2026-09-13 → 2026-09-19
  - W3 Concert Halls: 2026-09-20 → 2026-09-26
  - W4 Libraries: 2026-09-27 → 2026-09-30 only
- 1–3 October are not Architecture. October root is Philosophy.
- 6–30 September = 25 days = 50 page slots.

---

## 5. September 2026 pair calendar

Substance on 7–30 September remains unassigned until a later packet. Sources folder for September Architecture is empty as of 26 August 2026. This table assigns **pairs only**.

| Date | Weekday | Pair | Arc |
|---|---|---|---|
| 2026-09-06 | Sun | science-sports | Colosseum |
| 2026-09-07 | Mon | math-motivation | Colosseum |
| 2026-09-08 | Tue | aesthetics-architecture | Colosseum |
| 2026-09-09 | Wed | reading-research | Colosseum |
| 2026-09-10 | Thu | technology-teaching | Colosseum |
| 2026-09-11 | Fri | environment-entertainment | Colosseum |
| 2026-09-12 | Sat | recreation-relaxation | Colosseum |
| 2026-09-13 | Sun | science-sports | Sports Arenas |
| 2026-09-14 | Mon | math-motivation | Sports Arenas |
| 2026-09-15 | Tue | aesthetics-architecture | Sports Arenas |
| 2026-09-16 | Wed | reading-research | Sports Arenas |
| 2026-09-17 | Thu | technology-teaching | Sports Arenas |
| 2026-09-18 | Fri | environment-entertainment | Sports Arenas |
| 2026-09-19 | Sat | recreation-relaxation | Sports Arenas |
| 2026-09-20 | Sun | science-sports | Concert Halls |
| 2026-09-21 | Mon | math-motivation | Concert Halls |
| 2026-09-22 | Tue | aesthetics-architecture | Concert Halls |
| 2026-09-23 | Wed | reading-research | Concert Halls |
| 2026-09-24 | Thu | technology-teaching | Concert Halls |
| 2026-09-25 | Fri | environment-entertainment | Concert Halls |
| 2026-09-26 | Sat | recreation-relaxation | Concert Halls |
| 2026-09-27 | Sun | science-sports | Libraries |
| 2026-09-28 | Mon | math-motivation | Libraries |
| 2026-09-29 | Tue | aesthetics-architecture | Libraries |
| 2026-09-30 | Wed | reading-research | Libraries |

---

## 6. Launch-day bindings (accepted, not verified)

| Slot | Path | Source MDX | Claims (pending) |
|---|---|---|---|
| 2026-09-06-a | `/p/2026-09-06-a/` | `src/content/pages/published-rules-vs-arena-spectacle.mdx` | CLM-SCI-0003, CLM-SCI-0007 |
| 2026-09-06-b | `/p/2026-09-06-b/` | `src/content/pages/records-progression-and-midday-spectacle.mdx` | CLM-SCI-0004, CLM-SCI-0006 |

Do not promote these claims to `verified` in this decision. Do not invent a third launch thesis.

Live placeholder copy on `/p/2026-09-06-a/` still advertised “measure, see, and gather.” Replacement sentences were specified in the 26 August packet so the reserved page matches the accepted MDX. Those HTML edits live in the Drive static deploy folder, not in this commit. Deploy remains operator GO (`npx wrangler deploy`).

---

## 7. Other rulings recorded the same day

- **Secondary pair:** off unless the operator names a specific page and a `namedSpan`.
- **Sourcing elaboration:** a paragraph or whole essay may rest on one corpus source when later sentences elaborate meaning, context, application, or profundity. Statistics, quotations, dates, and factual claims still need a named source or `TODO: SOURCE`. No invented facts.
- **Hold:** “P007 live site / social post / profile edit” remains up except for the specified placeholder sentences, which the operator must paste and deploy. This file is not a general hold lift and not a merge-to-main GO.

---

## Operator signature

- [x] GO — Rich Ellefritz
- Date: 2026-08-26
