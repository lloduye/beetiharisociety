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
      const country = s.customer_details?.address?.country || 'Unknown';
      const state = s.customer_details?.address?.state || null;
      const currency = (s.currency || 'usd').toUpperCase();
      return {
        id: s.id,
        customerId: s.customer || null,
        name: name.split(' ')[0] + (name.includes(' ') ? '.' : ''),
        fullName: s.customer_details?.name || name,
        email,
        amount,
        date,
        created: s.created,
        country,
        state,
        currency,
      };
    });

    // Overall summary stats
    const nowSec = Math.floor(Date.now() / 1000);
    const THIRTY_DAYS = 30 * 24 * 60 * 60;

    let totalAmount = 0;
    let totalCount = donations.length;
    let last30DaysAmount = 0;
    let last30DaysCount = 0;
    let firstDonation = null;
    let lastDonation = null;
    let largestDonation = 0;

    donations.forEach((d) => {
      totalAmount += d.amount;

      if (!firstDonation || (d.created && d.created < firstDonation.created)) {
        firstDonation = d;
      }
      if (!lastDonation || (d.created && d.created > lastDonation.created)) {
        lastDonation = d;
      }
      if (d.amount > largestDonation) {
        largestDonation = d.amount;
      }

      if (d.created && nowSec - d.created <= THIRTY_DAYS) {
        last30DaysAmount += d.amount;
        last30DaysCount += 1;
      }
    });

    const averageDonation = totalCount > 0 ? totalAmount / totalCount : 0;

    const summary = {
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalCount,
      averageDonation: Math.round(averageDonation * 100) / 100,
      last30DaysAmount: Math.round(last30DaysAmount * 100) / 100,
      last30DaysCount,
      firstDonationDate: firstDonation?.date || null,
      lastDonationDate: lastDonation?.date || null,
      largestDonation: Math.round(largestDonation * 100) / 100,
    };

    // Country and region breakdowns
    const byCountryMap = {};
    const byRegionMap = {};

    donations.forEach((d) => {
      const countryKey = d.country || 'Unknown';
      const stateKey = d.state || 'Unknown';

      if (!byCountryMap[countryKey]) {
        byCountryMap[countryKey] = {
          country: countryKey,
          totalAmount: 0,
          totalCount: 0,
        };
      }
      byCountryMap[countryKey].totalAmount += d.amount;
      byCountryMap[countryKey].totalCount += 1;

      if (!byRegionMap[countryKey]) {
        byRegionMap[countryKey] = {
          country: countryKey,
          regions: {},
        };
      }
      if (!byRegionMap[countryKey].regions[stateKey]) {
        byRegionMap[countryKey].regions[stateKey] = {
          state: stateKey,
          totalAmount: 0,
          totalCount: 0,
        };
      }
      byRegionMap[countryKey].regions[stateKey].totalAmount += d.amount;
      byRegionMap[countryKey].regions[stateKey].totalCount += 1;
    });

    const byCountry = Object.values(byCountryMap)
      .map((c) => ({
        country: c.country,
        totalAmount: Math.round(c.totalAmount * 100) / 100,
        totalCount: c.totalCount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    const byRegion = Object.values(byRegionMap).map((c) => ({
      country: c.country,
      regions: Object.values(c.regions)
        .map((r) => ({
          state: r.state,
          totalAmount: Math.round(r.totalAmount * 100) / 100,
          totalCount: r.totalCount,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount),
    }));

    // Monthly timeline (YYYY-MM)
    const timelineMap = {};
    donations.forEach((d) => {
      if (!d.date) return;
      const year = d.date.getUTCFullYear();
      const month = d.date.getUTCMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (!timelineMap[key]) {
        timelineMap[key] = {
          month: key,
          totalAmount: 0,
          totalCount: 0,
        };
      }
      timelineMap[key].totalAmount += d.amount;
      timelineMap[key].totalCount += 1;
    });

    const timeline = Object.values(timelineMap)
      .map((t) => ({
        month: t.month,
        totalAmount: Math.round(t.totalAmount * 100) / 100,
        totalCount: t.totalCount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    donations.sort((a, b) => (b.created || 0) - (a.created || 0));
    const recentDonations = donations.slice(0, 20).map((d) => ({
      name: d.name,
      fullName: d.fullName,
      email: d.email,
      amount: d.amount,
      date: d.date,
      created: d.created,
      currency: d.currency,
      time: formatTimeAgo(d.created),
    }));

    const byEmail = {};
    donations.forEach((d) => {
      const key = d.email || d.name;
      if (!byEmail[key]) {
        byEmail[key] = {
          email: d.email,
          name: d.name,
          fullName: d.fullName,
          total: 0,
          count: 0,
          country: d.country || 'Unknown',
          state: d.state || null,
          lastDonation: d.created || null,
          customerId: d.customerId || null,
        };
      }
      byEmail[key].total += d.amount;
      byEmail[key].count += 1;
      if (d.created && (!byEmail[key].lastDonation || d.created > byEmail[key].lastDonation)) {
        byEmail[key].lastDonation = d.created;
        byEmail[key].customerId = d.customerId || byEmail[key].customerId;
      }
    });
    const topDonors = Object.values(byEmail)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((d) => ({
        name: d.name,
        total: Math.round(d.total * 100) / 100,
        count: d.count,
      }));

    const donors = Object.values(byEmail)
      .sort((a, b) => (b.lastDonation || 0) - (a.lastDonation || 0))
      .map((d, index) => ({
        id: index + 1,
        email: d.email,
        name: d.name,
        fullName: d.fullName,
        total: Math.round(d.total * 100) / 100,
        count: d.count,
        country: d.country,
        state: d.state,
        customerId: d.customerId,
        lastDonationDate: d.lastDonation ? new Date(d.lastDonation * 1000) : null,
        lastDonationTime: d.lastDonation ? formatTimeAgo(d.lastDonation) : '',
      }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({
        recentDonations,
        donations: donations.slice(0, 100),
        topDonors,
        summary,
        byCountry,
        byRegion,
        timeline,
        donors,
      }),
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
