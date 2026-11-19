/**
 * Menu data. The UI reads only from this file, so dishes, prices, photos and
 * options can be edited here without touching any component.
 *
 * SOURCE: Al-Dafwa Restaurant's menu on Google Maps, supplied by the client as
 * screenshots on 19 Nov 2026. English names, descriptions and prices follow
 * that menu. Where Google lists the same dish twice (e.g. "Chicken
 * Kebab-Sandwich" and "Chicken Kebab-Dish", or juice Small/Large/Gallon), it
 * is one dish here with a serving or size option at the same prices.
 * Arabic names are our translations: confirm them against the restaurant's
 * Arabic menu. See docs/04-menu-source.md for the line-by-line mapping.
 *
 * Photos are illustrative stock photos (see docs/photo-credits.md). Dishes
 * without a suitable photo show a typographic tile instead.
 */
import type { StaticImageData } from "next/image";

import babaGhanouj from "@/assets/photos/baba-ghanouj.jpg";
import breakfast from "@/assets/photos/breakfast.jpg";
import broasted from "@/assets/photos/broasted.jpg";
import chickenRice from "@/assets/photos/chicken-rice.jpg";
import cremeCaramel from "@/assets/photos/creme-caramel.jpg";
import fattoush from "@/assets/photos/fattoush.jpg";
import fishGrill from "@/assets/photos/fish-grill.jpg";
import fishSpiced from "@/assets/photos/fish-spiced.jpg";
import friedShrimp from "@/assets/photos/fried-shrimp.jpg";
import grapeLeaves from "@/assets/photos/grape-leaves.jpg";
import greenSalad from "@/assets/photos/green-salad.jpg";
import grilledShrimp from "@/assets/photos/grilled-shrimp.jpg";
import grillPlatter from "@/assets/photos/grill-platter.jpg";
import hummus from "@/assets/photos/hummus.jpg";
import juiceDark from "@/assets/photos/juice-dark.jpg";
import lahmBiAjeen from "@/assets/photos/lahm-bi-ajeen.jpg";
import mahashiMixed from "@/assets/photos/mahashi-mixed.jpg";
import mahashiPot from "@/assets/photos/mahashi-pot.jpg";
import mixedGrill from "@/assets/photos/mixed-grill.jpg";
import mtabbal from "@/assets/photos/mtabbal.jpg";
import muhallabia from "@/assets/photos/muhallabia.jpg";
import orangeJuice from "@/assets/photos/orange-juice.jpg";
import samosa from "@/assets/photos/samosa.jpg";
import sfiha from "@/assets/photos/sfiha.jpg";
import shakshuka from "@/assets/photos/shakshuka.jpg";
import shawarmaPlate from "@/assets/photos/shawarma-plate.jpg";
import shawarmaSpit from "@/assets/photos/shawarma-spit.jpg";
import shawarmaWrap from "@/assets/photos/shawarma-wrap.jpg";
import shawarmaWrapLight from "@/assets/photos/shawarma-wrap-light.jpg";
import skewers from "@/assets/photos/skewers.jpg";
import softDrinks from "@/assets/photos/soft-drinks.jpg";
import springRolls from "@/assets/photos/spring-rolls.jpg";
import tabbouleh from "@/assets/photos/tabbouleh.jpg";
import whiteRice from "@/assets/photos/white-rice.jpg";

/** true shows a "sample menu" notice everywhere. The real menu is in place. */
export const MENU_IS_PLACEHOLDER = false;

export type Localized = { en: string; ar: string };

export type MenuVariation = {
  id: string;
  name: Localized;
  /** Full price of the item when this variation is chosen (SAR). */
  price: number;
};

export type MenuExtra = {
  id: string;
  name: Localized;
  /** Added to the unit price (SAR). Use 0 for free options. */
  price: number;
};

