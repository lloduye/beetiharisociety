const { json, requireAdmin, getStripe, parseIntSafe, parseCreatedRange } = require('./_stripeAdmin');

/**
 * Admin-only: list disputes.
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
    const list = await stripe.disputes.list({
      limit,
      ...(starting_after ? { starting_after } : {}),
      ...(created ? { created } : {}),
    });

    const items = (list.data || []).map((d) => ({
      id: d.id,
      amount: d.amount,
      currency: d.currency,
      created: d.created,
      status: d.status,
      reason: d.reason,
      charge: d.charge,
      payment_intent: d.payment_intent || null,
      evidence_due_by: d.evidence_details?.due_by || null,
      has_evidence: d.evidence_details?.has_evidence || null,
    }));

    return json(200, {
      has_more: !!list.has_more,
      next_starting_after: items.length ? items[items.length - 1].id : null,
      items,
    }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-list-disputes error:', err.message);
    return json(500, { error: err.message || 'Failed to list disputes' });
  }
};

