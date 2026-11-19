/**
 * Guards the menu against transcription mistakes. GOOGLE_MENU is every line of
 * Al-Dafwa's Google Maps menu exactly as supplied by the client (screenshots,
 * 19 Nov 2026), with the dish/option it maps to on the website.
 */
import { describe, expect, it } from "vitest";
import { categories, getMenuItem, menuItems } from "@/data/menu";

type Line = [section: string, googleName: string, sar: number, itemId: string, variationId: string | null];

export const GOOGLE_MENU: Line[] = [
  ["Rice Dishes", "White Rice", 8, "white-rice", null],
  ["Rice Dishes", "Red Rice", 8, "red-rice", null],

  ["Salads And Appetizers", "Cabbage Salad With Mayonnaise", 14, "cabbage-salad", null],
  ["Salads And Appetizers", "Green Salad", 14, "green-salad", null],
  ["Salads And Appetizers", "Spicy Potato Salad", 14, "spicy-potato-salad", null],
  ["Salads And Appetizers", "Grape Leaves", 14, "grape-leaves-starter", null],
  ["Salads And Appetizers", "Fatteh Hummus", 17, "fatteh-hummus", null],
  ["Salads And Appetizers", "Beetroot Salad", 14, "beetroot-salad", null],
  ["Salads And Appetizers", "Eggplant Mousagah", 14, "moussaka", null],
  ["Salads And Appetizers", "Tabouleh", 14, "tabbouleh", null],
  ["Salads And Appetizers", "Baba Ghanouj", 14, "baba-ghanouj", null],
  ["Salads And Appetizers", "Meat Hummus", 22, "meat-hummus", null],
  ["Salads And Appetizers", "Fattoush", 14, "fattoush", null],
  ["Salads And Appetizers", "Corn Salad", 14, "corn-salad", null],
  ["Salads And Appetizers", "Msabbaha", 14, "msabbaha", null],
  ["Salads And Appetizers", "Beiruti Hummus", 16, "beiruti-hummus", null],
  ["Salads And Appetizers", "Hummus", 14, "hummus", null],
  ["Salads And Appetizers", "Mtabbal", 14, "mtabbal", null],

  ["Sea Food", "Fish Awsal-Sandwich", 18, "fish-awsal", "sandwich"],
  ["Sea Food", "Fish Fillets", 62, "fish-fillets", null],
  ["Sea Food", "Fried Fillet", 62, "fried-fillet", null],
  ["Sea Food", "Grilled Shrimp-Sandwich", 22, "grilled-shrimp", "sandwich"],
  ["Sea Food", "Fried Shrimp-Sandwich", 22, "fried-shrimp", "sandwich"],
  ["Sea Food", "Fried Shrimp-Dish", 62, "fried-shrimp", "plate"],
  ["Sea Food", "Mackerel Fish", 62, "mackerel", null],
  ["Sea Food", "Grilled Shrimp-Dish", 62, "grilled-shrimp", "plate"],
  ["Sea Food", "Fish Awsal-Dish", 62, "fish-awsal", "plate"],

  ["Shawarma And Broasted", "Shawarma Dish-Meat", 32, "meat-shawarma", "plate"],
  ["Shawarma And Broasted", "Shawarma Jumbo Chicken", 19, "chicken-shawarma", "jumbo"],
  ["Shawarma And Broasted", "Shawarma Dish-Chicken", 30, "chicken-shawarma", "plate"],
  ["Shawarma And Broasted", "Shawarma-Meat", 10, "meat-shawarma", "sandwich"],
  ["Shawarma And Broasted", "Arabic Shawarma-Meat", 26, "arabic-shawarma", "meat"],
  ["Shawarma And Broasted", "Shawarma-Chicken", 9, "chicken-shawarma", "sandwich"],
  ["Shawarma And Broasted", "Shawarma Jumbo Meat", 22, "meat-shawarma", "jumbo"],
  ["Shawarma And Broasted", "Arabic Shawarma-Chicken", 24, "arabic-shawarma", "chicken"],
  ["Shawarma And Broasted", "Brosted", 27, "broasted", null],

  ["Beverages", "Mineral Water-Large", 3, "water", "large"],
  ["Beverages", "Mineral Water-Small", 1, "water", "small"],
  ["Beverages", "Mirinda", 5, "mirinda", null],
  ["Beverages", "Dew", 5, "dew", null],
  ["Beverages", "Pepsi", 5, "pepsi", null],
  ["Beverages", "7 Up", 5, "7up", null],

  ["Hot Appetizers", "Samosas", 3, "samosa", null],
  ["Hot Appetizers", "Kibbeh", 5, "kibbeh", null],
  ["Hot Appetizers", "Spring Roll", 4, "spring-roll", null],

  ["Juices", "Pomegranate Juice-Small", 8, "juice-pomegranate", "small"],
  ["Juices", "Melon Juice-Large", 14, "juice-melon", "large"],
  ["Juices", "Apple Juice-Small", 8, "juice-apple", "small"],
  ["Juices", "Guava Juice-Small", 8, "juice-guava", "small"],
  ["Juices", "Fresh Mango Juice-Gallon", 35, "juice-mango", "gallon"],
  ["Juices", "Orange Juice-Small", 8, "juice-orange", "small"],
  ["Juices", "Melon Juice-Gallon", 35, "juice-melon", "gallon"],
  ["Juices", "Guava Juice-Large", 14, "juice-guava", "large"],
  ["Juices", "Melon Juice-Small", 8, "juice-melon", "small"],
  ["Juices", "Pomegranate Juice-Large", 14, "juice-pomegranate", "large"],
  ["Juices", "Banana With Milk Juice-Gallon", 35, "juice-banana-milk", "gallon"],
  ["Juices", "Pineapple Juice-Small", 8, "juice-pineapple", "small"],
  ["Juices", "Avocado Juice-Gallon", 35, "juice-avocado", "gallon"],
  ["Juices", "Orange Juice-Large", 14, "juice-orange", "large"],
  ["Juices", "Pineapple Juice-Gallon", 35, "juice-pineapple", "gallon"],
  ["Juices", "Carrot Juice-Small", 8, "juice-carrot", "small"],
  ["Juices", "Kiwi Juice-Large", 17, "juice-kiwi", "large"],
  ["Juices", "Strawberry Juice-Small", 8, "juice-strawberry", "small"],
  ["Juices", "Carrot Juice-Large", 14, "juice-carrot", "large"],
  ["Juices", "Pomegranate Juice-Gallon", 35, "juice-pomegranate", "gallon"],
  ["Juices", "Fresh Mango Juice-Large", 14, "juice-mango", "large"],
  ["Juices", "Fresh Mango Juice-Small", 8, "juice-mango", "small"],
  ["Juices", "Banana With Milk Juice-Large", 14, "juice-banana-milk", "large"],
  ["Juices", "Avocado Juice-Large", 17, "juice-avocado", "large"],
  ["Juices", "Carrot Juice-Gallon", 35, "juice-carrot", "gallon"],
  ["Juices", "Strawberry Juice-Gallon", 35, "juice-strawberry", "gallon"],
  ["Juices", "Kiwi Juice-Gallon", 35, "juice-kiwi", "gallon"],
  ["Juices", "Apple Juice-Gallon", 35, "juice-apple", "gallon"],
  ["Juices", "Apple Juice-Large", 14, "juice-apple", "large"],
  ["Juices", "Strawberry Juice-Large", 14, "juice-strawberry", "large"],
  ["Juices", "Banana With Milk Juice-Small", 8, "juice-banana-milk", "small"],
  ["Juices", "Guava Juice-Gallon", 35, "juice-guava", "gallon"],
  ["Juices", "Pineapple Juice-Large", 14, "juice-pineapple", "large"],
  ["Juices", "Orange Juice-Gallon", 35, "juice-orange", "gallon"],

  ["Mahashi", "Pomegranate Molasses Grape Leaves-Large", 78, "grape-leaves-pomegranate", "large"],
  ["Mahashi", "Classic Grape Leaves-Small", 24, "grape-leaves-classic", "small"],
  ["Mahashi", "Classic Grape Leaves-Medium", 54, "grape-leaves-classic", "medium"],
  ["Mahashi", "Classic Grape Leaves-Large", 78, "grape-leaves-classic", "large"],
  ["Mahashi", "Classic Stuffed Cabbage-Small", 22, "stuffed-cabbage-classic", "small"],
  ["Mahashi", "Spicy Grape Leaves-Medium", 54, "grape-leaves-spicy", "medium"],
  ["Mahashi", "Spicy Stuffed Cabbage-Large", 66, "stuffed-cabbage-spicy", "large"],
  ["Mahashi", "Pomegranate Molasses Grape Leaves-Small", 24, "grape-leaves-pomegranate", "small"],
  ["Mahashi", "Spicy Grape Leaves-Large", 78, "grape-leaves-spicy", "large"],
  ["Mahashi", "Spicy Grape Leaves-Small", 24, "grape-leaves-spicy", "small"],
  ["Mahashi", "Classic Stuffed Cabbage-Large", 66, "stuffed-cabbage-classic", "large"],
  ["Mahashi", "Spicy Stuffed Cabbage-Medium", 42, "stuffed-cabbage-spicy", "medium"],
  ["Mahashi", "Classic Stuffed Cabbage-Medium", 42, "stuffed-cabbage-classic", "medium"],
  ["Mahashi", "Pomegranate Molasses Grape Leaves-Medium", 54, "grape-leaves-pomegranate", "medium"],
  ["Mahashi", "Spicy Stuffed Cabbage-Small", 22, "stuffed-cabbage-spicy", "small"],

  ["Grills", "Chicken Kebab-Dish", 42, "chicken-kebab", "plate"],
  ["Grills", "Shish Tawouk-Sandwich", 18, "shish-tawouk", "sandwich"],
  ["Grills", "Half Chicken On Charcoal", 27, "half-chicken-charcoal", null],
  ["Grills", "Ribs Sheep", 62, "sheep-ribs", null],
  ["Grills", "Mixed Grill", 50, "mixed-grill", null],
  ["Grills", "Chicken Kebab-Sandwich", 18, "chicken-kebab", "sandwich"],
  ["Grills", "Meat Awsal-Sandwich", 18, "meat-awsal", "sandwich"],
  ["Grills", "Meat Kebab-Dish", 42, "meat-kebab", "plate"],
  ["Grills", "Meat Kebab-Sandwich", 18, "meat-kebab", "sandwich"],
  ["Grills", "Grilled Arayes", 36, "grilled-arayes", null],
  ["Grills", "Fajita Chicken-Sandwich", 18, "chicken-fajita", "sandwich"],
  ["Grills", "Meat Awsal-Dish", 50, "meat-awsal", "plate"],
  ["Grills", "Fajita Chicken-Dish", 30, "chicken-fajita", "plate"],
  ["Grills", "Cherries Armenian Meat Kebab", 48, "cherry-kebab", null],
  ["Grills", "Sitak Meat", 48, "meat-steak", null],
  ["Grills", "Shish Tawouk-Dish", 42, "shish-tawouk", "plate"],
  ["Grills", "Eggplant Meat Kebab", 42, "eggplant-kebab", null],
  ["Grills", "Arayes Chicken", 36, "chicken-arayes", null],

  ["Desserts", "Jello", 8, "jello", null],
  ["Desserts", "Fruit Salad", 14, "fruit-salad", null],
  ["Desserts", "Umm Ali", 12, "umm-ali", null],
  ["Desserts", "Creme Caramel", 12, "creme-caramel", null],
  ["Desserts", "Blancmange", 8, "blancmange", null],

  ["Breakfast", "Chicken Mgalgal-Sandwich", 8, "chicken-mgalgal", "sandwich"],
  ["Breakfast", "Meat Mgalgal-Sandwich", 10, "meat-mgalgal", "sandwich"],
  ["Breakfast", "Spicy Potatoes-Dish", 14, "spicy-potatoes", "plate"],
  ["Breakfast", "Shakshouka Eggs-Sandwich", 4, "shakshouka", "sandwich"],
  ["Breakfast", "Boiled Eggs-Dish", 7, "boiled-eggs", "plate"],
  ["Breakfast", "Potatos-Sandwich", 4, "potatoes", "sandwich"],
  ["Breakfast", "Potatos-Dish", 7, "potatoes", "plate"],
  ["Breakfast", "Meat Mgalgal-Dish", 19, "meat-mgalgal", "plate"],
  ["Breakfast", "Hot Dog-Sandwich", 7, "hot-dog", "sandwich"],
  ["Breakfast", "Spicy Potatoes-Sandwich", 4, "spicy-potatoes", "sandwich"],
  ["Breakfast", "Boiled Eggs-Sandwich", 4, "boiled-eggs", "sandwich"],
  ["Breakfast", "Olive", 7, "olives", null],
  ["Breakfast", "Fried Eggs-Dish", 7, "fried-eggs", "plate"],
  ["Breakfast", "Shakshouka Eggs-Dish", 7, "shakshouka", "plate"],
  ["Breakfast", "Hot Dog-Dish", 14, "hot-dog", "plate"],
  ["Breakfast", "Fried Eggs-Sandwich", 4, "fried-eggs", "sandwich"],
  ["Breakfast", "Lebanese Foul", 14, "lebanese-foul", null],
  ["Breakfast", "Chicken Mgalgal-Dish", 17, "chicken-mgalgal", "plate"],
  ["Breakfast", "Sheep Liver-Dish", 22, "sheep-liver", "plate"],
  ["Breakfast", "Sunny Side Up Egg", 7, "sunny-side-egg", null],
  ["Breakfast", "Sheep Liver-Sandwich", 7, "sheep-liver", "sandwich"],

  ["Pies And Pizza", "Cheese Pie", 6, "cheese-pie", null],
  ["Pies And Pizza", "Ash Albulbul-Medium", 24, "ash-albulbul", "medium"],
  ["Pies And Pizza", "Spinach Pie", 6, "spinach-pie", null],
  ["Pies And Pizza", "Labneh Pie", 6, "labneh-pie", null],
  ["Pies And Pizza", "Lahmah Bel Ajeen", 12, "lahm-bi-ajeen", null],
  ["Pies And Pizza", "Falafel Pie", 6, "falafel-pie", null],
  ["Pies And Pizza", "Ash Albulbul-Large", 30, "ash-albulbul", "large"],
  ["Pies And Pizza", "Plain Muhammara Pie", 6, "muhammara-pie", null],
  ["Pies And Pizza", "Honey Pie", 6, "honey-pie", null],
  ["Pies And Pizza", "Cheese Muhammara Pie", 8, "cheese-muhammara-pie", null],
  ["Pies And Pizza", "Arayes", 12, "arayes-bread", null],
  ["Pies And Pizza", "Thyme Pie", 6, "thyme-pie", null],
  ["Pies And Pizza", "Shami Safehah", 12, "shami-safeeha", null],
];

