/**
 * Core rate calculation logic for The Freelancer's Rate Reality Check.
 *
 * Principles:
 * 1. Desired income must be covered by billable hours after overhead.
 * 2. Billable hours are what you invoice — not total hours worked.
 * 3. Working weeks default to 48 (vacation, sick, holidays, admin gaps).
 * 4. Effective rate = what you keep after expenses / real billable load.
 */

/** Default weeks freelancers can realistically bill in a year. */
export const DEFAULT_BILLABLE_WEEKS = 48;

/** Soft cap: above this weekly billable load is often unsustainable. */
export const OPTIMISTIC_BILLABLE_HOURS = 30;

/**
 * @typedef {Object} RateInputs
 * @property {number} desiredAnnualIncome - Target take-home / salary-equivalent goal (pre-tax business income target)
 * @property {number} billableHoursPerWeek - Hours expected to invoice per week
 * @property {number} overheadPercent - Business expenses as % of revenue (0–80)
 * @property {number} [currentHourlyRate] - Optional: what they charge now
 * @property {number} [billableWeeks] - Optional override (default 48)
 */

/**
 * @typedef {Object} RateResults
 * @property {number} annualBillableHours
 * @property {number} baseHourlyBeforeOverhead - Income goal ÷ billable hours
 * @property {number} recommendedHourly - After overhead markup
 * @property {number} recommendedHourlyLow - ~10% below recommended (range floor)
 * @property {number} recommendedHourlyHigh - ~15% above recommended (range ceiling)
 * @property {number} effectiveRate - After expenses, if current rate provided; else same as recommended
 * @property {number} revenueNeeded - Annual revenue needed to hit income after overhead
 * @property {number} annualExpenses - Implied annual overhead $
 * @property {Object} projectGuidance - small/medium/large project price bands
 * @property {boolean} billableHoursOptimistic
 * @property {number|null} impliedAnnualFromCurrent - If current rate given
 * @property {number|null} gapToGoal - recommended vs current (absolute $)
 * @property {number|null} gapToGoalPercent
 */

/**
 * Calculate recommended rates from income goal + capacity + overhead.
 * @param {RateInputs} inputs
 * @returns {RateResults}
 */
export function calculateRates(inputs) {
  const income = clampPositive(inputs.desiredAnnualIncome);
  const hoursPerWeek = clampPositive(inputs.billableHoursPerWeek);
  const overheadPct = clamp(inputs.overheadPercent ?? 0, 0, 80) / 100;
  const weeks = clampPositive(inputs.billableWeeks ?? DEFAULT_BILLABLE_WEEKS);
  const current = inputs.currentHourlyRate != null && inputs.currentHourlyRate > 0
    ? inputs.currentHourlyRate
    : null;

  const annualBillableHours = hoursPerWeek * weeks;

  // Revenue needed so that (1 - overhead) * revenue = income goal
  // revenue = income / (1 - overhead)
  const keepRate = Math.max(1 - overheadPct, 0.01);
  const revenueNeeded = income / keepRate;
  const annualExpenses = revenueNeeded - income;

  // Base: pure income ÷ hours (no overhead)
  const baseHourlyBeforeOverhead =
    annualBillableHours > 0 ? income / annualBillableHours : 0;

  // Recommended: full revenue ÷ hours (includes overhead recovery)
  const recommendedHourly =
    annualBillableHours > 0 ? revenueNeeded / annualBillableHours : 0;

  // Range: slight floor for negotiation room, ceiling for premium positioning
  const recommendedHourlyLow = recommendedHourly * 0.9;
  const recommendedHourlyHigh = recommendedHourly * 1.15;

  // Effective rate after expenses from current rate (or recommended as proxy)
  const rateForEffective = current ?? recommendedHourly;
  const effectiveRate = rateForEffective * keepRate;

  const projectGuidance = buildProjectGuidance(recommendedHourlyLow, recommendedHourly, recommendedHourlyHigh);

  let impliedAnnualFromCurrent = null;
  let gapToGoal = null;
  let gapToGoalPercent = null;

  if (current != null) {
    // What annual income does current rate actually deliver after overhead?
    const grossFromCurrent = current * annualBillableHours;
    impliedAnnualFromCurrent = grossFromCurrent * keepRate;
    gapToGoal = recommendedHourly - current;
    gapToGoalPercent =
      recommendedHourly > 0 ? ((recommendedHourly - current) / recommendedHourly) * 100 : 0;
  }

  return {
    annualBillableHours: round1(annualBillableHours),
    baseHourlyBeforeOverhead: roundMoney(baseHourlyBeforeOverhead),
    recommendedHourly: roundMoney(recommendedHourly),
    recommendedHourlyLow: roundMoney(recommendedHourlyLow),
    recommendedHourlyHigh: roundMoney(recommendedHourlyHigh),
    effectiveRate: roundMoney(effectiveRate),
    revenueNeeded: roundMoney(revenueNeeded),
    annualExpenses: roundMoney(annualExpenses),
    projectGuidance,
    billableHoursOptimistic: hoursPerWeek > OPTIMISTIC_BILLABLE_HOURS,
    impliedAnnualFromCurrent:
      impliedAnnualFromCurrent != null ? roundMoney(impliedAnnualFromCurrent) : null,
    gapToGoal: gapToGoal != null ? roundMoney(gapToGoal) : null,
    gapToGoalPercent: gapToGoalPercent != null ? round1(gapToGoalPercent) : null,
    meta: {
      income,
      hoursPerWeek,
      overheadPct: overheadPct * 100,
      weeks,
      current,
      keepRate,
    },
  };
}

