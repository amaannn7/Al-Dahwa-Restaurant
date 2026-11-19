# Menu source and transcription notes

**Source:** Al-Dafwa Restaurant's menu on Google Maps, supplied by the client as 32 screenshots on 19 November 2026. All names, descriptions and prices on the site come from it. The data lives in `src/data/menu.ts`.

**Check:** `src/data/__tests__/menu-source.test.ts` lists all 152 Google lines with their price and asserts that (a) each one matches the website's dish and option to the riyal, and (b) every dish and option on the website traces back to one of those lines. Run `npm run test`. When the restaurant changes a price, update both `menu.ts` and that list, which keeps the two in step on purpose.

## How the Google menu was structured on the site

| On Google | On the site |
|---|---|
| 12 sections: Rice Dishes, Salads And Appetizers, Sea Food, Shawarma And Broasted, Beverages, Hot Appetizers, Juices, Mahashi, Grills, Desserts, Breakfast, Pies And Pizza | The same 12 sections, reordered so the signature sections (Grills, Shawarma & Broasted, Seafood) come first |
| Pairs such as "Chicken Kebab-Sandwich SAR 18" and "Chicken Kebab-Dish SAR 42" | One dish, "Chicken Kebab", with a Serving choice: Sandwich 18 / Plate 42 |
| "Shawarma-Chicken 9", "Shawarma Jumbo Chicken 19", "Shawarma Dish-Chicken 30" | "Chicken Shawarma": Sandwich 9 / Jumbo 19 / Plate 30 (same for meat: 10 / 22 / 32) |
| "Arabic Shawarma-Chicken 24", "Arabic Shawarma-Meat 26" | "Arabic Shawarma": Chicken 24 / Meat 26 |
| Juices "X Juice-Small / -Large / -Gallon" | One juice per fruit with a Size choice (Small 8 / Large 14 / Gallon 35; avocado and kiwi have no Small: Large 17 / Gallon 35) |
| Mahashi "-Small / -Medium / -Large" | One dish with a Size choice |
| "Mineral Water-Small 1 / -Large 3", "Ash Albulbul-Medium 24 / -Large 30" | One item each with a Size choice |

Result: 95 dishes, 152 priced options, exactly the 152 Google lines.

## Corrections made (please confirm with the restaurant)

| Google says | Site says | Why |
|---|---|---|
| "Shawarma-Meat: *Chicken* shawarma, garlic sauce and pickles" | "Meat shawarma with garlic sauce and pickles" | The description contradicted the dish name |
| "Ribs Sheep: Marinated and grilled *beef* ribs" | "Sheep Ribs: Marinated and grilled ribs" | Name says sheep, description says beef; we left the meat out of the description until confirmed |
| "Spring Roll: Stuffed *chips* fried in oil" | "Stuffed rolls fried in oil" | "Chips" reads as a translation slip |
| "Sitak Meat" | "Meat Steak" | Transliteration of ستيك |
| "Lahmah Bel Ajeen", "Shami Safehah", "Tabouleh", "Potatos" | "Lahm Bi Ajeen", "Shami Safeeha", "Tabbouleh", "Potatoes" | Spelling normalised |

Other descriptions were tidied for grammar only (for example "Mixed of marinated grills" became "Mixed marinated grills").

## Arabic names

Google showed the menu in English. **The Arabic names and descriptions are our translations** of standard dish names (مشاوي مشكلة، شيش طاووق، مقلقل، أوصال، عرايس، عش البلبل، صفيحة شامية…). They should be checked against the restaurant's own Arabic menu, especially:
- **Mackerel Fish**: shown as "سمك ماكريل". The restaurant may call it كنعد or إسقمري.
- **Blancmange**: shown as "مهلبية".
- **Dew**: shown as "ديو" (Mountain Dew?).
- **Hot Dog**: shown as "هوت دوق".

## Not on the site

- No extras or add-ons are listed on Google, so none are offered (the system supports them if the restaurant wants them).
- Lebanese Foul, Kibbeh, the pies, most salads and several grills have no honest stock photo, so they show a typographic tile.
