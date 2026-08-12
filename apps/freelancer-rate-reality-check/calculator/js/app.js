/**
 * UI controller — The Freelancer's Rate Reality Check calculator.
 * Vanilla ES modules, client-side only.
 *
 * Access stages: free results → email capture → paid unlock (verified license).
 */

import {
  CATEGORIES,
  EXPERIENCE_LEVELS,
  MARKET_MULTIPLIERS,
  CATEGORY_INSIGHTS,
  getBenchmark,
} from './benchmarks.js';
import {
  calculateRates,
  formatMoney,
  formatRateRange,
  DEFAULT_BILLABLE_WEEKS,
  DEFAULT_TAX_RATE_PERCENT,
  DEFAULT_WORKING_HOURS_PER_WEEK,
} from './calculator.js';
import { diagnoseUnderpricing } from './underpricing.js';
import {
  captureEmail,
  clearEmailCapture,
  clearLicense,
  getEntitlements,
  getStoredEmail,
  migrateLegacyTierToggle,
  activateLicense,
  refreshLicenseVerification,
} from './entitlements.js';

const STORAGE_KEYS = {
  scenarios: 'frrc_scenarios',
  form: 'frrc_last_form_v2',
};

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgawyyny';

const DEFAULTS = {
  category: 'writing',
  experience: 'intermediate',
  market: 'global',
  desiredNetIncome: 70000,
  currentHourlyRate: '',
  billableHoursPerWeek: 25,
  annualExpenses: 9000,
  taxRatePercent: DEFAULT_TAX_RATE_PERCENT,
};

// —— DOM helpers ——
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function readForm() {
  const currentRaw = $('#currentHourlyRate').value.trim();
  return {
    category: $('#category').value,
    experience: $('#experience').value,
    market: $('#market').value,
    desiredNetIncome: num($('#desiredNetIncome').value),
    currentHourlyRate: currentRaw === '' ? null : num(currentRaw),
    billableHoursPerWeek: num($('#billableHoursPerWeek').value),
    annualExpenses: num($('#annualExpenses').value),
    taxRatePercent: num($('#taxRatePercent').value),
  };
}

function num(v) {
  const n = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Apply free / email / paid stage to the document and gated sections.
 * Post-email (“You’re on the list”) only after a valid captured email.
 */
function applyAccessUI() {
  const ent = getEntitlements();
  const email = ent.email || getStoredEmail();
  const hasValidEmail = Boolean(ent.hasEmail && email);

  document.body.dataset.stage = ent.isPaid ? 'paid' : hasValidEmail ? 'email' : 'free';
  document.body.dataset.paid = ent.isPaid ? 'true' : 'false';
  document.body.dataset.email = hasValidEmail ? 'true' : 'false';

  // Paid feature blocks
  $$('.paid-only').forEach((el) => {
    el.hidden = !ent.isPaid;
  });

  // Email gate: show after free results when email not yet captured and not paid
  const emailGate = $('#emailGate');
  const postEmail = $('#postEmailUpsell');
  if (!emailGate || !postEmail) return ent;

  if (ent.isPaid) {
    emailGate.hidden = true;
    postEmail.hidden = true;
  } else if (hasValidEmail) {
    emailGate.hidden = true;
    postEmail.hidden = false;
    $('#emailThanks').textContent =
      `Thanks, ${email} — activate a license below for the full diagnostic, or hang tight for checkout.`;
  } else {
    emailGate.hidden = false;
    postEmail.hidden = true;
  }

  return ent;
}

// —— Populate selects ——
function initSelects() {
  const catSel = $('#category');
  CATEGORIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.label;
    catSel.appendChild(opt);
  });

  const expSel = $('#experience');
  EXPERIENCE_LEVELS.forEach((e) => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = `${e.label} (${e.yearsHint})`;
    expSel.appendChild(opt);
  });

  const mktSel = $('#market');
  Object.entries(MARKET_MULTIPLIERS).forEach(([id, m]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = m.label;
    mktSel.appendChild(opt);
  });
}

