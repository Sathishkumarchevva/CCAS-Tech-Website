# CCAS Tech website

Marketing site for **CCAS Tech** — a USA-based IT consulting and staffing company.
Built from the approved homepage prototype and the CCAS Tech Brand Guidelines v1.0.

**Stack:** [Astro](https://astro.build) (static output) · TypeScript · [three.js](https://threejs.org) for the hero (lazy-loaded) · Lucide icons · self-hosted brand fonts. No runtime framework and no server needed.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site → dist/
npm run preview   # serve the production build
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero (3D twin-arc mark), services, how it works, management, industries, about, contact form |
| `/services/` | 12 technology roles + 4 management disciplines + engagement models |
| `/industries/` | Technology, E-commerce, Banking, Finance, Insurance, Marketing |
| `/consultants/` | "Join our network" — for consultants (separate form) |
| `/about/` | Who we are, values, the meaning of the mark |
| `/contact/` | Contact form + details (supports `?role=` preselect) |
| `/privacy/`, `/terms/` | **Draft** legal pages — need review by counsel |
| `404` | Not-found page |

## Editing content

Almost all copy lives in **`src/data/site.ts`**: contact details, nav, the 12 roles, management areas, industries, engagement models, steps, values, stats and the "trusted by" list. Page-specific copy is in `src/pages/*.astro`.

## Contact forms

All three forms (homepage, Contact, Consultants → Apply) post to `/api/submit` ([`api/submit.js`](api/submit.js), a Vercel serverless function). It validates the data, discards spam, and forwards it to a **Power Automate** flow that adds a row to a table in a **Microsoft Excel** workbook.

Setup (about 15 minutes, in your Microsoft 365 account): [`docs/form-to-excel-power-automate.md`](docs/form-to-excel-power-automate.md). Then add two environment variables in Vercel and redeploy:

| Variable | Purpose |
|---|---|
| `POWER_AUTOMATE_URL` | The flow's "HTTP POST URL". Secret: keep it server-side (no `PUBLIC_` prefix). |
| `FORM_TIMEZONE` | Optional. Time zone for the "Submitted (local)" column. Default `America/New_York`. |

The "When an HTTP request is received" trigger needs a **Power Automate Premium** licence. The guide explains the alternative if you don't have one.

Until `POWER_AUTOMATE_URL` is set (and during `npm run dev`, which doesn't run `api/`), the forms open the visitor's email app with their details, so no enquiry is lost.
Protections: hidden honeypot field, per-visitor rate limit, cross-site posts blocked, field length caps, Excel-formula neutralising, native validation, clear success/error messages.

## Brand implementation (from the Brand Guidelines)

- **Colour tokens** in `src/styles/global.css` match the guidelines exactly (Navy `#0B1F3A`, Sunset Orange `#FF7A1A`, Orange Text `#C2540A`, etc.).
- **Type:** Space Grotesk (headings), DM Sans (body/UI), JetBrains Mono (labels) — the supplied WOFF2 files in `public/fonts/`. Scale follows the guidelines (Display 64/72 → Label 12/16, ×0.75 on mobile).
- **Logo:** supplied SVG artwork only (`public/images/`), never redrawn. Header 80px desktop / 64px mobile, logo 40px / 32px, max width 1200px.
- **Buttons / cards:** 12px radius, 16×28 padding, DM Sans SemiBold; hover `#E86A0E` / `#1A3358`; cards 20px radius, 1px `#E3E6EB` border, no heavy shadows.
- **Accessibility:** Sunset Orange is never used for small text on light backgrounds (Orange Text or Slate instead). Skip link, visible focus, keyboard-operable menu, `prefers-reduced-motion` respected (3D hero, starfield, marquee and reveals all calm down).
- **Icons:** Lucide only, 2px stroke, as specified.
- Favicons, web manifest, theme colour and OG image are the supplied files.

## Before launch — needs the client

Search the code for `TODO(client)`. In short:

1. **Phone number, office address, LinkedIn URL** — hidden until filled in `src/data/site.ts`.
2. **Stats** (430K projects, 170+ customers, 200+ awards) and the **"trusted by" company names** were carried over from the prototype. Confirm they are accurate and that the company names may be shown — they imply client relationships.
3. **Industry photos** came from the design prototype. Confirm they are licensed for commercial use.
4. **Privacy & Terms** are drafts.
5. Set up **Power Automate → Excel** and add `POWER_AUTOMATE_URL` in Vercel (see Contact forms).
6. Add analytics / cookie consent if required.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build command `npm run build`, output directory `dist`. The canonical site URL (`https://ccastech.com`) is set in `astro.config.mjs` and drives the sitemap and meta tags.
