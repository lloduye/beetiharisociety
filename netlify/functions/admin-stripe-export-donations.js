const { requireAdmin, getStripe, json, parseCreatedRange } = require('./_stripeAdmin');

function csvEscape(v) {
  const s = v == null ? '' : String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Admin-only: export donation sessions as CSV (best-effort, capped).
 * Query params:
 * - created_gte / created_lte (epoch seconds or ISO date)
 * - max (default 1000, hard cap 5000)
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  const stripe = getStripe();
  const q = event.queryStringParameters || {};
  const created = parseCreatedRange(q) || null;
  const max = Math.min(5000, Math.max(1, parseInt(q.max || '1000', 10) || 1000));

  try {
    const rows = [];
    rows.push([
      'created',
      'session_id',
      'amount_total',
      'currency',
      'payment_status',
      'customer_name',
      'customer_email',
      'payment_intent_id',
      'charge_id',
      'refunded',
      'amount_refunded',
      'receipt_url',
    ]);

    let startingAfter = null;
    let remaining = max;

    while (remaining > 0) {
      const limit = Math.min(100, remaining);
      const list = await stripe.checkout.sessions.list({
        status: 'complete',
        limit,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
        ...(created ? { created } : {}),
        expand: ['data.payment_intent', 'data.payment_intent.latest_charge'],
      });

      const sessions = (list.data || []).filter(
        (s) => s.mode === 'payment' && s.amount_total != null && s.amount_total > 0
      );

      for (const s of sessions) {
        const pi = s.payment_intent && typeof s.payment_intent === 'object' ? s.payment_intent : null;
        const charge = pi && pi.latest_charge && typeof pi.latest_charge === 'object' ? pi.latest_charge : null;

        rows.push([
          s.created ? new Date(s.created * 1000).toISOString() : '',
          s.id,
          s.amount_total != null ? String(s.amount_total) : '',
          s.currency || '',
          s.payment_status || '',
          s.customer_details?.name || '',
          s.customer_email || s.customer_details?.email || '',
          pi ? pi.id : typeof s.payment_intent === 'string' ? s.payment_intent : '',
          charge ? charge.id : '',
          charge ? String(!!charge.refunded) : '',
          charge && charge.amount_refunded != null ? String(charge.amount_refunded) : '',
          charge ? charge.receipt_url || '' : '',
        ]);
      }

      if (!list.has_more || !list.data || list.data.length === 0) break;
      startingAfter = list.data[list.data.length - 1].id;
      remaining -= limit;
    }

    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="donations_export_${Date.now()}.csv"`,
        'Cache-Control': 'no-store',
      },
      body: csv,
    };
  } catch (err) {
    console.error('admin-stripe-export-donations error:', err.message);
    return json(500, { error: err.message || 'Export failed' });
  }
};

