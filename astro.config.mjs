// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update to the real domain when chosen. Used for canonical URLs + sitemaps.
  site: 'https://termsofpower.org',

  // Default output is 'static' — produces a fully static build that deploys to
  // Cloudflare Pages with zero config. When serverless is needed later (e.g. a
  // real signup endpoint or target-submission API), add `@astrojs/cloudflare`
  // and switch only the dynamic routes to on-demand rendering.
});
