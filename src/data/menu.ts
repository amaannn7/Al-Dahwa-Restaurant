/**
 * Menu data. The UI reads only from this file, so dishes, prices, photos and
 * options can be edited here without touching any component.
 *
 * SOURCE: Al-Dafwa Restaurant's own QR menu (aldafwa.yallaqrcodes.com, linked
 * from the official Linktree as its "menu" (منيو) button), read on 21 Nov 2026. Names
 * (English and Arabic), prices, calories and section order follow it exactly,
 * except a few clear English slips that are listed in docs/04-menu-source.md.
 * Prices include 15% VAT (stated on that menu).
 *
 * Descriptions: the QR menu has none, so dishes that also appear on the
 * restaurant's Google Maps menu keep the description from there.
 *
 * Photos: the restaurant's own photos from the QR menu (src/assets/menu/).
 * A few dishes without one use an illustrative stock photo (see
 * docs/photo-credits.md); the rest show a typographic tile.
 */
import type { StaticImageData } from "next/image";

import stockBreakfast from "@/assets/photos/breakfast.jpg";
import stockLahmBiAjeen from "@/assets/photos/lahm-bi-ajeen.jpg";
import stockOrangeJuice from "@/assets/photos/orange-juice.jpg";
import stockSfiha from "@/assets/photos/sfiha.jpg";
import stockShakshuka from "@/assets/photos/shakshuka.jpg";
import stockShawarmaWrap from "@/assets/photos/shawarma-wrap.jpg";
import stockShawarmaWrapLight from "@/assets/photos/shawarma-wrap-light.jpg";
import stockSoftDrinks from "@/assets/photos/soft-drinks.jpg";

import hummus from "@/assets/menu/hummus.webp";
import beirutiHummus from "@/assets/menu/beiruti-hummus.webp";
import babaGhanouj from "@/assets/menu/baba-ghanouj.webp";
import mtabbal from "@/assets/menu/mtabbal.webp";
import fattoush from "@/assets/menu/fattoush.webp";
import grapeLeavesStarter from "@/assets/menu/grape-leaves-starter.webp";
import tabbouleh from "@/assets/menu/tabbouleh.webp";
import meatHummus from "@/assets/menu/meat-hummus.webp";
import fattehHummus from "@/assets/menu/fatteh-hummus.webp";
import greenSalad from "@/assets/menu/green-salad.webp";
import msabbaha from "@/assets/menu/msabbaha.webp";
import moussaka from "@/assets/menu/moussaka.webp";
import cabbageSalad from "@/assets/menu/cabbage-salad.webp";
import cornSalad from "@/assets/menu/corn-salad.webp";
import beetrootSalad from "@/assets/menu/beetroot-salad.webp";
import spicyPotatoSalad from "@/assets/menu/spicy-potato-salad.webp";
import mixMezze from "@/assets/menu/mix-mezze.webp";
import kibbeh from "@/assets/menu/kibbeh.webp";
import samosa from "@/assets/menu/samosa.webp";
import springRoll from "@/assets/menu/spring-roll.webp";
import whiteRice from "@/assets/menu/white-rice.webp";
import redRice from "@/assets/menu/red-rice.webp";
import grapeLeavesClassic from "@/assets/menu/grape-leaves-classic.webp";
import grapeLeavesSpicy from "@/assets/menu/grape-leaves-spicy.webp";
import grapeLeavesPomegranate from "@/assets/menu/grape-leaves-pomegranate.webp";
import stuffedCabbageClassic from "@/assets/menu/stuffed-cabbage-classic.webp";
import stuffedCabbageSpicy from "@/assets/menu/stuffed-cabbage-spicy.webp";
import mixedGrill from "@/assets/menu/mixed-grill.webp";
import cherryKebab from "@/assets/menu/cherry-kebab.webp";
import meatAwsal from "@/assets/menu/meat-awsal.webp";
import meatSteak from "@/assets/menu/meat-steak.webp";
import eggplantKebab from "@/assets/menu/eggplant-kebab.webp";
import meatKebab from "@/assets/menu/meat-kebab.webp";
import openBuffet from "@/assets/menu/open-buffet.webp";
import lambChops from "@/assets/menu/lamb-chops.webp";
import chickenKebab from "@/assets/menu/chicken-kebab.webp";
import shishTawouk from "@/assets/menu/shish-tawouk.webp";
import halfChickenCharcoal from "@/assets/menu/half-chicken-charcoal.webp";
import grilledArayes from "@/assets/menu/grilled-arayes.webp";
import shawarmaDish from "@/assets/menu/shawarma-dish.webp";
import arabicShawarma from "@/assets/menu/arabic-shawarma.webp";
import broasted from "@/assets/menu/broasted.webp";
import grilledShrimp from "@/assets/menu/grilled-shrimp.webp";
import friedShrimp from "@/assets/menu/fried-shrimp.webp";
import kanadFish from "@/assets/menu/kanad-fish.webp";
import fillet from "@/assets/menu/fillet.webp";
import fishAwsal from "@/assets/menu/fish-awsal.webp";
import potatoes from "@/assets/menu/potatoes.webp";
import falafelPlate from "@/assets/menu/falafel-plate.webp";
import ummAli from "@/assets/menu/umm-ali.webp";
import cremeCaramel from "@/assets/menu/creme-caramel.webp";
import muhallabia from "@/assets/menu/muhallabia.webp";
import jello from "@/assets/menu/jello.webp";
import fruitSalad from "@/assets/menu/fruit-salad.webp";

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
  /** Price in SAR, VAT included. Ignored when variations are present. */
  price: number;
  image: StaticImageData | null;
  available: boolean;
  featured?: boolean;
  /** Calories as printed on the restaurant's menu. */
  calories?: number;
  /** What the calories refer to: grams (e.g. 100 for "per 100 g") or "piece". Omitted = per serving as listed. */
  caloriesPer?: number | "piece";
  /** Served at the restaurant only: listed, but not added to WhatsApp orders. */
  dineInOnly?: boolean;
  /** Pick exactly one (e.g. size). The first is the default. None on the current menu. */
  variations?: { label: Localized; options: MenuVariation[] };
  /** Pick any number. None on the current menu. */
  extras?: { label: Localized; options: MenuExtra[] };
};

