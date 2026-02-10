const Stripe = require('stripe');

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

function getHeader(event, name) {
  const headers = event && event.headers ? event.headers : {};
  const lower = name.toLowerCase();
  return (
    headers[name] ||
    headers[name.toLowerCase()] ||
    headers[lower] ||
    headers[Object.keys(headers).find((k) => k.toLowerCase() === lower)]
  );
}

function requireAdmin(event) {
  const expected = (process.env.STRIPE_ADMIN_PASSPHRASE || '').trim();
  if (!expected) {
    return { ok: false, response: json(500, { error: 'STRIPE_ADMIN_PASSPHRASE is not configured' }) };
  }
  const provided = (getHeader(event, 'x-admin-passphrase') || '').trim();
  if (!provided || provided !== expected) {
    return { ok: false, response: json(401, { error: 'Unauthorized' }) };
  }
  return { ok: true };
}

function getStripe() {
  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    const err = new Error('Stripe is not configured (STRIPE_SECRET_KEY missing/invalid)');
    err.statusCode = 500;
    throw err;
  }
  return new Stripe(stripeSecretKey);
}

function parseIntSafe(v, fallback = null) {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function parseCreatedRange(query) {
  // Accept seconds since epoch (preferred) or ISO date strings.
  const gteRaw = query.created_gte;
  const lteRaw = query.created_lte;

  const toSec = (val) => {
    if (!val) return null;
    const asInt = parseIntSafe(val, null);
    if (asInt != null && asInt > 1000000000) return asInt; // seconds
    const ms = Date.parse(val);
    if (!Number.isFinite(ms)) return null;
    return Math.floor(ms / 1000);
  };

  const created = {};
  const gte = toSec(gteRaw);
  const lte = toSec(lteRaw);
  if (gte != null) created.gte = gte;
  if (lte != null) created.lte = lte;
  return Object.keys(created).length ? created : null;
}

module.exports = {
  json,
  requireAdmin,
  getStripe,
  parseIntSafe,
  parseCreatedRange,
};

