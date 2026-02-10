const { json, requireAdmin, getStripe } = require('./_stripeAdmin');

/**
 * Admin-only: retrieve current Stripe balance (available/pending).
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  const stripe = getStripe();
  try {
    const balance = await stripe.balance.retrieve();
    return json(200, { balance }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-balance error:', err.message);
    return json(500, { error: err.message || 'Failed to load balance' });
  }
};

