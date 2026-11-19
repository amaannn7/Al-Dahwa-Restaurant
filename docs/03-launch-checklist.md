# Launch checklist

## A. Needed from the restaurant (blocking)

- [ ] **WhatsApp number** that receives orders. Is +966 11 478 7671 on WhatsApp (WhatsApp Business on a landline), or is there a separate mobile? Ordering stays switched off until this is set.
- [ ] **Check the menu transcription** in `docs/04-menu-source.md`: the four corrections and the Arabic dish names.

Done: logo (supplied), phone +966 11 478 7671 (confirmed), full menu and prices (from Google Maps).

## B. Strongly recommended

- [ ] Confirm opening hours (12 PM to 2 AM daily is shown, from Google), especially Friday.
- [ ] Own photos: dishes, interior, exterior. They replace the illustrative stock photos.
- [ ] Confirm the Instagram account @aldafwa is theirs and active; add any TikTok / Snapchat / X accounts.
- [ ] Do they deliver WhatsApp orders themselves? If yes, the delivery area and fee (see the editing guide). Google links to HungerStation for delivery; a HungerStation button can be added if wanted.
- [ ] Is VAT included in menu prices? (Prices are shown exactly as on Google; no tax line is added.)
- [ ] A short verified history for the About page, if they want one (the logo gives 1990).
- [ ] Confirm family section and takeaway are current.

## C. Before going live

- [ ] Hosting: Vercel (Next.js 16). Environment variables:
  - `NEXT_PUBLIC_SITE_URL=https://<domain>`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER=9665XXXXXXXX` (or set it in `src/config/restaurant.ts`)
  - `NEXT_PUBLIC_ALLOW_INDEXING=true` **only on the production deployment**. Staging stays `noindex` and `robots.txt` disallows everything until then.
- [ ] Send a real test order from a phone to the restaurant's WhatsApp, in Arabic and English, and have them confirm it reads well.
- [ ] Open the site on a real iPhone (Safari) and Android (Chrome).
- [ ] Domain DNS pointed to the host (lower the TTL a day before).
- [ ] Google Search Console: verify the domain, submit `/sitemap.xml`.
- [ ] Google Business Profile: set the website link to the new domain.
- [ ] Confirm each Unsplash photo still shows as free on its page (`docs/photo-credits.md`).

## D. Rollback
1. Vercel keeps every deployment: promote the previous one in the dashboard.
2. If the domain itself is the problem, point DNS back to the previous host.
