/**
 * Access / entitlement layer for free → email → paid.
 *
 * Production:
 *   - Free results always available
 *   - Email capture gates the path to richer content
 *   - Paid unlock only after the Netlify function verifies a Lemon Squeezy key
 *   - Local test unlocks are ignored on any non-loopback host
 */

const STORAGE = {
  email: 'frrc_email',
  emailCapturedAt: 'frrc_email_captured_at',
  license: 'frrc_license_key',
  /** Set to "valid" only after the Netlify function confirms the key */
  licenseStatus: 'frrc_license_status',
  licenseVerifiedAt: 'frrc_license_verified_at',
  /** @deprecated old prototype toggle — migrated once then ignored */
  legacyTier: 'frrc_tier',
  devPaid: 'frrc_dev_paid',
};

/** Same-origin Netlify Function (also aliased at /api/verify-license). */
export const VERIFY_LICENSE_PATH = '/.netlify/functions/verify-license';

/**
 * @typedef {Object} Entitlements
 * @property {boolean} hasEmail
 * @property {string|null} email
 * @property {boolean} isPaid
 * @property {'free'|'email'|'paid'} stage
 * @property {string|null} licenseKey
 * @property {boolean} devUnlock
 */

function readQuery() {
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return new URLSearchParams();
  }
}

/** Loopback only. Production, previews, and tunnels never qualify. */
function isLocalDevHost() {
  try {
    const host = String(window.location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
  } catch {
    return false;
  }
}

function isDevPaidFlag() {
  if (!isLocalDevHost()) return false;
  const q = readQuery();
  if (q.get('dev_paid') === '1' || q.get('dev_paid') === 'true') return true;
  try {
    return localStorage.getItem(STORAGE.devPaid) === '1';
  } catch {
    return false;
  }
}

/**
 * Normalize and lightly validate email for local capture.
 * @param {string} raw
 * @returns {{ ok: true, email: string } | { ok: false, error: string }}
 */
export function validateEmail(raw) {
  const email = String(raw || '').trim().toLowerCase();
  if (!email) return { ok: false, error: 'Enter your email address.' };
  // Practical client-side check — not RFC-complete
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return { ok: false, error: 'That doesn’t look like a valid email.' };
  return { ok: true, email };
}

export function getStoredEmail() {
  try {
    const raw = localStorage.getItem(STORAGE.email);
    if (raw == null) return null;
    const result = validateEmail(raw);
    return result.ok ? result.email : null;
  } catch {
    return null;
  }
}

export function hasEmailCaptured() {
  return Boolean(getStoredEmail());
}

/**
 * Persist email capture locally. Formspree is fired from the UI after this succeeds.
 * @param {string} rawEmail
 * @returns {{ ok: true, email: string } | { ok: false, error: string }}
 */
export function captureEmail(rawEmail) {
  const result = validateEmail(rawEmail);
  if (!result.ok) return result;
  try {
    localStorage.setItem(STORAGE.email, result.email);
    localStorage.setItem(STORAGE.emailCapturedAt, new Date().toISOString());
  } catch {
    return { ok: false, error: 'Could not save your email in this browser.' };
  }
  return { ok: true, email: result.email };
}

export function clearEmailCapture() {
  try {
    localStorage.removeItem(STORAGE.email);
    localStorage.removeItem(STORAGE.emailCapturedAt);
  } catch {
    /* ignore */
  }
}

export function getLicenseKey() {
  try {
    return localStorage.getItem(STORAGE.license);
  } catch {
    return null;
  }
}

function isStoredLicenseVerified() {
  try {
    const key = getLicenseKey();
    const status = localStorage.getItem(STORAGE.licenseStatus);
    return Boolean(key && status === 'valid');
  } catch {
    return false;
  }
}

function persistVerifiedLicense(key) {
  localStorage.setItem(STORAGE.license, key);
  localStorage.setItem(STORAGE.licenseStatus, 'valid');
  localStorage.setItem(STORAGE.licenseVerifiedAt, new Date().toISOString());
}

/**
 * Ask the Netlify Function to validate a key with Lemon Squeezy.
 * Does not write localStorage.
 * @param {string} key
 * @returns {Promise<{ ok: boolean, error?: string, reason?: 'empty'|'rejected'|'invalid'|'network'|'unavailable' }>}
 */
async function verifyLicenseRemote(key) {
  let response;
  let data;
  try {
    response = await fetch(VERIFY_LICENSE_PATH, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey: key }),
    });
  } catch {
    return {
      ok: false,
      reason: 'network',
      error: 'Could not reach the license server. Check your connection and try again.',
    };
  }

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 503) {
    return {
      ok: false,
      reason: 'unavailable',
      error:
        (data && data.error) ||
        'License verification is not configured yet. Try again later.',
    };
  }

  if (!response.ok && (response.status >= 500 || !data)) {
    return {
      ok: false,
      reason: 'network',
      error:
        (data && data.error) ||
        'Could not verify that license key. Try again in a moment.',
    };
  }

  if (!data || data.valid !== true) {
    return {
      ok: false,
      reason: 'invalid',
      error: (data && data.error) || 'That license key isn’t valid.',
    };
  }

  return { ok: true };
}