export type MenuItem = {
  id: string;
  category: string;
  name: Localized;
  description: Localized;
  /** Base price in SAR. Ignored when variations are present. */
  price: number;
  image: StaticImageData | null;
  available: boolean;
  featured?: boolean;
  /** Pick exactly one (e.g. size). The first is the default. */
  variations?: { label: Localized; options: MenuVariation[] };
  /** Pick any number. None are listed on the current menu. */
  extras?: { label: Localized; options: MenuExtra[] };
};

export type MenuCategory = {
  id: string;
  name: Localized;
  image: StaticImageData | null;
};

// Sections from the Google Maps menu, ordered with the signature dishes first.
export const categories: MenuCategory[] = [
  { id: "grills", name: { en: "Grills", ar: "مشويات" }, image: mixedGrill },
  { id: "shawarma-broasted", name: { en: "Shawarma & Broasted", ar: "شاورما وبروستد" }, image: shawarmaSpit },
  { id: "seafood", name: { en: "Seafood", ar: "مأكولات بحرية" }, image: fishGrill },
  { id: "mahashi", name: { en: "Mahashi", ar: "محاشي" }, image: mahashiMixed },
  { id: "rice", name: { en: "Rice Dishes", ar: "أطباق الأرز" }, image: whiteRice },
  { id: "salads-appetizers", name: { en: "Salads & Appetizers", ar: "سلطات ومقبلات" }, image: fattoush },
  { id: "hot-appetizers", name: { en: "Hot Appetizers", ar: "مقبلات ساخنة" }, image: samosa },
  { id: "pies-pizza", name: { en: "Pies & Pizza", ar: "فطائر وبيتزا" }, image: lahmBiAjeen },
  { id: "breakfast", name: { en: "Breakfast", ar: "الفطور" }, image: breakfast },
  { id: "desserts", name: { en: "Desserts", ar: "حلويات" }, image: cremeCaramel },
  { id: "juices", name: { en: "Juices", ar: "عصائر" }, image: orangeJuice },
  { id: "beverages", name: { en: "Beverages", ar: "مشروبات" }, image: softDrinks },
];

/* ---------- helpers for repeated option sets ---------- */

const SERVING: Localized = { en: "Serving", ar: "طريقة التقديم" };
const SIZE: Localized = { en: "Size", ar: "الحجم" };
const TYPE: Localized = { en: "Choice", ar: "النوع" };

const opt = (id: string, en: string, ar: string, price: number): MenuVariation => ({ id, name: { en, ar }, price });
const sandwich = (price: number) => opt("sandwich", "Sandwich", "ساندويتش", price);
const plate = (price: number) => opt("plate", "Plate", "صحن", price);
const small = (price: number) => opt("small", "Small", "صغير", price);
const medium = (price: number) => opt("medium", "Medium", "وسط", price);
const large = (price: number) => opt("large", "Large", "كبير", price);
const gallon = (price: number) => opt("gallon", "Gallon", "جالون", price);

/** Sandwich / plate pairs, as listed "X-Sandwich" and "X-Dish" on Google. */
const servings = (s: number, p: number) => ({ label: SERVING, options: [sandwich(s), plate(p)] });
const sizes = (...options: MenuVariation[]) => ({ label: SIZE, options });

type Def = Omit<MenuItem, "available" | "image" | "price"> & {
  price?: number;
  image?: StaticImageData | null;
  available?: boolean;
};
const item = (d: Def): MenuItem => ({ price: 0, image: null, available: true, ...d });
const L = (en: string, ar: string): Localized => ({ en, ar });

/** Juices share one pattern: "Fresh X juice", sold in small, large and gallon. */
const juice = (id: string, en: string, ar: string, prices: { small?: number; large: number; gallon: number }, image: StaticImageData | null = null, desc?: Localized) =>
  item({
    id: `juice-${id}`,
    category: "juices",
    name: L(`${en} Juice`, `عصير ${ar}`),
    description: desc ?? L(`Fresh ${en.toLowerCase()} juice`, `عصير ${ar} طازج`),
    image,
    variations: sizes(...[prices.small !== undefined ? small(prices.small) : null, large(prices.large), gallon(prices.gallon)].filter((o): o is MenuVariation => o !== null)),
  });