const priceOf = (itemId: string, variationId: string | null) => {
  const item = getMenuItem(itemId);
  if (!item) return undefined;
  if (variationId === null) return item.variations ? undefined : item.price;
  return item.variations?.options.find((o) => o.id === variationId)?.price;
};

describe("menu matches the Google Maps menu", () => {
  it("has no duplicate source lines", () => {
    const names = GOOGLE_MENU.map((l) => l[1]);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(GOOGLE_MENU)("%s / %s = SAR %d", (_section, _name, sar, itemId, variationId) => {
    expect(priceOf(itemId, variationId)).toBe(sar);
  });

  it("every dish and option on the site comes from a Google line (nothing invented)", () => {
    const covered = new Set(GOOGLE_MENU.map((l) => `${l[3]}|${l[4] ?? ""}`));
    const onSite = menuItems.flatMap((i) =>
      i.variations ? i.variations.options.map((o) => `${i.id}|${o.id}`) : [`${i.id}|`],
    );
    expect(onSite.filter((k) => !covered.has(k))).toEqual([]);
    expect(onSite.length).toBe(GOOGLE_MENU.length);
  });

  it("every item is in a known section and has both languages", () => {
    const cats = new Set(categories.map((c) => c.id));
    for (const i of menuItems) {
      expect(cats.has(i.category)).toBe(true);
      expect(i.name.en && i.name.ar && i.description.en && i.description.ar).toBeTruthy();
    }
  });
});
