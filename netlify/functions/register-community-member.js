const Stripe = require('stripe');

/**
 * Registers a community member: creates Stripe Customer and returns customer ID.
 * The frontend stores the full member record in Firestore including this stripeCustomerId.
 * Set STRIPE_SECRET_KEY in Netlify Environment variables.
 * Body: { firstName, lastName, email, phone, country, addressLine1, addressLine2?, city, state, postalCode }
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Netlify.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    country,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
  } = body;

  if (!email || !firstName || !lastName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'First name, last name, and email are required.' }),
    };
  }

  const stripe = new Stripe(stripeSecretKey);

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const address = {
    line1: addressLine1 || '',
    line2: addressLine2 || undefined,
    city: city || undefined,
    state: state || undefined,
    postal_code: postalCode || undefined,
    country: (country || '').toUpperCase().slice(0, 2) || undefined,
  };

  try {
    const customer = await stripe.customers.create({
      email: email.trim().toLowerCase(),
      name: fullName,
      phone: phone ? String(phone).trim() : undefined,
      address: Object.keys(address).some((k) => address[k]) ? address : undefined,
      metadata: {
        source: 'betihari_community_signup',
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        stripeCustomerId: customer.id,
        email: customer.email,
      }),
    };
  } catch (err) {
    console.error('Stripe customer create error:', err.type, err.code, err.message);
    if (err.code === 'invalid_request_error' && err.message && err.message.includes('already been used')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'An account with this email already exists in our system.',
        }),
      };
    }
    const msg = err.message || 'Failed to register community member';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: msg }),
    };
  }
};
