# Product Spec — 001: The Freelancer's Rate Reality Check

Status: Draft for review. Informed by [docs/research/001-freelancer-rate-reality-check.md](../research/001-freelancer-rate-reality-check.md).

## 1. Product Name & Positioning

**Name:** The Freelancer's Rate Reality Check

**Positioning:** A short, sharply-written reality check for freelancers who suspect — or don't yet realize — they're underpricing their work. Not a generic "how to freelance" guide and not a bare calculator. It pairs a real number (the calculator) with the psychology and scripts to actually act on it (the ebook), which is the specific gap the research identified in the existing calculator market: plenty of tools produce a number, almost none address why freelancers won't charge it or how to raise it without losing the client.

Tagline direction: *"You're probably charging less than you think you need to. Here's the real number — and how to actually charge it."*

## 2. Target Audience

- **Primary:** Freelancers 0–3 years in, across writing, design, development, marketing, and consulting, who have never done a real rate calculation (gut-feel pricing) or set their rate off a low platform anchor.
- **Secondary:** Slightly more established freelancers (3–5 years) who suspect they're underpriced — signaled by near-100% close rates, no price pushback, or client rates that haven't moved since they started — and want a structured way to justify and execute a rate increase.
- **Explicitly not the primary target:** agencies, established consultancies, or freelancers already using value-based/project pricing with a mature process — the research suggests that's a distinct, later-stage problem (a plausible future product, not this one).

## 3. Ebook Structure (Chapter Outline)

1. **The Reality Check** — open with the underpricing diagnostic (100% close rate, no pushback, no rate movement since starting) so readers self-identify immediately.
2. **Why You're Underpriced (and It's Not Entirely Your Fault)** — anchoring effect, platform-driven low anchors, imposter syndrome; normalize the pattern using research findings.
3. **The Real Number** — walk through the actual math: desired income → gross-up for SE tax and expenses → realistic billable hours (20–30/week, 48–50 weeks/year) → effective vs. billable rate. This chapter is the narrative walkthrough of what the calculator automates.
4. **Know Your Market** — category/specialty benchmarks by field, and the 2026-specific AI bifurcation angle: how positioning as an AI-tool expert vs. competing with AI-automatable commodity work moves your ceiling.
5. **The Anchoring Trap** — why your first rate follows you, and why incremental increases beat one-time jumps for existing clients.
6. **What Leverage You Actually Have** — strategy differentiated by leverage and experience level (beginner through expert): how fast to move, what to trade instead of price, and when to prune.
7. **The Scripts** — concrete, copy-adaptable scripts and objection responses: grandfathering existing clients, introducing new rates to new clients, framing the increase around value/outcomes rather than apologizing for it.
8. **The Ceiling Hourly Billing Puts on You** — a short, forward-looking chapter introducing value/project-based pricing as the next step once the reader's hourly rate is fixed — sets up a natural upsell to a future product rather than over-promising a full framework here.
9. **Your Next 30 Days** — action checklist: run the calculator, pick your number, script your next client conversation, set a 6-month recalculation reminder.
10. **The Standard You Set** — closing chapter: the rate as a standard, not only a number.

## 4. Interactive Tool Requirements — Rate Calculator

