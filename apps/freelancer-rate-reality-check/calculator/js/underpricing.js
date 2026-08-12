/**
 * Underpricing diagnostic: compares the freelancers's rate against
 * category benchmarks and against the rate required for their income goal.
 *
 * Signal levels:
 *   green  — fair / market-aligned (or above)
 *   yellow — caution: below mid-market or below goal rate
 *   red    — significant underpricing vs market floor and/or goal
 */

/**
 * @typedef {'green' | 'yellow' | 'red'} SignalLevel
 */

/**
 * @typedef {Object} DiagnosticResult
 * @property {SignalLevel} level
 * @property {string} label - Short badge text
 * @property {string} summary - One-line plain-language takeaway
 * @property {string[]} explanations - Supporting bullets
 * @property {Object} metrics - Numeric context for UI
 * @property {Object} [detailed] - Paid-tier deeper breakdown
 */

/**
 * Run the full underpricing diagnostic.
 *
 * @param {Object} params
 * @param {number|null} params.currentHourlyRate - What they charge now (optional)
 * @param {number} params.recommendedHourly - Rate needed for their income goal
 * @param {{ low: number, mid: number, high: number }} params.benchmark
 * @param {number|null} params.impliedAnnualFromCurrent
 * @param {number} params.desiredAnnualIncome
 * @param {boolean} params.isPaid - Whether to include richer diagnostic detail
 * @param {'free'|'email'|'paid'} [params.stage] - Access stage for CTA copy (defaults from isPaid)
 * @param {string} params.categoryLabel
 * @param {string} params.experienceLabel
 * @param {string} [params.categoryInsight]
 * @param {string} [params.commonPitfall]
 * @param {boolean} [params.billableHoursOptimistic]
 * @returns {DiagnosticResult}
 */
export function diagnoseUnderpricing(params) {
  const {
    currentHourlyRate,
    recommendedHourly,
    benchmark,
    impliedAnnualFromCurrent,
    desiredAnnualIncome,
    isPaid,
    stage: stageParam,
    categoryLabel,
    experienceLabel,
    categoryInsight,
    commonPitfall,
    billableHoursOptimistic,
  } = params;

  const stage = stageParam || (isPaid ? 'paid' : 'free');
  const hasCurrent = currentHourlyRate != null && currentHourlyRate > 0;
  // Primary rate we evaluate: current if provided, else recommended goal rate
  const rateUnderReview = hasCurrent ? currentHourlyRate : recommendedHourly;
  const rateSource = hasCurrent ? 'current' : 'recommended';

  const vsMarket = compareToMarket(rateUnderReview, benchmark);
  const vsGoal = hasCurrent
    ? compareToGoal(currentHourlyRate, recommendedHourly)
    : { status: 'n/a', ratio: 1, gap: 0 };

  // Combined signal: market underpricing is primary; goal gap can worsen it
  const level = combineSignals(vsMarket, vsGoal, hasCurrent);
  const label = signalLabel(level);
  const summary = buildSummary({
    level,
    hasCurrent,
    rateUnderReview,
    vsMarket,
    vsGoal,
    categoryLabel,
    experienceLabel,
    benchmark,
  });

  // Free: short signal bullets. Paid: full market / goal explanations.
  const explanations = isPaid
    ? buildExplanations({
        hasCurrent,
        rateUnderReview,
        recommendedHourly,
        vsMarket,
        vsGoal,
        impliedAnnualFromCurrent,
        desiredAnnualIncome,
        benchmark,
        billableHoursOptimistic,
      })
    : buildBasicExplanations({
        hasCurrent,
        rateUnderReview,
        recommendedHourly,
        vsMarket,
        vsGoal,
        stage,
      });

  const metrics = {
    rateUnderReview,
    rateSource,
    marketLow: benchmark.low,
    marketMid: benchmark.mid,
    marketHigh: benchmark.high,
    marketPosition: vsMarket.position,
    marketRatio: vsMarket.ratioToMid,
    goalRatio: vsGoal.ratio,
    goalGap: vsGoal.gap,
  };

  /** @type {DiagnosticResult} */
  const result = {
    level,
    label,
    summary,
    explanations,
    metrics,
  };

  if (isPaid) {
    result.detailed = buildDetailedDiagnostic({
      vsMarket,
      vsGoal,
      hasCurrent,
      rateUnderReview,
      recommendedHourly,
      benchmark,
      categoryInsight,
      commonPitfall,
      billableHoursOptimistic,
      impliedAnnualFromCurrent,
      desiredAnnualIncome,
      categoryLabel,
      experienceLabel,
    });
  }

  return result;
}

