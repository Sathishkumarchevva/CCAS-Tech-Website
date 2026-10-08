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

Both forms POST JSON to the URL in `PUBLIC_FORM_ENDPOINT` (works with Formspree, Basin, Getform or any JSON endpoint).

```bash
cp .env.example .env     # then set PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

On Vercel/Netlify, set it as an environment variable instead. **If it is empty, the forms fall back to opening the visitor's email client** (`mailto:`), so nothing is silently lost — but set an endpoint before launch.
Includes a honeypot field, native validation, and clear success/error messages.

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
5. Set **`PUBLIC_FORM_ENDPOINT`**.
6. Add analytics / cookie consent if required.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build command `npm run build`, output directory `dist`. The canonical site URL (`https://ccastech.com`) is set in `astro.config.mjs` and drives the sitemap and meta tags.