**Inputs:**
- Desired annual take-home income
- Category/niche (writing, design, development, marketing, consulting, other — drives benchmark comparison)
- Experience tier (beginner / mid-level / expert-specialist)
- Estimated annual business expenses (with sensible category defaults the user can adjust: software, insurance, equipment, etc.)
- Realistic working weeks/year (default 48–50, editable)
- Realistic billable hours/week (default 20–30, editable, with an explanatory note on why this isn't 40)
- Optional: region/geography for a rough cost-of-living or market adjustment

**Outputs:**
- Minimum viable hourly rate (the sustainability floor)
- Recommended hourly rate (floor + margin buffer)
- Effective rate vs. billable rate, shown side-by-side, with the 35–45% typical gap called out explicitly
- Category/experience-tier benchmark comparison ("your calculated rate vs. the market range for your niche and tier")
- A short, plain-language diagnostic line if their current self-reported rate (optional input) is meaningfully below the calculated number — this is the tool's differentiation vs. the market: not just a number, but a call-out.

**Key differentiating features (per research gap analysis):**
- Category-specific benchmark context on the output screen, not just a generic number.
- A one-line "underpricing signal" prompt (tied to the close-rate/pushback diagnostic from the ebook) framed as an optional self-check, not a hard input.
- Clear visual separation of billable vs. effective rate — the single most commonly-missed factor in the research.
- Link/CTA back into the relevant ebook chapter for whichever result band the user lands in (e.g., "significantly underpriced" routes toward Ch. 2 and Ch. 6).

**Explicitly out of scope for v1:** invoicing, time tracking, tax filing, multi-currency support, saved user accounts/history. Keep it a single-session, no-signup calculator, consistent with what the research shows converts well in this category.

## 5. Unique Value / Differentiation

- Existing free calculators solve the math; none pair it with the psychology, scripts, and category-aware framing this product provides.
- Existing pricing-psychology content (blogs, guides) rarely ships with a working, personalized calculator — most is generic advice with no numeric output specific to the reader.
- The 2026 AI-bifurcation framing (specialty positioning vs. commodity-task exposure) is current and not yet mainstream in either the calculator or ebook content reviewed — a genuine timing advantage.
- Single clean tool, no SEO-bloat kitchen-sink of unrelated calculators — a credibility differentiator against the crowded, cluttered competitor tools found in research.

## 6. Success / Quality Criteria (Quality Gate)

For this product to pass the Quality Gate and move to Productize, all of the following must be true:

**Content quality:**
- All rate figures in the ebook are presented as ranges with attributed sourcing (or clearly labeled as illustrative), not asserted as precise fact — consistent with the research caveats.
- No unverifiable or fabricated statistics; any research-derived claim traces back to the research pack or an equivalent verified source.
- Chapter 7 (rate-raising scripts) contains genuinely usable, copy-adaptable language — not vague advice.
- Reading level and tone appropriate for a fast, one-sitting read (no padding to hit a page count).

**Tool quality:**
- Calculator produces mathematically correct output for the defined formula (income → gross-up → hourly rate) — verified against manual calculation for at least 3 test scenarios spanning different categories/tiers.
- Billable-vs-effective rate distinction is visually unambiguous.
- Tool works with no signup, loads fast, and functions on mobile.
- Category benchmark comparisons are internally consistent with the numbers presented in the ebook (no contradictions between the two deliverables).

**Cohesion:**
- Ebook and tool cross-reference each other clearly (tool output links to relevant chapter; ebook references the tool by name with a clear CTA).
- Positioning/tagline is consistent across both deliverables and any productized listing copy.

## 7. Suggested Pricing & Packaging

Based on category norms for ebook + calculator hybrids and the research's cost/value framing:

- **Free tier — Calculator only, gated at the output's depth:** free access to the basic number (minimum viable rate), used as the lead magnet / email capture. This matches how the reviewed competitor tools operate (free, no signup) but converts traffic into the funnel rather than losing it to a generic competitor tool.
- **Ebook alone:** $19–$29 — consistent with niche non-fiction ebook norms; low-friction impulse buy. Productize locks **$29**.
- **Ebook + full calculator (benchmark comparison, diagnostic, category-specific detail) bundle:** $39–$49 — the primary offer. Anchor the bundle against the ebook-alone price so the bundle reads as the obvious better deal. Productize locks **$39**.
- **Rationale for this band:** the research's own value framing (a $20K/year income improvement justifies a $2–4K course) supports pricing meaningfully higher than $39–49, but a first product in this pipeline should optimize for **proof of the full pipeline and initial conversion data**, not maximum extraction — recommend launching at the lower end of viable pricing and revisiting upward once real conversion/feedback data exists (this feeds the Feedback stage).
- **Upsell path:** rate-raising scripts and "Beyond Hourly" chapter set up a plausible future product (value-based pricing course/template) at a materially higher price point once this product validates the audience.

## Open Items for This Spec

See the report-back message for open questions and risks flagged for team review before Parallel Generation begins.
