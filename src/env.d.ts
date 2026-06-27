/// <reference types="astro/client" />

// Cloudflare bindings declared in wrangler.jsonc, surfaced on
// `Astro.locals.runtime.env` by the Cloudflare adapter.
interface Env {
  DB: import('@cloudflare/workers-types').D1Database;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
