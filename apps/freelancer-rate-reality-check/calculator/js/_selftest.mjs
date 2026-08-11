/**
 * Self-test for tax-aware rate math (ebook Chapter 3 alignment).
 * Run with: node js/_selftest.mjs  (requires Node)
 */
import { calculateRates } from './calculator.js';
import { getBenchmark } from './benchmarks.js';
import { diagnoseUnderpricing } from './underpricing.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  } else {
    console.log('PASS:', msg);
  }
}

// —— Ebook worked example (Chapter 3) ——
// take-home $70k + expenses $9k, tax 30%, 25 hrs/wk × 48 weeks
// revenue = 79000 / 0.70 = 112857
// floor = 112857 / 1200 = $94
// recommended = 94 × 1.20 = $113
const ebook = calculateRates({
  desiredNetIncome: 70000,
  annualExpenses: 9000,
  taxRatePercent: 30,
  billableHoursPerWeek: 25,
  billableWeeks: 48,
  workingHoursPerWeek: 40,
});

assert(ebook.annualBillableHours === 1200, 'ebook: annual billable hours = 1200');
assert(ebook.annualWorkingHours === 1920, 'ebook: working year = 40×48 = 1920');
assert(ebook.revenueNeeded === 112857, `ebook: revenue = 112857 (got ${ebook.revenueNeeded})`);
assert(ebook.floorHourly === 94, `ebook: floor = $94 (got ${ebook.floorHourly})`);
assert(ebook.recommendedHourly === 113, `ebook: recommended = $113 (got ${ebook.recommendedHourly})`);
assert(ebook.recommendedHourlyLow === 108, `ebook: rec low ≈ $108 (got ${ebook.recommendedHourlyLow})`);
assert(ebook.recommendedHourlyHigh === 118, `ebook: rec high ≈ $118 (got ${ebook.recommendedHourlyHigh})`);
assert(ebook.effectiveRateAtFloor === 36, `ebook: effective at floor ≈ $36 (got ${ebook.effectiveRateAtFloor})`);
// At recommended: net is higher than $70k due to buffer
assert(ebook.effectiveRate === 45, `ebook: effective at recommended ≈ $45 (got ${ebook.effectiveRate})`);

// Current rate below floor → gap
const withCurrent = calculateRates({
  desiredNetIncome: 70000,
  annualExpenses: 9000,
  taxRatePercent: 30,
  billableHoursPerWeek: 25,
  currentHourlyRate: 50,
});
assert(withCurrent.gapToFloor === 44, `gap to floor = 44 (got ${withCurrent.gapToFloor})`);
assert(withCurrent.impliedNetFromCurrent != null, 'implied net from current is set');
// 50 * 1200 = 60000 gross; after 30% tax = 42000; minus 9000 = 33000
assert(
  withCurrent.impliedNetFromCurrent === 33000,
  `implied net at $50 = 33000 (got ${withCurrent.impliedNetFromCurrent})`
);

const bench = getBenchmark('writing', 'intermediate', 'global');
assert(bench.low === 45 && bench.mid === 60 && bench.high === 80, 'writing intermediate band');

const diagRed = diagnoseUnderpricing({
  currentHourlyRate: 50,
  recommendedHourly: withCurrent.floorHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: withCurrent.impliedNetFromCurrent,
  desiredAnnualIncome: 70000,
  isPaid: true,
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
  categoryInsight: 'x',
  commonPitfall: 'y',
});
assert(diagRed.level === 'red' || diagRed.level === 'yellow', 'current $50 → caution/underpricing');

console.log('\nEbook $70k example:', {
  revenue: ebook.revenueNeeded,
  floor: ebook.floorHourly,
  recommended: ebook.recommendedHourly,
  range: [ebook.recommendedHourlyLow, ebook.recommendedHourlyHigh],
  effectiveAtFloor: ebook.effectiveRateAtFloor,
  effectiveAtRecommended: ebook.effectiveRate,
});

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log('\nAll assertions passed.');
