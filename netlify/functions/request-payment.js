const Stripe = require('stripe');

/**
 * Creates a Stripe invoice for a customer and optionally finalizes/sends it.
 * Body: {
 *   customerId,
 *   amountCents (required),
 *   description (optional),
 *   currency (optional, default 'usd'),
 *   sendNow (optional, default true) - finalize and send invoice
 * }
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

  const { customerId, amountCents, description, currency = 'usd', sendNow = true } = body;

  if (!customerId || amountCents == null || amountCents < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'customerId and amountCents (minimum 1) are required.' }),
    };
  }

  const stripe = new Stripe(stripeSecretKey);
  const amount = Math.round(Number(amountCents));
  const desc = description || 'Beti-Hari Society - Payment Request';

  try {
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: 30,
      pending_invoice_items_behavior: 'include',
      metadata: { source: 'betihari_community_dashboard' },
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      amount: amount,
      currency: (currency || 'usd').toLowerCase(),
      description: desc,
      invoice: invoice.id,
    });

    let finalInvoice = invoice;
    if (sendNow) {
      finalInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
      await stripe.invoices.sendInvoice(invoice.id);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        invoiceId: finalInvoice.id,
        hostedInvoiceUrl: finalInvoice.hosted_invoice_url,
        status: finalInvoice.status,
        message: sendNow ? 'Invoice created and sent to customer.' : 'Draft invoice created.',
      }),
    });
  } catch (err) {
    console.error('Stripe invoice error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to create invoice' }),
    };
  }
};
