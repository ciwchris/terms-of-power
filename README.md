# Terms of Power

A coordinated accountability project that makes the imbalance buried in digital
terms of service **visible, specific, and reputationally costly**. See
[`project-plan.md`](./project-plan.md) for the full strategy.

This repository is the project website, built with [Astro](https://astro.build).

## Stack

- **Astro** — static-by-default content site; only `/api/notify` runs on demand
- **Single-page** homepage with anchor navigation, plus per-campaign pages at
  `/campaign/[slug]`
- **Cloudflare Pages** hosting + **D1** (SQLite) behind the "notify me" signup
- **Typography:** system sans + system mono — no web fonts, by design
- No UI framework — plain `.astro` components and scoped CSS

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # build → ./dist (static pages + the notify function)
npm run preview    # preview the production build
```

The "notify me" signup writes to D1. To exercise it locally, create the local
database once, then run dev as usual:

```bash
npm run db:migrate:local   # apply migrations/ to a local D1
npm run dev                # platformProxy surfaces the local DB binding
```

The endpoint also degrades gracefully (HTTP 503) when no DB binding is present.

## Project structure

```
src/
  layouts/Base.astro         # <head>, nav + footer shell
  components/Nav.astro        # sticky SiteHeader (brand rule + anchor nav + CTA)
  components/Footer.astro     # brand lockup + footer nav + fine print
  data/campaigns.ts          # campaign content + types (source of truth for campaigns)
  pages/
    index.astro              # homepage — all sections on one scrolling page
    campaign/[slug].astro    # one page per campaign (getStaticPaths over campaigns)
    api/notify.ts            # POST signup → D1 (the only on-demand route)
    404.astro
  styles/global.css          # design-system tokens + base + components
  env.d.ts                   # types the Cloudflare D1 binding on Astro.locals
migrations/                  # D1 schema (subscribers table)
wrangler.jsonc               # Cloudflare bindings (D1) for dev + deploy
public/favicon.svg
```

Homepage sections (anchor IDs): `#top`, `#the-gap`, `#problem`, `#method`,
`#get-involved`, `#success`, `#scope`. The `#get-involved` section sits right
after `#method`, leads with the active campaign (a card linking to its
`/campaign/[slug]` page), and keeps the "notify me" form as a secondary option.

### Adding a campaign

Add an entry to the `campaigns` array in `src/data/campaigns.ts`. A `status` of
`"active"` makes it the campaign featured on the homepage (`activeCampaign()`
returns the first active one); its page builds automatically at
`/campaign/<slug>`. Keep quoted clauses **verbatim** and cite the source — the
strategy depends on specifics being defensible.

## Design system

Implemented from the Claude Design project **"Terms of Power redesign"**
(`Terms of Power.dc.html`). Tokens live in `src/styles/global.css` (`:root`),
mirroring the source design system:

- **Palette:** warm off-white `#FAFAF8`, near-black ink `#111827`, quiet grays,
  and one restrained muted-burgundy accent `#7C2D12` (hover `#5C1F0E`). Accent is
  held to ~10–15% of any view — CTAs, links, thin rules, eyebrows.
- **Type:** system sans (`ui-sans-serif, system-ui, …`), system mono. No web fonts.
- **Surfaces:** white cards, 1px `#D1D5DB` border, 14px radius; separation comes
  from spacing + borders, not elevation (subtle shadow on card hover only).
- **Rhythm:** spacious editorial sections (64–96px), 1120px page container.

To re-sync from the design later, see the `DesignSync` MCP / `/design-sync`.

## Deployment — Cloudflare Pages

The site uses the `@astrojs/cloudflare` adapter. Pages are static; `/api/notify`
deploys as a Cloudflare Pages Function and needs the D1 binding.

- **Build command:** `npm run build`
- **Output directory:** `dist`

### One-time: provision the notify list (D1)

```bash
npx wrangler login
npx wrangler d1 create terms-of-power-notify
```

Copy the printed `database_id` into `wrangler.jsonc` (replace
`REPLACE_WITH_D1_DATABASE_ID`), then create the schema on the remote database:

```bash
npm run db:migrate        # wrangler d1 migrations apply ... --remote
```

### Deploy

Connect the repo in the Cloudflare dashboard (Workers & Pages → Create → Pages)
so the `DB` binding from `wrangler.jsonc` is picked up, or deploy from the CLI:

```bash
npm run build
npx wrangler pages deploy dist
```

Export the signups any time with `npm run db:list`.

> **Note:** the Cloudflare adapter enables Astro Sessions via a `SESSION` KV
> binding by default. The site doesn't use sessions, so this is harmless — but
> if you ever call `Astro.session`, add a KV namespace bound as `SESSION` to
> `wrangler.jsonc`.
