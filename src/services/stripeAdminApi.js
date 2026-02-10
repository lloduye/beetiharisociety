const PASS_KEY = 'stripe_admin_passphrase';

export function getStripeAdminPassphrase() {
  try {
    return sessionStorage.getItem(PASS_KEY) || '';
  } catch {
    return '';
  }
}

export function setStripeAdminPassphrase(pass) {
  try {
    if (!pass) sessionStorage.removeItem(PASS_KEY);
    else sessionStorage.setItem(PASS_KEY, pass);
  } catch {}
}

async function adminFetch(path, { method = 'GET', query, body } = {}) {
  const passphrase = getStripeAdminPassphrase();
  if (!passphrase) {
    throw new Error('Stripe admin passphrase is required');
  }

  const qs = query ? `?${new URLSearchParams(query).toString()}` : '';
  const res = await fetch(`/.netlify/functions/${path}${qs}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passphrase': passphrase,
    },
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    if (!res.ok) throw new Error('Export failed');
    return { kind: 'csv', blob: await res.blob(), filename: getFilename(res) };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  if (data && data.error) {
    throw new Error(data.error);
  }
  return { kind: 'json', data };
}

function getFilename(res) {
  const cd = res.headers.get('content-disposition') || '';
  const match = cd.match(/filename="([^"]+)"/);
  return match ? match[1] : 'donations_export.csv';
}

export const stripeAdminApi = {
  async listDonations({ limit = 50, starting_after, created_gte, created_lte } = {}) {
    const { data } = await adminFetch('admin-stripe-list-donations', {
      query: {
        limit: String(limit),
        ...(starting_after ? { starting_after } : {}),
        ...(created_gte ? { created_gte } : {}),
        ...(created_lte ? { created_lte } : {}),
      },
    });
    return data;
  },

  async getDonation(sessionId) {
    const { data } = await adminFetch('admin-stripe-get-donation', {
      query: { sessionId },
    });
    return data;
  },

  async refund({ payment_intent_id, charge_id, amount, reason } = {}) {
    const { data } = await adminFetch('admin-stripe-refund', {
      method: 'POST',
      body: { payment_intent_id, charge_id, amount, reason },
    });
    return data;
  },

  async balance() {
    const { data } = await adminFetch('admin-stripe-balance');
    return data;
  },

  async listPayouts({ limit = 25, starting_after, created_gte, created_lte } = {}) {
    const { data } = await adminFetch('admin-stripe-list-payouts', {
      query: {
        limit: String(limit),
        ...(starting_after ? { starting_after } : {}),
        ...(created_gte ? { created_gte } : {}),
        ...(created_lte ? { created_lte } : {}),
      },
    });
    return data;
  },

  async listDisputes({ limit = 25, starting_after, created_gte, created_lte } = {}) {
    const { data } = await adminFetch('admin-stripe-list-disputes', {
      query: {
        limit: String(limit),
        ...(starting_after ? { starting_after } : {}),
        ...(created_gte ? { created_gte } : {}),
        ...(created_lte ? { created_lte } : {}),
      },
    });
    return data;
  },

  async exportDonations({ created_gte, created_lte, max = 1000 } = {}) {
    const res = await adminFetch('admin-stripe-export-donations', {
      query: {
        ...(created_gte ? { created_gte } : {}),
        ...(created_lte ? { created_lte } : {}),
        max: String(max),
      },
    });
    return res; // { kind:'csv', blob, filename }
  },
};

