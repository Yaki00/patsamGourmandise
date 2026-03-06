"use client";

import Link from "next/link";
import { CartPill } from "@/components/cart-pill";

type SiteHeaderProps = {
  currentPage?: "home" | "commander" | "livraison" | "contact" | "checkout";
};

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const isActive = (page: SiteHeaderProps["currentPage"]) =>
    currentPage === page ? "text-[#f24ea5]" : "hover:text-[#f24ea5]";

  return (
    <header className="glass sticky top-4 z-40 mx-auto mt-4 flex w-[min(1200px,92%)] items-center justify-between gap-2 rounded-full px-3 py-2 shadow-[0_10px_30px_rgba(255,114,182,.15)] sm:gap-3 sm:px-4 sm:py-3">
      <Link href="/" className="text-base font-extrabold tracking-tight text-[#f24ea5] sm:text-lg">
        Patsam Gourmandise
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold text-[#714f5d] md:flex">
        <Link href="/" className={`transition ${isActive("home")}`}>
          Accueil
        </Link>
        <Link href="/#collections" className="transition hover:text-[#f24ea5]">
          Collections
        </Link>
        <Link href="/#best" className="transition hover:text-[#f24ea5]">
          Best-sellers
        </Link>
        <Link href="/livraison" className={`transition ${isActive("livraison")}`}>
          Livraison
        </Link>
        <Link href="/contact" className={`transition ${isActive("contact")}`}>
          Contact
        </Link>
      </nav>

      <Link
        href="/commander"
        className={`hidden min-h-11 items-center rounded-full px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)] transition hover:-translate-y-0.5 sm:inline-flex ${
          currentPage === "commander"
            ? "bg-gradient-to-r from-[#f25ea8] to-[#ff8f72]"
            : "bg-gradient-to-r from-[#ff72b6] to-[#ffa183]"
        }`}
      >
        Commander
      </Link>

      <CartPill />
    </header>
  );
}
