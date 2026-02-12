const Stripe = require('stripe');

/**
 * Updates a Stripe customer. Used by Community dashboard when editing members.
 * Body: { customerId, firstName?, lastName?, email?, phone?, addressLine1?, addressLine2?, city?, state?, postalCode?, country? }
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe is not configured.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { customerId } = body;
  if (!customerId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'customerId is required.' }) };
  }

  const stripe = new Stripe(stripeSecretKey);
  const fullName = [body.firstName, body.lastName].filter(Boolean).join(' ');

  const updateData = {};
  if (fullName) updateData.name = fullName;
  if (body.email != null) updateData.email = String(body.email).trim().toLowerCase();
  if (body.phone != null) updateData.phone = String(body.phone).trim() || null;

  if (
    body.addressLine1 != null ||
    body.addressLine2 != null ||
    body.city != null ||
    body.state != null ||
    body.postalCode != null ||
    body.country != null
  ) {
    updateData.address = {
      line1: body.addressLine1 || '',
      line2: body.addressLine2 || undefined,
      city: body.city || undefined,
      state: body.state || undefined,
      postal_code: body.postalCode || undefined,
      country: body.country ? String(body.country).toUpperCase().slice(0, 2) : undefined,
    };
  }

  if (body.firstName != null || body.lastName != null) {
    updateData.metadata = {
      firstName: (body.firstName || '').trim(),
      lastName: (body.lastName || '').trim(),
    };
  }

  if (Object.keys(updateData).length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No fields to update.' }) };
  }

  try {
    const customer = await stripe.customers.update(customerId, updateData);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, customer: { id: customer.id, email: customer.email } }),
    };
  } catch (err) {
    console.error('Stripe customer update error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to update customer' }),
    };
  }
};