/**
 * Free-tier signal copy: level + direction without full benchmark tables.
 */
function ctaForStage(stage, hasCurrent) {
  if (stage === 'paid') return null;
  if (stage === 'email') {
    return hasCurrent
      ? 'Activate a license below for market bands, project pricing, and a scored raise path.'
      : 'Activate a license below to unlock full market benchmarks and the detailed diagnostic.';
  }
  return hasCurrent
    ? 'Enter your email below for market bands, project pricing, and a scored raise path.'
    : 'Enter your email below to unlock full market benchmarks and the detailed diagnostic.';
}

function buildBasicExplanations({
  hasCurrent,
  rateUnderReview,
  recommendedHourly,
  vsMarket,
  vsGoal,
  stage,
}) {
  const lines = [];
  const rate = Math.round(rateUnderReview);

  if (hasCurrent) {
    lines.push(
      `Your current rate ($${rate}/hr) is ${vsMarket.position} for your category and experience.`
    );
    if (vsGoal.status !== 'on_track' && vsGoal.status !== 'n/a') {
      const pct = Math.round((1 - vsGoal.ratio) * 100);
      lines.push(
        `That sits roughly ${pct}% below the floor rate your take-home goal implies (~$${Math.round(recommendedHourly)}/hr).`
      );
    } else {
      lines.push(
        `Against your income goal, you’re near the floor rate of about $${Math.round(recommendedHourly)}/hr.`
      );
    }
  } else {
    lines.push(
      `Your goal-based floor is about $${rate}/hr — the minimum to hit your stated take-home after tax and expenses.`
    );
    lines.push(
      `Versus typical rates for your profile, that floor is ${vsMarket.position}.`
    );
  }

  const cta = ctaForStage(stage, hasCurrent);
  if (cta) lines.push(cta);

  return lines;
}

/**
 * Position rate on market band.
 * @returns {{ position: string, ratioToLow: number, ratioToMid: number, status: 'above_high'|'at_mid'|'below_mid'|'below_low'|'far_below' }}
 */
function compareToMarket(rate, benchmark) {
  const { low, mid, high } = benchmark;
  const ratioToLow = low > 0 ? rate / low : 1;
  const ratioToMid = mid > 0 ? rate / mid : 1;

  let status;
  let position;

  if (rate >= high) {
    status = 'above_high';
    position = 'at or above market high';
  } else if (rate >= mid) {
    status = 'at_mid';
    position = 'at or above market midpoint';
  } else if (rate >= low) {
    status = 'below_mid';
    position = 'between market low and mid';
  } else if (rate >= low * 0.75) {
    status = 'below_low';
    position = 'below market low';
  } else {
    status = 'far_below';
    position = 'well below market low';
  }

  return { position, ratioToLow, ratioToMid, status, low, mid, high };
}

function compareToGoal(current, recommended) {
  if (!recommended || recommended <= 0) {
    return { status: 'n/a', ratio: 1, gap: 0 };
  }
  const ratio = current / recommended;
  const gap = recommended - current;

  let status;
  if (ratio >= 0.95) status = 'on_track';
  else if (ratio >= 0.8) status = 'slight_gap';
  else if (ratio >= 0.6) status = 'material_gap';
  else status = 'severe_gap';

  return { status, ratio, gap };
}

/**
 * Market is primary; goal gap can escalate yellow → red or green → yellow.
 */
