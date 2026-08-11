# Productize — 001: The Freelancer's Rate Reality Check

Stage: Productize. Entered after Quality Gate #1 revisions were completed and re-verified.

## 1. Packaging

### Product name

**Confirmed: "The Freelancer's Rate Reality Check"**

Holds up on three tests: it states the problem rather than the format, "reality check" carries the diagnostic framing that runs through the whole product, and it's searchable without being generic. No change recommended.

Sub-title for listings: *Find the rate you should actually be charging — and learn how to charge it.*

### Pricing (confirmed)

| SKU | Price | Contents |
|---|---|---|
| Free tier | $0 | Calculator: floor + recommended rate, effective-rate reveal |
| Ebook only | $19–$29 (launch at **$19**) | Full 8-chapter ebook, PDF + EPUB |
| Bundle | $39–$49 (launch at **$39**) | Ebook + full calculator (category benchmarks, underpricing diagnostic, project guidance, category insights) |

Launch at the bottom of each approved band. Rationale per the approved v1 strategy: optimize for volume and conversion data, revisit upward once real numbers exist. The $19/$39 spread also makes the bundle the obvious pick — twice the price for substantially more than twice the utility.

### Free-tier / paid split

The free calculator must be genuinely useful on its own or it won't earn the email; the paid tier must be obviously better or it won't convert. Proposed line:

**Free:** enter income, expenses, tax rate, hours → get floor rate, recommended rate, and the effective-rate reveal (the "you keep less than half" moment). This is the hook: it creates the problem the paid product solves.

**Paid:** category + experience + market benchmarking against the locked bands, the underpricing diagnostic with severity, per-category insight and pitfall notes, project-size pricing guidance, and the chapter cross-links from result to relevant ebook section.

Email capture sits between the free result and the benchmark comparison — after value is delivered, not before.

## 2. Sales Page Outline (first draft)

### Above the fold

**Headline:** You're probably charging less than half of what you think you are.

**Sub:** Most freelancers set their rate by guessing, then never move it. This is the calculation they skipped — and the script for actually raising it.

**Primary CTA:** Calculate your real rate — free
**Secondary CTA:** Get the book + full calculator — $39

### Section 1 — The diagnostic (agitate)

Lead with the self-identification checklist from Chapter 1, as a short list the reader can fail:

- When did a client last push back on your price?
- Has your rate moved since you started?
- Do you know your billable hours, or are you assuming 40?
- Are you busy and still not making money?

Closing line: *If you're closing nearly every deal, that's not sales skill. That's a pricing signal.*

### Section 2 — The arithmetic (demonstrate)

Show the worked example as a visual, since it's the most persuasive asset the product has:

> Guessed rate: $38/hr → Real floor: $94/hr → Recommended: $113/hr

Then the effective-rate reveal: *at $113/hour, you net about $45/hour of your actual working life.* This is the moment the product earns belief — it explains a feeling the reader already has.

### Section 3 — What's inside

Two columns, ebook and calculator, with the free/paid line drawn visibly.

**The book (8 chapters, ~50 pages, one sitting):** the calculation, category benchmarks, why anchoring keeps you stuck, four word-for-word scripts for raising rates, handling the four objections you'll actually hear, and a 30-day plan.

**The calculator:** your floor and recommended rate, effective-rate breakdown, benchmarking against your category/experience/market, underpricing diagnostic, project-size pricing.

### Section 4 — The differentiator

Direct, comparative, and honest:

> There are plenty of free rate calculators. They all give you a number. None of them tell you why you won't charge it, or what to say when the client pushes back. That's the half that actually changes your income.

### Section 5 — Who this is and isn't for

**For:** freelancers 0–5 years in — writing, design, development, marketing, consulting — who've never run the numbers, or whose rate hasn't moved.

**Not for:** established consultants already running value-based pricing with a mature proposal process. Say this plainly; it raises credibility and cuts refund requests.

### Section 6 — Objection handling

- *"I can find a free calculator."* → Yes — and ours is free too. The book is the part that gets you to use the number.
- *"Will this work outside the US?"* → Market multipliers cover 13 regions; tax guidance is US-specific and flagged as such.
- *"I'm too new to charge more."* → Chapter 2 is specifically about why that feeling is the trap.

### Section 7 — Final CTA + honest scope note

Restate both offers. Immediately beneath, in smaller type, a short methodology line: benchmarks are directional mid-market references for direct-client work, not guarantees; tax figures are illustrative, not tax advice.

## 3. Key Claims — and the Line Not to Cross

**Defensible (supported by the assets):**
- The standard rate method omits tax, expenses, and non-billable time, and typically produces roughly half the required rate.
- Most freelancers have 20–30 billable hours per week, not 40.
- Your effective rate is well under half your billable rate once tax, expenses, and non-billable time are counted.
- Benchmarks are directional mid-market references for direct-client work.

**Do not claim:**
- Any specific income increase ("add $30K to your income"). The $30K figure in Chapter 1 is an illustrative arithmetic example under stated assumptions, not an outcome promise — it must not migrate to the sales page as a headline.
- That clients will accept an increase, or that no one will churn. The book explicitly says some will leave.
- Tax, legal, or financial advice of any kind.
- Testimonials or results. There are none yet; the page ships without a social-proof section rather than with a fabricated one.

## 4. Delivery Format

**Ebook:** PDF as the primary format (layout control matters for the benchmark tables). EPUB as a secondary — worth doing, but note the eight rate tables and the multiplier table will reflow unpredictably in EPUB and need a check on a real reader before shipping.

**Calculator:** static hosting is sufficient for v1 — it's a client-side ES-module app with no backend. Netlify, Cloudflare Pages, or GitHub Pages all work. Custom subdomain preferred over a platform URL for credibility.

**Delivery platform:** Gumroad or Lemon Squeezy. Lemon Squeezy is a merchant of record and handles VAT/sales-tax remittance; Gumroad is simpler and more familiar to this audience. For a first product with unknown volume, the MoR benefit likely outweighs the simplicity difference — but this is a judgment call for the team, not a technical constraint.

**Email capture:** whichever platform is chosen should handle the free-tier list; avoid adding a separate ESP for v1.

## 5. Checklist

### Content
- [ ] Ebook copyedit pass (single voice check across all 8 chapters)
- [ ] Replace `[CALC]` markers with real calculator links (21 instances)
- [ ] Front matter: add purchase/version date and a "recalculate every 6 months" note
- [ ] PDF layout and typesetting; verify all benchmark tables render correctly
- [ ] EPUB export; verify table reflow on a real e-reader
- [ ] Cover design

### Calculator
- [ ] Free/paid gating implemented and tested end-to-end
- [ ] Email capture wired between free result and benchmark comparison
- [ ] Mobile check (spec requires it)
- [ ] Deploy to static host; custom domain
- [ ] Confirm `_selftest.mjs` passes against final build

### Commerce
- [ ] Platform selected and account set up
- [ ] Three SKUs configured (free capture, $19 ebook, $39 bundle)
- [ ] Purchase → delivery flow tested with a real transaction
- [ ] Refund policy written

### Sales page
- [ ] Full copy drafted from this outline
- [ ] Claims reviewed against §3 (no income promises, no fabricated proof)
- [ ] Methodology/disclaimer line included
- [ ] Mobile layout check

### Pre-launch verification
- [ ] Final cross-check: ebook figures vs. calculator output, one more pass after any late edits
- [ ] All links live (calculator ↔ book ↔ sales page)
