/**
 * Core rate calculation logic for The Freelancer's Rate Reality Check.
 *
 * Aligned with the ebook (Chapter 3: The Real Number):
 *   1. Start with desired take-home (net) income
 *   2. Add annual business expenses (dollars)
 *   3. Gross up for tax: revenueNeeded = (net + expenses) / (1 − taxRate)
 *   4. Divide by realistic billable hours → floor rate
 *   5. Apply 15–25% buffer → recommended rate
 *   6. Effective rate = true net per hour of working life
 *      (after tax, expenses, and non-billable time)
 */

/** Default weeks freelancers can realistically bill in a year. */
export const DEFAULT_BILLABLE_WEEKS = 48;

/** Soft cap: above this weekly billable load is often unsustainable. */
export const OPTIMISTIC_BILLABLE_HOURS = 30;

/** Default total working hours/week (billable + non-billable). */
export const DEFAULT_WORKING_HOURS_PER_WEEK = 40;

/** Default total tax rate suggestion (SE tax + income tax, rough). */
export const DEFAULT_TAX_RATE_PERCENT = 30;

/** Buffer above floor for recommended rate (ebook: 15–25%, mid 20%). */
export const RECOMMENDED_BUFFER_LOW = 1.15;
export const RECOMMENDED_BUFFER_MID = 1.2;
export const RECOMMENDED_BUFFER_HIGH = 1.25;

/**
 * @typedef {Object} RateInputs
 * @property {number} desiredNetIncome - Target take-home after taxes
 * @property {number} billableHoursPerWeek - Hours expected to invoice per week
 * @property {number} annualExpenses - Business expenses in dollars per year
 * @property {number} taxRatePercent - Total tax rate as percent (e.g. 30)
 * @property {number} [currentHourlyRate] - Optional: what they charge now
 * @property {number} [billableWeeks] - Optional override (default 48)
 * @property {number} [workingHoursPerWeek] - Total work week incl. non-billable (default 40)
 */

/**
 * @typedef {Object} RateResults
 * @property {number} annualBillableHours
 * @property {number} annualWorkingHours - Full working year (billable + non-billable)
 * @property {number} floorHourly - Minimum viable rate (exactly hits target)
 * @property {number} recommendedHourly - Floor × 1.20 (mid buffer)
 * @property {number} recommendedHourlyLow - Floor × 1.15
 * @property {number} recommendedHourlyHigh - Floor × 1.25
 * @property {number} effectiveRate - Net after tax/expenses per working hour of life
 * @property {number} revenueNeeded - Annual revenue to hit net after tax + expenses
 * @property {number} annualExpenses - Dollar expenses used
 * @property {number} preTaxSubtotal - desiredNet + expenses (before tax gross-up)
 * @property {Object[]} projectGuidance
 * @property {boolean} billableHoursOptimistic
 * @property {number|null} impliedNetFromCurrent
 * @property {number|null} gapToFloor - floor − current ($/hr)
 * @property {number|null} gapToFloorPercent
 * @property {number|null} gapToRecommended
 */

/**
 * Calculate floor + recommended rates from net income, expenses, tax, capacity.
 * @param {RateInputs} inputs
 * @returns {RateResults}
 */
