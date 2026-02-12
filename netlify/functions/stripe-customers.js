const Stripe = require('stripe');

/**
 * Returns Stripe customers (community members) with payment/subscription summaries.
 * GET /.netlify/functions/stripe-customers
 *   ?limit=50
 *   &starting_after=cus_xxx  (pagination)
 *   &email=xxx  (filter by email)
 *   ?customer=cus_xxx  (single customer with charges & subscriptions)
 * Requires STRIPE_SECRET_KEY in Netlify. Used by Community dashboard.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customers: [],
        hasMore: false,
        error: 'Stripe not configured',
      }),
    };
  }

  const params = event.queryStringParameters || {};
  const singleCustomerId = params.customer;
  const limit = Math.min(parseInt(params.limit, 10) || 50, 100);
  const startingAfter = params.starting_after || null;
  const emailFilter = (params.email || '').trim().toLowerCase();

  const stripe = new Stripe(stripeSecretKey);

  try {
    if (singleCustomerId) {
      const [customer, charges, subscriptions] = await Promise.all([
        stripe.customers.retrieve(singleCustomerId),
        stripe.charges.list({ customer: singleCustomerId, limit: 50 }),
        stripe.subscriptions.list({ customer: singleCustomerId, status: 'all', limit: 20 }),
      ]);

      if (customer.deleted) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Customer not found' }),
        };
      }

      const customerData = buildCustomerSummary(customer);
      customerData.charges = (charges.data || []).map((c) => ({
        id: c.id,
        amount: (c.amount || 0) / 100,
        currency: (c.currency || 'usd').toUpperCase(),
        status: c.status,
        description: c.description,
        created: c.created,
        receiptUrl: c.receipt_url,
      }));
      customerData.subscriptions = (subscriptions.data || []).map((s) => ({
        id: s.id,
        status: s.status,
        currentPeriodStart: s.current_period_start,
        currentPeriodEnd: s.current_period_end,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        items: (s.items?.data || []).map((i) => ({
          priceId: i.price?.id,
          quantity: i.quantity,
          unitAmount: (i.price?.unit_amount || 0) / 100,
          interval: i.price?.recurring?.interval,
        })),
      }));

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        body: JSON.stringify({ customer: customerData }),
      };
    }

    const listParams = { limit };
    if (startingAfter) listParams.starting_after = startingAfter;
    if (emailFilter) listParams.email = emailFilter;

    const list = await stripe.customers.list(listParams);
    const customers = (list.data || []).map((c) => buildCustomerSummary(c));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({
        customers,
        hasMore: list.has_more,
        lastId: list.data?.length ? list.data[list.data.length - 1].id : null,
      }),
    };
  } catch (err) {
    console.error('stripe-customers error:', err.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customers: [],
        hasMore: false,
        error: err.message || 'Failed to load customers',
      }),
    };
  }
};

function buildCustomerSummary(c) {
  const addr = c.address || {};
  const totalCharges = c.metadata?.total_charges;
  return {
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    created: c.created,
    address: {
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country,
    },
    metadata: c.metadata || {},
  };
}
