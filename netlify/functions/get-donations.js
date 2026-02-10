const Stripe = require('stripe');

/**
 * Returns recent donations and top donors from Stripe Checkout (one-time payments).
 * Requires STRIPE_SECRET_KEY in Netlify. Used by Get Involved page.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recentDonations: [], topDonors: [], error: 'Stripe not configured' }),
    };
  }

  const stripe = new Stripe(stripeSecretKey);
  const sessions = [];
  let hasMore = true;
  let startingAfter = null;

  try {
    while (hasMore) {
      const params = {
        status: 'complete',
        limit: 100,
      };
      if (startingAfter) params.starting_after = startingAfter;
      const list = await stripe.checkout.sessions.list(params);
      for (const s of list.data) {
        if (s.mode === 'payment' && s.amount_total != null && s.amount_total > 0) {
          sessions.push(s);
        }
      }
      hasMore = list.has_more;
      if (list.data.length) startingAfter = list.data[list.data.length - 1].id;
      else hasMore = false;
    }

    const donations = sessions.map((s) => {
      const name = s.customer_details?.name || s.customer_email || 'Anonymous';
      const email = (s.customer_email || '').toLowerCase().trim();
      const amount = (s.amount_total || 0) / 100;
      const date = s.created ? new Date(s.created * 1000) : null;
      return {
        id: s.id,
        name: name.split(' ')[0] + (name.includes(' ') ? '.' : ''),
        email,
        amount,
        date,
        created: s.created,
      };
    });

    donations.sort((a, b) => (b.created || 0) - (a.created || 0));
    const recentDonations = donations.slice(0, 20).map((d) => ({
      name: d.name,
      amount: d.amount,
      date: d.date,
      time: formatTimeAgo(d.created),
    }));

    const byEmail = {};
    donations.forEach((d) => {
      const key = d.email || d.name;
      if (!byEmail[key]) byEmail[key] = { name: d.name, total: 0, count: 0 };
      byEmail[key].total += d.amount;
      byEmail[key].count += 1;
    });
    const topDonors = Object.values(byEmail)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((d) => ({
        name: d.name,
        total: Math.round(d.total * 100) / 100,
        count: d.count,
      }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ recentDonations, topDonors }),
    };
  } catch (err) {
    console.error('get-donations error:', err.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recentDonations: [],
        topDonors: [],
        error: err.message || 'Failed to load donations',
      }),
    };
  }
};

function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const sec = Math.floor(Date.now() / 1000 - timestamp);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
}
