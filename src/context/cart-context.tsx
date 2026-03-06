"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productCatalog } from "@/data/products";

export type CartEntry = {
  productId: string;
  flavor: string;
  qty: number;
};

type CartContextValue = {
  entries: CartEntry[];
  totalItems: number;
  subtotal: number;
  addItem: (entry: CartEntry) => void;
  setItemQty: (productId: string, flavor: string, qty: number) => void;
  removeItem: (productId: string, flavor: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "patsam-cart-v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartEntry[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          typeof item.productId === "string" &&
          typeof item.flavor === "string" &&
          typeof item.qty === "number"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const totalItems = useMemo(
    () => entries.reduce((sum, item) => sum + Math.max(0, item.qty), 0),
    [entries]
  );

  const subtotal = useMemo(() => {
    return entries.reduce((sum, item) => {
      const product = productCatalog.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.qty;
    }, 0);
  }, [entries]);

  const addItem = (entry: CartEntry) => {
    const safeQty = Math.max(1, Math.min(30, entry.qty));
    setEntries((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.productId === entry.productId && item.flavor === entry.flavor
      );
      if (idx === -1) {
        return [...prev, { ...entry, qty: safeQty }];
      }
      return prev.map((item, index) =>
        index === idx ? { ...item, qty: Math.min(99, item.qty + safeQty) } : item
      );
    });
  };

  const setItemQty = (productId: string, flavor: string, qty: number) => {
    setEntries((prev) => {
      if (qty <= 0) {
        return prev.filter(
          (item) => !(item.productId === productId && item.flavor === flavor)
        );
      }
      return prev.map((item) =>
        item.productId === productId && item.flavor === flavor
          ? { ...item, qty: Math.min(99, qty) }
          : item
      );
    });
  };

  const removeItem = (productId: string, flavor: string) => {
    setEntries((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.flavor === flavor)
      )
    );
  };

  const clearCart = () => setEntries([]);

  const value: CartContextValue = {
    entries,
    totalItems,
    subtotal,
    addItem,
    setItemQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
