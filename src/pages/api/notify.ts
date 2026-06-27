import type { APIRoute } from 'astro';

// Runs on demand as a Cloudflare Pages Function — the rest of the site is static.
export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  let email = '';
  try {
    const data = (await request.json()) as { email?: unknown };
    email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  } catch {
    // malformed body falls through to validation below
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const db = locals.runtime?.env?.DB;
  if (!db) {
    // No binding (e.g. dev without platformProxy, or unconfigured deploy).
    return json({ ok: false, error: 'Signups are temporarily unavailable.' }, 503);
  }

  try {
    // INSERT OR IGNORE makes re-signups a no-op (email is the primary key).
    await db
      .prepare('INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)')
      .bind(email, 'website')
      .run();
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
  }

  return json({ ok: true }, 200);
};