function combineSignals(vsMarket, vsGoal, hasCurrent) {
  let marketLevel;
  switch (vsMarket.status) {
    case 'above_high':
    case 'at_mid':
      marketLevel = 'green';
      break;
    case 'below_mid':
      marketLevel = 'yellow';
      break;
    case 'below_low':
      marketLevel = 'red';
      break;
    case 'far_below':
      marketLevel = 'red';
      break;
    default:
      marketLevel = 'yellow';
  }

  if (!hasCurrent) {
    // Evaluating recommended rate only — still useful market check
    return marketLevel;
  }

  // Escalate if goal gap is severe even when market looks okay
  if (vsGoal.status === 'severe_gap') {
    return 'red';
  }
  if (vsGoal.status === 'material_gap' && marketLevel === 'green') {
    return 'yellow';
  }
  if (vsGoal.status === 'material_gap' && marketLevel === 'yellow') {
    return 'red';
  }

  return marketLevel;
}

function signalLabel(level) {
  switch (level) {
    case 'green':
      return 'On Track';
    case 'yellow':
      return 'Caution';
    case 'red':
      return 'Underpricing';
    default:
      return 'Unknown';
  }
}

function buildSummary({
  level,
  hasCurrent,
  rateUnderReview,
  vsMarket,
  categoryLabel,
  experienceLabel,
  benchmark,
}) {
  const who = `${experienceLabel} ${categoryLabel}`.toLowerCase();
  const rate = Math.round(rateUnderReview);

  if (!hasCurrent) {
    if (level === 'green') {
      return `Your goal-based rate of $${rate}/hr sits in a healthy range for ${who} (market mid ≈ $${benchmark.mid}/hr).`;
    }
    if (level === 'yellow') {
      return `Your goal-based rate of $${rate}/hr is below the typical midpoint ($${benchmark.mid}/hr) for ${who}. Consider whether the income goal or hours need adjustment.`;
    }
    return `Your goal-based rate of $${rate}/hr is below the market floor (≈ $${benchmark.low}/hr) for ${who}. That usually means the income target needs more billable hours, lower overhead, or a higher market position.`;
  }

  if (level === 'green') {
    return `Your current rate of $${rate}/hr looks aligned with the market for ${who}.`;
  }
  if (level === 'yellow') {
    return `Your current rate of $${rate}/hr is soft versus market mid ($${benchmark.mid}/hr) for ${who}. Room to raise without leaving the typical band.`;
  }
  return `Your current rate of $${rate}/hr is significantly below market (low ≈ $${benchmark.low}/hr, mid ≈ $${benchmark.mid}/hr) for ${who}. This is a clear underpricing signal.`;
}

function buildExplanations(ctx) {
  const lines = [];
  const {
    hasCurrent,
    rateUnderReview,
    recommendedHourly,
    vsMarket,
    vsGoal,
    impliedAnnualFromCurrent,
    desiredAnnualIncome,
    benchmark,
    billableHoursOptimistic,
  } = ctx;

  lines.push(
    `Market band for your profile: $${benchmark.low}–$${benchmark.high}/hr (mid $${benchmark.mid}).`
  );

  lines.push(
    `Your ${hasCurrent ? 'current' : 'goal-based'} rate ($${Math.round(rateUnderReview)}/hr) is ${vsMarket.position}.`
  );

  if (hasCurrent) {
    lines.push(
      `To hit your take-home goal, your floor rate is about $${Math.round(recommendedHourly)}/hr at your stated hours, expenses, and tax rate.`
    );
    if (vsGoal.status !== 'on_track' && vsGoal.status !== 'n/a') {
      const pct = Math.round((1 - vsGoal.ratio) * 100);
      lines.push(
        `That is roughly ${pct}% below your floor rate (gap ≈ $${Math.round(vsGoal.gap)}/hr).`
      );
    }
    if (impliedAnnualFromCurrent != null) {
      lines.push(
        `At your current rate, estimated take-home after tax & expenses is about $${Math.round(impliedAnnualFromCurrent).toLocaleString()} vs a goal of $${Math.round(desiredAnnualIncome).toLocaleString()}.`
      );
    }
  } else {
    lines.push(
      `Enter your current hourly rate to compare what you charge today against both market and your floor rate.`
    );
  }

  if (billableHoursOptimistic) {
    lines.push(
      `Note: billing more than ~30 hours/week long-term is hard for most freelancers (sales, admin, and recovery eat capacity). If hours drop, your required rate rises.`
    );
  }

  return lines;
}

