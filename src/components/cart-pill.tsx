"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/cart-context";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function CartPill() {
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { totalItems, subtotal } = useCart();
  const safeTotalItems = isHydrated ? totalItems : 0;
  const safeSubtotal = isHydrated ? subtotal : 0;
  const hasItems = safeTotalItems > 0;

  return (
    <Link
      href="/checkout"
      className={`inline-flex h-11 items-center gap-2 rounded-full pr-4 pl-1.5 text-[0.95rem] font-bold transition ${
        hasItems
          ? "bg-framboise text-white hover:bg-framboise-deep"
          : "bg-ganache text-chantilly hover:bg-cacao"
      }`}
      aria-label={`Panier : ${safeTotalItems} article(s), ${formatPrice(safeSubtotal)}`}
    >
      <span
        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 text-sm ${
          hasItems ? "bg-white text-framboise" : "bg-white/15 text-chantilly"
        }`}
      >
        {safeTotalItems}
      </span>
      <span className="tabular-nums">
        {hasItems ? formatPrice(safeSubtotal) : "Panier"}
      </span>
    </Link>
  );
}
