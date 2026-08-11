# Rate Reality Check — Calculator

Interactive companion tool for **The Freelancer's Rate Reality Check**.

Helps freelancers:

1. Calculate a realistic hourly rate from income goals, billable hours, and overhead  
2. Compare against **category- and experience-aware** market benchmarks  
3. See a clear **Underpricing Signal** (green / yellow / red) with plain-language explanation  

## Location

```
apps/freelancer-rate-reality-check/calculator/
```

## Quick start (local)

This is a static, client-side app (ES modules). Browsers block modules from `file://` in some cases, so serve the folder over HTTP.

### Option A — Python

```bash
cd apps/freelancer-rate-reality-check/calculator
python -m http.server 5173
```

Open [http://localhost:5173](http://localhost:5173)

### Option B — Node (npx)

```bash
cd apps/freelancer-rate-reality-check/calculator
npx --yes serve -p 5173
```

### Option C — VS Code / Cursor

Use the “Live Server” (or equivalent) extension on `index.html`.

No build step, bundler, or backend is required for v1.

## What’s included

| Path | Role |
|------|------|
| `index.html` | Single-page UI |
| `css/styles.css` | Mobile-friendly layout & signal colors |
| `js/benchmarks.js` | Category × experience bands + market multipliers |
| `js/calculator.js` | Rate math (income, hours, overhead → hourly + projects) |
| `js/underpricing.js` | Green / yellow / red diagnostic |
| `js/app.js` | UI wiring, free/paid toggle, scenarios, export |

## Rate logic (correctness first)

**Recommended hourly rate**

```
annual_billable_hours = billable_hours_per_week × 48

revenue_needed = desired_annual_income ÷ (1 − overhead_percent)

recommended_hourly = revenue_needed ÷ annual_billable_hours
```

- **48 weeks** is the default billable-year assumption (vacation, sick days, admin gaps).  
- **Overhead** is treated as a percentage of revenue that must be recovered in the rate.  
- **Recommended range** is ~90%–115% of that mid recommendation (negotiation / positioning band).  
- **Effective rate** = rate × (1 − overhead) — what remains after expenses.  
- **Project guidance** = hourly band × typical hours (10 / 40 / 100), with a light package factor on larger scopes.

### Underpricing signal

Compares the rate under review (current rate if provided, otherwise the goal-based rate) to the market band for **category + experience + location**:

| Signal | Meaning |
|--------|---------|
| **Green — On Track** | At or above market midpoint (and not severely below goal rate) |
| **Yellow — Caution** | Between market low and mid, or a moderate gap to the goal rate |
| **Red — Underpricing** | Below market low, far below low, or a severe gap to the rate required for the income goal |

If a **current hourly rate** is entered, the tool also shows implied annual income after expenses vs the stated goal.

## Free vs paid (prototype)

Use the **toggle** in the header (state stored in `localStorage`).

| Feature | Free | Paid / full |
|---------|------|-------------|
| Core rate calculation | ✓ | ✓ |
| Market benchmark range | ✓ | ✓ |
| Basic underpricing flag + explanation | ✓ | ✓ |
| Project rate guidance | ✓ | ✓ |
| Category insights & common pitfalls | | ✓ |
| Scored raise path + income reality check | | ✓ |
| Save / load scenarios | | ✓ |
| Export results (`.txt`) | | ✓ |

Replace the toggle later with real entitlements (license key, auth, Gumroad, etc.). Feature gating is already isolated via `body[data-tier]` and `.paid-only` / `.free-only` classes.

## Defaults worth knowing

- Category: Writing  
- Experience: Intermediate  
- Market: Global / remote (1.0× baseline)  
- Income goal: $80,000  
- Billable hours: 25/week  
- Overhead: 20%  

Benchmarks are **directional USD mid-market references**, not guarantees. Specialties, proof of results, and client segment still matter.

## Deploy

Any static host works:

- Netlify / Vercel / Cloudflare Pages / GitHub Pages / S3 + CDN  
- Point the publish directory at `calculator/` (or the monorepo path that contains `index.html`)

No environment variables required for v1.

## Next steps (not in this pass)

- Visual polish / brand alignment with the product  
- Real paid unlock (instead of local toggle)  
- Currency selection beyond USD formatting  
- Shareable scenario URLs  
- Unit tests for `calculator.js` and `underpricing.js`  

## License / product

Companion tool for the digital product **The Freelancer's Rate Reality Check**.  
Keep product, pricing, and licensing terms with the parent product materials.