export function calculateRates(inputs) {
  const netIncome = clampPositive(inputs.desiredNetIncome ?? inputs.desiredAnnualIncome);
  const hoursPerWeek = clampPositive(inputs.billableHoursPerWeek);
  const annualExpenses = clampPositive(inputs.annualExpenses ?? 0);
  const taxRate = clamp(inputs.taxRatePercent ?? DEFAULT_TAX_RATE_PERCENT, 0, 60) / 100;
  const weeks = clampPositive(inputs.billableWeeks ?? DEFAULT_BILLABLE_WEEKS);
  const workingHoursPerWeek = Math.max(
    hoursPerWeek,
    clampPositive(inputs.workingHoursPerWeek ?? DEFAULT_WORKING_HOURS_PER_WEEK)
  );
  const current =
    inputs.currentHourlyRate != null && inputs.currentHourlyRate > 0
      ? inputs.currentHourlyRate
      : null;

  const annualBillableHours = hoursPerWeek * weeks;
  const annualWorkingHours = workingHoursPerWeek * weeks;

  // Ebook formula: revenueNeeded = (desiredNet + expenses) / (1 − taxRate)
  const keepAfterTax = Math.max(1 - taxRate, 0.01);
  const preTaxSubtotal = netIncome + annualExpenses;
  const revenueNeeded = preTaxSubtotal / keepAfterTax;

  // Floor: minimum viable hourly to hit target exactly
  const floorHourly =
    annualBillableHours > 0 ? revenueNeeded / annualBillableHours : 0;

  // Recommended: floor with buffer (15–25%, mid 20%)
  const recommendedHourly = floorHourly * RECOMMENDED_BUFFER_MID;
  const recommendedHourlyLow = floorHourly * RECOMMENDED_BUFFER_LOW;
  const recommendedHourlyHigh = floorHourly * RECOMMENDED_BUFFER_HIGH;

  // Effective rate: true net per hour of working life (not just billable)
  // Using the rate under review (current if set, else recommended)
  const rateForEffective = current ?? recommendedHourly;
  const effectiveRate = computeEffectiveRate({
    hourlyRate: rateForEffective,
    annualBillableHours,
    annualWorkingHours,
    taxRate,
    annualExpenses,
  });

  // Also compute effective if they only hit the floor (book's ~$36 illustration)
  const effectiveRateAtFloor = computeEffectiveRate({
    hourlyRate: floorHourly,
    annualBillableHours,
    annualWorkingHours,
    taxRate,
    annualExpenses,
  });

  const projectGuidance = buildProjectGuidance(
    recommendedHourlyLow,
    recommendedHourly,
    recommendedHourlyHigh
  );

  let impliedNetFromCurrent = null;
  let gapToFloor = null;
  let gapToFloorPercent = null;
  let gapToRecommended = null;

  if (current != null) {
    const grossFromCurrent = current * annualBillableHours;
    impliedNetFromCurrent = grossFromCurrent * keepAfterTax - annualExpenses;
    gapToFloor = floorHourly - current;
    gapToFloorPercent =
      floorHourly > 0 ? ((floorHourly - current) / floorHourly) * 100 : 0;
    gapToRecommended = recommendedHourly - current;
  }

  return {
    annualBillableHours: round1(annualBillableHours),
    annualWorkingHours: round1(annualWorkingHours),
    floorHourly: roundMoney(floorHourly),
    recommendedHourly: roundMoney(recommendedHourly),
    recommendedHourlyLow: roundMoney(recommendedHourlyLow),
    recommendedHourlyHigh: roundMoney(recommendedHourlyHigh),
    /** @deprecated alias — use floorHourly */
    baseHourlyBeforeOverhead: roundMoney(floorHourly),
    effectiveRate: roundMoney(effectiveRate),
    effectiveRateAtFloor: roundMoney(effectiveRateAtFloor),
    revenueNeeded: roundMoney(revenueNeeded),
    annualExpenses: roundMoney(annualExpenses),
    preTaxSubtotal: roundMoney(preTaxSubtotal),
    projectGuidance,
    billableHoursOptimistic: hoursPerWeek > OPTIMISTIC_BILLABLE_HOURS,
    impliedNetFromCurrent:
      impliedNetFromCurrent != null ? roundMoney(impliedNetFromCurrent) : null,
    /** @deprecated alias */
    impliedAnnualFromCurrent:
      impliedNetFromCurrent != null ? roundMoney(impliedNetFromCurrent) : null,
    gapToFloor: gapToFloor != null ? roundMoney(gapToFloor) : null,
    gapToFloorPercent: gapToFloorPercent != null ? round1(gapToFloorPercent) : null,
    gapToRecommended: gapToRecommended != null ? roundMoney(gapToRecommended) : null,
    /** @deprecated alias for underpricing — gap vs floor */
    gapToGoal: gapToFloor != null ? roundMoney(gapToFloor) : null,
    gapToGoalPercent: gapToFloorPercent != null ? round1(gapToFloorPercent) : null,
    meta: {
      netIncome,
      hoursPerWeek,
      workingHoursPerWeek,
      annualExpenses,
      taxRatePercent: taxRate * 100,
      weeks,
      current,
      keepAfterTax,
    },
  };
}

/**
 * True net per hour of working life after tax, expenses, and non-billable time.
 */
function computeEffectiveRate({
  hourlyRate,
  annualBillableHours,
  annualWorkingHours,
  taxRate,
  annualExpenses,
}) {
  if (annualWorkingHours <= 0) return 0;
  const gross = clampPositive(hourlyRate) * annualBillableHours;
  const afterTax = gross * Math.max(1 - taxRate, 0);
  const net = afterTax - annualExpenses;
  return net / annualWorkingHours;
}

/**
 * Build project rate guidance from recommended hourly band.
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
 * Reverse: estimate net take-home from a charged rate.
 */
export function estimateNetFromRate(
  hourlyRate,
  billableHoursPerWeek,
  annualExpenses,
  taxRatePercent,
  billableWeeks = DEFAULT_BILLABLE_WEEKS
) {
  const hours = clampPositive(billableHoursPerWeek) * clampPositive(billableWeeks);
  const gross = clampPositive(hourlyRate) * hours;
  const keep = Math.max(1 - clamp(taxRatePercent, 0, 60) / 100, 0.01);
  return roundMoney(gross * keep - clampPositive(annualExpenses));
}

/** @deprecated use estimateNetFromRate */
export function estimateIncomeFromRate(
  hourlyRate,
  billableHoursPerWeek,
  taxRatePercent,
  billableWeeks = DEFAULT_BILLABLE_WEEKS
) {
  return estimateNetFromRate(hourlyRate, billableHoursPerWeek, 0, taxRatePercent, billableWeeks);
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
