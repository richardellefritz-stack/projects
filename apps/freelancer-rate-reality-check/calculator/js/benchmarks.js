/**
 * Category- and experience-aware freelance rate benchmarks (USD/hour).
 * Ranges are approximate mid-market references for client-facing work,
 * not guarantees. Used for underpricing diagnostics and guidance.
 *
 * Structure: category → experience → { low, mid, high }
 * Project multipliers convert hourly guidance into typical project bands.
 */

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', yearsHint: '0–2 years' },
  { id: 'intermediate', label: 'Intermediate', yearsHint: '2–5 years' },
  { id: 'advanced', label: 'Advanced', yearsHint: '5–10 years' },
  { id: 'expert', label: 'Expert', yearsHint: '10+ years' },
];

export const CATEGORIES = [
  { id: 'writing', label: 'Writing' },
  { id: 'design', label: 'Design' },
  { id: 'development', label: 'Development' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'other', label: 'Other' },
];

/**
 * Hourly USD benchmarks by category and experience.
 * mid ≈ typical solid rate; low/high bound a realistic band.
 */
export const HOURLY_BENCHMARKS = {
  writing: {
    beginner: { low: 25, mid: 40, high: 55 },
    intermediate: { low: 45, mid: 60, high: 80 },
    advanced: { low: 75, mid: 100, high: 140 },
    expert: { low: 120, mid: 160, high: 220 },
  },
  design: {
    beginner: { low: 30, mid: 45, high: 60 },
    intermediate: { low: 50, mid: 70, high: 95 },
    advanced: { low: 85, mid: 120, high: 165 },
    expert: { low: 140, mid: 190, high: 260 },
  },
  development: {
    beginner: { low: 40, mid: 55, high: 75 },
    intermediate: { low: 70, mid: 95, high: 130 },
    advanced: { low: 115, mid: 150, high: 200 },
    expert: { low: 170, mid: 220, high: 300 },
  },
  marketing: {
    beginner: { low: 30, mid: 45, high: 60 },
    intermediate: { low: 55, mid: 75, high: 100 },
    advanced: { low: 90, mid: 125, high: 170 },
    expert: { low: 140, mid: 190, high: 260 },
  },
  consulting: {
    beginner: { low: 50, mid: 70, high: 95 },
    intermediate: { low: 85, mid: 120, high: 160 },
    advanced: { low: 145, mid: 195, high: 260 },
    expert: { low: 230, mid: 300, high: 420 },
  },
  other: {
    beginner: { low: 30, mid: 45, high: 60 },
    intermediate: { low: 55, mid: 75, high: 100 },
    advanced: { low: 90, mid: 125, high: 170 },
    expert: { low: 140, mid: 185, high: 250 },
  },
};

/**
 * Location / market multipliers applied to benchmark bands.
 * "global" and "us" sit at 1.0 as the baseline reference market.
 */
export const MARKET_MULTIPLIERS = {
  us: { label: 'United States', multiplier: 1.0 },
  canada: { label: 'Canada', multiplier: 0.95 },
  uk: { label: 'United Kingdom', multiplier: 0.95 },
  western_eu: { label: 'Western Europe', multiplier: 0.95 },
  northern_eu: { label: 'Northern Europe', multiplier: 1.05 },
  australia: { label: 'Australia / NZ', multiplier: 0.95 },
  eastern_eu: { label: 'Eastern Europe', multiplier: 0.55 },
  latam: { label: 'Latin America', multiplier: 0.5 },
  south_asia: { label: 'South Asia', multiplier: 0.4 },
  se_asia: { label: 'Southeast Asia', multiplier: 0.45 },
  middle_east: { label: 'Middle East', multiplier: 0.85 },
  africa: { label: 'Africa', multiplier: 0.45 },
  global: { label: 'Global / remote (market rate)', multiplier: 1.0 },
};

/** Typical project sizes in estimated billable hours. */
export const PROJECT_SIZE_HOURS = {
  small: { label: 'Small project', hours: 10 },
  medium: { label: 'Medium project', hours: 40 },
  large: { label: 'Large project', hours: 100 },
};

/**
 * @param {string} category
 * @param {string} experience
 * @param {string} [marketId='global']
 * @returns {{ low: number, mid: number, high: number, marketId: string, multiplier: number }}
 */
export function getBenchmark(category, experience, marketId = 'global') {
  const cat = HOURLY_BENCHMARKS[category] || HOURLY_BENCHMARKS.other;
  const base = cat[experience] || cat.intermediate;
  const market = MARKET_MULTIPLIERS[marketId] || MARKET_MULTIPLIERS.global;
  const m = market.multiplier;

  return {
    low: roundMoney(base.low * m),
    mid: roundMoney(base.mid * m),
    high: roundMoney(base.high * m),
    marketId,
    multiplier: m,
    marketLabel: market.label,
  };
}

/**
 * Paid tier: richer narrative notes per category (not just raw numbers).
 */
export const CATEGORY_INSIGHTS = {
  writing: {
    note: 'Writing rates vary widely by specialty (SEO, technical, ghostwriting, copy). Niche expertise and proven ROI support the upper band.',
    commonPitfall: 'Pricing per word without floor rates often underprices research-heavy work.',
  },
  design: {
    note: 'UI/UX and brand systems usually command more than one-off graphics. Portfolio quality and process documentation move rates up.',
    commonPitfall: 'Unlimited revisions and asset dumps without scope kill effective hourly rate.',
  },
  development: {
    note: 'Full-stack, mobile, and specialized stacks (security, data, AI) sit higher. Maintenance retainers stabilize income.',
    commonPitfall: 'Fixed bids without contingency for unknowns erode the real rate.',
  },
  marketing: {
    note: 'Strategy and performance marketing typically outprice pure execution. Results-tied case studies justify premium rates.',
    commonPitfall: 'Bundling ads management + content + strategy as one flat fee hides underpricing.',
  },
  consulting: {
    note: 'Consulting prices access to judgment, not just hours. Day rates and retainers are common at advanced levels.',
    commonPitfall: 'Charging implementation rates for advisory work leaves money on the table.',
  },
  other: {
    note: 'Use neighboring categories as a sanity check. Specialized trades and niches can exceed these mid-market bands.',
    commonPitfall: 'Copying hobbyist marketplace rates as a baseline trains clients to undervalue you.',
  },
};

function roundMoney(n) {
  return Math.round(n);
}
