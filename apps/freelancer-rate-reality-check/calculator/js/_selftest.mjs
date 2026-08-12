/**
 * Self-test for tax-aware rate math (ebook Chapter 3 alignment).
 * Run with: node js/_selftest.mjs  (requires Node)
 */
import { calculateRates } from './calculator.js';
import { getBenchmark } from './benchmarks.js';
import { diagnoseUnderpricing } from './underpricing.js';
import {
  activateLicense,
  captureEmail,
  clearEmailCapture,
  clearLicense,
  getEntitlements,
  getLicenseKey,
  getStoredEmail,
  hasEmailCaptured,
  hasPaidAccess,
  migrateLegacyTierToggle,
  refreshLicenseVerification,
  setLicenseKey,
  validateEmail,
  VERIFY_LICENSE_PATH,
} from './entitlements.js';

// Minimal localStorage so entitlements can be tested in Node
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

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

// —— Entitlements: empty storage must stay on free / email-gate stage ——
assert(getStoredEmail() === null, 'clean storage: no stored email');
assert(hasEmailCaptured() === false, 'clean storage: email not captured');
const cleanEnt = getEntitlements();
assert(cleanEnt.hasEmail === false, 'clean storage: hasEmail is false');
assert(cleanEnt.email === null, 'clean storage: email is null');
assert(cleanEnt.stage === 'free', 'clean storage: stage is free');
assert(cleanEnt.isPaid === false, 'clean storage: not paid');

assert(validateEmail('').ok === false, 'empty email is invalid');
assert(validateEmail('not-an-email').ok === false, 'malformed email is invalid');
assert(captureEmail('').ok === false, 'capture rejects empty email');
assert(captureEmail('nope').ok === false, 'capture rejects invalid email');
assert(getStoredEmail() === null, 'failed capture does not persist email');
assert(getEntitlements().stage === 'free', 'failed capture leaves stage free');

localStorage.setItem('frrc_email', '   ');
assert(getStoredEmail() === null, 'whitespace stored email is ignored');
assert(getEntitlements().stage === 'free', 'whitespace stored email stays free');
localStorage.setItem('frrc_email', 'not-valid');
assert(getStoredEmail() === null, 'invalid stored email is ignored');
assert(getEntitlements().hasEmail === false, 'invalid stored email does not set hasEmail');
localStorage.removeItem('frrc_email');

const captured = captureEmail('Alex@Example.com');
assert(captured.ok === true && captured.email === 'alex@example.com', 'capture accepts and normalizes email');
assert(getStoredEmail() === 'alex@example.com', 'valid capture persists email');
assert(hasEmailCaptured() === true, 'valid capture sets hasEmailCaptured');
assert(getEntitlements().stage === 'email', 'valid capture moves stage to email');
assert(getEntitlements().hasEmail === true, 'valid capture sets hasEmail');

// —— License field: server verification only; never silent-store; no public bypass ——
let lastFetch = null;
let fetchImpl = async () => {
  throw new Error('fetch not stubbed');
};
globalThis.fetch = async (url, opts) => {
  lastFetch = { url, opts };
  return fetchImpl(url, opts);
};

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

clearLicense();
const emptyKey = await activateLicense('');
assert(emptyKey.ok === false, 'empty license key is rejected');
assert(getLicenseKey() === null, 'empty license key is not stored');
assert(lastFetch === null, 'empty license key does not call the verifier');

const syncReject = setLicenseKey('LS-ABCDEFGHIJ');
assert(syncReject.ok === false, 'setLicenseKey no longer stores unverified keys');
assert(getLicenseKey() === null, 'setLicenseKey does not persist a key');
assert(hasPaidAccess() === false, 'setLicenseKey does not unlock paid');

const publicDev = await activateLicense('DEV-UNLOCK');
assert(publicDev.ok === false, 'DEV-UNLOCK via public license field is rejected');
assert(
  typeof publicDev.error === 'string' && !publicDev.error.includes('DEV-UNLOCK'),
  'public license error does not advertise DEV-UNLOCK'
);
assert(getLicenseKey() === null, 'rejected DEV-UNLOCK is not stored');
assert(hasPaidAccess() === false, 'DEV-UNLOCK via license field does not unlock paid');
assert(lastFetch === null, 'DEV-UNLOCK is not sent to the verifier');

fetchImpl = async () => jsonResponse(200, { valid: false, error: 'That license key isn’t valid.' });
const invalidRemote = await activateLicense('38b1460a-5104-4067-a91d-77b872934d51');
assert(invalidRemote.ok === false, 'server-invalid key is rejected');
assert(typeof invalidRemote.error === 'string' && invalidRemote.error.length > 0, 'invalid key has an error');
assert(getLicenseKey() === null, 'invalid key is not stored');
assert(hasPaidAccess() === false, 'invalid key does not unlock paid');
assert(lastFetch && lastFetch.url === VERIFY_LICENSE_PATH, 'verifier is called at the Netlify function path');
assert(lastFetch.opts.method === 'POST', 'verifier is called with POST');

fetchImpl = async () => {
  throw new Error('offline');
};
const offline = await activateLicense('38b1460a-5104-4067-a91d-77b872934d51');
assert(offline.ok === false, 'network failure does not unlock paid');
assert(getLicenseKey() === null, 'network failure does not store a key');
assert(hasPaidAccess() === false, 'network failure leaves access unpaid');