function applyDefaults() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.form) || 'null');
  } catch {
    saved = null;
  }
  const d = { ...DEFAULTS, ...(saved || {}) };

  if (d.desiredAnnualIncome != null && d.desiredNetIncome == null) {
    d.desiredNetIncome = d.desiredAnnualIncome;
  }
  if (d.overheadPercent != null && d.annualExpenses == null) {
    d.annualExpenses = DEFAULTS.annualExpenses;
  }
  if (d.taxRatePercent == null) {
    d.taxRatePercent = DEFAULT_TAX_RATE_PERCENT;
  }

  $('#category').value = d.category;
  $('#experience').value = d.experience;
  $('#market').value = d.market;
  $('#desiredNetIncome').value = d.desiredNetIncome;
  $('#currentHourlyRate').value =
    d.currentHourlyRate === '' || d.currentHourlyRate == null
      ? ''
      : d.currentHourlyRate;
  $('#billableHoursPerWeek').value = d.billableHoursPerWeek;
  $('#annualExpenses').value = d.annualExpenses ?? DEFAULTS.annualExpenses;
  $('#taxRatePercent').value = d.taxRatePercent;
  $('#taxRateValue').textContent = `${d.taxRatePercent}%`;
}

// —— Main compute + render ——
function run() {
  const form = readForm();
  localStorage.setItem(STORAGE_KEYS.form, JSON.stringify(form));

  const rates = calculateRates({
    desiredNetIncome: form.desiredNetIncome,
    billableHoursPerWeek: form.billableHoursPerWeek,
    annualExpenses: form.annualExpenses,
    taxRatePercent: form.taxRatePercent,
    currentHourlyRate: form.currentHourlyRate,
    billableWeeks: DEFAULT_BILLABLE_WEEKS,
    workingHoursPerWeek: DEFAULT_WORKING_HOURS_PER_WEEK,
  });

  const benchmark = getBenchmark(form.category, form.experience, form.market);
  const catMeta = CATEGORIES.find((c) => c.id === form.category);
  const expMeta = EXPERIENCE_LEVELS.find((e) => e.id === form.experience);
  const insight = CATEGORY_INSIGHTS[form.category] || CATEGORY_INSIGHTS.other;
  const ent = getEntitlements();

  const diagnostic = diagnoseUnderpricing({
    currentHourlyRate: form.currentHourlyRate,
    recommendedHourly: rates.floorHourly,
    benchmark,
    impliedAnnualFromCurrent: rates.impliedNetFromCurrent,
    desiredAnnualIncome: form.desiredNetIncome,
    isPaid: ent.isPaid,
    stage: ent.stage,
    categoryLabel: catMeta?.label || form.category,
    experienceLabel: expMeta?.label || form.experience,
    categoryInsight: insight.note,
    commonPitfall: insight.commonPitfall,
    billableHoursOptimistic: rates.billableHoursOptimistic,
  });

  renderResults(form, rates, benchmark, diagnostic, ent);
  return { form, rates, benchmark, diagnostic, ent };
}