export type MenuCategory = {
  id: string;
  name: Localized;
  image: StaticImageData | null;
  /** Short note shown under the section heading (from the restaurant's menu). */
  note?: Localized;
  /** Add the section name to dish names in the cart and WhatsApp order ("Orange (Juices)"). */
  qualifyInOrder?: boolean;
};

const L = (en: string, ar: string): Localized => ({ en, ar });

type Def = Omit<MenuItem, "available" | "image"> & { image?: StaticImageData | null; available?: boolean };
const item = (d: Def): MenuItem => ({ image: null, available: true, ...d });

// Sections in the restaurant's own order.
export const categories: MenuCategory[] = [
  { id: "cold-starters", name: L("Cold Starters", "مقبلات باردة"), image: mixMezze },
  { id: "hot-starters", name: L("Hot Starters", "مقبلات حارة"), image: kibbeh },
  { id: "mahashi", name: L("Mahashi", "المحاشي"), image: grapeLeavesSpicy },
  { id: "grills", name: L("Grills", "المشاوي"), image: mixedGrill },
  { id: "shawarma-broasted", name: L("Shawarma & Broasted", "الشاورما و البروستد"), image: arabicShawarma },
  { id: "seafood", name: L("Seafood", "البحريات"), image: kanadFish },
  { id: "pastries", name: L("Pastries", "الفطائر"), image: stockLahmBiAjeen, qualifyInOrder: true },
  { id: "breakfast", name: L("Breakfast", "الإفطار"), image: falafelPlate },
  { id: "desserts", name: L("Desserts", "الحلويات"), image: ummAli },
  { id: "juices", name: L("Juices", "العصائر"), image: stockOrangeJuice, note: L("Juices have no added sugar. Ask for sugar when you order if you'd like it.", "العصائر لا تحتوي على سكر. على العميل طلب إضافة سكر عند الرغبة."), qualifyInOrder: true },
  { id: "drinks", name: L("Drinks", "المشروبات"), image: stockSoftDrinks },
];

