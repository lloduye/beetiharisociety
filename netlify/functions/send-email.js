// Netlify serverless function: send an email using MXroute's SMTP HTTP API.
// Docs: https://docs.mxroute.com/docs/api/smtp-api.html
//
// Required environment variables in Netlify (and optional in local `.env`):
// - MXROUTE_SERVER   e.g. "redbull.mxrouting.net"
// - MXROUTE_USERNAME e.g. "contact@yourdomain.org"
// - MXROUTE_PASSWORD the mailbox password (KEEP PRIVATE)
// - MXROUTE_FROM     default From address, usually same as username
//
// Frontend: POST JSON to `/.netlify/functions/send-email` with:
//   { to: string, subject: string, body: string }
// Optional:
//   { replyTo?: string }
//
// Response: { success: boolean, message?: string, error?: string }

const MXROUTE_API_URL = 'https://smtpapi.mxroute.com/';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // Basic CORS preflight support (in case it's ever called cross-origin)
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
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
        error:
          'Email is not configured. Please set MXROUTE_SERVER, MXROUTE_USERNAME, MXROUTE_PASSWORD, and MXROUTE_FROM in Netlify environment variables.',
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

  const to = (payload.to || '').trim();
  const subject = (payload.subject || '').trim();
  const body = (payload.body || '').trim();
  const replyTo = (payload.replyTo || '').trim();

  if (!to || !subject || !body) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        error: 'Missing required fields: to, subject, and body are all required.',
      }),
    };
  }

  const requestBody = {
    server,
    username,
    password,
    from: defaultFrom,
    to,
    subject,
    body,
  };

  try {
    // Use global fetch if available (Node 18+). If not, throw a clear error.
    if (typeof fetch !== 'function') {
      throw new Error(
        'fetch is not available in this runtime. Please upgrade the Node.js runtime for Netlify functions to 18 or higher.'
      );
    }

    const response = await fetch(MXROUTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(replyTo ? { 'Reply-To': replyTo } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText);
    } catch {
      // MXroute should return JSON; if not, expose text for debugging.
      result = { success: response.ok, message: resultText };
    }

    if (!response.ok || result.success === false) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          error:
            result.message ||
            'Failed to send email via MXroute. Please check MXroute credentials and try again.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        message: result.message || 'Email sent successfully.',
      }),
    };
  } catch (err) {
    console.error('send-email error:', err.message || err);
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        error:
          err.message ||
          'Unexpected error while sending email. Please try again or contact support.',
      }),
    };
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

