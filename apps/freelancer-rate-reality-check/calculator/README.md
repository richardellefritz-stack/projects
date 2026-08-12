# Rate Reality Check — Calculator

Interactive companion tool for **The Freelancer's Rate Reality Check**.

Helps freelancers:

1. Calculate a realistic hourly rate from income goals, billable hours, and overhead  
2. See floor / recommended / effective rates and a basic underpricing signal (free)  
3. Unlock market benchmarks, project guidance, and a full diagnostic (paid)

## Location

```
apps/freelancer-rate-reality-check/calculator/
```

## Quick start (local)

Static, client-side ES modules. Serve over HTTP:

```bash
cd apps/freelancer-rate-reality-check/calculator
python -m http.server 5173
```

Open [http://localhost:5173](http://localhost:5173)

## What’s included

| Path | Role |
|------|------|
| `index.html` | Single-page UI |
| `css/styles.css` | Layout & signal colors |
| `js/benchmarks.js` | Category × experience bands + market multipliers |
| `js/calculator.js` | Rate math (Chapter 3–aligned) |
| `js/underpricing.js` | Green / yellow / red diagnostic |
| `js/entitlements.js` | Free → email → paid access layer (license verify via Netlify Function) |
| `js/app.js` | UI wiring, email gate, license activate, scenarios, export |
| `js/_selftest.mjs` | Node self-test for ebook worked example |
| `netlify/functions/verify-license.js` | Server-side Lemon Squeezy license check |
| `netlify.toml` | Publish this folder + the license function |

## Free vs paid

### Free (always)

- Floor rate (minimum viable)
- Recommended rate band (+15–25%, mid +20%)
- Effective rate reveal (true net per working hour of life)
- Basic underpricing signal (green / yellow / red) with short summary

### After email capture

- Local lead capture (`localStorage`)
- Upsell listing full-version features
- License-key field to activate paid access

### Paid (license / purchase unlock)

- Market benchmark band (Low / Mid / High) + market label
- Capacity & revenue breakdown
- Project rate guidance
- Plain-language interpretation
- Detailed diagnostic (scores, category insight, pitfall, raise path, income reality)
- Saved scenarios
- Export (`.txt`)

## Access flow

```
Landing → enter numbers → free results
       → email capture (“Unlock detailed insights”)
       → post-email upsell + license activate
       → paid features (when licensed)
```

### Email capture

- UI form after free results (`#emailGate`)
- Validates format client-side
- Stores `frrc_email` + `frrc_email_captured_at` in `localStorage`
- After a valid local save, posts `{ email, source: "calculator" }` to Formspree (`https://formspree.io/f/mgawyyny`) via `fetch`
- Formspree is fire-and-forget: a slow or failed POST does not block the “You’re on the list” stage

### Paid unlock (Lemon Squeezy via Netlify Function)

| Method | How |
|--------|-----|
| License key UI | User pastes key → `activateLicense()` → `POST /.netlify/functions/verify-license` → Lemon Squeezy License API |
| Accepted keys | Only keys Lemon Squeezy reports as `valid` **and** that match the configured store/product IDs |
| Client storage | Key + `frrc_license_status=valid` are written **only after** the function returns `{ valid: true }` |

There is **no** public free/paid toggle. Query-string and localStorage shortcuts do not unlock paid on the live site. `DEV-UNLOCK` and arbitrary `LS-` keys are rejected in the license field. The old `frrc_tier` key is cleared on load.

The API key never ships in `calculator/js`. Paid features still live in the static bundle (this is a client-side calculator); the function is what stops the public license field from unlocking anyone.

#### Netlify environment variables

Set these under **Site settings → Environment variables** (see `../.env.example`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `LEMONSQUEEZY_API_KEY` | Yes | Bearer token for the Lemon Squeezy License API |
| `LEMONSQUEEZY_STORE_ID` | Yes* | Only accept keys from this store |
| `LEMONSQUEEZY_PRODUCT_ID` | Yes* | Only accept keys from this product |
| `LEMONSQUEEZY_VARIANT_ID` | No | Optional extra restriction |

\*At least one of `LEMONSQUEEZY_STORE_ID` or `LEMONSQUEEZY_PRODUCT_ID` is required. If the function is missing the API key or both IDs, it returns `{ valid: false }` (fail closed).

#### Local / deployed testing

```bash
# from apps/freelancer-rate-reality-check
cp .env.example .env   # fill in real values locally; do not commit
npx netlify dev        # serves calculator + function
```

1. Open the app, capture an email, paste a real Lemon Squeezy license key → paid features unlock.
2. Paste a garbage key or `DEV-UNLOCK` → error, still on the email/upsell stage.

A plain `python -m http.server` will not run the function; license activation will show a connection error. Use `netlify dev` or the deployed site.

## Rate logic (ebook Chapter 3)

```
pre_tax_subtotal = desired_take_home + annual_expenses
revenue_needed   = pre_tax_subtotal ÷ (1 − tax_rate)
annual_billable  = billable_hours_per_week × 48
floor_hourly     = revenue_needed ÷ annual_billable
recommended_mid  = floor × 1.20
```

Defaults match the ebook worked example: **$70k** take-home, **$9k** expenses, **30%** tax, **25×48** hours → **floor ≈ $94**, **recommended ≈ $113**, **effective at floor ≈ $36**.

```bash
node js/_selftest.mjs
```

## Deploy

**Netlify (required for license verification).** Base directory: `apps/freelancer-rate-reality-check` (this product folder). `netlify.toml` publishes `calculator/` and the function at `netlify/functions`.

Without the function, the UI still works as a static site, but license activation cannot succeed.

## Next steps

- Lemon Squeezy checkout URL in the post-email upsell
- Brand polish
- Optional: move paid diagnostic rendering behind a server response so the bundle itself is not the gate

## License / product

Companion tool for **The Freelancer's Rate Reality Check**.
