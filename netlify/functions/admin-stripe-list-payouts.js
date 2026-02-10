const { json, requireAdmin, getStripe, parseIntSafe, parseCreatedRange } = require('./_stripeAdmin');

/**
 * Admin-only: list payouts.
 * Query params:
 * - limit (max 100, default 25)
 * - starting_after
 * - created_gte / created_lte (epoch seconds or ISO date)
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  const stripe = getStripe();
  const q = event.queryStringParameters || {};
  const limit = Math.min(100, Math.max(1, parseIntSafe(q.limit, 25)));
  const starting_after = typeof q.starting_after === 'string' && q.starting_after ? q.starting_after : undefined;
  const created = parseCreatedRange(q);

  try {
    const list = await stripe.payouts.list({
      limit,
      ...(starting_after ? { starting_after } : {}),
      ...(created ? { created } : {}),
    });

    const items = (list.data || []).map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      created: p.created,
      arrival_date: p.arrival_date,
      status: p.status,
      method: p.method,
      type: p.type,
      description: p.description,
    }));

    return json(200, {
      has_more: !!list.has_more,
      next_starting_after: items.length ? items[items.length - 1].id : null,
      items,
    }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-list-payouts error:', err.message);
    return json(500, { error: err.message || 'Failed to list payouts' });
  }
};

