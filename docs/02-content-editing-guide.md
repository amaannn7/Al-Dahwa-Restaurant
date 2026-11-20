# Editing the website content

Nothing on the site is hard-coded in the page layouts. Business facts live in one config file, dishes in one data file, and interface wording in one dictionary. After any edit, run `npm run build` to check it, then redeploy.

## 1. Restaurant details: `src/config/restaurant.ts`

| To change | Edit |
|---|---|
| WhatsApp number (orders, catering inquiries, meeting requests) | `whatsapp: "966504224206"`: international format, digits only, no `+` or leading `0`. Or set `NEXT_PUBLIC_WHATSAPP_NUMBER` in the hosting dashboard. Empty switches WhatsApp off and shows a call fallback. |
| Phones | `phone: "+966114787671"` (main) and `altPhones: ["+966114791868"]` (extra numbers, shown in the footer, contact page, location section and catering page) |
| Opening hours | Edit `openingHours`, for example: `[{ days: { en: "Daily", ar: "يومياً" }, opens: "12:00", closes: "02:00", schemaDays: [...] }]`. Set to `null` to hide hours. They appear in the footer, the location section and Google's structured data. |
| Delivery | Add `"delivery"` to `orderTypes`. Checkout then asks pickup or delivery, and asks for an address for delivery. |
| Delivery fee or other charge | Add to `charges`, for example `{ id: "delivery", label: { en: "Delivery fee", ar: "رسوم التوصيل" }, amount: 10, appliesTo: ["delivery"] }`. It is shown in the cart, checkout and WhatsApp message. |
| Social links | `social: [{ id: "tiktok", url: "…", handle: "@…" }, …]`. Order = display order. Ids with icons: `tiktok`, `instagram`, `linktree`, `maps`. WhatsApp is added automatically. They appear in the footer, mobile menu, home page "Follow Al-Dafwa" band and contact page. |
| Domain | Set `NEXT_PUBLIC_SITE_URL=https://your-domain.sa` in the hosting dashboard. |

## 2. Menu: `src/data/menu.ts`

The menu is the restaurant's own QR menu (see `docs/04-menu-source.md`). To change it, edit `menuItems` in `src/data/menu.ts`. Sections with no dishes are hidden automatically.

**After changing a price, also update the matching line in `src/data/__tests__/menu-source.test.ts`.** That test compares the site with the QR menu dish by dish, so an accidental price change fails the build checks. If the restaurant stops using the Google menu as its reference, you can delete that test file.

Each dish is one `item({ ... })` line. The current menu has one price per dish and no sizes, but sizes and extras are supported (below) if the restaurant adds them.

### A simple dish
```ts
item({
  id: "lentils",                      // unique, lowercase, no spaces; never reuse an old id
  category: "breakfast",              // must match a category id
  name: L("Lentil", "عدس"),
  description: L("", ""),             // optional; leave empty if the restaurant gives none
  price: 6,                           // SAR, VAT included
  image: lentils,                     // optional; omit for a typographic tile
  calories: 60,                       // optional, as printed on the menu
  caloriesPer: 100,                   // optional: grams (e.g. 100 = "per 100 g") or "piece"
  // available: false                 // shows "Currently unavailable"
  // dineInOnly: true                 // listed, but can't be ordered on WhatsApp
}),
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

1. Dish photos go in `src/assets/menu/`, named by dish id (the restaurant's own photos are there now). Other photos go in `src/assets/photos/`. JPEG or WebP, at least 1200px on the long edge.
2. Import it at the top of `src/data/menu.ts`: `import lentils from "@/assets/menu/lentils.webp";`
3. Use it as `image: lentils`.

Images are resized and converted to AVIF/WebP automatically. If a photo from the restaurant is small, upscale it with Upscayl (Standard model) to about 2x, never more, and check it at 100% before using it. When you replace stock photos, remove their rows from `docs/photo-credits.md`.

## 4. Logo

The official logo is in `src/assets/brand/` (`logo-mark.png` for the header and footer, `logo-full.png` with the tagline for the About page), made from the supplied JPEG. If the restaurant has a vector (SVG/AI/PDF) version, swap these files for crisper edges; `src/app/icon.png`, `src/app/apple-icon.png` and `public/og-image.jpg` should then be regenerated.

## 5. Catering page

The catering options live in `src/lib/catering.ts`:

- `EVENT_TYPES`, `GUEST_RANGES`, `SERVICES`, `MEAL_TIMES`: each option has an `id` and `label: { en, ar }` (services also have a `hint`). Remove a service the restaurant doesn't offer by deleting its line; add one by copying a line with a new `id`.
- `meetingSlots("12:00", "22:00")`: the first and last meeting times offered, in half-hour steps.
- Page wording (headings, highlights, steps, form labels, errors) is under `catering` in `src/i18n/dictionaries.ts`.

After editing, run `npm run test`: `src/lib/__tests__/catering.test.ts` checks the message text, so update it if you rename a label it mentions.

## 6. Wording

All interface text, in both languages, is in `src/i18n/dictionaries.ts`. Page titles and search descriptions are in `src/lib/seo.tsx`. Keep Arabic and English in step.

## 7. Checks after editing

```bash
npm run test     # price and WhatsApp message logic
npm run lint
npm run build
```
