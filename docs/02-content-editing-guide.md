# Editing the website content

Nothing on the site is hard-coded in the page layouts. Business facts live in one config file, dishes in one data file, and interface wording in one dictionary. After any edit, run `npm run build` to check it, then redeploy.

## 1. Restaurant details: `src/config/restaurant.ts`

| To change | Edit |
|---|---|
| WhatsApp number (switches ordering on) | `whatsapp: "9665XXXXXXXX"`: international format, digits only, no `+` or leading `0`. Or set `NEXT_PUBLIC_WHATSAPP_NUMBER` in the hosting dashboard. |
| Phone | `phone: "+966114791868"` |
| Opening hours | Replace `null` with a list, for example: `[{ days: { en: "Daily", ar: "يومياً" }, opens: "06:00", closes: "02:00" }]`. They then appear in the footer, the location section and Google's structured data. |
| Delivery | Add `"delivery"` to `orderTypes`. Checkout then asks pickup or delivery, and asks for an address for delivery. |
| Delivery fee or other charge | Add to `charges`, for example `{ id: "delivery", label: { en: "Delivery fee", ar: "رسوم التوصيل" }, amount: 10, appliesTo: ["delivery"] }`. It is shown in the cart, checkout and WhatsApp message. |
| Social links | `social: { instagram: "…", tiktok: "…" }` (Instagram has an icon; ask a developer to add icons for others). |
| Domain | Set `NEXT_PUBLIC_SITE_URL=https://your-domain.sa` in the hosting dashboard. |

## 2. Menu: `src/data/menu.ts`

The menu is the restaurant's real menu, transcribed from Google Maps (see `docs/04-menu-source.md`). To change it, edit `menuItems` in `src/data/menu.ts`. Sections with no dishes are hidden automatically.

**After changing a price, also update the matching line in `src/data/__tests__/menu-source.test.ts`.** That test compares the site with the Google menu line by line, so an accidental price change fails the build checks. If the restaurant stops using the Google menu as its reference, you can delete that test file.

Most dishes use small helpers for repeated options, e.g. `variations: servings(18, 42)` (Sandwich 18 / Plate 42) or `sizes(small(24), medium(54), large(78))`.

### A simple dish
```ts
{
  id: "lentil-soup",                 // unique, lowercase, no spaces; never reuse an old id
  category: "hot-appetizers",        // must match a category id
  name: { en: "Lentil Soup", ar: "شوربة عدس" },
  description: { en: "Red lentil soup with lemon.", ar: "شوربة عدس أحمر مع الليمون." },
  price: 10,                          // SAR
  image: lentilSoup,                  // or null for a typographic tile
  available: true,                    // false shows "Currently unavailable"
},
```

### Sizes (pick one) and extras (pick any)
```ts
variations: {
  label: { en: "Size", ar: "الحجم" },
  options: [
    { id: "small", name: { en: "Small", ar: "صغير" }, price: 9 },   // full price for this size
    { id: "large", name: { en: "Large", ar: "كبير" }, price: 14 },
  ],
},
extras: {
  label: { en: "Extras", ar: "إضافات" },
  options: [
    { id: "cheese", name: { en: "Cheese", ar: "جبن" }, price: 2 },  // added to the price
    { id: "no-onion", name: { en: "No onion", ar: "بدون بصل" }, price: 0 },
  ],
},
```
Only add options the restaurant really offers. If an English or Arabic dish name is unknown, ask the restaurant rather than translating it yourself.

Add `featured: true` to show a dish under "Signature Dishes" on the home page.

## 3. Photos

1. Put the file in `src/assets/photos/` (JPEG, at least 1600px on the long edge).
2. Import it at the top of `src/data/menu.ts`: `import lentilSoup from "@/assets/photos/lentil-soup.jpg";`
3. Use it as `image: lentilSoup`.

Images are resized and converted to AVIF/WebP automatically. If a photo from the restaurant is small, upscale it with Upscayl (Standard model) to about 2x, never more, and check it at 100% before using it. When you replace stock photos, remove their rows from `docs/photo-credits.md`.

## 4. Logo

The official logo is in `src/assets/brand/` (`logo-mark.png` for the header and footer, `logo-full.png` with the tagline for the About page), made from the supplied JPEG. If the restaurant has a vector (SVG/AI/PDF) version, swap these files for crisper edges; `src/app/icon.png`, `src/app/apple-icon.png` and `public/og-image.jpg` should then be regenerated.

## 5. Wording

All interface text, in both languages, is in `src/i18n/dictionaries.ts`. Page titles and search descriptions are in `src/lib/seo.tsx`. Keep Arabic and English in step.

## 6. Checks after editing

```bash
npm run test     # price and WhatsApp message logic
npm run lint
npm run build
```
