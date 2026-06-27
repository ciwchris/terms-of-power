# Terms of Power

A coordinated accountability project that makes the imbalance buried in digital
terms of service **visible, specific, and reputationally costly**. See
[`project-plan.md`](./project-plan.md) for the full strategy.

This repository is the project website, built with [Astro](https://astro.build).

## Stack

- **Astro** (static output) — fast, zero-JS-by-default content site
- **Single-page** site with anchor navigation (header/footer links scroll to sections)
- **Typography:** system sans + system mono — no web fonts, by design
- No UI framework — plain `.astro` components and scoped CSS

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build → ./dist
npm run preview    # preview the production build
```

## Project structure

```
src/
  layouts/Base.astro        # <head>, nav + footer shell
  components/Nav.astro       # sticky SiteHeader (brand rule + anchor nav + CTA)
  components/Footer.astro    # brand lockup + footer nav + fine print
  pages/
    index.astro             # the whole site — all sections on one scrolling page
  styles/global.css         # design-system tokens + base + components
public/favicon.svg
```

Sections (anchor IDs): `#top`, `#the-gap`, `#problem`, `#why-mid`, `#method`,
`#success`, `#scope`, `#get-involved`.

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

The site builds to static files, so no adapter is needed yet.

- **Build command:** `npm run build`
- **Output directory:** `dist`

Connect the repo in the Cloudflare dashboard (Workers & Pages → Create → Pages),
or deploy the built directory with Wrangler:

```bash
npm run build
npx wrangler pages deploy dist
```

### Adding serverless later

When dynamic behavior is needed (a real signup endpoint, target submissions),
install the Cloudflare adapter and switch only those routes to on-demand
rendering — the rest of the site stays static:

```bash
npx astro add cloudflare
```

Then set `export const prerender = false` on the specific dynamic pages/endpoints.
The "Add your name" form in `index.astro` (`#get-involved`) currently shows a
client-side confirmation only — no data is stored. Swap the submit handler in the
page's inline `<script>` for a `fetch()` to the new endpoint when it exists.
