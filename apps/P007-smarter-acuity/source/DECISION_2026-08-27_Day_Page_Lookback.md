# Day Page, Share Suffixes, Week Hub, and Lookback Shorts

**Status:** GO to draft PR 2026-08-27. Not a hold lift. Not a merge-to-main GO. Not a deploy.
**Operator:** Rich Ellefritz (Screenwriter)
**Amends:** `source/DECISION_2026-08-26_Weekday_Map_Fallback.md` §4 (two pages per day / 60 page slots) and §6 (Packet A paths). Does not repeal the weekday pair map, fallback chain, Open Load-Bearing, Surface Boundary, or Deploy Handoff.
**Why this file exists:** Social stays dual-daily. The site of record becomes one webpage per public day. Video drops to a two-day lookback short on Tuesday / Thursday / Saturday plus a Sunday episode. Live `/system` still names `/p/YYYY-MM-DD-a` as the permanent address. That sentence is now false.

---

## 1. System of record — one URL per public day

| Layer | Address | What it is |
|---|---|---|
| System of record | `/p/YYYY-MM-DD/` | That day's page: morning A + evening B, two Cards, two source blocks |
| Share A | `/p/YYYY-MM-DD/a` | Same page. OG image = Card A. Opens on `#a`. |
| Share B | `/p/YYYY-MM-DD/b` | Same page. OG image = Card B. Opens on `#b`. |
| Legacy | `/p/YYYY-MM-DD-a/` | 301 → `/p/YYYY-MM-DD/a` |
| Legacy | `/p/YYYY-MM-DD-b/` | 301 → `/p/YYYY-MM-DD/b` |

Fragments alone (`#a`) do not pick Open Graph. X, Slack, and iMessage ignore the hash. The `/a` and `/b` suffixes exist only to choose the Card and the scroll position. They are not second essays.

Page grammar, always in this order:

1. Day header — date, pair, root, weekly arc
2. **Morning** — Card A, weave label, essay A, sources A (`#a`)
3. Hairline
4. **Evening** — Card B, weave label, essay B, sources B (`#b`)
5. Foreshadow line to tomorrow's day page

Page tags stay the undirected pair slug and the monthly root. Direction is a section / asset attribute (`weekday-map.ts` already works this way).

Social A links to `/p/YYYY-MM-DD/a`. Social B links to `/p/YYYY-MM-DD/b`.

---

## 2. Week page — hub, not the record

A weekly-arc page is permitted. It is not the citeable object.

| Page | Job |
|---|---|
| `/p/YYYY-MM-DD/` | Citeable object. Two essays. Two thumbs. |
| `/w/{year}-{month}-{arc}/` e.g. `/w/2026-09-colosseum/` | Hub: day cards for that arc, both thumbs visible, links into the day |
| Optional "Read the week" | Concatenated view of those day pages for humans. Permalinks still go to the day. |

September 2026 hubs, when built: Colosseum (1–12), Sports Arenas (13–19), Concert Halls (20–26), Libraries (27–30). Parent remains `/themes/architecture/`.

Do not dump a week's essays onto one URL as the system of record. W1 Colosseum is twelve days / twenty-four weaves. That wrecks citations, load-bearing claims, and Open Graph.

This PR records the hub rule. It does not add hub HTML. Live hub pages wait for a later packet after the first day pages exist.

---

## 3. Thumbnails (Cards and Plates)

Unchanged Stage grammar: left column rail, motif well, navy void, right type well, gold construction line, SA monogram. Same column and key light across A and B so clips cut.

- Two **Cards** live on the day page (title on; webpage hero + social still).
- Two **Plates** export from those Cards (title off; Imagine I2V seed).
- Each social post carries its own Card, including still-only days.

---

## 4. Video cadence — lookback shorts + Sunday episode

Dual daily social stills continue. Shorts do not.

| Surface | Standing law |
|---|---|
| Daily social | Two stills. Card A morning, Card B evening. Link to `/a` or `/b`. |
| Short / Reel | Tuesday, Thursday, Saturday only |
| Sunday | One 16:9 episode from the week's 16:9 Plates plus extra sourced material |
| Mon / Wed / Fri | Stills only. Cards and Plates still render; they are inventory for the next short. |

### Lookback stitch (standing)

Each midweek short is a **two-day chapter**: previous public day + short day. Four Plates, cut on the shared column, each a slow push-in of 5–8 seconds. End card on Today B. Runtime about 24–36 seconds.

Order, always:

**Prev A → Prev B → Today A → Today B**

The emphasized cut is the overnight hinge: yesterday B → today A. Hold that join a beat longer. That is the dual-write the short is supposed to make visible.

| Posted | Plates |
|---|---|
| Tuesday | Mon A → Mon B → Tue A → Tue B |
| Thursday | Wed A → Wed B → Thu A → Thu B |
| Saturday | Fri A → Fri B → Sat A → Sat B |
| Sunday | Week's 16:9 Plates + extra sourced beat. Not a fourth short. |

Sunday essays do not ride the following Tuesday's lookback. They live in the Sunday episode.

Silent + burned captions for now. Do not read four essays aloud. Fallback trim if 36 seconds starts to fail on Instagram: Prev B → Today A → Today B. Fallback only; standing law is four plates.

### Seams

If there is no previous public page, drop the lookback. Do not invent a day.

| Date | Stitch |
|---|---|
| Tue 1 Sep 2026 | One-day exception. 1 Sep A → 1 Sep B only. No 31 Aug page. |
| Thu 3 Sep 2026 | First two-day chapter: Wed 2 + Thu 3 |
| Sat 5 Sep 2026 | Fri 4 + Sat 5 |
| Sun 6 Sep 2026 | Episode over days 1–5. Packet A is the center of gravity, not another short. |

Same seam rule at month starts and at clipped W4.

September short days if launch is 1 September: 1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29. Sunday episodes: 6, 13, 20, 27.

---

## 5. What this does not change

- Weekday pair map and A/B weave labels
- Fallback chain (weekly arc → that month's root → WC defense / sourced date-fact)
- Open Load-Bearing
- Dual daily social cadence
- Packet A substance and claims (CLM-SCI-0003, 0004, 0006, 0007 remain pending)
- Deploy origin (Drive static folder + `npx wrangler deploy`). This monorepo still does not deploy the public site.

---

## 6. Live-site packet (not this PR)

Head Master / Drive static, after Master Mind, after operator paste. Out of scope here:

1. Day-page HTML template (two wells, two Card slots)
2. Routes for `/p/YYYY-MM-DD/`, `/a`, `/b`
3. 301s from the live `-a`/`-b` slugs
4. Rewrite the `/system` sentence that names `/p/YYYY-MM-DD-a`
5. Homepage and `/themes/architecture/` cards point at the day page
6. Operator `npx wrangler deploy`

---

## Operator signature

- [x] GO — draft PR — Rich Ellefritz via Screenwriter
- Date: 2026-08-27
