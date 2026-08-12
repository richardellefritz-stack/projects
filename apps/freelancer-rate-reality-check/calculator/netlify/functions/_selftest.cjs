/**
 * Smoke-test the license function with a mocked Lemon Squeezy fetch.
 * Run: node netlify/functions/_selftest.cjs
 */
delete require.cache[require.resolve('./verify-license.js')];

process.env.LEMONSQUEEZY_API_KEY = 'test-api-key';
process.env.LEMONSQUEEZY_STORE_ID = '11';
process.env.LEMONSQUEEZY_PRODUCT_ID = '22';
delete process.env.LEMONSQUEEZY_VARIANT_ID;

const { handler } = require('./verify-license.js');

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  } else {
    console.log('PASS:', msg);
  }
}

function mockLs(payload, status = 200) {
  global.fetch = async (url, opts) => {
    mockLs.last = { url, opts };
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    };
  };
}

async function invoke(method, body) {
  return handler({
    httpMethod: method,
    body: body == null ? null : JSON.stringify(body),
  });
}

(async () => {
  const denied = await invoke('GET', null);
  assert(denied.statusCode === 405, 'GET is rejected');
  assert(JSON.parse(denied.body).valid === false, 'GET response is not valid');
  const deniedHeaders = JSON.stringify(denied.headers || {});
  assert(
    !deniedHeaders.toLowerCase().includes('access-control-allow-origin'),
    'GET response has no CORS allow-origin'
  );

  const options = await invoke('OPTIONS', null);
  assert(options.statusCode === 405, 'OPTIONS is not a CORS preflight');
  assert(
    !JSON.stringify(options.headers || {}).toLowerCase().includes('access-control-allow-origin'),
    'OPTIONS has no wildcard CORS header'
  );

  const empty = await invoke('POST', { licenseKey: '' });
  assert(empty.statusCode === 400, 'empty key is 400');
  assert(JSON.parse(empty.body).valid === false, 'empty key is not valid');

  mockLs({
    valid: true,
    error: null,
    license_key: { status: 'active' },
    meta: { store_id: 11, product_id: 22, product_name: 'FRC' },
  });
  const ok = await invoke('POST', { licenseKey: '38b1460a-5104-4067-a91d-77b872934d51' });
  const okBody = JSON.parse(ok.body);
  assert(ok.statusCode === 200 && okBody.valid === true, 'matching store/product unlocks');
  assert(okBody.productName === 'FRC', 'returns product name');
  assert(
    !JSON.stringify(ok.headers || {}).toLowerCase().includes('access-control-allow-origin'),
    'success response has no CORS allow-origin'
  );
  assert(!JSON.stringify(okBody).includes('test-api-key'), 'API key is not in the response');
  assert(
    mockLs.last.opts.headers.Authorization === 'Bearer test-api-key',
    'sends API key only to Lemon Squeezy'
  );
  assert(
    String(mockLs.last.opts.body).includes('license_key=38b1460a-5104-4067-a91d-77b872934d51'),
    'forwards the license key to Lemon Squeezy'
  );

  mockLs({
    valid: true,
    error: null,
    license_key: { status: 'active' },
    meta: { store_id: 99, product_id: 22, product_name: 'Other' },
  });
  const wrongStore = await invoke('POST', { licenseKey: '38b1460a-5104-4067-a91d-77b872934d51' });
  assert(JSON.parse(wrongStore.body).valid === false, 'wrong store_id is rejected');

  mockLs({
    valid: false,
    error: 'Invalid license key.',
    license_key: { status: 'disabled' },
  });
  const bad = await invoke('POST', { licenseKey: 'nope' });
  const badBody = JSON.parse(bad.body);
  assert(badBody.valid === false, 'Lemon Squeezy invalid is denied');
  assert(typeof badBody.error === 'string' && badBody.error.length > 0, 'invalid has an error');

  mockLs({
    valid: true,
    error: null,
    license_key: { status: 'expired' },
    meta: { store_id: 11, product_id: 22 },
  });
  const expired = await invoke('POST', { licenseKey: '38b1460a-5104-4067-a91d-77b872934d51' });
  assert(JSON.parse(expired.body).valid === false, 'expired status is denied');

  process.env.LEMONSQUEEZY_API_KEY = '';
  delete require.cache[require.resolve('./verify-license.js')];
  const unconfigured = require('./verify-license.js');
  const missing = await unconfigured.handler({
    httpMethod: 'POST',
    body: JSON.stringify({ licenseKey: 'abc' }),
  });
  assert(missing.statusCode === 503, 'missing API key fails closed');
  assert(JSON.parse(missing.body).valid === false, 'unconfigured is not valid');

  if (failed) {
    console.error(`\n${failed} assertion(s) failed`);
    process.exit(1);
  }
  console.log('\nFunction assertions passed.');
})();
