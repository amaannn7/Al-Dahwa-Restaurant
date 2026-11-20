import { describe, expect, it } from "vitest";
import { menuItems } from "@/data/menu";

/**
 * The restaurant's own QR menu (aldafwa.yallaqrcodes.com, linked from the
 * official Linktree), read on 21 Nov 2026: [QR item id, Arabic name, price in
 * SAR (VAT included), website dish id]. 105 dishes.
 *
 * When the restaurant changes a price, update it here and in src/data/menu.ts.
 */
const QR_MENU: [number, string, number, string][] = [
  [1, "حمص", 12, "hummus"],
  [2, "حمص بيروتي", 13, "beiruti-hummus"],
  [3, "بابا غنوج", 12, "baba-ghanouj"],
  [4, "متبل", 12, "mtabbal"],
  [5, "فتوش", 12, "fattoush"],
  [6, "ورق عنب", 12, "grape-leaves-starter"],
  [7, "تبوله", 12, "tabbouleh"],
  [8, "حمص باللحم", 18, "meat-hummus"],
  [9, "فتة حمص", 14, "fatteh-hummus"],
  [10, "سلطة خضراء", 12, "green-salad"],
  [11, "مسبحة", 12, "msabbaha"],
  [12, "مصقعه باذنجان", 12, "moussaka"],
  [13, "سلطة ملفوف بالميونيز", 12, "cabbage-salad"],
  [14, "سلطة ذرة", 12, "corn-salad"],
  [15, "سلطة شمندر", 12, "beetroot-salad"],
  [16, "سلطة بطاطس حارة", 12, "spicy-potato-salad"],
  [17, "صحن مقبلات مشكل", 23, "mix-mezze"],
  [18, "كبة", 4, "kibbeh"],
  [19, "سمبوسك", 2, "samosa"],
  [20, "سبرينغ رول", 3, "spring-roll"],
  [21, "رز أبيض", 7, "white-rice"],
  [22, "رز أحمر", 7, "red-rice"],
  [111, "ورق عنب كلاسيك", 20, "grape-leaves-classic"],
  [112, "ورق عنب سبايسي", 20, "grape-leaves-spicy"],
  [113, "ورق عنب دبس رمان", 20, "grape-leaves-pomegranate"],
  [114, "محشي ملفوف كلاسيك", 18, "stuffed-cabbage-classic"],
  [115, "محشي ملفوف سبايسي", 18, "stuffed-cabbage-spicy"],
  [28, "مشوي مشكل", 40, "mixed-grill"],
  [29, "كباب لحم أرمني بالكرز", 40, "cherry-kebab"],
  [30, "أوصال لحم", 40, "meat-awsal"],
  [31, "ستيك لحم", 40, "meat-steak"],
  [32, "كباب لحم باذنجان", 35, "eggplant-kebab"],
  [33, "كباب لحم", 35, "meat-kebab"],
  [35, "بوفيه مفتوح", 45, "open-buffet"],
  [36, "ريش غنم", 50, "lamb-chops"],
  [38, "كباب دجاج", 35, "chicken-kebab"],
  [39, "شيش طاووق", 35, "shish-tawouk"],
  [40, "فاهيتا دجاج", 25, "chicken-fajita"],
  [41, "نصف دجاج عالفحم", 22, "half-chicken-charcoal"],
  [42, "عرائس", 30, "grilled-arayes"],
  [43, "شاورما صاروخ", 15, "rocket-shawarma"],
  [44, "شاورما", 7, "shawarma"],
  [45, "صحن شاورما", 25, "shawarma-dish"],
  [46, "شاورما عربي", 20, "arabic-shawarma"],
  [47, "بروستد", 22, "broasted"],
  [48, "جمبري مشوي", 50, "grilled-shrimp"],
  [49, "جمبري مقلي", 50, "fried-shrimp"],
  [50, "سمك كنعد", 50, "kanad-fish"],
  [51, "فيليه", 50, "fillet"],
  [52, "أوصال سمك", 50, "fish-awsal"],
  [54, "بيتزا", 20, "pizza"],
  [55, "صفيحة شامية", 10, "shami-safeeha"],
  [56, "لحم بالعجينة", 10, "lahm-bi-ajeen"],
  [57, "محمرة سادة", 5, "muhammara-pie"],
  [58, "محمرة بالجبن", 7, "cheese-muhammara-pie"],
  [59, "سبانخ", 5, "spinach-pie"],
  [60, "عش البلبل", 20, "ash-albulbul"],
  [61, "عرائس", 10, "arayes-pie"],
  [62, "لبنة", 5, "labneh-pie"],
  [63, "فطائر فلافل", 5, "falafel-pie"],
  [118, "فطائر زعتر", 5, "zaatar-pie"],
  [64, "إفطار مشكل", 23, "mix-breakfast"],
  [65, "بطاطس", 6, "potatoes"],
  [66, "كبدة غنم", 18, "sheep-liver"],
  [68, "مقلقل دجاج", 7, "chicken-mgalgal"],
  [69, "بيض شكشوكة", 6, "shakshouka"],
  [70, "بيض مقلي", 6, "fried-eggs"],
  [71, "بيض بالجبن", 7, "egg-cheese"],
  [72, "بيض مسلوق", 6, "boiled-eggs"],
  [73, "بيض عيون", 6, "sunny-side-egg"],
  [74, "جبنة بيضاء", 7, "white-cheese"],
  [75, "لبنة", 6, "labneh-breakfast"],
  [76, "جبنة بالمربى", 7, "cheese-jam"],
  [77, "فول لبناني", 12, "lebanese-foul"],
  [78, "فلافل صحن", 12, "falafel-plate"],
  [79, "حلاوة جبنة", 12, "cheese-halawa"],
  [80, "بطاطس حارة", 12, "spicy-potatoes"],
  [81, "زيتون", 6, "olives"],
  [85, "عدس", 6, "lentils"],
  [119, "صحن مقلقل دجاج", 14, "chicken-mgalgal-dish"],
  [86, "أم علي", 10, "umm-ali"],
  [87, "كريم كراميل", 10, "creme-caramel"],
  [88, "مهلبية", 7, "muhallabia"],
  [89, "جيلو", 7, "jello"],
  [90, "فروت سلاد", 12, "fruit-salad"],
  [95, "كوكتيل الدفواء", 7, "dafwa-cocktail"],
  [96, "برتقال", 7, "juice-orange"],
  [97, "مانجو", 7, "juice-mango"],
  [98, "جوافة", 7, "juice-guava"],
  [99, "تفاح", 7, "juice-apple"],
  [100, "موز بالحليب", 7, "juice-banana-milk"],
  [101, "أناناس", 7, "juice-pineapple"],
  [102, "فراولة", 7, "juice-strawberry"],
  [103, "جزر", 7, "juice-carrot"],
  [91, "رمان", 7, "juice-pomegranate"],
  [92, "شمام", 7, "juice-melon"],
  [93, "شقف", 12, "juice-shogaf"],
  [94, "أفوكادو", 14, "juice-avocado"],
  [104, "كيوي", 14, "juice-kiwi"],
  [105, "جالون عصير", 30, "juice-gallon"],
  [106, "بيبسي", 4, "pepsi"],
  [107, "سفن أب", 4, "7up"],
  [108, "ميراندا", 4, "mirinda"],
  [109, "ديو", 4, "dew"],
  [110, "مياه صحية", 1, "water"],
];

describe("menu matches the restaurant's QR menu", () => {
  const byId = new Map(menuItems.map((i) => [i.id, i]));

  it("has every QR dish with the same Arabic name and price", () => {
    for (const [, ar, price, id] of QR_MENU) {
      const item = byId.get(id);
      expect(item, id).toBeDefined();
      expect(item!.name.ar, id).toBe(ar);
      expect(item!.price, id).toBe(price);
      expect(item!.variations, id).toBeUndefined();
    }
  });

  it("has nothing that is not on the QR menu", () => {
    expect(new Set(QR_MENU.map((r) => r[3])).size).toBe(QR_MENU.length);
    expect(menuItems).toHaveLength(QR_MENU.length);
  });

  it("only the open buffet is dine-in only", () => {
    expect(menuItems.filter((i) => i.dineInOnly).map((i) => i.id)).toEqual(["open-buffet"]);
  });
});
