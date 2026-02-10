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

function clampInt(v, min, max, fallback) {
  const n = parseInt(String(v || ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function ymdFromTsSec(ts) {
  const d = new Date(ts * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Read-only donation overview for dashboard charts (no donor PII).
 * Requires STRIPE_SECRET_KEY.
 *
 * Query:
 * - days: number (default 30, max 365)
 *
 * Response includes only aggregates and amounts.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    return json(200, { ok: false, error: 'Stripe not configured' }, { 'Cache-Control': 'no-store' });
  }

  const stripe = new Stripe(stripeSecretKey);
  const q = event.queryStringParameters || {};
  const days = clampInt(q.days, 1, 365, 30);

  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = nowSec - days * 86400;

  const sessions = [];
  let hasMore = true;
  let startingAfter = null;

  try {
    while (hasMore) {
      const params = {
        status: 'complete',
        limit: 100,
        created: { gte: startSec },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const list = await stripe.checkout.sessions.list(params);
      for (const s of list.data || []) {
        if (s.mode === 'payment' && s.amount_total != null && s.amount_total > 0) {
          sessions.push(s);
        }
      }
      hasMore = !!list.has_more;
      if (list.data && list.data.length) startingAfter = list.data[list.data.length - 1].id;
      else hasMore = false;
    }

    // Aggregate by day (UTC) to avoid timezone ambiguity.
    const byDay = new Map(); // ymd -> { gross_cents, count }
    let gross = 0;
    let count = 0;
    let min = null;
    let max = null;

    const recent = sessions
      .slice()
      .sort((a, b) => (b.created || 0) - (a.created || 0))
      .slice(0, 25)
      .map((s) => ({
        created: s.created,
        amount_cents: s.amount_total,
        currency: s.currency,
      }));

    for (const s of sessions) {
      const amt = s.amount_total || 0;
      gross += amt;
      count += 1;
      min = min == null ? amt : Math.min(min, amt);
      max = max == null ? amt : Math.max(max, amt);

      const ymd = ymdFromTsSec(s.created || nowSec);
      const prev = byDay.get(ymd) || { date: ymd, gross_cents: 0, count: 0 };
      prev.gross_cents += amt;
      prev.count += 1;
      byDay.set(ymd, prev);
    }

    // Fill missing days so charts are continuous.
    const daily = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const ts = nowSec - i * 86400;
      const key = ymdFromTsSec(ts);
      daily.push(byDay.get(key) || { date: key, gross_cents: 0, count: 0 });
    }

    const avg = count ? Math.round(gross / count) : 0;
    return json(
      200,
      {
        ok: true,
        range: { days, startSec, endSec: nowSec },
        totals: {
          gross_cents: gross,
          count,
          avg_cents: avg,
          min_cents: min || 0,
          max_cents: max || 0,
        },
        daily,
        recent,
      },
      { 'Cache-Control': 'public, max-age=60' }
    );
  } catch (err) {
    console.error('get-donations-overview error:', err.message);
    return json(200, { ok: false, error: err.message || 'Failed to load donation overview' });
  }
};