/**
 * Build project rate guidance from hourly band.
 * Applies a small package discount curve: larger projects often price slightly
 * below pure hourly × hours, but we show full and package-style ranges.
 */
function buildProjectGuidance(hourlyLow, hourlyMid, hourlyHigh) {
  const sizes = [
    { id: 'small', label: 'Small (~10 hrs)', hours: 10, packageFactor: 1.0 },
    { id: 'medium', label: 'Medium (~40 hrs)', hours: 40, packageFactor: 0.95 },
    { id: 'large', label: 'Large (~100 hrs)', hours: 100, packageFactor: 0.9 },
  ];

  return sizes.map((s) => ({
    id: s.id,
    label: s.label,
    hours: s.hours,
    low: roundMoney(hourlyLow * s.hours * s.packageFactor),
    mid: roundMoney(hourlyMid * s.hours * s.packageFactor),
    high: roundMoney(hourlyHigh * s.hours * s.packageFactor),
  }));
}

/**
 * Reverse: given a target hourly and capacity, estimate sustainable income.
 * @param {number} hourlyRate
 * @param {number} billableHoursPerWeek
 * @param {number} overheadPercent
 * @param {number} [billableWeeks]
 */
export function estimateIncomeFromRate(
  hourlyRate,
  billableHoursPerWeek,
  overheadPercent,
  billableWeeks = DEFAULT_BILLABLE_WEEKS
) {
  const hours = clampPositive(billableHoursPerWeek) * clampPositive(billableWeeks);
  const gross = clampPositive(hourlyRate) * hours;
  const keep = Math.max(1 - clamp(overheadPercent, 0, 80) / 100, 0.01);
  return roundMoney(gross * keep);
}

function clampPositive(n) {
  const x = Number(n);
  if (!Number.isFinite(x) || x < 0) return 0;
  return x;
}

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
}

function roundMoney(n) {
  return Math.round(n);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Format currency for display (USD default).
 * @param {number} n
 * @param {string} [currency='USD']
 */
export function formatMoney(n, currency = 'USD') {
  if (n == null || !Number.isFinite(n)) return '—';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Format a rate range like "$75–$95/hr"
 */
export function formatRateRange(low, high, suffix = '/hr') {
  return `${formatMoney(low)}–${formatMoney(high)}${suffix}`;
}
