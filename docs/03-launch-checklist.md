# Launch checklist

## A. Needed from the restaurant (blocking)

- [ ] **Check the menu corrections** in `docs/04-menu-source.md`: a few English names on the QR menu were fixed (for example "Beef Salad" for سلطة شمندر is shown as Beetroot Salad), and two dishes with no English name were named by us.
- [ ] **Catering:** which of the services on the inquiry form they actually offer (pickup, delivery to a venue, buffet setup, full service with staff), any minimum order or guest count, and lead time. The form says the restaurant will confirm, but options they never offer should be removed in `src/lib/catering.ts`.
- [ ] **Send a test catering inquiry and a test meeting request** from a phone and confirm they arrive on the WhatsApp number below and read well.

Done: logo (supplied), phone +966 11 478 7671 (confirmed), full menu, prices, calories and dish photos (from the restaurant's own QR menu, confirmed by the client on 21 Nov 2026 as the current menu), **WhatsApp +966 50 422 4206** (from the official Linktree, 20 Nov 2026; orders, catering inquiries and meeting requests all go there), TikTok and second landline +966 11 479 1868 (Linktree).

## B. Strongly recommended

- [ ] Confirm opening hours (12 PM to 2 AM daily is shown, from Google), especially Friday.
- [ ] Own photos: dishes, interior, exterior. They replace the illustrative stock photos.
- [ ] Instagram: @aldafwa is listed on three directories but **not** on the official Linktree, so the site no longer links it. If it is theirs, add it back in one line (`social` in `src/config/restaurant.ts`).
- [ ] Do they deliver WhatsApp orders themselves? If yes, the delivery area and fee (see the editing guide). Google links to HungerStation for delivery; a HungerStation button can be added if wanted.
- [ ] Open Buffet (45 SAR) is shown under Grills as "Dine-in only" and cannot be ordered on WhatsApp. Confirm that is right, and whether it should also be mentioned on the Catering page.
- [ ] A short verified history for the About page, if they want one (the logo gives 1990).
- [ ] Confirm family section and takeaway are current.

## C. Before going live

- [ ] Hosting: Vercel (Next.js 16). Environment variables:
  - `NEXT_PUBLIC_SITE_URL=https://<domain>`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER` only if it should differ from the Linktree number set in `src/config/restaurant.ts` (966504224206)
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
