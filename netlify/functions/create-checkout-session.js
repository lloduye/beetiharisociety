const Stripe = require('stripe');

// Netlify serverless function: create a Stripe Checkout Session for one-time donation or subscription (membership).
// Set STRIPE_SECRET_KEY in Netlify Environment variables.
// Body: { amount } for donation (cents), or { subscription: true } for $120/month membership.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Netlify environment variables.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const origin = event.headers.origin || event.headers.Referer || '';
  const baseUrl = origin.replace(/\/$/, '') || 'https://betiharisociety.org';
  const stripe = new Stripe(stripeSecretKey);

  const isSubscription = body.subscription === true;
  const isEmbedded = body.embedded === true;
  const returnUrl = body.returnUrl || baseUrl;

  const sessionOptions = (overrides) => {
    const { success_url, cancel_url, successUrl, cancelUrl, ...rest } = overrides;
    return {
      payment_method_types: ['card'],
      ...(isEmbedded
        ? { ui_mode: 'embedded', return_url: returnUrl }
        : {
            success_url: successUrl || success_url || `${baseUrl}/?donate=success`,
            cancel_url: cancelUrl || cancel_url || baseUrl,
          }),
      ...rest,
    };
  };

  if (isSubscription) {
    const membershipAmountCents = 12000;
    const successUrl = body.successUrl || `${baseUrl}/get-involved?membership=success`;
    const cancelUrl = body.cancelUrl || `${baseUrl}/get-involved`;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        ...sessionOptions({
          success_url: successUrl,
          cancel_url: cancelUrl,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Beti-Hari Society Membership',
                  description: 'Monthly membership — $120/month.',
                },
                unit_amount: membershipAmountCents,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            },
          ],
          metadata: { type: 'membership' },
          subscription_data: { metadata: { type: 'membership' } },
        }),
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEmbedded ? { clientSecret: session.client_secret } : { url: session.url }
        ),
      };
    } catch (err) {
      console.error('Stripe subscription error:', err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message || 'Failed to create checkout session' }),
      };
    }
  }

  // One-time donation
  const amountCents = typeof body.amount === 'number' ? Math.round(body.amount) : null;
  const minCents = 100;
  if (amountCents == null || amountCents < minCents) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Amount must be at least ${minCents / 100} (in cents: ${minCents})` }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...sessionOptions({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation to Beti-Hari Society',
                description: 'Support education and economic development in South Sudan',
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        metadata: { type: 'donation' },
      }),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isEmbedded ? { clientSecret: session.client_secret } : { url: session.url }
      ),
    };
  } catch (err) {
    console.error('Stripe Checkout error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to create checkout session' }),
    };
  }
};
