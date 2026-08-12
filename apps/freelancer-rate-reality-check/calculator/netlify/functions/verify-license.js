/**
 * POST /.netlify/functions/verify-license
 *
 * Validates a Lemon Squeezy license key server-side so the calculator
 * never sees the API key. Fail closed: valid is true only when Lemon
 * Squeezy says the key is usable and it belongs to this store/product.
 *
 * Env (Netlify → Site settings → Environment variables):
 *   LEMONSQUEEZY_API_KEY      required for authenticated License API calls
 *   LEMONSQUEEZY_STORE_ID     required unless PRODUCT_ID is set
 *   LEMONSQUEEZY_PRODUCT_ID   required unless STORE_ID is set
 *   LEMONSQUEEZY_VARIANT_ID   optional extra restriction
 */

const LS_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate';
const MAX_KEY_LENGTH = 200;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function readConfig() {
  return {
    apiKey: String(process.env.LEMONSQUEEZY_API_KEY || '').trim(),
    storeId: String(process.env.LEMONSQUEEZY_STORE_ID || '').trim(),
    productId: String(process.env.LEMONSQUEEZY_PRODUCT_ID || '').trim(),
    variantId: String(process.env.LEMONSQUEEZY_VARIANT_ID || '').trim(),
  };
}

function parseLicenseKey(rawBody) {
  if (!rawBody) return '';
  if (typeof rawBody === 'object') {
    return String(rawBody.licenseKey || rawBody.license_key || '').trim();
  }
  try {
    const parsed = JSON.parse(rawBody);
    return String(parsed.licenseKey || parsed.license_key || '').trim();
  } catch {
    return '';
  }
}

function isUsableStatus(status) {
  return status === 'active' || status === 'inactive';
}

function belongsToThisProduct(meta, config) {
  if (config.storeId && String(meta.store_id) !== config.storeId) return false;
  if (config.productId && String(meta.product_id) !== config.productId) return false;
  if (config.variantId && String(meta.variant_id) !== config.variantId) return false;
  return true;
}

function rejectionMessage(ls) {
  const status = ls?.license_key?.status;
  if (status === 'expired') return 'That license key has expired.';
  if (status === 'disabled') return 'That license key is no longer active.';
  if (typeof ls?.error === 'string' && ls.error.trim()) {
    return 'That license key isn’t valid.';
  }
  return 'That license key isn’t valid.';
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { valid: false, error: 'Method not allowed.' });
  }

  const config = readConfig();
  if (!config.apiKey) {
    return json(503, {
      valid: false,
      error: 'License verification is not configured.',
    });
  }
  if (!config.storeId && !config.productId) {
    return json(503, {
      valid: false,
      error: 'License verification is not configured.',
    });
  }

  const licenseKey = parseLicenseKey(event.body);
  if (!licenseKey || licenseKey.length > MAX_KEY_LENGTH) {
    return json(400, { valid: false, error: 'Enter a valid license key.' });
  }

  let ls;
  try {
    const res = await fetch(LS_VALIDATE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: new URLSearchParams({ license_key: licenseKey }).toString(),
    });

    try {
      ls = await res.json();
    } catch {
      ls = null;
    }

    if (!ls || typeof ls !== 'object') {
      return json(502, {
        valid: false,
        error: 'License service returned an unexpected response.',
      });
    }
  } catch {
    return json(502, {
      valid: false,
      error: 'Could not reach the license service. Try again in a moment.',
    });
  }

  const status = ls.license_key?.status;
  const lsSaysValid = ls.valid === true && isUsableStatus(status);
  if (!lsSaysValid) {
    return json(200, { valid: false, error: rejectionMessage(ls) });
  }

  const meta = ls.meta || {};
  if (!belongsToThisProduct(meta, config)) {
    return json(200, {
      valid: false,
      error: 'That license key isn’t valid for this product.',
    });
  }

  return json(200, {
    valid: true,
    status,
    productName: meta.product_name || null,
  });
};
