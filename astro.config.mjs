// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Update to the real domain when chosen. Used for canonical URLs + sitemaps.
  site: 'https://termsofpower.org',

  // Output stays 'static' (the default): every page is prerendered to HTML and
  // deploys to Cloudflare Pages unchanged. Only routes that opt out with
  // `export const prerender = false` (currently just /api/notify) run on demand
  // as Cloudflare Pages Functions. The Cloudflare adapter is what makes those
  // on-demand routes — and the D1 binding behind them — possible.
  adapter: cloudflare({
    // Surface the wrangler.jsonc bindings (the D1 database) on
    // `Astro.locals.runtime.env` during `astro dev`, so the signup endpoint
    // works locally against a local D1 instance.
    platformProxy: { enabled: true },
  }),
});
