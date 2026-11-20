# Al-Dafwa Restaurant website

Bilingual (Arabic / English) restaurant website for Al-Dafwa Restaurant, Omar Bin Abdulaziz Road, Al Malaz, Riyadh. It includes a digital menu, a persistent cart, ordering through WhatsApp, a Catering & Bulk Orders page (catering inquiry and meeting request forms) and the restaurant's social links. There is no backend, database or payment: orders and requests are sent as a pre-filled WhatsApp message that the customer sends themselves.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # unit tests: prices, cart, WhatsApp order and catering messages
npm run lint
npm run build && npm run start
```

Environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional override of the restaurant WhatsApp (digits only). The default, 966504224206, comes from the official Linktree and is set in `src/config/restaurant.ts`. With no number at all, ordering and requests are disabled and the site asks customers to call. |
| `NEXT_PUBLIC_SITE_URL` | Production URL for canonical links, sitemap and Open Graph. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` only in production. Otherwise the site is `noindex`. |

## Where things live

| Path | What |
|---|---|
| `src/config/restaurant.ts` | Name, address, coordinates, phone, WhatsApp, hours, social links, order types, charges |
| `src/data/menu.ts` | The full menu: 11 sections, 105 dishes, from the restaurant's own QR menu (prices include VAT) |
| `src/i18n/dictionaries.ts` | All interface text in Arabic and English |
| `src/lib/cart.ts` | Pure cart and price logic (integer halalas) |
| `src/lib/whatsapp.ts` | WhatsApp message builder, URL encoding, phone validation |
| `src/lib/catering.ts` | Catering inquiry and meeting request options, validation and messages |
| `src/lib/social.ts` | Social links list (WhatsApp plus the accounts in the config) |
| `src/components/cart/` | Cart provider (React state + localStorage), drawer, checkout |
| `src/app/[lang]/` | Pages: home, menu, about, contact |
| `src/proxy.ts` | Sends `/` to `/ar` or `/en` (saved choice, browser language, Arabic default) |

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Lucide icons, GSAP (scroll reveals), Three.js (hero embers, tablets and desktops only), Vitest.

## Docs

- `docs/01-research-and-plan.md`: verified facts and their sources, conflicts, design direction, ordering flow
- `docs/02-content-editing-guide.md`: how to change the menu, prices, photos, hours, logo and WhatsApp number
- `docs/03-launch-checklist.md`: what the restaurant must confirm, and go-live steps
- `docs/04-menu-source.md`: where every menu price came from, corrections, Arabic names to check
- `docs/photo-credits.md`: Unsplash photo credits (all photos are illustrative)
