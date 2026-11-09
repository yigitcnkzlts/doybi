export type RestaurantStatus = "OPEN" | "CLOSED" | "TEMPORARILY_CLOSED" | "HIDDEN";
export type OrderStatus =
  | "CREATED"
  | "RESTAURANT_CONFIRMED"
  | "PREPARING"
  | "WITH_COURIER"
  | "DELIVERED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "CARD_ON_DELIVERY";

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type CustomerAddress = {
  id: string;
  city: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  directions: string;
};

export type RestaurantOperatingHours = {
  opensAt: string;
  closesAt: string;
};

export type RestaurantDeliveryZone = {
  neighborhood: string;
  deliveryFeeCents: number;
};

export type MenuItemOption = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  choices: {
    id: string;
    label: string;
    priceCents: number;
  }[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  priceCents: number;
  category: string;
  options: MenuItemOption[];
};

export type MenuCategory = {
  id: string;
  name: string;
};

export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  description: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryMinutes: number;
  minimumOrderCents: number;
  status: RestaurantStatus;
  manuallyClosed: boolean;
  operatingHours: RestaurantOperatingHours;
  deliveryZones: RestaurantDeliveryZone[];
  categories: MenuCategory[];
  menu: MenuItem[];
  paymentMethods: PaymentMethod[];
  campaign?: string;
};

export type SelectedMenuOption = {
  groupId: string;
  groupName: string;
  choiceId: string;
  name: string;
  priceCents: number;
};

export type CartItem = {
  id: string;
  restaurantId: string;
  menuItemId: string;
  name: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  options: SelectedMenuOption[];
  note: string;
};

export type Cart = {
  restaurantId: string | null;
  items: CartItem[];
};

export type OrderItem = CartItem;

export type Order = {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  address: CustomerAddress;
  phone: string;
  note: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  isDemo: true;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
};
