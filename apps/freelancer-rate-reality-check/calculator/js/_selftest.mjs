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

const rates = calculateRates({
  desiredAnnualIncome: 80000,
  billableHoursPerWeek: 25,
  overheadPercent: 20,
  currentHourlyRate: 40,
});

// hours = 25 * 48 = 1200
// revenue = 80000 / 0.8 = 100000
// recommended = 100000 / 1200 ≈ 83.33 → 83
// effective from current = 40 * 0.8 = 32
// implied annual = 40 * 1200 * 0.8 = 38400
assert(rates.annualBillableHours === 1200, 'annual billable hours = 1200');
assert(rates.revenueNeeded === 100000, 'revenue needed = 100000');
assert(rates.recommendedHourly === 83, 'recommended hourly = 83');
assert(rates.recommendedHourlyLow === 75, 'range low ≈ 75');
assert(rates.recommendedHourlyHigh === 96, 'range high ≈ 96');
assert(rates.effectiveRate === 32, 'effective rate from current = 32');
assert(rates.impliedAnnualFromCurrent === 38400, 'implied annual = 38400');
assert(rates.gapToGoal === 43, 'gap to goal = 43');
assert(rates.projectGuidance.length === 3, 'three project sizes');

const bench = getBenchmark('writing', 'intermediate', 'global');
assert(bench.low === 45 && bench.mid === 60 && bench.high === 80, 'writing intermediate band');

const diagRed = diagnoseUnderpricing({
  currentHourlyRate: 40,
  recommendedHourly: rates.recommendedHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: rates.impliedAnnualFromCurrent,
  desiredAnnualIncome: 80000,
  isPaid: true,
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
  categoryInsight: 'x',
  commonPitfall: 'y',
});
assert(diagRed.level === 'red', 'current $40 → red underpricing');
assert(diagRed.detailed && diagRed.detailed.steps.length > 0, 'paid detail has raise path');

const diagYellow = diagnoseUnderpricing({
  currentHourlyRate: 50,
  recommendedHourly: 83,
  benchmark: bench,
  impliedAnnualFromCurrent: 48000,
  desiredAnnualIncome: 80000,
  isPaid: false,
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
// $50 is between low(45) and mid(60) → yellow, may escalate to red if material goal gap
// goal ratio = 50/83 ≈ 0.60 → borderline material/severe
assert(
  diagYellow.level === 'yellow' || diagYellow.level === 'red',
  'current $50 → yellow or red (below mid + goal gap)'
);

const ratesHigh = calculateRates({
  desiredAnnualIncome: 80000,
  billableHoursPerWeek: 25,
  overheadPercent: 20,
});
const diagGoalOnly = diagnoseUnderpricing({
  currentHourlyRate: null,
  recommendedHourly: ratesHigh.recommendedHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: null,
  desiredAnnualIncome: 80000,
  isPaid: false,
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
// $83 >= high $80 → green (above_high)
assert(diagGoalOnly.level === 'green', 'goal-based $83 vs writing mid band → green');

const diagGreenCurrent = diagnoseUnderpricing({
  currentHourlyRate: 70,
  recommendedHourly: 83,
  benchmark: bench,
  impliedAnnualFromCurrent: 67200,
  desiredAnnualIncome: 80000,
  isPaid: false,
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
// $70 >= mid $60, goal ratio 70/83 ≈ 0.84 → slight_gap, market green → overall green or yellow
assert(
  diagGreenCurrent.level === 'green' || diagGreenCurrent.level === 'yellow',
  'current $70 near mid → green or mild yellow'
);

const latam = getBenchmark('development', 'advanced', 'latam');
const us = getBenchmark('development', 'advanced', 'us');
assert(latam.mid < us.mid, 'LATAM multiplier lowers development advanced mid');

console.log('\nResults sample:', {
  recommended: rates.recommendedHourly,
  range: [rates.recommendedHourlyLow, rates.recommendedHourlyHigh],
  signal40: diagRed.level,
  signalGoalOnly: diagGoalOnly.level,
});

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log('\nAll assertions passed.');