function renderResults(form, rates, benchmark, diagnostic, ent) {
  const results = $('#results');
  results.hidden = false;
  $('#emptyState').hidden = true;

  // —— Free core ——
  $('#outFloorRate').textContent = `${formatMoney(rates.floorHourly)}/hr`;
  $('#outFloorNote').textContent =
    'Hits your take-home target with zero buffer';

  $('#outRecommendedRange').textContent = formatRateRange(
    rates.recommendedHourlyLow,
    rates.recommendedHourlyHigh
  );
  $('#outRecommendedMid').textContent = `${formatMoney(rates.recommendedHourly)}/hr mid (+20% buffer)`;

  $('#outEffectiveRate').textContent = `${formatMoney(rates.effectiveRate)}/hr`;
  const rateSource =
    form.currentHourlyRate != null ? 'your current rate' : 'the recommended rate';
  $('#outEffectiveNote').textContent = `True net after tax, expenses, and non-billable time — based on ${rateSource} across ~${rates.annualWorkingHours} working hrs/year`;

  // Basic underpricing signal (always free)
  const signal = $('#signal');
  signal.dataset.level = diagnostic.level;
  $('#signalBadge').textContent = diagnostic.label;
  $('#signalSummary').textContent = diagnostic.summary;
  $('#signalExplanations').innerHTML = diagnostic.explanations
    .map((e) => `<li>${escapeHtml(e)}</li>`)
    .join('');

  // Gap callout when current rate present (free)
  const gap = $('#goalGap');
  if (form.currentHourlyRate != null && rates.gapToFloor != null) {
    gap.hidden = false;
    if (rates.gapToFloor > 5) {
      gap.textContent = `You are about ${formatMoney(rates.gapToFloor)}/hr below your floor rate (${rates.gapToFloorPercent}% short of the minimum to hit your take-home target).`;
      gap.dataset.tone = 'warn';
    } else if (
      rates.gapToRecommended != null &&
      rates.gapToRecommended > 5 &&
      rates.gapToFloor <= 5
    ) {
      gap.textContent = `You clear the floor rate, but sit about ${formatMoney(rates.gapToRecommended)}/hr below the recommended rate (with buffer).`;
      gap.dataset.tone = 'warn';
    } else if (rates.gapToFloor < -5) {
      gap.textContent = `Your current rate is about ${formatMoney(Math.abs(rates.gapToFloor))}/hr above the floor needed for your stated take-home.`;
      gap.dataset.tone = 'good';
    } else {
      gap.textContent =
        'Your current rate roughly matches the floor rate required for your take-home target.';
      gap.dataset.tone = 'good';
    }
  } else {
    gap.hidden = true;
  }

  $('#hoursWarning').hidden = !rates.billableHoursOptimistic;

  // Access stage UI (email gate / post-email upsell / paid)
  applyAccessUI();

  // —— Paid-only richer content ——
  if (!ent.isPaid) {
    return;
  }

  $('#outMarketRange').textContent = formatRateRange(benchmark.low, benchmark.high);
  $('#outMarketMid').textContent = `mid ${formatMoney(benchmark.mid)}/hr · ${benchmark.marketLabel}`;

  $('#outBillableHours').textContent = `${rates.annualBillableHours} billable hrs/year`;
  $('#outRevenueNeeded').textContent = formatMoney(rates.revenueNeeded);
  $('#outExpenses').textContent = formatMoney(rates.annualExpenses);
  $('#outWorkingHours').textContent = `${rates.annualWorkingHours} hrs`;

  const projEl = $('#outProjects');
  projEl.innerHTML = rates.projectGuidance
    .map(
      (p) => `
      <div class="project-card">
        <div class="project-label">${escapeHtml(p.label)}</div>
        <div class="project-range">${formatMoney(p.low)} – ${formatMoney(p.high)}</div>
        <div class="project-mid">Typical ~ ${formatMoney(p.mid)}</div>
      </div>`
    )
    .join('');

  $('#outInterpretation').textContent = buildInterpretation(form, rates, diagnostic);

  if (diagnostic.detailed) {
    renderPaidDetail(diagnostic.detailed);
  }

  renderScenarioList();
}

