import type { Restaurant } from "@/types/customer";

const foodPhoto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=80`;

export const neighborhoods = [
  "Yüzüncü Yıl",
  "Hürriyet",
  "Değirmenaltı",
  "Altınova",
  "Ertuğrul",
  "Çınarlı",
];

export const restaurants: Restaurant[] = [
  {
    id: "demo-kiziltas",
    slug: "kiziltas-lokantasi",
    name: "Kızıltaş Lokantası",
    description: "Izgaradan sofrana, özenle hazırlanan klasik lezzetler.",
    cuisine: "Kebap · Türk Mutfağı",
    image: foodPhoto("photo-1544025162-d76694265947"),
    rating: 4.8,
    deliveryMinutes: 30,
    minimumOrderCents: 25000,
    status: "OPEN",
    manuallyClosed: false,
    operatingHours: { opensAt: "10:00", closesAt: "23:00" },
    deliveryZones: [
      { neighborhood: "Hürriyet", deliveryFeeCents: 1500 },
      { neighborhood: "Yüzüncü Yıl", deliveryFeeCents: 0 },
      { neighborhood: "Değirmenaltı", deliveryFeeCents: 2000 },
    ],
    categories: [
      { id: "grill", name: "Izgaralar" },
      { id: "soup", name: "Çorbalar" },
      { id: "drinks", name: "İçecekler" },
    ],
    paymentMethods: ["CASH_ON_DELIVERY", "CARD_ON_DELIVERY"],
    campaign: "Demo · Ücretsiz teslimat",
    menu: [
      {
        id: "adana",
        name: "Adana Kebap",
        description: "Zırhta çekilmiş et, közlenmiş biber ve domatesle.",
        image: foodPhoto("photo-1558030006-450675393462"),
        priceCents: 40000,
        category: "Izgaralar",
        options: [
          {
            id: "portion",
            name: "Porsiyon",
            required: true,
            multiple: false,
            choices: [
              { id: "single", label: "1 porsiyon", priceCents: 0 },
              { id: "large", label: "1,5 porsiyon", priceCents: 18000 },
            ],
          },
          {
            id: "side",
            name: "Yanına ekle",
            required: false,
            multiple: true,
            choices: [
              { id: "ayran", label: "Ayran", priceCents: 4000 },
              { id: "cola", label: "Kola", priceCents: 5000 },
            ],
          },
        ],
      },
      {
        id: "half-soup",
        name: "Yarım Çorba",
        description: "Günün çorbası, küçük porsiyon.",
        image: foodPhoto("photo-1547592180-85f173990554"),
        priceCents: 8000,
        category: "Çorbalar",
        options: [],
      },
      {
        id: "chicken-soup",
        name: "Tavuk Suyu Çorbası",
        description: "Tavuk suyu ve taze baharatlarla.",
        image: foodPhoto("photo-1547592180-85f173990554"),
        priceCents: 12000,
        category: "Çorbalar",
        options: [],
      },
      {
        id: "lentil-soup",
        name: "Mercimek Çorbası",
        description: "Klasik mercimek çorbası, limon ile.",
        image: foodPhoto("photo-1547592180-85f173990554"),
        priceCents: 12000,
        category: "Çorbalar",
        options: [],
      },
      {
        id: "cop-shish",
        name: "Çöp Şiş",
        description: "Izgarada pişmiş, sıcak servis edilir.",
        image: foodPhoto("photo-1544025162-d76694265947"),
        priceCents: 70000,
        category: "Izgaralar",
        options: [],
      },
      {
        id: "cola-drink",
        name: "Kola",
        description: "Soğuk kutu içecek.",
        image: foodPhoto("photo-1513558161293-cdaf765edfd7"),
        priceCents: 5000,
        category: "İçecekler",
        options: [],
      },
    ],
  },
  {
    id: "demo-pizza",
    slug: "doybi-pizza",
    name: "DOYBİ Pizza",
    description: "İncecik hamur, bol malzeme ve fırından yeni çıktı.",
    cuisine: "Pizza · İtalyan",
    image: foodPhoto("photo-1579751626657-72bc17010498"),
    rating: 4.7,
    deliveryMinutes: 25,
    minimumOrderCents: 20000,
    status: "OPEN",
    manuallyClosed: false,
    operatingHours: { opensAt: "11:00", closesAt: "23:30" },
    deliveryZones: [
      { neighborhood: "Yüzüncü Yıl", deliveryFeeCents: 1200 },
      { neighborhood: "Altınova", deliveryFeeCents: 1800 },
      { neighborhood: "Ertuğrul", deliveryFeeCents: 1500 },
      { neighborhood: "Hürriyet", deliveryFeeCents: 1500 },
    ],
    categories: [{ id: "pizza", name: "Pizzalar" }],
    paymentMethods: ["CASH_ON_DELIVERY"],
    campaign: "Demo menü",
    menu: [
      {
        id: "margherita",
        name: "Margherita",
        description: "Domates sosu, mozzarella ve fesleğen.",
        image: foodPhoto("photo-1579751626657-72bc17010498"),
        priceCents: 26000,
        category: "Pizzalar",
        options: [
          {
            id: "size",
            name: "Boyut",
            required: true,
            multiple: false,
            choices: [
              { id: "medium", label: "Orta", priceCents: 0 },
              { id: "large", label: "Büyük", priceCents: 10000 },
            ],
          },
        ],
      },
      {
        id: "pepperoni",
        name: "Pepperoni",
        description: "Mozzarella, domates sosu ve pepperoni.",
        image: foodPhoto("photo-1579751626657-72bc17010498"),
        priceCents: 34000,
        category: "Pizzalar",
        options: [],
      },
    ],
  },
  {
    id: "demo-doner",
    slug: "doybi-doner",
    name: "DOYBİ Döner",
    description: "Günlük hazırlanan döner, sıcacık ekmek arasında.",
    cuisine: "Döner · Türk Mutfağı",
    image: foodPhoto("photo-1529006557810-274b9b2fc783"),
    rating: 4.6,
    deliveryMinutes: 35,
    minimumOrderCents: 18000,
    status: "TEMPORARILY_CLOSED",
    manuallyClosed: true,
    operatingHours: { opensAt: "10:00", closesAt: "22:00" },
    deliveryZones: [
      { neighborhood: "Değirmenaltı", deliveryFeeCents: 1000 },
      { neighborhood: "Hürriyet", deliveryFeeCents: 1500 },
      { neighborhood: "Çınarlı", deliveryFeeCents: 2000 },
    ],
    categories: [{ id: "doner", name: "Dönerler" }],
    paymentMethods: ["CASH_ON_DELIVERY", "CARD_ON_DELIVERY"],
    menu: [
      {
        id: "bread-doner",
        name: "Ekmek Arası Döner",
        description: "Taze ekmek, ince kesim döner ve yeşillik.",
        image: foodPhoto("photo-1529006557810-274b9b2fc783"),
        priceCents: 21000,
        category: "Dönerler",
        options: [],
      },
    ],
  },
  {
    id: "demo-burger",
    slug: "doybi-burger",
    name: "DOYBİ Burger",
    description: "Izgara köfte, taze ekmek ve çıtır patates.",
    cuisine: "Burger · Amerikan",
    image: foodPhoto("photo-1568901346375-23c9450c58cd"),
    rating: 4.5,
    deliveryMinutes: 40,
    minimumOrderCents: 30000,
    status: "CLOSED",
    manuallyClosed: false,
    operatingHours: { opensAt: "12:00", closesAt: "22:00" },
    deliveryZones: [
      { neighborhood: "Altınova", deliveryFeeCents: 0 },
      { neighborhood: "Ertuğrul", deliveryFeeCents: 1500 },
      { neighborhood: "Yüzüncü Yıl", deliveryFeeCents: 1000 },
    ],
    categories: [{ id: "burger", name: "Burgerler" }],
    paymentMethods: ["CARD_ON_DELIVERY"],
    menu: [
      {
        id: "classic-burger",
        name: "Klasik Burger",
        description: "Izgara köfte, marul, domates ve burger sosu.",
        image: foodPhoto("photo-1568901346375-23c9450c58cd"),
        priceCents: 32000,
        category: "Burgerler",
        options: [],
      },
    ],
  },
  {
    id: "demo-soup",
    slug: "doybi-corbaci",
    name: "DOYBİ Çorbacı",
    description: "Günün her saatine sıcak ve iç ısıtan çorbalar.",
    cuisine: "Çorba · Ev Yemekleri",
    image: foodPhoto("photo-1547592180-85f173990554"),
    rating: 4.9,
    deliveryMinutes: 20,
    minimumOrderCents: 15000,
    status: "HIDDEN",
    manuallyClosed: false,
    operatingHours: { opensAt: "00:00", closesAt: "23:59" },
    deliveryZones: [{ neighborhood: "Hürriyet", deliveryFeeCents: 900 }],
    categories: [{ id: "soup", name: "Çorbalar" }],
    paymentMethods: ["CASH_ON_DELIVERY"],
    menu: [],
  },
];

export const restaurantBySlug = (slug: string) =>
  restaurants.find((restaurant) => restaurant.slug === slug);

export const restaurantById = (id: string) =>
  restaurants.find((restaurant) => restaurant.id === id);

export function getRestaurantStatus(restaurant: Restaurant, now = new Date()) {
  if (restaurant.status === "HIDDEN") return "HIDDEN";
  if (restaurant.status === "TEMPORARILY_CLOSED" || restaurant.manuallyClosed) {
    return "TEMPORARILY_CLOSED";
  }
  if (restaurant.status === "CLOSED") return "CLOSED";

  const [openHour, openMinute] = restaurant.operatingHours.opensAt.split(":").map(Number);
  const [closeHour, closeMinute] = restaurant.operatingHours.closesAt.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const opens = openHour * 60 + openMinute;
  const closes = closeHour * 60 + closeMinute;
  const isOpen = closes < opens ? current >= opens || current < closes : current >= opens && current < closes;
  return isOpen ? "OPEN" : "CLOSED";
}

export function getDeliveryZone(restaurant: Restaurant, neighborhood: string) {
  return restaurant.deliveryZones.find((zone) => zone.neighborhood === neighborhood);
}