/**
 * Verify a license key with Lemon Squeezy via the Netlify Function.
 * Persists the key only when the server returns valid: true.
 * DEV-UNLOCK is rejected here. It never grants paid access.
 *
 * @param {string} rawKey
 * @returns {Promise<{ ok: true } | { ok: false, error: string, reason?: string }>}
 */
export async function activateLicense(rawKey) {
  const key = String(rawKey || '').trim();
  if (!key) {
    return { ok: false, reason: 'empty', error: 'Enter a license key.' };
  }

  if (key.toUpperCase() === 'DEV-UNLOCK') {
    return {
      ok: false,
      reason: 'rejected',
      error: 'That key isn’t recognized. Enter the license key from your purchase.',
    };
  }

  const result = await verifyLicenseRemote(key);
  if (!result.ok) return result;

  try {
    persistVerifiedLicense(key);
  } catch {
    return { ok: false, reason: 'network', error: 'Could not save the license key.' };
  }
  return { ok: true };
}

/**
 * Re-check a previously stored key with the server.
 * Explicit invalid → revoke. Network / unconfigured → keep last verified state.
 * @returns {Promise<{ ok: boolean, skipped?: string, error?: string, reason?: string }>}
 */
export async function refreshLicenseVerification() {
  if (isDevPaidFlag()) return { ok: true, skipped: 'dev' };
  const key = getLicenseKey();
  if (!key) return { ok: false, skipped: 'none' };

  const result = await verifyLicenseRemote(key);
  if (result.reason === 'network' || result.reason === 'unavailable') {
    return {
      ok: isStoredLicenseVerified(),
      error: result.error,
      reason: result.reason,
    };
  }
  if (!result.ok) {
    clearLicense();
    return result;
  }
  try {
    persistVerifiedLicense(key);
  } catch {
    /* still treated as valid this session if persist fails after server OK */
  }
  return { ok: true };
}

/**
 * @deprecated Public license field must go through activateLicense().
 * Kept so leftover callers fail closed instead of storing unverified keys.
 * @param {string} key
 * @returns {{ ok: false, error: string }}
 */
export function setLicenseKey(key) {
  const normalized = String(key || '').trim();
  if (!normalized) {
    return { ok: false, error: 'Enter a license key.' };
  }
  return {
    ok: false,
    error: 'That key isn’t recognized. License keys must be verified after purchase.',
  };
}

export function clearLicense() {
  try {
    localStorage.removeItem(STORAGE.license);
    localStorage.removeItem(STORAGE.licenseStatus);
    localStorage.removeItem(STORAGE.licenseVerifiedAt);
  } catch {
    /* ignore */
  }
}

/**
 * True when the user should see full paid features.
 * Production: only after server verification.
 */
export function hasPaidAccess() {
  if (isDevPaidFlag()) return true;
  return isStoredLicenseVerified();
}

/**
 * Snapshot of access stage for UI.
 * @returns {Entitlements}
 */
export function getEntitlements() {
  const email = getStoredEmail();
  const hasEmail = Boolean(email);
  const licenseKey = getLicenseKey();
  const devUnlock = isDevPaidFlag();
  const isPaid = hasPaidAccess();

  let stage = 'free';
  if (isPaid) stage = 'paid';
  else if (hasEmail) stage = 'email';

  return {
    hasEmail,
    email,
    isPaid,
    stage,
    licenseKey,
    devUnlock,
  };
}

/**
 * One-time cleanup of the old prototype tier toggle so it can't unlock paid.
 */
export function migrateLegacyTierToggle() {
  try {
    if (localStorage.getItem(STORAGE.legacyTier) != null) {
      localStorage.removeItem(STORAGE.legacyTier);
    }
    if (!isLocalDevHost() && localStorage.getItem(STORAGE.devPaid) != null) {
      localStorage.removeItem(STORAGE.devPaid);
    }
  } catch {
    /* ignore */
  }
}

export const ENTITLEMENT_STORAGE_KEYS = STORAGE;