function renderPaidDetail(detailed) {
  const score = detailed.scorecard;
  $('#detailScore').textContent =
    score.overall != null ? `${score.overall}/100` : '—';
  $('#detailScoreMarket').textContent =
    score.marketFit != null ? `${score.marketFit}` : '—';
  $('#detailScoreGoal').textContent =
    score.goalFit != null ? `${score.goalFit}` : 'n/a';

  $('#detailInsight').textContent = detailed.categoryInsight;
  $('#detailPitfall').textContent = detailed.commonPitfall;

  $('#detailSteps').innerHTML = detailed.steps
    .map(
      (s) => `
      <li>
        <strong>${escapeHtml(s.title)}</strong>
        <p>${escapeHtml(s.detail)}</p>
      </li>`
    )
    .join('');

  const cap = $('#detailCapacity');
  if (detailed.capacityWarning) {
    cap.hidden = false;
    cap.textContent = detailed.capacityWarning;
  } else {
    cap.hidden = true;
  }

  const inc = $('#detailIncome');
  if (detailed.incomeReality && detailed.incomeReality.implied != null) {
    inc.hidden = false;
    const short = detailed.incomeReality.shortfall;
    const amp = String.fromCharCode(38);
    inc.innerHTML = `
      <strong>Income reality check</strong>
      <p>Implied take-home after tax ${amp} expenses: <strong>${formatMoney(detailed.incomeReality.implied)}</strong>
      vs goal <strong>${formatMoney(detailed.incomeReality.goal)}</strong>
      ${
        short > 0
          ? `— shortfall of <strong>${formatMoney(short)}</strong>/year.`
          : short < 0
            ? `— surplus of <strong>${formatMoney(Math.abs(short))}</strong>/year.`
            : '— on target.'
      }</p>`;
  } else {
    inc.hidden = true;
  }
}

function buildInterpretation(form, rates, diagnostic) {
  const parts = [];
  parts.push(
    `To take home about ${formatMoney(form.desiredNetIncome)}/year after ${formatMoney(form.annualExpenses)} expenses and ~${form.taxRatePercent}% tax, you need roughly ${formatMoney(rates.revenueNeeded)} in revenue. At ${form.billableHoursPerWeek} billable hrs/week × 48 weeks (${rates.annualBillableHours} hrs), that is a floor of ${formatMoney(rates.floorHourly)}/hr — and a recommended rate near ${formatMoney(rates.recommendedHourly)}/hr with buffer.`
  );
  parts.push(
    `Your effective rate — true net per hour of working life after tax, expenses, and non-billable time — is about ${formatMoney(rates.effectiveRate)}/hr across ~${rates.annualWorkingHours} working hours/year.`
  );

  if (diagnostic.level === 'red') {
    parts.push(
      'The underpricing signal is red: clients may be trained on a rate that does not fund a sustainable business. Prioritize raising rates on new work and rewriting packages before adding more low-rate volume.'
    );
  } else if (diagnostic.level === 'yellow') {
    parts.push(
      'The signal is yellow: you are not necessarily "wrong," but you have clear headroom toward mid-market without needing elite credentials.'
    );
  } else {
    parts.push(
      'The signal is green: focus on scope control, retainers, and selective premium work rather than racing to the bottom on price.'
    );
  }

  return parts.join(' ');
}

function escapeHtml(str) {
  const amp = String.fromCharCode(38);
  return String(str)
    .replace(/&/g, amp + 'amp;')
    .replace(/</g, amp + 'lt;')
    .replace(/>/g, amp + 'gt;')
    .replace(/"/g, amp + 'quot;');
}

// —— Scenarios (paid) ——
function loadScenarios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.scenarios) || '[]');
  } catch {
    return [];
  }
}

function saveScenarios(list) {
  localStorage.setItem(STORAGE_KEYS.scenarios, JSON.stringify(list));
}

function renderScenarioList() {
  const list = loadScenarios();
  const el = $('#scenarioList');
  if (!el) return;
  if (!list.length) {
    el.innerHTML = '<p class="muted">No saved scenarios yet.</p>';
    return;
  }
  el.innerHTML = list
    .map(
      (s, i) => `
      <div class="scenario-item" data-id="${escapeHtml(s.id)}">
        <div>
          <strong>${escapeHtml(s.name)}</strong>
          <div class="muted small">${escapeHtml(s.summary)}</div>
        </div>
        <div class="scenario-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-action="load" data-idx="${i}">Load</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="delete" data-idx="${i}">Delete</button>
        </div>
      </div>`
    )
    .join('');
}

