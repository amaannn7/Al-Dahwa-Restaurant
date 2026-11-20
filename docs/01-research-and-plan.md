# Al-Dafwa Restaurant website: research and plan

Researched 19 November 2026; updated the same day with the client's logo, phone number and the full Google Maps menu, and on 20 to 21 November 2026 with the restaurant's official Linktree (linktr.ee/aldafwa_restaurant). Every fact used on the site is listed here with its source.

## 1. Restaurant identity

| Fact | Value used | Sources | Confidence |
|---|---|---|---|
| Name | Al-Dafwa Restaurant / مطاعم الدفواء | Google Maps listing (English and Arabic names); logo reads الدفواء | High |
| Brand line | عراقة الطعم الأصيل منذ 1990 ("the heritage of authentic taste since 1990") | The official logo, supplied by the client | High. The site says the brand's heritage dates to 1990, not that this branch opened in 1990. |
| Phone | +966 11 478 7671 (main); +966 11 479 1868 (second landline) | Client (19 Nov 2026) and Google Maps; the Linktree bio lists both ("011478671" there is missing a digit) | High |
| WhatsApp | +966 50 422 4206 | Official Linktree: WhatsApp button opens wa.me/966504224206; the bio lists 0504224206 | High |
| Social | TikTok @aldafwarestaurant; Linktree; Google Maps location | Official Linktree | High |
| Hours | Daily 12:00 PM to 2:00 AM | Google Maps ("Open, closes 2 AM"; Thursday 12 PM to 2 AM shown) and the daily schedule mirrored on top-rated.online | Medium. Confirm Friday and holiday hours. |
| Menu | 11 sections, 105 dishes, one price each, calories, 54 dish photos | The restaurant's own QR menu (Linktree), confirmed by the client on 21 Nov 2026 as current. Replaced the Google Maps menu. See `04-menu-source.md`. | High |
| Location | 24.6799277, 46.7336186 | Client brief (Google Maps). near-place.com (24.6799627, 46.7335975) and Yandex Maps agree. Our map embed drops the pin on Umar Ibn Abdul Aziz Br Rd, Al Malaz. | High |
| Address | Omar Bin Abdulaziz Road, Al Malaz, Riyadh 12831 / طريق عمر بن عبدالعزيز، الملز، الرياض 12831 | cafesriyadh.com, near-place.com, top-rated.online, Yandex Maps | High |
| Cuisine | Lebanese and Arabic | Linktree bio: "مطعم لبناني عربي" (earlier directories said Arabic / Middle Eastern) | High |
| Services | Family section, takeaway; a Breakfast menu section; delivery via HungerStation ("Place an order: hungerstation.com" on Google) | ksarestaurant.com (Family Section); Yandex Maps (Takeout); Google Maps menu and order link | Medium |
| Instagram | instagram.com/aldafwa | cafesriyadh.com, top-rated.online, Yandex Maps | Low. **Not on the official Linktree, so no longer linked** until confirmed. |
| VAT | Prices include 15% VAT | Stated on the QR menu | High |
| Reviews mention | shawarma, sheesh tawook sandwich, broasted ("broast"), charcoal grill ("fahm"), an open buffet | Review snippets on cafesriyadh.com, near-place.com, top-rated.online | Used only to shape tone; no reviews are quoted on the site. |

### Conflicts found (not resolved silently)

| Item | What the sources say | What the site does |
|---|---|---|
| Phone | Older listings show +966 11 479 1868 and +966 50 422 4207 | **Resolved:** the client confirmed +966 11 478 7671 (also on Google Maps). |
| Opening hours | Older listings: 06:00 to 02:00, or 08:00 to 00:00 | **Resolved** to Google's current 12:00 PM to 2:00 AM; Friday still to confirm. |
| Area label | Most say Al Malaz; Foursquare and top-rated.online's breadcrumb say Az-Zahraa / As Salamah | Uses Al Malaz (matches the coordinates and the street address). |

### Sources that could not be read
Google Search, HungerStation (Cloudflare 403), Instagram, Foursquare (login wall), arabplaces.com and readymap.city (403). Google Maps showed its overview once, then a "limited view" without the menu tab; the client supplied the menu as screenshots instead. These blocks were respected, not worked around.

## 2. Available assets

| Asset | Status |
|---|---|
| Design reference | Supplied (`docs/reference/design-reference.jpg`). Fonts identified as Josefin Sans (headings and body) with a script accent; palette sampled from the image. |
| Logo | **Supplied** (`docs/reference/logo-original.jpeg`, 828x396 JPEG). Upscaled 4x with Upscayl's digital-art model, background removed, cropped into a full version (with tagline) and a compact mark. The favicon uses the green tree. |
| Food / interior photos | **Dish photos: the restaurant's own** (54, from its QR menu, 21 Nov 2026). Before that: **not supplied.** Public photos found online were tiny third-party thumbnails of unknown ownership, so they were not used. Licensed Unsplash food photography is used instead (see `photo-credits.md`). No photo is presented as the restaurant's interior. |
| Menu and prices | **From the restaurant's own QR menu** (see `04-menu-source.md`). |
| WhatsApp number | **From the official Linktree** (+966 50 422 4206). Ordering, catering inquiries and meeting requests are on. |
| Delivery, charges, VAT | Not confirmed. Checkout offers pickup only and adds no fees. |
| History / story | Not supplied. The About page states only verified facts. |