/* ---------- the menu ---------- */

export const menuItems: MenuItem[] = [
  // Grills
  item({ id: "mixed-grill", category: "grills", name: L("Mixed Grill", "مشاوي مشكلة"), description: L("Mixed marinated grills", "تشكيلة من المشاوي المتبلة"), price: 50, image: mixedGrill, featured: true }),
  item({ id: "shish-tawouk", category: "grills", name: L("Shish Tawouk", "شيش طاووق"), description: L("Skewers of fresh chicken pieces, marinated and grilled on charcoal", "أسياخ من قطع الدجاج الطازجة، متبلة ومشوية على الفحم"), image: skewers, variations: servings(18, 42) }),
  item({ id: "chicken-kebab", category: "grills", name: L("Chicken Kebab", "كباب دجاج"), description: L("Skewers of minced chicken, marinated and grilled on charcoal", "أسياخ من الدجاج المفروم، متبلة ومشوية على الفحم"), variations: servings(18, 42) }),
  item({ id: "meat-kebab", category: "grills", name: L("Meat Kebab", "كباب لحم"), description: L("Skewers of minced meat, marinated and grilled on charcoal", "أسياخ من اللحم المفروم، متبلة ومشوية على الفحم"), image: grillPlatter, variations: servings(18, 42) }),
  item({ id: "meat-awsal", category: "grills", name: L("Meat Awsal", "أوصال لحم"), description: L("Skewers of fresh meat pieces, marinated and grilled on charcoal", "أسياخ من قطع اللحم الطازجة، متبلة ومشوية على الفحم"), variations: servings(18, 50) }),
  item({ id: "half-chicken-charcoal", category: "grills", name: L("Half Chicken on Charcoal", "نصف دجاجة على الفحم"), description: L("Charcoal grilled chicken", "دجاج مشوي على الفحم"), price: 27, image: chickenRice, featured: true }),
  item({ id: "sheep-ribs", category: "grills", name: L("Sheep Ribs", "ريش غنم"), description: L("Marinated and grilled ribs", "ريش متبلة ومشوية"), price: 62 }),
  item({ id: "cherry-kebab", category: "grills", name: L("Armenian Cherry Kebab", "كباب كرز أرمني"), description: L("Minced meat marinated and grilled the traditional way", "لحم مفروم متبل ومشوي على الطريقة التقليدية"), price: 48 }),
  item({ id: "meat-steak", category: "grills", name: L("Meat Steak", "ستيك لحم"), description: L("A marinated and grilled steak dish", "طبق ستيك متبل ومشوي"), price: 48 }),
  item({ id: "eggplant-kebab", category: "grills", name: L("Eggplant Meat Kebab", "كباب باذنجان باللحم"), description: L("Eggplant kebab", "كباب الباذنجان"), price: 42 }),
  item({ id: "grilled-arayes", category: "grills", name: L("Grilled Arayes", "عرايس مشوية"), description: L("Arayes prepared our own way", "عرايس محضرة على طريقتنا"), price: 36 }),
  item({ id: "chicken-arayes", category: "grills", name: L("Chicken Arayes", "عرايس دجاج"), description: L("Baked dough stuffed with minced chicken, rich in spices", "عجينة مخبوزة محشوة بالدجاج المفروم الغني بالبهارات"), price: 36 }),
  item({ id: "chicken-fajita", category: "grills", name: L("Chicken Fajita", "فاهيتا دجاج"), description: L("Mexican-style chicken with a special sauce", "دجاج على الطريقة المكسيكية مع صوص خاص"), variations: servings(18, 30) }),

  // Shawarma & Broasted
  item({ id: "chicken-shawarma", category: "shawarma-broasted", name: L("Chicken Shawarma", "شاورما دجاج"), description: L("Chicken shawarma with garlic sauce and pickles", "شاورما دجاج مع الثومية والمخلل"), image: shawarmaWrap, featured: true, variations: { label: SERVING, options: [sandwich(9), opt("jumbo", "Jumbo", "جامبو", 19), plate(30)] } }),
  item({ id: "meat-shawarma", category: "shawarma-broasted", name: L("Meat Shawarma", "شاورما لحم"), description: L("Meat shawarma with garlic sauce and pickles", "شاورما لحم مع الثومية والمخلل"), image: shawarmaWrapLight, variations: { label: SERVING, options: [sandwich(10), opt("jumbo", "Jumbo", "جامبو", 22), plate(32)] } }),
  item({ id: "arabic-shawarma", category: "shawarma-broasted", name: L("Arabic Shawarma", "شاورما عربي"), description: L("Arabic shawarma with bread, special spices and garlic", "شاورما عربي بالخبز مع بهارات خاصة وثوم"), image: shawarmaPlate, variations: { label: TYPE, options: [opt("chicken", "Chicken", "دجاج", 24), opt("meat", "Meat", "لحم", 26)] } }),
  item({ id: "broasted", category: "shawarma-broasted", name: L("Broasted Chicken", "بروستد"), description: L("Marinated and fried chicken pieces", "قطع دجاج متبلة ومقلية"), price: 27, image: broasted, featured: true }),

  // Seafood
  item({ id: "fish-awsal", category: "seafood", name: L("Fish Awsal", "أوصال سمك"), description: L("Marinated fish with grilled vegetables", "سمك متبل مع خضار مشوية"), variations: servings(18, 62) }),
  item({ id: "fish-fillets", category: "seafood", name: L("Fish Fillets", "فيليه سمك"), description: L("Fresh grilled fish fillets with special spices", "شرائح سمك طازجة مشوية بتوابل خاصة"), price: 62, image: fishSpiced }),
  item({ id: "fried-fillet", category: "seafood", name: L("Fried Fillet", "فيليه مقلي"), description: L("Fillet prepared our own way", "فيليه محضر على طريقتنا"), price: 62 }),
  item({ id: "mackerel", category: "seafood", name: L("Mackerel Fish", "سمك ماكريل"), description: L("Fish with our special spices", "سمك بتوابلنا الخاصة"), price: 62, image: fishGrill }),
  item({ id: "grilled-shrimp", category: "seafood", name: L("Grilled Shrimp", "روبيان مشوي"), description: L("Shrimp grilled with spices", "روبيان مشوي بالبهارات"), image: grilledShrimp, variations: servings(22, 62) }),
  item({ id: "fried-shrimp", category: "seafood", name: L("Fried Shrimp", "روبيان مقلي"), description: L("Marinated and fried shrimp", "روبيان متبل ومقلي"), image: friedShrimp, variations: servings(22, 62) }),

  // Mahashi
  item({ id: "grape-leaves-classic", category: "mahashi", name: L("Classic Grape Leaves", "ورق عنب كلاسيك"), description: L("Grape leaves rolled and stuffed with rice", "ورق عنب ملفوف ومحشو بالرز"), image: grapeLeaves, variations: sizes(small(24), medium(54), large(78)) }),
  item({ id: "grape-leaves-spicy", category: "mahashi", name: L("Spicy Grape Leaves", "ورق عنب حار"), description: L("Grape leaves rolled and stuffed with rice", "ورق عنب ملفوف ومحشو بالرز"), variations: sizes(small(24), medium(54), large(78)) }),
  item({ id: "grape-leaves-pomegranate", category: "mahashi", name: L("Grape Leaves with Pomegranate Molasses", "ورق عنب بدبس الرمان"), description: L("Grape leaves stuffed with a mixture of rice and spices", "ورق عنب محشو بخليط الرز والبهارات"), image: mahashiPot, variations: sizes(small(24), medium(54), large(78)) }),
  item({ id: "stuffed-cabbage-classic", category: "mahashi", name: L("Classic Stuffed Cabbage", "ملفوف محشي كلاسيك"), description: L("Cabbage and carrots with mayonnaise and a special mixture", "ملفوف وجزر مع المايونيز وخلطة خاصة"), image: mahashiMixed, variations: sizes(small(22), medium(42), large(66)) }),
  item({ id: "stuffed-cabbage-spicy", category: "mahashi", name: L("Spicy Stuffed Cabbage", "ملفوف محشي حار"), description: L("Cabbage and carrots with mayonnaise and a special mixture", "ملفوف وجزر مع المايونيز وخلطة خاصة"), variations: sizes(small(22), medium(42), large(66)) }),

  // Rice dishes
  item({ id: "white-rice", category: "rice", name: L("White Rice", "رز أبيض"), description: L("White rice cooked the traditional way", "رز أبيض مطبوخ بالطريقة التقليدية"), price: 8, image: whiteRice }),
  item({ id: "red-rice", category: "rice", name: L("Red Rice", "رز أحمر"), description: L("Plain red rice", "رز أحمر سادة"), price: 8 }),

  // Salads & appetizers
  item({ id: "hummus", category: "salads-appetizers", name: L("Hummus", "حمص"), description: L("A creamy blend of chickpeas and tahini", "مزيج كريمي من الحمص والطحينة"), price: 14, image: hummus }),
  item({ id: "beiruti-hummus", category: "salads-appetizers", name: L("Beiruti Hummus", "حمص بيروتي"), description: L("Chickpeas blended with tahini, lemon juice and garlic", "حمص مخلوط بالطحينة وعصير الليمون والثوم"), price: 16 }),
  item({ id: "meat-hummus", category: "salads-appetizers", name: L("Meat Hummus", "حمص باللحم"), description: L("Mashed chickpeas with tahini, lemon juice, garlic and minced meat", "حمص مهروس مع الطحينة وعصير الليمون والثوم واللحم المفروم"), price: 22 }),
  item({ id: "fatteh-hummus", category: "salads-appetizers", name: L("Fatteh Hummus", "فتة حمص"), description: L("Mashed chickpeas, toasted bread and yogurt with tahini", "حمص مهروس وخبز محمص ولبن مع الطحينة"), price: 17 }),
  item({ id: "msabbaha", category: "salads-appetizers", name: L("Msabbaha", "مسبحة"), description: L("Mashed chickpeas with tahini and spices", "حمص مهروس مع الطحينة والبهارات"), price: 14 }),
  item({ id: "mtabbal", category: "salads-appetizers", name: L("Mtabbal", "متبل"), description: L("Grilled eggplant mashed with tahini", "باذنجان مشوي مهروس مع الطحينة"), price: 14, image: mtabbal }),
  item({ id: "baba-ghanouj", category: "salads-appetizers", name: L("Baba Ghanouj", "بابا غنوج"), description: L("Grilled eggplant mashed with tahini", "باذنجان مشوي مهروس مع الطحينة"), price: 14, image: babaGhanouj }),
  item({ id: "moussaka", category: "salads-appetizers", name: L("Eggplant Moussaka", "مسقعة باذنجان"), description: L("Eggplant with spiced meat and tomato sauce", "باذنجان مع لحم متبل وصلصة طماطم"), price: 14 }),
  item({ id: "grape-leaves-starter", category: "salads-appetizers", name: L("Grape Leaves", "ورق عنب"), description: L("Grape leaves stuffed with a rice mixture", "ورق عنب محشو بخليط الرز"), price: 14 }),
  item({ id: "fattoush", category: "salads-appetizers", name: L("Fattoush", "فتوش"), description: L("Mixed vegetables with fried bread pieces", "خضار مشكلة مع قطع الخبز المقلي"), price: 14, image: fattoush }),
  item({ id: "tabbouleh", category: "salads-appetizers", name: L("Tabbouleh", "تبولة"), description: L("Parsley, bulgur, tomatoes and onions", "بقدونس وبرغل وطماطم وبصل"), price: 14, image: tabbouleh }),
  item({ id: "green-salad", category: "salads-appetizers", name: L("Green Salad", "سلطة خضراء"), description: L("Mixed green salad", "سلطة خضراء مشكلة"), price: 14, image: greenSalad }),
  item({ id: "cabbage-salad", category: "salads-appetizers", name: L("Cabbage Salad with Mayonnaise", "سلطة ملفوف بالمايونيز"), description: L("Fresh vegetables and cabbage", "خضار طازجة وملفوف"), price: 14 }),
  item({ id: "spicy-potato-salad", category: "salads-appetizers", name: L("Spicy Potato Salad", "سلطة بطاطس حارة"), description: L("Potato salad prepared our own way", "سلطة بطاطس محضرة على طريقتنا"), price: 14 }),
  item({ id: "beetroot-salad", category: "salads-appetizers", name: L("Beetroot Salad", "سلطة شمندر"), description: L("Fresh vegetables and beetroot", "خضار طازجة وشمندر"), price: 14 }),
  item({ id: "corn-salad", category: "salads-appetizers", name: L("Corn Salad", "سلطة ذرة"), description: L("Fresh vegetables and corn", "خضار طازجة وذرة"), price: 14 }),

  // Hot appetizers
  item({ id: "samosa", category: "hot-appetizers", name: L("Samosa", "سمبوسة"), description: L("Pastry filled with a choice of flavours", "معجنات محشوة بنكهات متعددة"), price: 3, image: samosa }),
  item({ id: "kibbeh", category: "hot-appetizers", name: L("Kibbeh", "كبة"), description: L("Spiced cracked bulgur wheat shaped into filled croquettes", "برغل متبل مشكل على هيئة أقراص محشوة"), price: 5 }),
  item({ id: "spring-roll", category: "hot-appetizers", name: L("Spring Roll", "سبرينغ رول"), description: L("Stuffed rolls fried in oil", "لفائف محشوة مقلية بالزيت"), price: 4, image: springRolls }),

  // Pies & pizza
  item({ id: "cheese-pie", category: "pies-pizza", name: L("Cheese Pie", "فطيرة جبن"), description: L("Pie stuffed with white cheese", "فطيرة محشوة بالجبن الأبيض"), price: 6 }),
  item({ id: "thyme-pie", category: "pies-pizza", name: L("Thyme Pie", "فطيرة زعتر"), description: L("Pie stuffed with thyme", "فطيرة محشوة بالزعتر"), price: 6 }),
  item({ id: "spinach-pie", category: "pies-pizza", name: L("Spinach Pie", "فطيرة سبانخ"), description: L("Pie stuffed with spinach", "فطيرة محشوة بالسبانخ"), price: 6 }),
  item({ id: "labneh-pie", category: "pies-pizza", name: L("Labneh Pie", "فطيرة لبنة"), description: L("Pie stuffed with fresh labneh", "فطيرة محشوة باللبنة الطازجة"), price: 6 }),
  item({ id: "falafel-pie", category: "pies-pizza", name: L("Falafel Pie", "فطيرة فلافل"), description: L("Pie stuffed with falafel pieces", "فطيرة محشوة بقطع الفلافل"), price: 6 }),
  item({ id: "honey-pie", category: "pies-pizza", name: L("Honey Pie", "فطيرة عسل"), description: L("Pie prepared our own way", "فطيرة محضرة على طريقتنا"), price: 6 }),
  item({ id: "muhammara-pie", category: "pies-pizza", name: L("Plain Muhammara Pie", "فطيرة محمرة سادة"), description: L("Nuts with pepper molasses and grilled vegetables", "مكسرات مع دبس الفلفل وخضار مشوية"), price: 6 }),
  item({ id: "cheese-muhammara-pie", category: "pies-pizza", name: L("Cheese Muhammara Pie", "فطيرة محمرة بالجبن"), description: L("Fluffy dough baked in the oven with muhammara sauce and cheese", "عجينة هشة مخبوزة في الفرن مع صوص المحمرة والجبن"), price: 8 }),
  item({ id: "lahm-bi-ajeen", category: "pies-pizza", name: L("Lahm Bi Ajeen", "لحم بعجين"), description: L("Pie with ground meat and tomatoes", "فطيرة باللحم المفروم والطماطم"), price: 12, image: lahmBiAjeen }),
  item({ id: "shami-safeeha", category: "pies-pizza", name: L("Shami Safeeha", "صفيحة شامية"), description: L("Pie prepared the Shami way", "فطيرة على الطريقة الشامية"), price: 12, image: sfiha }),
  item({ id: "arayes-bread", category: "pies-pizza", name: L("Arayes", "عرايس"), description: L("Marinated minced meat stuffed in bread", "لحم مفروم متبل محشو في الخبز"), price: 12 }),
  item({ id: "ash-albulbul", category: "pies-pizza", name: L("Ash Al Bulbul", "عش البلبل"), description: L("Dough topped with cheese, labneh and honey", "عجينة بالجبن واللبنة والعسل"), variations: sizes(medium(24), large(30)) }),

  // Breakfast
  item({ id: "chicken-mgalgal", category: "breakfast", name: L("Chicken Mgalgal", "مقلقل دجاج"), description: L("Chicken pieces with onions and spices", "قطع دجاج مع البصل والبهارات"), variations: servings(8, 17) }),
  item({ id: "meat-mgalgal", category: "breakfast", name: L("Meat Mgalgal", "مقلقل لحم"), description: L("Cooked meat, tomato, onion and mixed vegetables", "لحم مطبوخ مع الطماطم والبصل وخضار مشكلة"), variations: servings(10, 19) }),
  item({ id: "sheep-liver", category: "breakfast", name: L("Sheep Liver", "كبدة غنم"), description: L("Liver cooked with fresh vegetables", "كبدة مطبوخة مع خضار طازجة"), variations: servings(7, 22) }),
  item({ id: "shakshouka", category: "breakfast", name: L("Shakshouka Eggs", "بيض شكشوكة"), description: L("Eggs cooked with vegetables", "بيض مطبوخ مع الخضار"), image: shakshuka, variations: servings(4, 7) }),
  item({ id: "fried-eggs", category: "breakfast", name: L("Fried Eggs", "بيض مقلي"), description: L("Eggs fried with oil and salt", "بيض مقلي بالزيت والملح"), variations: servings(4, 7) }),
  item({ id: "boiled-eggs", category: "breakfast", name: L("Boiled Eggs", "بيض مسلوق"), description: L("Boiled eggs", "بيض مسلوق"), variations: servings(4, 7) }),
  item({ id: "sunny-side-egg", category: "breakfast", name: L("Sunny Side Up Egg", "بيضة عيون"), description: L("Fried on one side only, with a runny yolk", "بيضة مقلية على جهة واحدة مع صفار سائل"), price: 7 }),
  item({ id: "spicy-potatoes", category: "breakfast", name: L("Spicy Potatoes", "بطاطس حارة"), description: L("Spicy potato cubes with a special hot sauce", "مكعبات بطاطس حارة مع صوص حار خاص"), variations: servings(4, 14) }),
  item({ id: "potatoes", category: "breakfast", name: L("Potatoes", "بطاطس"), description: L("Crispy french fries", "بطاطس مقلية مقرمشة"), variations: servings(4, 7) }),
  item({ id: "hot-dog", category: "breakfast", name: L("Hot Dog", "هوت دوق"), description: L("Sausage with sauces", "نقانق مع الصوصات"), variations: servings(7, 14) }),
  item({ id: "lebanese-foul", category: "breakfast", name: L("Lebanese Foul", "فول لبناني"), description: L("Foul prepared the Lebanese way", "فول محضر على الطريقة اللبنانية"), price: 14 }),
  item({ id: "olives", category: "breakfast", name: L("Olives", "زيتون"), description: L("A small side dish of olives", "طبق جانبي صغير من الزيتون"), price: 7 }),

  // Desserts
  item({ id: "umm-ali", category: "desserts", name: L("Umm Ali", "أم علي"), description: L("Puff pastry soaked in fresh milk, with nuts and cream", "عجينة منفوخة مغموسة بالحليب الطازج مع المكسرات والقشطة"), price: 12 }),
  item({ id: "creme-caramel", category: "desserts", name: L("Creme Caramel", "كريم كراميل"), description: L("Custard of milk, eggs, sugar and vanilla, topped with caramel sauce", "كاسترد من الحليب والبيض والسكر والفانيلا مع صوص الكراميل"), price: 12, image: cremeCaramel }),
  item({ id: "blancmange", category: "desserts", name: L("Blancmange", "مهلبية"), description: L("A Middle Eastern milk pudding", "حلى حليب شرقي"), price: 8, image: muhallabia }),
  item({ id: "fruit-salad", category: "desserts", name: L("Fruit Salad", "سلطة فواكه"), description: L("A mix of fresh fruits", "تشكيلة من الفواكه الطازجة"), price: 14 }),
  item({ id: "jello", category: "desserts", name: L("Jello", "جيلي"), description: L("Gelatin with sugar and strawberry flavour", "جيلاتين بالسكر ونكهة الفراولة"), price: 8 }),

  // Juices (Small 8 / Large 14 / Gallon 35; avocado and kiwi Large 17 / Gallon 35)
  juice("orange", "Orange", "برتقال", { small: 8, large: 14, gallon: 35 }, orangeJuice),
  juice("mango", "Mango", "مانجو", { small: 8, large: 14, gallon: 35 }, juiceDark, L("Natural mango juice", "عصير مانجو طبيعي")),
  juice("pomegranate", "Pomegranate", "رمان", { small: 8, large: 14, gallon: 35 }),
  juice("melon", "Melon", "شمام", { small: 8, large: 14, gallon: 35 }),
  juice("apple", "Apple", "تفاح", { small: 8, large: 14, gallon: 35 }),
  juice("guava", "Guava", "جوافة", { small: 8, large: 14, gallon: 35 }),
  juice("pineapple", "Pineapple", "أناناس", { small: 8, large: 14, gallon: 35 }),
  juice("carrot", "Carrot", "جزر", { small: 8, large: 14, gallon: 35 }),
  juice("strawberry", "Strawberry", "فراولة", { small: 8, large: 14, gallon: 35 }),
  juice("banana-milk", "Banana with Milk", "موز بالحليب", { small: 8, large: 14, gallon: 35 }, null, L("Fresh banana juice with milk", "عصير موز طازج بالحليب")),
  juice("avocado", "Avocado", "أفوكادو", { large: 17, gallon: 35 }),
  juice("kiwi", "Kiwi", "كيوي", { large: 17, gallon: 35 }),

  // Beverages
  item({ id: "water", category: "beverages", name: L("Mineral Water", "مياه معدنية"), description: L("Natural mineral water", "مياه معدنية طبيعية"), variations: sizes(small(1), large(3)) }),
  item({ id: "pepsi", category: "beverages", name: L("Pepsi", "بيبسي"), description: L("Carbonated soft drink", "مشروب غازي"), price: 5, image: softDrinks }),
  item({ id: "7up", category: "beverages", name: L("7 Up", "سفن أب"), description: L("Lemon-lime soft drink", "مشروب غازي بنكهة الليمون"), price: 5, image: softDrinks }),
  item({ id: "mirinda", category: "beverages", name: L("Mirinda", "ميرندا"), description: L("Mirinda soft drink", "مشروب ميرندا الغازي"), price: 5, image: softDrinks }),
  item({ id: "dew", category: "beverages", name: L("Dew", "ديو"), description: L("Refreshing soft drink", "مشروب غازي منعش"), price: 5, image: softDrinks }),
];

const itemIndex = new Map(menuItems.map((item) => [item.id, item]));

export function getMenuItem(id: string): MenuItem | undefined {
  return itemIndex.get(id);
}

export function itemsInCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.category === categoryId);
}

export const featuredItems = menuItems.filter((item) => item.featured);

/** Only categories that actually hold items are shown. */
export const visibleCategories = categories.filter((c) =>
  menuItems.some((item) => item.category === c.id),
);
