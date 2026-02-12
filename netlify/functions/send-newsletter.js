/**
 * Sends a newsletter to multiple recipients using MXroute SMTP API.
 * Body: { recipients: string[], subject: string, body: string }
 * Sends one email per recipient (BCC not always supported) to avoid exposing addresses.
 */
const MXROUTE_API_URL = 'https://smtpapi.mxroute.com/';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  const server = (process.env.MXROUTE_SERVER || '').trim();
  const username = (process.env.MXROUTE_USERNAME || '').trim();
  const password = (process.env.MXROUTE_PASSWORD || '').trim();
  const defaultFrom = (process.env.MXROUTE_FROM || username || '').trim();

  if (!server || !username || !password || !defaultFrom) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        error: 'Email not configured. Set MXROUTE_* in Netlify.',
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, error: 'Invalid JSON body' }),
    };
  }

  const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
  const subject = (payload.subject || '').trim();
  const body = (payload.body || '').trim();

  if (recipients.length === 0 || !subject || !body) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        error: 'recipients (array), subject, and body are required.',
      }),
    };
  }

  const validEmails = recipients
    .map((r) => String(r).trim().toLowerCase())
    .filter((e) => e && e.includes('@'));

  if (validEmails.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, error: 'No valid recipient emails.' }),
    };
  }

  const sent = [];
  const failed = [];

  for (const to of validEmails) {
    try {
      const requestBody = {
        server,
        username,
        password,
        from: defaultFrom,
        to,
        subject,
        body,
      };

      const response = await fetch(MXROUTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const resultText = await response.text();
      let result;
      try {
        result = JSON.parse(resultText);
      } catch {
        result = { success: response.ok };
      }

      if (response.ok && result.success !== false) {
        sent.push(to);
      } else {
        failed.push({ email: to, error: result.message || resultText });
      }
    } catch (err) {
      failed.push({ email: to, error: err.message });
    }
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: failed.length === 0,
      sent: sent.length,
      failed: failed.length,
      failedList: failed,
      message:
        failed.length === 0
          ? `Newsletter sent to ${sent.length} recipient(s).`
          : `Sent to ${sent.length}, failed for ${failed.length}.`,
    }),
  };
};
