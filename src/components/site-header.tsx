"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartPill } from "@/components/cart-pill";

type SiteHeaderProps = {
  currentPage?: "home" | "commander" | "livraison" | "contact" | "checkout";
};

const navLinks: {
  href: string;
  label: string;
  page?: SiteHeaderProps["currentPage"];
}[] = [
  { href: "/#vitrine", label: "La vitrine" },
  { href: "/commander", label: "Commander", page: "commander" },
  { href: "/livraison", label: "Livraison", page: "livraison" },
  { href: "/contact", label: "Contact", page: "contact" },
];

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className="sticky top-3 z-40 mx-auto mt-3 flex w-[min(1200px,94%)] items-center justify-between gap-3 rounded-full bg-chantilly/95 py-2 pr-2 pl-5 shadow-[0_12px_30px_-18px_rgba(59,29,23,.45)] backdrop-blur sm:top-4 sm:mt-4 sm:w-[min(1200px,92%)] sm:pl-6">
        <Link
          href="/"
          className="font-display truncate text-xl leading-none text-framboise sm:text-2xl"
          aria-label="Patsam Gourmandise, accueil"
        >
          Patsam
          <span className="hidden sm:inline"> Gourmandise</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => {
            const active = link.page && currentPage === link.page;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.95rem] font-semibold transition ${
                  active
                    ? "bg-framboise-soft text-framboise-deep"
                    : "text-ganache hover:bg-lait-fraise"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CartPill />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lait-fraise text-ganache md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
          >
            <span className="relative block h-3.5 w-5">
              <span className="absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current" />
              <span className="absolute top-3 left-0 h-0.5 w-3 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Fermer le menu"
            className="dialog-backdrop absolute inset-0"
            onClick={closeMenu}
          />
          <aside
            id="mobile-site-menu"
            className="dialog-panel absolute inset-x-3 top-3 rounded-[1.75rem] bg-chantilly p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl text-framboise">Patsam</p>
              <button
                type="button"
                onClick={closeMenu}
                className="btn btn-soft btn-sm"
              >
                Fermer
              </button>
            </div>

            <nav className="grid" aria-label="Navigation mobile">
              {[
                { href: "/", label: "Accueil", page: "home" as const },
                ...navLinks,
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={
                    link.page && currentPage === link.page ? "page" : undefined
                  }
                  className="font-display border-b border-line py-3 text-3xl text-ganache last:border-0 aria-[current=page]:text-framboise"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