function saveCurrentScenario() {
  if (!getEntitlements().isPaid) return;
  const { form, rates, diagnostic } = run();
  const nameInput = $('#scenarioName');
  const name =
    nameInput.value.trim() ||
    `${form.category} · ${form.experience} · ${new Date().toLocaleDateString()}`;

  const summary = `Floor ${formatMoney(rates.floorHourly)}/hr · Rec ${formatMoney(rates.recommendedHourly)}/hr · signal: ${diagnostic.label}`;

  const list = loadScenarios();
  list.unshift({
    id: `s_${Date.now()}`,
    name,
    summary,
    form,
    savedAt: new Date().toISOString(),
  });
  saveScenarios(list.slice(0, 20));
  nameInput.value = '';
  renderScenarioList();
}

function loadScenario(idx) {
  const list = loadScenarios();
  const s = list[idx];
  if (!s?.form) return;
  const f = s.form;
  $('#category').value = f.category;
  $('#experience').value = f.experience;
  $('#market').value = f.market;
  $('#desiredNetIncome').value =
    f.desiredNetIncome ?? f.desiredAnnualIncome ?? DEFAULTS.desiredNetIncome;
  $('#currentHourlyRate').value =
    f.currentHourlyRate == null ? '' : f.currentHourlyRate;
  $('#billableHoursPerWeek').value = f.billableHoursPerWeek;
  $('#annualExpenses').value = f.annualExpenses ?? DEFAULTS.annualExpenses;
  $('#taxRatePercent').value = f.taxRatePercent ?? DEFAULT_TAX_RATE_PERCENT;
  $('#taxRateValue').textContent = `${$('#taxRatePercent').value}%`;
  run();
}

function deleteScenario(idx) {
  const list = loadScenarios();
  list.splice(idx, 1);
  saveScenarios(list);
  renderScenarioList();
}

// —— Export (paid) ——
function exportResults() {
  if (!getEntitlements().isPaid) return;
  const { form, rates, benchmark, diagnostic } = run();
  const cat = CATEGORIES.find((c) => c.id === form.category)?.label;
  const exp = EXPERIENCE_LEVELS.find((e) => e.id === form.experience)?.label;

  const lines = [
    "The Freelancer's Rate Reality Check — Export",
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '=== Inputs ===',
    `Profession: ${cat}`,
    `Experience: ${exp}`,
    `Market: ${benchmark.marketLabel}`,
    `Desired take-home: ${formatMoney(form.desiredNetIncome)}`,
    `Annual expenses: ${formatMoney(form.annualExpenses)}`,
    `Tax rate: ${form.taxRatePercent}%`,
    `Current hourly rate: ${form.currentHourlyRate != null ? formatMoney(form.currentHourlyRate) + '/hr' : 'not provided'}`,
    `Billable hours/week: ${form.billableHoursPerWeek}`,
    '',
    '=== Rates (ebook-aligned) ===',
    `Floor rate (minimum viable): ${formatMoney(rates.floorHourly)}/hr`,
    `Recommended range (+15–25%): ${formatRateRange(rates.recommendedHourlyLow, rates.recommendedHourlyHigh)}`,
    `Recommended mid (+20%): ${formatMoney(rates.recommendedHourly)}/hr`,
    `Effective rate (true net / life-hour): ${formatMoney(rates.effectiveRate)}/hr`,
    `Effective at floor: ${formatMoney(rates.effectiveRateAtFloor)}/hr`,
    `Annual billable hours: ${rates.annualBillableHours}`,
    `Annual working hours: ${rates.annualWorkingHours}`,
    `Revenue needed: ${formatMoney(rates.revenueNeeded)}`,
    `Annual expenses: ${formatMoney(rates.annualExpenses)}`,
    `Pre-tax subtotal (net + expenses): ${formatMoney(rates.preTaxSubtotal)}`,
    '',
    '=== Market benchmark ===',
    `Band: ${formatRateRange(benchmark.low, benchmark.high)} (mid ${formatMoney(benchmark.mid)})`,
    '',
    '=== Project guidance ===',
    ...rates.projectGuidance.map(
      (p) =>
        `${p.label}: ${formatMoney(p.low)} – ${formatMoney(p.high)} (typ. ${formatMoney(p.mid)})`
    ),
    '',
    '=== Underpricing signal ===',
    `Level: ${diagnostic.label} (${diagnostic.level})`,
    diagnostic.summary,
    ...diagnostic.explanations.map((e) => `• ${e}`),
    '',
    '=== Interpretation ===',
    buildInterpretation(form, rates, diagnostic),
  ];

  if (diagnostic.detailed) {
    lines.push('', '=== Detailed diagnostic (full version) ===');
    lines.push(`Overall score: ${diagnostic.detailed.scorecard.overall}/100`);
    lines.push(`Category insight: ${diagnostic.detailed.categoryInsight}`);
    lines.push(`Common pitfall: ${diagnostic.detailed.commonPitfall}`);
    diagnostic.detailed.steps.forEach((s) => {
      lines.push(`${s.title}: ${s.detail}`);
    });
  }

  lines.push(
    '',
    '---',
    "Companion tool for The Freelancer's Rate Reality Check.",
    'Formula: revenue = (take-home + expenses) / (1 - tax%); floor = revenue / billable hours; recommended = floor x 1.15-1.25.'
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rate-reality-check-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// —— Email + license ——
/**
 * Best-effort Formspree POST. Must not block or reverse the local email stage.
 * @param {string} email
 */
function submitEmailToFormspree(email) {
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      source: 'calculator',
    }),
  }).catch(() => {
    /* ignore network / CORS / Formspree errors */
  });
}

