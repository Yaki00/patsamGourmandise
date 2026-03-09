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
    getServerSnapshot
  );
  const { totalItems, subtotal } = useCart();
  const safeTotalItems = isHydrated ? totalItems : 0;
  const safeSubtotal = isHydrated ? subtotal : 0;

  return (
    <Link
      href="/checkout"
      className="glass inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-bold text-[#6e4e5d] sm:gap-2 sm:px-3"
    >
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff72b6] px-1 text-[10px] text-white">
        {safeTotalItems}
      </span>
      <span className="hidden sm:inline">Panier</span>
      <span className="text-[#4f3340] sm:hidden">
        {safeTotalItems}
      </span>
      <span className="hidden text-[#4f3340] sm:inline">
        {formatPrice(safeSubtotal)}
      </span>
    </Link>
  );
}
