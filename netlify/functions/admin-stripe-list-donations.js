const { json, requireAdmin, getStripe, parseIntSafe, parseCreatedRange } = require('./_stripeAdmin');

/**
 * Admin-only: list completed one-time donation checkout sessions.
 * Query params:
 * - limit (max 100, default 50)
 * - starting_after (session id)
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

  const limit = Math.min(100, Math.max(1, parseIntSafe(q.limit, 50)));
  const starting_after = typeof q.starting_after === 'string' && q.starting_after ? q.starting_after : undefined;
  const created = parseCreatedRange(q);

  try {
    const params = {
      status: 'complete',
      limit,
      ...(starting_after ? { starting_after } : {}),
      ...(created ? { created } : {}),
      expand: [
        'data.payment_intent',
        'data.payment_intent.latest_charge',
      ],
    };

    const list = await stripe.checkout.sessions.list(params);

    const items = (list.data || [])
      .filter((s) => s.mode === 'payment' && s.amount_total != null && s.amount_total > 0)
      .map((s) => {
        const pi = s.payment_intent && typeof s.payment_intent === 'object' ? s.payment_intent : null;
        const charge = pi && pi.latest_charge && typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
        return {
          sessionId: s.id,
          created: s.created,
          amount_total: s.amount_total,
          currency: s.currency,
          payment_status: s.payment_status,
          customer_name: s.customer_details?.name || null,
          customer_email: s.customer_email || s.customer_details?.email || null,
          payment_intent_id: pi ? pi.id : (typeof s.payment_intent === 'string' ? s.payment_intent : null),
          charge_id: charge ? charge.id : null,
          receipt_url: charge ? charge.receipt_url : null,
          refunded: charge ? !!charge.refunded : null,
          amount_refunded: charge ? charge.amount_refunded : null,
        };
      });

    return json(200, {
      has_more: !!list.has_more,
      next_starting_after: items.length ? items[items.length - 1].sessionId : null,
      items,
    }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-list-donations error:', err.message);
    return json(500, { error: err.message || 'Failed to list donations' });
  }
};