export const menuItems: MenuItem[] = [
  // Cold Starters
  item({ id: "hummus", category: "cold-starters", name: L("Hommos", "حمص"), description: L("A creamy blend of chickpeas and tahini", "مزيج كريمي من الحمص والطحينة"), price: 12, image: hummus, calories: 260, caloriesPer: 100 }),
  item({ id: "beiruti-hummus", category: "cold-starters", name: L("Hommos Bairuti", "حمص بيروتي"), description: L("Chickpeas blended with tahini, lemon juice and garlic", "حمص مخلوط بالطحينة وعصير الليمون والثوم"), price: 13, image: beirutiHummus, calories: 260, caloriesPer: 100 }),
  item({ id: "baba-ghanouj", category: "cold-starters", name: L("Baba Ghannouj", "بابا غنوج"), description: L("Grilled eggplant mashed with tahini", "باذنجان مشوي مهروس مع الطحينة"), price: 12, image: babaGhanouj, calories: 90, caloriesPer: 100 }),
  item({ id: "mtabbal", category: "cold-starters", name: L("Mutabal", "متبل"), description: L("Grilled eggplant mashed with tahini", "باذنجان مشوي مهروس مع الطحينة"), price: 12, image: mtabbal, calories: 150, caloriesPer: 100 }),
  item({ id: "fattoush", category: "cold-starters", name: L("Fattoush", "فتوش"), description: L("Mixed vegetables with fried bread pieces", "خضار مشكلة مع قطع الخبز المقلي"), price: 12, image: fattoush, calories: 50, caloriesPer: 100 }),
  item({ id: "grape-leaves-starter", category: "cold-starters", name: L("Grape Leaves", "ورق عنب"), description: L("Grape leaves stuffed with a rice mixture", "ورق عنب محشو بخليط الرز"), price: 12, image: grapeLeavesStarter, calories: 50, caloriesPer: 100 }),
  item({ id: "tabbouleh", category: "cold-starters", name: L("Tabbouleh", "تبوله"), description: L("Parsley, bulgur, tomatoes and onions", "بقدونس وبرغل وطماطم وبصل"), price: 12, image: tabbouleh, calories: 45, caloriesPer: 100 }),
  item({ id: "meat-hummus", category: "cold-starters", name: L("Hommos with Meat", "حمص باللحم"), description: L("Mashed chickpeas with tahini, lemon juice, garlic and minced meat", "حمص مهروس مع الطحينة وعصير الليمون والثوم واللحم المفروم"), price: 18, image: meatHummus, calories: 260, caloriesPer: 100 }),
  item({ id: "fatteh-hummus", category: "cold-starters", name: L("Hommos Fatteh", "فتة حمص"), description: L("Mashed chickpeas, toasted bread and yogurt with tahini", "حمص مهروس وخبز محمص ولبن مع الطحينة"), price: 14, image: fattehHummus, calories: 300, caloriesPer: 100 }),
  item({ id: "green-salad", category: "cold-starters", name: L("Green Salad", "سلطة خضراء"), description: L("Mixed green salad", "سلطة خضراء مشكلة"), price: 12, image: greenSalad, calories: 25, caloriesPer: 100 }),
  item({ id: "msabbaha", category: "cold-starters", name: L("Musabaha", "مسبحة"), description: L("Mashed chickpeas with tahini and spices", "حمص مهروس مع الطحينة والبهارات"), price: 12, image: msabbaha, calories: 150, caloriesPer: 100 }),
  item({ id: "moussaka", category: "cold-starters", name: L("Musakaa Eggplant", "مصقعه باذنجان"), description: L("Eggplant with spiced meat and tomato sauce", "باذنجان مع لحم متبل وصلصة طماطم"), price: 12, image: moussaka, calories: 110, caloriesPer: 100 }),
  item({ id: "cabbage-salad", category: "cold-starters", name: L("Coleslaw", "سلطة ملفوف بالميونيز"), description: L("Fresh vegetables and cabbage", "خضار طازجة وملفوف"), price: 12, image: cabbageSalad, calories: 60, caloriesPer: 100 }),
  item({ id: "corn-salad", category: "cold-starters", name: L("Corn Salad", "سلطة ذرة"), description: L("Fresh vegetables and corn", "خضار طازجة وذرة"), price: 12, image: cornSalad, calories: 50, caloriesPer: 100 }),
  item({ id: "beetroot-salad", category: "cold-starters", name: L("Beetroot Salad", "سلطة شمندر"), description: L("Fresh vegetables and beetroot", "خضار طازجة وشمندر"), price: 12, image: beetrootSalad, calories: 90, caloriesPer: 100 }),
  item({ id: "spicy-potato-salad", category: "cold-starters", name: L("Hot Potato Salad", "سلطة بطاطس حارة"), description: L("Potato salad prepared our own way", "سلطة بطاطس محضرة على طريقتنا"), price: 12, image: spicyPotatoSalad, calories: 170, caloriesPer: 100 }),
  item({ id: "mix-mezze", category: "cold-starters", name: L("Mix Mezze Dish", "صحن مقبلات مشكل"), description: L("", ""), price: 23, image: mixMezze, calories: 100, caloriesPer: 100 }),

  // Hot Starters
  item({ id: "kibbeh", category: "hot-starters", name: L("Kibbe", "كبة"), description: L("Spiced cracked bulgur wheat shaped into filled croquettes", "برغل متبل مشكل على هيئة أقراص محشوة"), price: 4, image: kibbeh, calories: 80, caloriesPer: 35 }),
  item({ id: "samosa", category: "hot-starters", name: L("Sambosak", "سمبوسك"), description: L("Pastry filled with a choice of flavours", "معجنات محشوة بنكهات متعددة"), price: 2, image: samosa }),
  item({ id: "spring-roll", category: "hot-starters", name: L("Spring Roll", "سبرينغ رول"), description: L("Stuffed rolls fried in oil", "لفائف محشوة مقلية بالزيت"), price: 3, image: springRoll }),
  item({ id: "white-rice", category: "hot-starters", name: L("White Rice", "رز أبيض"), description: L("White rice cooked the traditional way", "رز أبيض مطبوخ بالطريقة التقليدية"), price: 7, image: whiteRice, calories: 160, caloriesPer: 100 }),
  item({ id: "red-rice", category: "hot-starters", name: L("Red Rice", "رز أحمر"), description: L("Plain red rice", "رز أحمر سادة"), price: 7, image: redRice, calories: 150, caloriesPer: 100 }),

  // Mahashi
  item({ id: "grape-leaves-classic", category: "mahashi", name: L("Grape Leaves Classic", "ورق عنب كلاسيك"), description: L("Grape leaves rolled and stuffed with rice", "ورق عنب ملفوف ومحشو بالرز"), price: 20, image: grapeLeavesClassic, calories: 35, caloriesPer: 50 }),
  item({ id: "grape-leaves-spicy", category: "mahashi", name: L("Grape Leaves Spicy", "ورق عنب سبايسي"), description: L("Grape leaves rolled and stuffed with rice", "ورق عنب ملفوف ومحشو بالرز"), price: 20, image: grapeLeavesSpicy, calories: 35, caloriesPer: 50 }),
  item({ id: "grape-leaves-pomegranate", category: "mahashi", name: L("Grape Leaves With Pomegranate Sauce", "ورق عنب دبس رمان"), description: L("Grape leaves stuffed with a mixture of rice and spices", "ورق عنب محشو بخليط الرز والبهارات"), price: 20, image: grapeLeavesPomegranate, calories: 35, caloriesPer: 50 }),
  item({ id: "stuffed-cabbage-classic", category: "mahashi", name: L("Cabbage Mahshi Classic", "محشي ملفوف كلاسيك"), description: L("", ""), price: 18, image: stuffedCabbageClassic, calories: 22, caloriesPer: 35 }),
  item({ id: "stuffed-cabbage-spicy", category: "mahashi", name: L("Cabbage Mahshi Spicy", "محشي ملفوف سبايسي"), description: L("", ""), price: 18, image: stuffedCabbageSpicy, calories: 22, caloriesPer: 35 }),

  // Grills
  item({ id: "mixed-grill", category: "grills", name: L("Mix Grills", "مشوي مشكل"), description: L("Mixed marinated grills", "تشكيلة من المشاوي المتبلة"), price: 40, image: mixedGrill, calories: 690, featured: true }),
  item({ id: "cherry-kebab", category: "grills", name: L("Armenian Cherry Meat Kabab", "كباب لحم أرمني بالكرز"), description: L("Minced meat marinated and grilled the traditional way", "لحم مفروم متبل ومشوي على الطريقة التقليدية"), price: 40, image: cherryKebab, calories: 611 }),
  item({ id: "meat-awsal", category: "grills", name: L("Grilled Meat Chunks", "أوصال لحم"), description: L("Skewers of fresh meat pieces, marinated and grilled on charcoal", "أسياخ من قطع اللحم الطازجة، متبلة ومشوية على الفحم"), price: 40, image: meatAwsal, calories: 140, caloriesPer: 60 }),
  item({ id: "meat-steak", category: "grills", name: L("Meat Steak", "ستيك لحم"), description: L("A marinated and grilled steak dish", "طبق ستيك متبل ومشوي"), price: 40, image: meatSteak, calories: 480 }),
  item({ id: "eggplant-kebab", category: "grills", name: L("Eggplant Meat Kabab", "كباب لحم باذنجان"), description: L("Eggplant kebab", "كباب الباذنجان"), price: 35, image: eggplantKebab, calories: 220 }),
  item({ id: "meat-kebab", category: "grills", name: L("Meat Kabab", "كباب لحم"), description: L("Skewers of minced meat, marinated and grilled on charcoal", "أسياخ من اللحم المفروم، متبلة ومشوية على الفحم"), price: 35, image: meatKebab, calories: 190, caloriesPer: 50 }),
  item({ id: "open-buffet", category: "grills", name: L("Open Buffet", "بوفيه مفتوح"), description: L("", ""), price: 45, image: openBuffet, dineInOnly: true }),
  item({ id: "lamb-chops", category: "grills", name: L("Lamb Chops", "ريش غنم"), description: L("Marinated and grilled ribs", "ريش متبلة ومشوية"), price: 50, image: lambChops, calories: 600 }),
  item({ id: "chicken-kebab", category: "grills", name: L("Chicken Kabab", "كباب دجاج"), description: L("Skewers of minced chicken, marinated and grilled on charcoal", "أسياخ من الدجاج المفروم، متبلة ومشوية على الفحم"), price: 35, image: chickenKebab, calories: 150, caloriesPer: 50 }),
  item({ id: "shish-tawouk", category: "grills", name: L("Shish Tawok", "شيش طاووق"), description: L("Skewers of fresh chicken pieces, marinated and grilled on charcoal", "أسياخ من قطع الدجاج الطازجة، متبلة ومشوية على الفحم"), price: 35, image: shishTawouk, calories: 120, caloriesPer: 60 }),
  item({ id: "chicken-fajita", category: "grills", name: L("Chicken Fajita", "فاهيتا دجاج"), description: L("Mexican-style chicken with a special sauce", "دجاج على الطريقة المكسيكية مع صوص خاص"), price: 25, calories: 410 }),
  item({ id: "half-chicken-charcoal", category: "grills", name: L("Half Grilled Chicken", "نصف دجاج عالفحم"), description: L("Charcoal grilled chicken", "دجاج مشوي على الفحم"), price: 22, image: halfChickenCharcoal, calories: 720, featured: true }),
  item({ id: "grilled-arayes", category: "grills", name: L("Arayes", "عرائس"), description: L("Arayes prepared our own way", "عرايس محضرة على طريقتنا"), price: 30, image: grilledArayes, calories: 300, caloriesPer: 100 }),

  // Shawarma & Broasted
  item({ id: "rocket-shawarma", category: "shawarma-broasted", name: L("Rocket Shawarma", "شاورما صاروخ"), description: L("Jumbo", "جامبو"), price: 15, image: stockShawarmaWrapLight }),
  item({ id: "shawarma", category: "shawarma-broasted", name: L("Shawarma", "شاورما"), description: L("", ""), price: 7, image: stockShawarmaWrap }),
  item({ id: "shawarma-dish", category: "shawarma-broasted", name: L("Shawarma Dish", "صحن شاورما"), description: L("", ""), price: 25, image: shawarmaDish }),
  item({ id: "arabic-shawarma", category: "shawarma-broasted", name: L("Arabic Shawarma", "شاورما عربي"), description: L("Arabic shawarma with bread, special spices and garlic", "شاورما عربي بالخبز مع بهارات خاصة وثوم"), price: 20, image: arabicShawarma, featured: true }),
  item({ id: "broasted", category: "shawarma-broasted", name: L("Broasted", "بروستد"), description: L("Marinated and fried chicken pieces", "قطع دجاج متبلة ومقلية"), price: 22, image: broasted, calories: 910, featured: true }),

  // Seafood
  item({ id: "grilled-shrimp", category: "seafood", name: L("Grilled Shrimp", "جمبري مشوي"), description: L("Shrimp grilled with spices", "روبيان مشوي بالبهارات"), price: 50, image: grilledShrimp, calories: 300 }),
  item({ id: "fried-shrimp", category: "seafood", name: L("Fried Shrimp", "جمبري مقلي"), description: L("Marinated and fried shrimp", "روبيان متبل ومقلي"), price: 50, image: friedShrimp, calories: 600 }),
  item({ id: "kanad-fish", category: "seafood", name: L("Kanad Fish", "سمك كنعد"), description: L("Fish with our special spices", "سمك بتوابلنا الخاصة"), price: 50, image: kanadFish, calories: 500 }),
  item({ id: "fillet", category: "seafood", name: L("Fillet", "فيليه"), description: L("", ""), price: 50, image: fillet }),
  item({ id: "fish-awsal", category: "seafood", name: L("Fish Chops", "أوصال سمك"), description: L("Marinated fish with grilled vegetables", "سمك متبل مع خضار مشوية"), price: 50, image: fishAwsal, calories: 430 }),

  // Pastries
  item({ id: "pizza", category: "pastries", name: L("Pizza", "بيتزا"), description: L("", ""), price: 20, calories: 190, caloriesPer: 100 }),
  item({ id: "shami-safeeha", category: "pastries", name: L("Shamiya Safiha", "صفيحة شامية"), description: L("Pie prepared the Shami way", "فطيرة على الطريقة الشامية"), price: 10, image: stockSfiha, calories: 210, caloriesPer: 100 }),
  item({ id: "lahm-bi-ajeen", category: "pastries", name: L("Lahmajun", "لحم بالعجينة"), description: L("Pie with ground meat and tomatoes", "فطيرة باللحم المفروم والطماطم"), price: 10, image: stockLahmBiAjeen, calories: 220, caloriesPer: 100 }),
  item({ id: "muhammara-pie", category: "pastries", name: L("Muhammara", "محمرة سادة"), description: L("Nuts with pepper molasses and grilled vegetables", "مكسرات مع دبس الفلفل وخضار مشوية"), price: 5, calories: 180, caloriesPer: 100 }),
  item({ id: "cheese-muhammara-pie", category: "pastries", name: L("Cheese Muhamara", "محمرة بالجبن"), description: L("Fluffy dough baked in the oven with muhammara sauce and cheese", "عجينة هشة مخبوزة في الفرن مع صوص المحمرة والجبن"), price: 7, calories: 180, caloriesPer: 100 }),
  item({ id: "spinach-pie", category: "pastries", name: L("Spinach", "سبانخ"), description: L("Pie stuffed with spinach", "فطيرة محشوة بالسبانخ"), price: 5, calories: 130, caloriesPer: 100 }),
  item({ id: "ash-albulbul", category: "pastries", name: L("Osh El Bulbul", "عش البلبل"), description: L("Dough topped with cheese, labneh and honey", "عجينة بالجبن واللبنة والعسل"), price: 20, calories: 23, caloriesPer: 100 }),
  item({ id: "arayes-pie", category: "pastries", name: L("Arayes", "عرائس"), description: L("Marinated minced meat stuffed in bread", "لحم مفروم متبل محشو في الخبز"), price: 10, calories: 900, caloriesPer: 100 }),
  item({ id: "labneh-pie", category: "pastries", name: L("Labna", "لبنة"), description: L("Pie stuffed with fresh labneh", "فطيرة محشوة باللبنة الطازجة"), price: 5, calories: 430, caloriesPer: 100 }),
  item({ id: "falafel-pie", category: "pastries", name: L("Falafel Fatayer", "فطائر فلافل"), description: L("Pie stuffed with falafel pieces", "فطيرة محشوة بقطع الفلافل"), price: 5, calories: 150, caloriesPer: 100 }),
  item({ id: "zaatar-pie", category: "pastries", name: L("Za'atar Fatayer", "فطائر زعتر"), description: L("Pie stuffed with thyme", "فطيرة محشوة بالزعتر"), price: 5, calories: 170, caloriesPer: 100 }),

  // Breakfast
  item({ id: "mix-breakfast", category: "breakfast", name: L("Mix Breakfast", "إفطار مشكل"), description: L("", ""), price: 23, image: stockBreakfast, calories: 560, caloriesPer: 100 }),
  item({ id: "potatoes", category: "breakfast", name: L("Potato", "بطاطس"), description: L("Crispy french fries", "بطاطس مقلية مقرمشة"), price: 6, image: potatoes, calories: 170, caloriesPer: 100 }),
  item({ id: "sheep-liver", category: "breakfast", name: L("Lamb Liver", "كبدة غنم"), description: L("Liver cooked with fresh vegetables", "كبدة مطبوخة مع خضار طازجة"), price: 18, calories: 550, caloriesPer: 100 }),
  item({ id: "chicken-mgalgal", category: "breakfast", name: L("Mugalgal", "مقلقل دجاج"), description: L("Chicken pieces with onions and spices", "قطع دجاج مع البصل والبهارات"), price: 7, calories: 550, caloriesPer: 100 }),
  item({ id: "shakshouka", category: "breakfast", name: L("Shakshouka", "بيض شكشوكة"), description: L("Eggs cooked with vegetables", "بيض مطبوخ مع الخضار"), price: 6, image: stockShakshuka, calories: 290, caloriesPer: 100 }),
  item({ id: "fried-eggs", category: "breakfast", name: L("Fried Egg", "بيض مقلي"), description: L("Eggs fried with oil and salt", "بيض مقلي بالزيت والملح"), price: 6, calories: 280, caloriesPer: 100 }),
  item({ id: "egg-cheese", category: "breakfast", name: L("Egg with Cheese", "بيض بالجبن"), description: L("", ""), price: 7, calories: 550, caloriesPer: 100 }),
  item({ id: "boiled-eggs", category: "breakfast", name: L("Boiled Egg", "بيض مسلوق"), description: L("Boiled eggs", "بيض مسلوق"), price: 6, calories: 170, caloriesPer: 100 }),
  item({ id: "sunny-side-egg", category: "breakfast", name: L("Sunny Side Up Eggs", "بيض عيون"), description: L("Fried on one side only, with a runny yolk", "بيضة مقلية على جهة واحدة مع صفار سائل"), price: 6, calories: 380, caloriesPer: 100 }),
  item({ id: "white-cheese", category: "breakfast", name: L("White Cheese", "جبنة بيضاء"), description: L("", ""), price: 7, calories: 260, caloriesPer: 100 }),
  item({ id: "labneh-breakfast", category: "breakfast", name: L("Labna", "لبنة"), description: L("", ""), price: 6, calories: 260, caloriesPer: 100 }),
  item({ id: "cheese-jam", category: "breakfast", name: L("Cheese with Jam", "جبنة بالمربى"), description: L("", ""), price: 7, calories: 300, caloriesPer: 100 }),
  item({ id: "lebanese-foul", category: "breakfast", name: L("Lebanese Foul", "فول لبناني"), description: L("Foul prepared the Lebanese way", "فول محضر على الطريقة اللبنانية"), price: 12, calories: 190, caloriesPer: 100 }),
  item({ id: "falafel-plate", category: "breakfast", name: L("Falafel Mix", "فلافل صحن"), description: L("", ""), price: 12, image: falafelPlate, calories: 90, caloriesPer: "piece" }),
  item({ id: "cheese-halawa", category: "breakfast", name: L("Cheese with Halawa", "حلاوة جبنة"), description: L("", ""), price: 12, calories: 420, caloriesPer: 100 }),
  item({ id: "spicy-potatoes", category: "breakfast", name: L("Hot Potato", "بطاطس حارة"), description: L("Spicy potato cubes with a special hot sauce", "مكعبات بطاطس حارة مع صوص حار خاص"), price: 12, calories: 170, caloriesPer: 100 }),
  item({ id: "olives", category: "breakfast", name: L("Olive", "زيتون"), description: L("A small side dish of olives", "طبق جانبي صغير من الزيتون"), price: 6, calories: 40, caloriesPer: 100 }),
  item({ id: "lentils", category: "breakfast", name: L("Lentil", "عدس"), description: L("", ""), price: 6, calories: 60, caloriesPer: 100 }),
  item({ id: "chicken-mgalgal-dish", category: "breakfast", name: L("Mugalgal Dish", "صحن مقلقل دجاج"), description: L("Chicken pieces with onions and spices", "قطع دجاج مع البصل والبهارات"), price: 14 }),

  // Desserts
  item({ id: "umm-ali", category: "desserts", name: L("Om Ali", "أم علي"), description: L("Puff pastry soaked in fresh milk, with nuts and cream", "عجينة منفوخة مغموسة بالحليب الطازج مع المكسرات والقشطة"), price: 10, image: ummAli, calories: 180, caloriesPer: 100 }),
  item({ id: "creme-caramel", category: "desserts", name: L("Cream Caramel", "كريم كراميل"), description: L("Custard of milk, eggs, sugar and vanilla, topped with caramel sauce", "كاسترد من الحليب والبيض والسكر والفانيلا مع صوص الكراميل"), price: 10, image: cremeCaramel, calories: 45, caloriesPer: 100 }),
  item({ id: "muhallabia", category: "desserts", name: L("Muhalabiya", "مهلبية"), description: L("A Middle Eastern milk pudding", "حلى حليب شرقي"), price: 7, image: muhallabia, calories: 60, caloriesPer: 100 }),
  item({ id: "jello", category: "desserts", name: L("Jello", "جيلو"), description: L("Gelatin with sugar and strawberry flavour", "جيلاتين بالسكر ونكهة الفراولة"), price: 7, image: jello, calories: 35, caloriesPer: 100 }),
  item({ id: "fruit-salad", category: "desserts", name: L("Fruit Salad", "فروت سلاد"), description: L("A mix of fresh fruits", "تشكيلة من الفواكه الطازجة"), price: 12, image: fruitSalad, calories: 390, caloriesPer: 100 }),

  // Juices
  item({ id: "dafwa-cocktail", category: "juices", name: L("Dafwa Cocktail", "كوكتيل الدفواء"), description: L("", ""), price: 7, calories: 80, caloriesPer: 100 }),
  item({ id: "juice-orange", category: "juices", name: L("Orange", "برتقال"), description: L("Fresh orange juice", "عصير برتقال طازج"), price: 7, image: stockOrangeJuice, calories: 45, caloriesPer: 100 }),
  item({ id: "juice-mango", category: "juices", name: L("Mango", "مانجو"), description: L("Natural mango juice", "عصير مانجو طبيعي"), price: 7, calories: 140, caloriesPer: 100 }),
  item({ id: "juice-guava", category: "juices", name: L("Guava", "جوافة"), description: L("Fresh guava juice", "عصير جوافة طازج"), price: 7, calories: 110, caloriesPer: 100 }),
  item({ id: "juice-apple", category: "juices", name: L("Apple", "تفاح"), description: L("Fresh apple juice", "عصير تفاح طازج"), price: 7, calories: 50, caloriesPer: 100 }),
  item({ id: "juice-banana-milk", category: "juices", name: L("Banana Milk", "موز بالحليب"), description: L("Fresh banana juice with milk", "عصير موز طازج بالحليب"), price: 7, calories: 110, caloriesPer: 100 }),
  item({ id: "juice-pineapple", category: "juices", name: L("Pineapple", "أناناس"), description: L("Fresh pineapple juice", "عصير أناناس طازج"), price: 7, calories: 30, caloriesPer: 100 }),
  item({ id: "juice-strawberry", category: "juices", name: L("Strawberry", "فراولة"), description: L("Fresh strawberry juice", "عصير فراولة طازج"), price: 7, calories: 150, caloriesPer: 100 }),
  item({ id: "juice-carrot", category: "juices", name: L("Carrot", "جزر"), description: L("Fresh carrot juice", "عصير جزر طازج"), price: 7, calories: 40, caloriesPer: 100 }),
  item({ id: "juice-pomegranate", category: "juices", name: L("Pomegranate", "رمان"), description: L("Fresh pomegranate juice", "عصير رمان طازج"), price: 7, calories: 45, caloriesPer: 100 }),
  item({ id: "juice-melon", category: "juices", name: L("Melon", "شمام"), description: L("Fresh melon juice", "عصير شمام طازج"), price: 7, calories: 150, caloriesPer: 100 }),
  item({ id: "juice-shogaf", category: "juices", name: L("Shogaf", "شقف"), description: L("", ""), price: 12, calories: 390, caloriesPer: 100 }),
  item({ id: "juice-avocado", category: "juices", name: L("Avocado", "أفوكادو"), description: L("Fresh avocado juice", "عصير أفوكادو طازج"), price: 14, calories: 100, caloriesPer: 100 }),
  item({ id: "juice-kiwi", category: "juices", name: L("Kiwi", "كيوي"), description: L("Fresh kiwi juice", "عصير كيوي طازج"), price: 14, calories: 50, caloriesPer: 100 }),
  item({ id: "juice-gallon", category: "juices", name: L("Juice Gallon", "جالون عصير"), description: L("", ""), price: 30 }),

  // Drinks
  item({ id: "pepsi", category: "drinks", name: L("Pepsi", "بيبسي"), description: L("Carbonated soft drink", "مشروب غازي"), price: 4, image: stockSoftDrinks }),
  item({ id: "7up", category: "drinks", name: L("7 up", "سفن أب"), description: L("Lemon-lime soft drink", "مشروب غازي بنكهة الليمون"), price: 4, image: stockSoftDrinks }),
  item({ id: "mirinda", category: "drinks", name: L("Miranda", "ميراندا"), description: L("Mirinda soft drink", "مشروب ميرندا الغازي"), price: 4, image: stockSoftDrinks }),
  item({ id: "dew", category: "drinks", name: L("Dew", "ديو"), description: L("Refreshing soft drink", "مشروب غازي منعش"), price: 4, image: stockSoftDrinks }),
  item({ id: "water", category: "drinks", name: L("Water", "مياه صحية"), description: L("Natural mineral water", "مياه معدنية طبيعية"), price: 1 }),
];

