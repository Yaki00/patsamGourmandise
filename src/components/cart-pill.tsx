"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/cart-context";

export function CartPill() {
  const { totalItems, subtotal } = useCart();
  const hasItems = totalItems > 0;
  const ref = useRef<HTMLAnchorElement>(null);

  // Rebond quand un produit arrive dans le panier.
  useEffect(() => {
    const bump = () => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove("cart-bump");
      void el.offsetWidth;
      el.classList.add("cart-bump");
    };
    window.addEventListener("cart:bump", bump);
    return () => window.removeEventListener("cart:bump", bump);
  }, []);

  return (
    <Link
      ref={ref}
      href="/checkout"
      data-cart-target
      className={`inline-flex h-11 items-center gap-2 rounded-full pr-4 pl-1.5 text-[0.95rem] font-bold transition-colors duration-300 ${
        hasItems
          ? "bg-framboise text-white hover:bg-framboise-deep"
          : "bg-ganache text-chantilly hover:bg-cacao"
      }`}
      aria-label={`Panier : ${totalItems} article(s), ${formatPrice(subtotal)}`}
    >
      <span
        className={`relative inline-flex h-8 min-w-8 items-center justify-center overflow-hidden rounded-full px-1.5 text-sm ${
          hasItems ? "bg-white text-framboise" : "bg-white/15 text-chantilly"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={totalItems}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {totalItems}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="tabular-nums">
        {hasItems ? formatPrice(subtotal) : "Panier"}
      </span>
    </Link>
  );
}