function buildDetailedDiagnostic(ctx) {
  const {
    vsMarket,
    vsGoal,
    hasCurrent,
    rateUnderReview,
    recommendedHourly,
    benchmark,
    categoryInsight,
    commonPitfall,
    billableHoursOptimistic,
    impliedAnnualFromCurrent,
    desiredAnnualIncome,
    categoryLabel,
    experienceLabel,
  } = ctx;

  const raiseToLow =
    rateUnderReview < benchmark.low
      ? Math.round(benchmark.low - rateUnderReview)
      : 0;
  const raiseToMid =
    rateUnderReview < benchmark.mid
      ? Math.round(benchmark.mid - rateUnderReview)
      : 0;
  const raiseToGoal =
    hasCurrent && recommendedHourly > rateUnderReview
      ? Math.round(recommendedHourly - rateUnderReview)
      : 0;

  const steps = [];
  if (raiseToLow > 0) {
    steps.push({
      title: 'Step 1 — Reach the market floor',
      detail: `Raise by about $${raiseToLow}/hr to clear the low end of the ${experienceLabel} ${categoryLabel} band ($${benchmark.low}/hr).`,
    });
  }
  if (raiseToMid > 0) {
    steps.push({
      title: raiseToLow > 0 ? 'Step 2 — Move toward mid-market' : 'Step 1 — Move toward mid-market',
      detail: `Another ~$${raiseToMid}/hr (from today) lands near the market midpoint ($${benchmark.mid}/hr), where positioning is easier to defend.`,
    });
  }
  if (raiseToGoal > 0 && Math.round(recommendedHourly) !== benchmark.mid) {
    steps.push({
      title: 'Align with your income goal',
      detail: `Your numbers imply ~$${Math.round(recommendedHourly)}/hr. That may sit above or below mid-market depending on hours and overhead — treat it as a personal floor, not a vanity number.`,
    });
  }
  if (steps.length === 0) {
    steps.push({
      title: 'Hold or selectively premium-price',
      detail:
        'You are at or above solid market levels. Focus on packaging, retainers, and higher-value scopes rather than discounting.',
    });
  }

  return {
    categoryInsight: categoryInsight || '',
    commonPitfall: commonPitfall || '',
    marketStatus: vsMarket.status,
    goalStatus: vsGoal.status,
    raiseToLow,
    raiseToMid,
    raiseToGoal,
    steps,
    incomeReality: hasCurrent
      ? {
          implied: impliedAnnualFromCurrent,
          goal: desiredAnnualIncome,
          shortfall:
            impliedAnnualFromCurrent != null
              ? Math.round(desiredAnnualIncome - impliedAnnualFromCurrent)
              : null,
        }
      : null,
    capacityWarning: billableHoursOptimistic
      ? 'Your billable-hour assumption is aggressive. Stress-test the math at 20–25 hrs/week.'
      : null,
    scorecard: {
      marketFit: scoreFromMarket(vsMarket.status),
      goalFit: hasCurrent ? scoreFromGoal(vsGoal.status) : null,
      overall: scoreOverall(vsMarket.status, vsGoal.status, hasCurrent),
    },
  };
}

function scoreFromMarket(status) {
  const map = {
    above_high: 95,
    at_mid: 85,
    below_mid: 60,
    below_low: 35,
    far_below: 15,
  };
  return map[status] ?? 50;
}

function scoreFromGoal(status) {
  const map = {
    on_track: 90,
    slight_gap: 70,
    material_gap: 40,
    severe_gap: 15,
    'n/a': null,
  };
  return map[status] ?? 50;
}

function scoreOverall(marketStatus, goalStatus, hasCurrent) {
  const m = scoreFromMarket(marketStatus);
  if (!hasCurrent) return m;
  const g = scoreFromGoal(goalStatus);
  if (g == null) return m;
  return Math.round(m * 0.55 + g * 0.45);
}
