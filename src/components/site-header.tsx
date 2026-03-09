"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartPill } from "@/components/cart-pill";

type SiteHeaderProps = {
  currentPage?: "home" | "commander" | "livraison" | "contact" | "checkout";
};

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (page: SiteHeaderProps["currentPage"]) =>
    currentPage === page ? "text-[#f24ea5]" : "hover:text-[#f24ea5]";

  useEffect(() => {
    if (!menuOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="glass sticky top-3 z-40 mx-auto mt-3 flex w-[min(1200px,94%)] items-center justify-between gap-2 rounded-2xl px-2.5 py-2 shadow-[0_10px_30px_rgba(255,114,182,.15)] sm:top-4 sm:mt-4 sm:w-[min(1200px,92%)] sm:gap-3 sm:rounded-full sm:px-4 sm:py-3">
        <Link
          href="/"
          className="max-w-[170px] truncate text-sm font-extrabold tracking-tight text-[#f24ea5] sm:max-w-none sm:text-lg"
        >
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <CartPill />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6d4d5a] md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
          >
            <span className="relative block h-4 w-5">
              <span className="absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute top-3 left-0 h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-black/35"
            onClick={closeMenu}
          />
          <aside
            id="mobile-site-menu"
            className="glass absolute top-0 right-0 h-full w-[min(86vw,360px)] border-l border-white/75 p-5 shadow-[-8px_0_30px_rgba(70,33,51,.2)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-base font-black text-[#5d3f4d]">Menu</p>
              <button
                type="button"
                onClick={closeMenu}
                className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#734d5f]"
              >
                Fermer
              </button>
            </div>

            <nav className="grid gap-2 text-sm font-semibold text-[#6b4c5a]">
              <Link href="/" onClick={closeMenu} className={`rounded-xl bg-white/75 px-4 py-3 ${isActive("home")}`}>
                Accueil
              </Link>
              <Link
                href="/#collections"
                onClick={closeMenu}
                className="rounded-xl bg-white/75 px-4 py-3 hover:text-[#f24ea5]"
              >
                Collections
              </Link>
              <Link
                href="/#best"
                onClick={closeMenu}
                className="rounded-xl bg-white/75 px-4 py-3 hover:text-[#f24ea5]"
              >
                Best-sellers
              </Link>
              <Link
                href="/commander"
                onClick={closeMenu}
                className={`rounded-xl bg-white/75 px-4 py-3 ${isActive("commander")}`}
              >
                Commander
              </Link>
              <Link
                href="/livraison"
                onClick={closeMenu}
                className={`rounded-xl bg-white/75 px-4 py-3 ${isActive("livraison")}`}
              >
                Livraison
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className={`rounded-xl bg-white/75 px-4 py-3 ${isActive("contact")}`}
              >
                Contact
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
