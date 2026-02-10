const { json, requireAdmin, getStripe } = require('./_stripeAdmin');

/**
 * Admin-only: retrieve a single donation session with expanded details,
 * plus fees/net via balance transaction when possible.
 *
 * Query params:
 * - sessionId (required)
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  const stripe = getStripe();
  const q = event.queryStringParameters || {};
  const sessionId = (q.sessionId || '').trim();
  if (!sessionId) return json(400, { error: 'Missing sessionId' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        'payment_intent',
        'payment_intent.latest_charge',
        'customer',
        'line_items',
      ],
    });

    const pi = session.payment_intent && typeof session.payment_intent === 'object' ? session.payment_intent : null;
    const charge = pi && pi.latest_charge && typeof pi.latest_charge === 'object' ? pi.latest_charge : null;

    let balanceTx = null;
    if (charge && charge.balance_transaction) {
      try {
        const btId = typeof charge.balance_transaction === 'string' ? charge.balance_transaction : charge.balance_transaction.id;
        if (btId) {
          balanceTx = await stripe.balanceTransactions.retrieve(btId);
        }
      } catch (e) {
        // non-fatal
        balanceTx = null;
      }
    }

    return json(200, {
      session: {
        id: session.id,
        created: session.created,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_name: session.customer_details?.name || null,
        customer_email: session.customer_email || session.customer_details?.email || null,
        customer_phone: session.customer_details?.phone || null,
        customer_address: session.customer_details?.address || null,
        metadata: session.metadata || {},
      },
      payment_intent: pi
        ? {
            id: pi.id,
            status: pi.status,
            amount: pi.amount,
            amount_received: pi.amount_received,
            currency: pi.currency,
            created: pi.created,
          }
        : null,
      charge: charge
        ? {
            id: charge.id,
            paid: charge.paid,
            captured: charge.captured,
            refunded: charge.refunded,
            amount: charge.amount,
            amount_refunded: charge.amount_refunded,
            currency: charge.currency,
            receipt_email: charge.receipt_email,
            receipt_url: charge.receipt_url,
            payment_method_details: charge.payment_method_details || null,
            created: charge.created,
            balance_transaction_id:
              typeof charge.balance_transaction === 'string'
                ? charge.balance_transaction
                : charge.balance_transaction?.id || null,
          }
        : null,
      balance_transaction: balanceTx
        ? {
            id: balanceTx.id,
            amount: balanceTx.amount,
            fee: balanceTx.fee,
            net: balanceTx.net,
            currency: balanceTx.currency,
            type: balanceTx.type,
            reporting_category: balanceTx.reporting_category,
            created: balanceTx.created,
            available_on: balanceTx.available_on,
          }
        : null,
    }, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('admin-stripe-get-donation error:', err.message);
    return json(500, { error: err.message || 'Failed to load donation' });
  }
};

