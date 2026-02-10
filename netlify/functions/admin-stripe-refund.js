const { json, requireAdmin, getStripe, parseIntSafe } = require('./_stripeAdmin');

/**
 * Admin-only: create a refund for a donation.
 * Body:
 * - payment_intent_id (required) OR charge_id (required)
 * - amount (optional, cents) for partial refunds
 * - reason (optional) one of: duplicate, fraudulent, requested_by_customer
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  const stripe = getStripe();

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const payment_intent = (body.payment_intent_id || '').trim();
  const charge = (body.charge_id || '').trim();
  if (!payment_intent && !charge) {
    return json(400, { error: 'payment_intent_id or charge_id is required' });
  }

  const amount = parseIntSafe(body.amount, null);
  const reason = (body.reason || '').trim() || undefined;

  const params = {
    ...(payment_intent ? { payment_intent } : {}),
    ...(charge ? { charge } : {}),
    ...(amount != null ? { amount } : {}),
    ...(reason ? { reason } : {}),
  };

  try {
    const refund = await stripe.refunds.create(params);
    return json(200, { refund }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-refund error:', err.message);
    return json(500, { error: err.message || 'Refund failed' });
  }
};