const itemIndex = new Map(menuItems.map((item) => [item.id, item]));
const categoryIndex = new Map(categories.map((c) => [c.id, c]));

export function getMenuItem(id: string): MenuItem | undefined {
  return itemIndex.get(id);
}

export function getCategory(id: string): MenuCategory | undefined {
  return categoryIndex.get(id);
}

export function itemsInCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.category === categoryId);
}

export const featuredItems = menuItems.filter((item) => item.featured);

/** Only categories that actually hold items are shown. */
export const visibleCategories = categories.filter((c) =>
  menuItems.some((item) => item.category === c.id),
);

// Some names appear in two sections (e.g. "Labna" in Pastries and Breakfast).
const nameCount = new Map<string, number>();
for (const i of menuItems) nameCount.set(i.name.en, (nameCount.get(i.name.en) ?? 0) + 1);

/**
 * Name for the cart and the WhatsApp order. Adds the section when the name is
 * not unique or the section asks for it, so "Orange" reads "Orange (Juices)".
 */
export function orderName(item: MenuItem, locale: "en" | "ar"): string {
  const name = item.name[locale];
  const category = getCategory(item.category);
  const qualify = category?.qualifyInOrder || (nameCount.get(item.name.en) ?? 0) > 1;
  return qualify && category ? `${name} (${category.name[locale]})` : name;
}