## 3. Creative direction

Taken from the client's reference, then adapted to Al-Dafwa:
- **Palette:** deep teal-black `#0b161a` and slate surfaces `#141e20` / `#1a2629` from the reference; accents from the logo: sand gold `#d5ad72` (wordmark) for prices, buttons and highlights, and leaf green `#4fae74` (tree and tagline) for the script lines.
- **Type:** Josefin Sans (bold caps for display, wide-tracked caps for section titles, light for body) with Allura as the script accent, as in the reference. Arabic uses Tajawal (geometric, pairs with Josefin) and Aref Ruqaa for the script accent. Arabic is never letter-spaced or upper-cased.
- **Layouts from the reference:** full-bleed fire photo hero; three-panel "photo / text card / photo" introduction; "Our Special" list with copper leader lines and a large photo beside it.
- **Motion (premium archetype from the motion-design skill):** one decelerating curve, 0.8s reveals with 80ms stagger and 24px travel (GSAP ScrollTrigger.batch); a lightweight Three.js ember layer over the hero on tablets and desktops only. Everything respects reduced motion and stays visible without JavaScript.

## 4. Website structure

```
/            → redirects to /ar or /en (saved choice, then browser language, then Arabic)
/ar, /en     Home: hero, introduction, signature dishes, menu sections, visiting, order CTA, location
/[lang]/menu     Digital menu with sticky section rail, item cards, options dialog
/[lang]/catering Catering & bulk orders: highlights, steps, catering inquiry and meeting request forms (WhatsApp)
/[lang]/about    Verified facts, what we serve, dining with us, location
/[lang]/contact  WhatsApp / call / visit cards, Instagram, map and directions
```
Cart drawer, options dialog, toast, mobile cart bar and floating WhatsApp button are available on every page.

## 5. Ordering experience

1. Add dishes from the home page or the menu. Simple dishes go straight in; dishes with sizes or extras open a dialog that shows the live price.
2. A toast confirms each add; the badge updates; the customer stays on the page. On phones a sticky "View cart" bar shows the running total.
3. The cart drawer lists each line with options, unit price, quantity stepper, subtotal and remove; clearing asks for confirmation.
4. Checkout asks only for name, phone and optional notes (and an address if delivery is ever enabled), with a full order summary and an "Edit order" link.
5. "Order via WhatsApp" builds the message from the cart (never hard-coded), URL-encodes it and opens `https://wa.me/<number>?text=…`.
6. The site then explains that the order is only placed once the customer presses send in WhatsApp, and that the restaurant will confirm. The cart is kept until the customer chooses to clear it.

Safeguards: prices are recomputed from the menu data (stored prices are ignored), unknown or removed dishes are dropped from saved carts with a notice, unavailable dishes block checkout until removed, quantities are clamped to 1 to 50, long orders switch to a compact message layout and over-long ones are refused with a clear message, and ordering is disabled (with a call-the-restaurant fallback) while no WhatsApp number is configured.

## 6. Catering & bulk orders (added 21 Nov 2026)

- **Page:** `/[lang]/catering`, linked from the main navigation, the footer, a home page section and the contact page.
- **Two requests, one channel.** A catering inquiry (event type, guest range, service wanted, date, optional serving time and location, name, phone, optional email and notes) and a meeting request (in person at the restaurant or a phone call, date, a half-hour slot from 12:00 PM to 10:00 PM, name, phone, optional event type, guests and topic). Both build a WhatsApp message to the restaurant's number with the same honest flow as orders: WhatsApp opens with the text written out, nothing is sent until the customer presses send, and the page says the restaurant will reply to confirm. Nothing is stored and no API keys are involved.
- **No invented promises.** The service options describe what the customer wants; the page states the restaurant confirms what it can provide. Menu highlights name only dishes and sizes on the real menu. No prices, minimums, capacities or lead times are shown until the restaurant gives them.
- **Dropdowns** are a custom accessible listbox (`src/components/ui/Select.tsx`): mouse, touch and full keyboard use (arrows, Home/End, typeahead, Esc), opening upwards near the bottom of the screen.
- **Logic** lives in `src/lib/catering.ts`, unit tested in `src/lib/__tests__/catering.test.ts` (validation, Riyadh date handling, message text in both languages, URL length).
