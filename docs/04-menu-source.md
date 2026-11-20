# Menu source and transcription notes

**Source:** the restaurant's own QR menu at aldafwa.yallaqrcodes.com, linked as its "menu" (منيو) button from its official Linktree (linktr.ee/aldafwa_restaurant). The client confirmed on 21 Nov 2026 that this is the current, updated menu. It replaces the Google Maps menu used before. The data was read from the menu's public feed on 21 Nov 2026; a text snapshot is in `docs/reference/qr-menu-snapshot.txt`.

The site data lives in `src/data/menu.ts`.

**Check:** `src/data/__tests__/menu-source.test.ts` lists all 105 QR dishes with their Arabic name and price and asserts that (a) each one is on the site with the same Arabic name and price, and (b) nothing else is on the site. Run `npm run test`. When the restaurant changes a price, update both `menu.ts` and that list.

## What comes from the QR menu

- **11 sections in the restaurant's order:** Cold Starters, Hot Starters, Mahashi, Grills, Shawarma & Broasted, Seafood, Pastries, Breakfast, Desserts, Juices, Drinks.
- **105 dishes, one price each.** The QR menu has no sizes or sandwich/plate options, so the site has none either. The gallon of juice is its own item (Juice Gallon, 30 SAR).
- **Arabic and English names** exactly as written, including the restaurant's spellings (Hommos, Mutabal, Sambosak, Lahmajun, Kanad Fish, Osh El Bulbul).
- **Calories** as printed, with the basis the menu gives (per 100 g for whole sections, or per 35 g, 50 g, 60 g or per piece for single dishes). Shown on each dish card and in the dish dialog.
- **Notes:** "Prices include 15% VAT" (shown on the menu page and in the cart), and the juice note "العصائر لا تحتوي على سكر. على العميل طلب إضافة سكر عند الرغبة" (shown under Juices).
- **Photos:** the restaurant's own photos for the 54 dishes that have one (`src/assets/menu/`).
- **Open Buffet (45 SAR)** is listed under Grills as on the QR menu, marked "Dine-in only", and cannot be added to a WhatsApp order.

## Corrections (please confirm with the restaurant)

| QR menu says | Site says | Why |
|---|---|---|
| "Beef Salad" for سلطة شمندر | Beetroot Salad | شمندر is beetroot |
| "Jelato" for جيلو | Jello | "Jelato" reads as gelato (ice cream) |
| "Omelette" for بيض عيون | Sunny Side Up Eggs | بيض عيون is fried eggs with the yolk up, not an omelette |
| "Juice Bottle" for جالون عصير | Juice Gallon | The Arabic says gallon |
| "Mix Brakfast" | Mix Breakfast | Spelling |
| "Pastrise", "Sea Food", "Grills Menu", "Al Mahashi" (section names) | Pastries, Seafood, Grills, Mahashi | Spelling and shorter headings |
| "Shawarma" with the note "Jumbo - Rocket" for شاورما صاروخ | Rocket Shawarma, described as "Jumbo" | Two different dishes were both called "Shawarma" in English |
| No English name for فطائر زعتر | Za'atar Fatayer | Our translation, following the menu's own "Falafel Fatayer" |
| No English name for صحن مقلقل دجاج | Mugalgal Dish | Our translation, following the menu's own "Mugalgal" and "Shawarma Dish" |

Arabic names are unchanged.

**In the cart and the WhatsApp order**, juices and pastries carry their section ("Orange (Juices)", "Spinach (Pastries)"). So do the two names that appear in two sections: Labna (Pastries and Breakfast) and Arayes (Grills and Pastries). That way the order is clear without the menu in front of you. The menu itself shows the names as written.

## Descriptions

The QR menu has no dish descriptions. Dishes that were also on the restaurant's Google Maps menu keep the description from there (for example Hommos: "A creamy blend of chickpeas and tahini"). Dishes new on the QR menu, or with no clear match, have no description: Mix Mezze Dish, Stuffed Cabbage (both), Open Buffet, Shawarma, Shawarma Dish, Fillet, Pizza, Mix Breakfast, Egg with Cheese, White Cheese, Labna (breakfast), Cheese with Jam, Falafel Mix, Cheese with Halawa, Lentil, Dafwa Cocktail, Shogaf and Juice Gallon. Google's stuffed cabbage description described coleslaw, so it was not reused.

## Compared with the old Google menu

Most prices changed (for example Mix Grills 40, was 50; Hommos 12, was 14; Broasted 22, was 27). Dishes on Google but not on the QR menu were removed: Chicken Arayes, Chicken Shawarma and Meat Shawarma (the QR menu has a single Shawarma, a Rocket Shawarma and a Shawarma Dish), Fish Fillets and Fried Fillet (now one Fillet), Cheese Pie, Honey Pie, Meat Mugalgal and Hot Dog. The sandwich/plate and size options are gone. New on the QR menu: Mix Mezze Dish, Open Buffet, Rocket Shawarma, Pizza, Mix Breakfast and several breakfast plates, Dafwa Cocktail, Shogaf and the Juice Gallon.
