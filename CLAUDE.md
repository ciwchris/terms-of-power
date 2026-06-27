# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing/manifesto website for **Terms of Power** — a coordinated accountability
project that makes the power imbalance buried in digital terms of service visible,
specific, and reputationally costly. `project-plan.md` holds the full strategy and is
the source of truth for site copy and messaging; keep the two aligned.

## Commands

```bash
npm install
npm run dev               # dev server at http://localhost:4321
npm run build             # build → ./dist (static pages + the notify function)
npm run preview           # serve the production build locally

npm run db:migrate:local  # apply migrations/ to a LOCAL D1 (needed before the
                          #   notify form works in `npm run dev`)
npm run db:migrate        # apply migrations/ to the REMOTE D1 (deploy)
npm run db:list           # dump the remote subscriber list
```

There are no tests, linter, or formatter configured. TypeScript is in `strict` mode
(via `astro/tsconfigs/strict`); `npm run build` is the de-facto type/correctness check.

## Viewing / previewing the site

When you need to look at the rendered site (verify a change, screenshot a page, check
layout), **use the `agent-browser` skill** — not the Chrome DevTools MCP. Serve the build
or run `npm run dev`, then drive it with `agent-browser` (`open <url>`, `screenshot --full
<path>`, `snapshot -i`). Remember relative-path assets and `#anchor` links only resolve
correctly under the right base path — check nested routes like `/campaign/<slug>/`, not just
the homepage, since shared Nav/Footer links are root-relative (`/#…`) for that reason.

## Architecture

Astro 5 with the `@astrojs/cloudflare` adapter. Output is **static by default** — every
page prerenders to HTML; only routes that set `export const prerender = false` run on
demand as Cloudflare Pages Functions (currently just `src/pages/api/notify.ts`). No UI
framework, zero JS by default.

- **Homepage** (`src/pages/index.astro`) is **one scrolling page**: content lives in
  `<section>` elements with anchor IDs (`#top`, `#the-gap`, `#problem`, `#method`,
  `#get-involved`, `#success`, `#scope`). Nav/footer links scroll to these. Add homepage
  content by adding a section.
- **Campaigns** are the only other pages. `src/data/campaigns.ts` is the source of truth:
  an array of typed `Campaign` objects. `src/pages/campaign/[slug].astro` renders one page
  per campaign via `getStaticPaths()`. `activeCampaign()` returns the first `status:
  "active"` campaign, which the homepage `#get-involved` section features as a card. **Add
  or edit a campaign by editing `campaigns.ts`, not by hand-writing a page.** Keep quoted
  clauses verbatim with a cited source — the whole strategy rests on specifics being
  defensible (see `project-plan.md`).
- `src/layouts/Base.astro` is the shell: `<head>` (canonical URL, OG/Twitter meta), skip
  link, `<Nav />`, `<main>` slot, `<Footer />`. Every page wraps its content in `Base`.
- `src/components/Nav.astro` (sticky header, ~64px) and `Footer.astro` are presentational.
  The header offset is mirrored in CSS as `scroll-margin-top` on `[id]` sections — keep
  them in sync if the header height changes.

## Design system — read before touching styles

All design tokens live in `:root` in `src/styles/global.css` and are the single source of
truth. **Use the CSS variables and the shared utility classes; do not hardcode colors,
spacing, or type sizes.** The system was generated from the Claude Design project
"Terms of Power redesign" — to re-sync from that source, use the `DesignSync` MCP /
`/design-sync` rather than hand-editing tokens.

Conventions to preserve:
- **Editorial/civic** restraint. The muted-burgundy accent (`--accent`, `#7c2d12`) is held
  to ~10–15% of any view — CTAs, links, thin rules, eyebrows only. Don't expand its use.
- **No web fonts**, by design — system sans + system mono only (`--font-sans`, `--font-mono`).
- Separation comes from **spacing and 1px borders**, not elevation; the only shadow is a
  subtle one on card hover.
- Shared classes: `.wrap` (1120px container), `.section` (+ modifiers `--sm`, `--line`,
  `--muted`), `.eyebrow`, `.card`, `.btn` (`--primary`/`--secondary`, `--lg`/`--md`),
  `.input`, `.lede`, `.fineprint`. Reuse these before writing new CSS.
- Respect `prefers-reduced-motion` (reveal animation and smooth scroll already gate on it).

## The notify-me signup (D1)

The "notify me" form in `#get-involved` POSTs to `src/pages/api/notify.ts`, which inserts
the email into a Cloudflare **D1** `subscribers` table (`INSERT OR IGNORE`, so re-signups
are idempotent; emails are lowercased). The D1 binding is `DB`, declared in
`wrangler.jsonc` and typed in `src/env.d.ts` as `Astro.locals.runtime.env.DB`. Schema lives
in `migrations/`.

- Locally, the binding is surfaced by `platformProxy` (set in `astro.config.mjs`); run
  `npm run db:migrate:local` once before the form will work in `npm run dev`.
- The endpoint returns 503 if the binding is missing, so a misconfigured deploy fails soft.
- `wrangler.jsonc` ships a placeholder `database_id` — the real one comes from
  `wrangler d1 create` (see README). Don't commit a real id-less assumption.

## Deployment

Cloudflare Pages — build command `npm run build`, output directory `dist`. Deploying
requires the D1 database to exist and its `database_id` to be set in `wrangler.jsonc`
(README "One-time: provision the notify list"). `site` in `astro.config.mjs`
(`https://termsofpower.org`) drives canonical URLs — update it if the real domain changes.

Note: the Cloudflare adapter enables Astro Sessions via a default `SESSION` KV binding. The
site doesn't use sessions, so the build warning about it is harmless — only add the KV
binding if something starts calling `Astro.session`.