function handleEmailSubmit(e) {
  e.preventDefault();
  const err = $('#emailError');
  err.hidden = true;
  const result = captureEmail($('#emailInput').value);
  if (!result.ok) {
    err.textContent = result.error;
    err.hidden = false;
    return;
  }
  submitEmailToFormspree(result.email);
  run();
  $('#postEmailUpsell')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleLicenseSubmit(e) {
  e.preventDefault();
  const err = $('#licenseError');
  const btn = $('#btnLicenseSubmit');
  err.hidden = true;
  const prevLabel = btn ? btn.textContent : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Checking…';
  }
  try {
    const result = await activateLicense($('#licenseInput').value);
    if (!result.ok) {
      err.textContent = result.error;
      err.hidden = false;
      return;
    }
    run();
    $('#paidFeatures')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = prevLabel || 'Activate full version';
    }
  }
}

// —— Events ——
function bindEvents() {
  const form = $('#calcForm');
  form.addEventListener('input', (e) => {
    if (e.target.id === 'taxRatePercent') {
      $('#taxRateValue').textContent = `${e.target.value}%`;
    }
    run();
  });
  form.addEventListener('change', () => run());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });

  $('#emailForm')?.addEventListener('submit', handleEmailSubmit);
  $('#licenseForm')?.addEventListener('submit', handleLicenseSubmit);

  $('#btnSaveScenario')?.addEventListener('click', () => saveCurrentScenario());
  $('#btnExport')?.addEventListener('click', () => exportResults());
  $('#btnReset')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.form);
    applyDefaults();
    run();
  });

  $('#scenarioList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    if (btn.dataset.action === 'load') loadScenario(idx);
    if (btn.dataset.action === 'delete') deleteScenario(idx);
  });
}

// —— Boot ——
async function init() {
  migrateLegacyTierToggle();
  initSelects();
  applyDefaults();
  bindEvents();
  applyAccessUI();
  run();
  const refresh = await refreshLicenseVerification();
  if (!refresh.skipped) {
    applyAccessUI();
    run();
  }
}

init();

export { clearEmailCapture, clearLicense, getEntitlements };
