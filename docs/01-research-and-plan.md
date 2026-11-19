# Al-Dafwa Restaurant website: research and plan

Researched 19 November 2026; updated the same day with the client's logo, phone number and the full Google Maps menu. Every fact used on the site is listed here with its source.

## 1. Restaurant identity

| Fact | Value used | Sources | Confidence |
|---|---|---|---|
| Name | Al-Dafwa Restaurant / مطاعم الدفواء | Google Maps listing (English and Arabic names); logo reads الدفواء | High |
| Brand line | عراقة الطعم الأصيل منذ 1990 ("the heritage of authentic taste since 1990") | The official logo, supplied by the client | High. The site says the brand's heritage dates to 1990, not that this branch opened in 1990. |
| Phone | +966 11 478 7671 | Client (19 Nov 2026); same number on Google Maps | High |
| Hours | Daily 12:00 PM to 2:00 AM | Google Maps ("Open, closes 2 AM"; Thursday 12 PM to 2 AM shown) and the daily schedule mirrored on top-rated.online | Medium. Confirm Friday and holiday hours. |
| Menu | 12 sections, 95 dishes, 152 priced options | Google Maps menu, screenshots from the client. See `04-menu-source.md`. | High |
| Location | 24.6799277, 46.7336186 | Client brief (Google Maps). near-place.com (24.6799627, 46.7335975) and Yandex Maps agree. Our map embed drops the pin on Umar Ibn Abdul Aziz Br Rd, Al Malaz. | High |
| Address | Omar Bin Abdulaziz Road, Al Malaz, Riyadh 12831 / طريق عمر بن عبدالعزيز، الملز، الرياض 12831 | cafesriyadh.com, near-place.com, top-rated.online, Yandex Maps | High |
| Cuisine | Arabic and Middle Eastern | ksarestaurant.com ("Arabic"), top-rated.online ("Middle eastern restaurant"), cafesriyadh.com ("Middle Eastern food") | High |
| Services | Family section, takeaway; a Breakfast menu section; delivery via HungerStation ("Place an order: hungerstation.com" on Google) | ksarestaurant.com (Family Section); Yandex Maps (Takeout); Google Maps menu and order link | Medium |
| Instagram | instagram.com/aldafwa | cafesriyadh.com, top-rated.online, Yandex Maps (all list it as the website) | Medium. Not opened (Instagram blocks automated access). |
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
| Food / interior photos | **Not supplied.** Public photos found online were tiny third-party thumbnails of unknown ownership, so they were not used. Licensed Unsplash food photography is used instead (see `photo-credits.md`). No photo is presented as the restaurant's interior. |
| Menu and prices | **Supplied** as Google Maps screenshots and transcribed in full (see `04-menu-source.md`). |
| WhatsApp number | **Not supplied.** Ordering and WhatsApp buttons switch on automatically when it is set. |
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
