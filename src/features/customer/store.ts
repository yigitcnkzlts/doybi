"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CustomerAddress, Order, PaymentMethod } from "@/types/customer";

type CustomerState = {
  address: CustomerAddress | null;
  cart: CartItem[];
  cartRestaurantId: string | null;
  orders: Order[];
  setAddress: (address: CustomerAddress) => void;
  addItem: (item: CartItem) => boolean;
  replaceCartWith: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeDemoOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "isDemo">) => string;
  advanceDemoOrder: (orderId: string) => void;
};

const orderStatuses: Order["status"][] = [
  "CREATED",
  "RESTAURANT_CONFIRMED",
  "PREPARING",
  "WITH_COURIER",
  "DELIVERED",
];

const paymentMethodGuard = (method: PaymentMethod) => method;

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      address: null,
      cart: [],
      cartRestaurantId: null,
      orders: [],
      setAddress: (address) => set({ address }),
      addItem: (item) => {
        const { cart, cartRestaurantId } = get();
        if (cartRestaurantId && cartRestaurantId !== item.restaurantId) return false;
        const existing = cart.find(
          (line) =>
            line.menuItemId === item.menuItemId &&
            line.note === item.note &&
            JSON.stringify(line.options) === JSON.stringify(item.options),
        );
        if (existing) {
          set({
            cart: cart.map((line) =>
              line.id === existing.id ? { ...line, quantity: line.quantity + item.quantity } : line,
            ),
          });
        } else {
          set({ cart: [...cart, item], cartRestaurantId: item.restaurantId });
        }
        return true;
      },
      replaceCartWith: (item) => set({ cart: [item], cartRestaurantId: item.restaurantId }),
      removeItem: (itemId) =>
        set((state) => {
          const cart = state.cart.filter((item) => item.id !== itemId);
          return { cart, cartRestaurantId: cart.length ? state.cartRestaurantId : null };
        }),
      setQuantity: (itemId, quantity) =>
        set((state) => {
          const cart =
            quantity <= 0
              ? state.cart.filter((item) => item.id !== itemId)
              : state.cart.map((item) => (item.id === itemId ? { ...item, quantity } : item));
          return { cart, cartRestaurantId: cart.length ? state.cartRestaurantId : null };
        }),
      clearCart: () => set({ cart: [], cartRestaurantId: null }),
      placeDemoOrder: (order) => {
        const id = `DEMO-${Date.now().toString().slice(-6)}`;
        const completedOrder: Order = {
          ...order,
          id,
          createdAt: new Date().toISOString(),
          status: orderStatuses[0],
          isDemo: true,
          paymentMethod: paymentMethodGuard(order.paymentMethod),
        };
        set((state) => ({ orders: [completedOrder, ...state.orders], cart: [], cartRestaurantId: null }));
        return id;
      },
      advanceDemoOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const index = orderStatuses.indexOf(order.status);
            return { ...order, status: orderStatuses[Math.min(index + 1, orderStatuses.length - 1)] };
          }),
        })),
    }),
    {
      name: "doybi-customer-demo",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        address: state.address,
        cart: state.cart,
        cartRestaurantId: state.cartRestaurantId,
        orders: state.orders,
      }),
    },
  ),
);