fetchImpl = async () => jsonResponse(200, { valid: true, status: 'active' });
const verified = await activateLicense('38b1460a-5104-4067-a91d-77b872934d51');
assert(verified.ok === true, 'server-valid key is accepted');
assert(getLicenseKey() === '38b1460a-5104-4067-a91d-77b872934d51', 'valid key is stored as submitted');
assert(hasPaidAccess() === true, 'verified key unlocks paid');
assert(getEntitlements().stage === 'paid', 'verified key sets paid stage');
assert(getEntitlements().isPaid === true, 'verified key sets isPaid');

fetchImpl = async () => jsonResponse(200, { valid: false, error: 'That license key isn’t valid.' });
const revoked = await refreshLicenseVerification();
assert(revoked.ok === false, 're-check revokes when the server says invalid');
assert(hasPaidAccess() === false, 'revoked key no longer unlocks paid');
assert(getLicenseKey() === null, 'revoked key is cleared');

fetchImpl = async () => jsonResponse(200, { valid: true, status: 'active' });
await activateLicense('38b1460a-5104-4067-a91d-77b872934d51');
fetchImpl = async () => {
  throw new Error('offline');
};
const kept = await refreshLicenseVerification();
assert(kept.ok === true, 'network error on re-check keeps last verified state');
assert(hasPaidAccess() === true, 'verified access survives a re-check outage');
clearLicense();

localStorage.setItem('frrc_license_key', 'DEV-UNLOCK');
assert(hasPaidAccess() === false, 'leftover stored DEV-UNLOCK does not grant paid');
localStorage.setItem('frrc_license_key', 'LS-1234567890');
assert(hasPaidAccess() === false, 'leftover stored LS- key without verify flag does not grant paid');
clearLicense();

function setLocation({ hostname = 'localhost', search = '' } = {}) {
  globalThis.window = { location: { hostname, search } };
}

localStorage.setItem('frrc_dev_paid', '1');
setLocation({ hostname: 'example.netlify.app', search: '?dev_paid=1' });
assert(hasPaidAccess() === false, 'dev flags do not unlock on a public host');
assert(getEntitlements().isPaid === false, 'public host stays unpaid with leftover dev flags');
migrateLegacyTierToggle();
assert(localStorage.getItem('frrc_dev_paid') == null, 'public host clears leftover localStorage dev flag');

setLocation({ hostname: 'localhost', search: '' });
localStorage.setItem('frrc_dev_paid', '1');
assert(hasPaidAccess() === true, 'dev storage flag unlocks on localhost only');
assert(getEntitlements().stage === 'paid', 'localhost dev flag sets paid stage');
localStorage.removeItem('frrc_dev_paid');
assert(hasPaidAccess() === false, 'clearing localhost dev flag removes paid');

setLocation({ hostname: '127.0.0.1', search: '?dev_paid=1' });
assert(hasPaidAccess() === true, 'query flag unlocks on loopback only');
setLocation({ hostname: 'localhost', search: '' });
assert(hasPaidAccess() === false, 'loopback without flag stays unpaid');

// —— Underpricing CTA is stage-aware ——
const diagFree = diagnoseUnderpricing({
  currentHourlyRate: 50,
  recommendedHourly: withCurrent.floorHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: withCurrent.impliedNetFromCurrent,
  desiredAnnualIncome: 70000,
  isPaid: false,
  stage: 'free',
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
assert(
  diagFree.explanations.some((e) => e.includes('Enter your email below')),
  'free stage CTA asks for email'
);
assert(
  !diagFree.explanations.some((e) => e.includes('Activate a license')),
  'free stage CTA does not mention license'
);

const diagEmail = diagnoseUnderpricing({
  currentHourlyRate: 50,
  recommendedHourly: withCurrent.floorHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: withCurrent.impliedNetFromCurrent,
  desiredAnnualIncome: 70000,
  isPaid: false,
  stage: 'email',
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
assert(
  diagEmail.explanations.some((e) => e.includes('Activate a license below')),
  'email stage CTA points to license upsell'
);
assert(
  !diagEmail.explanations.some((e) => e.includes('Enter your email below')),
  'email stage CTA does not ask for email'
);

const diagEmailNoRate = diagnoseUnderpricing({
  currentHourlyRate: null,
  recommendedHourly: ebook.floorHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: null,
  desiredAnnualIncome: 70000,
  isPaid: false,
  stage: 'email',
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
assert(
  diagEmailNoRate.explanations.some((e) => e.includes('Activate a license below')),
  'email stage CTA (no current rate) points to license upsell'
);
assert(
  !diagEmailNoRate.explanations.some((e) => e.includes('Enter your email below')),
  'email stage CTA (no current rate) does not ask for email'
);

const diagPaid = diagnoseUnderpricing({
  currentHourlyRate: 50,
  recommendedHourly: withCurrent.floorHourly,
  benchmark: bench,
  impliedAnnualFromCurrent: withCurrent.impliedNetFromCurrent,
  desiredAnnualIncome: 70000,
  isPaid: true,
  stage: 'paid',
  categoryLabel: 'Writing',
  experienceLabel: 'Intermediate',
});
assert(
  !diagPaid.explanations.some((e) => e.includes('Enter your email below')),
  'paid stage has no email CTA'
);
assert(
  !diagPaid.explanations.some((e) => e.includes('Activate a license')),
  'paid stage has no license CTA'
);

clearEmailCapture();
clearLicense();

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
