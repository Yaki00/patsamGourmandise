"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CartPill } from "@/components/cart-pill";
import { contact } from "@/data/site";

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

const mobileLinks = [
  { href: "/", label: "Accueil", page: "home" as const },
  ...navLinks,
];

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Se cache quand on descend, revient dès qu'on remonte.
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    setHidden(current > 300 && current > previous + 4);
    if (current < previous - 4) setHidden(false);
  });

  useEffect(() => {
    const show = () => setHidden(false);
    window.addEventListener("header:show", show);
    return () => window.removeEventListener("header:show", show);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const activeHref = navLinks.find(
    (link) => link.page && link.page === currentPage,
  )?.href;
  const pillHref = hovered ?? activeHref;

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -90, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -110 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`sticky top-3 z-40 mx-auto mt-3 flex w-[min(1200px,94%)] items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:top-4 sm:mt-4 sm:w-[min(1200px,92%)] sm:pl-6 ${
          scrolled
            ? "bg-chantilly/90 shadow-[0_16px_40px_-20px_rgba(59,29,23,.55)]"
            : "bg-chantilly/70 shadow-[0_10px_30px_-24px_rgba(59,29,23,.4)]"
        }`}
      >
        <Link
          href="/"
          className="group font-display truncate text-xl leading-none text-framboise sm:text-2xl"
          aria-label="Patsam Gourmandise, accueil"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            Patsam
          </span>
          <span className="hidden sm:inline"> Gourmandise</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigation principale"
          onPointerLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => {
            const active = link.page && currentPage === link.page;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onPointerEnter={() => setHovered(link.href)}
                className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors ${
                  active ? "text-framboise-deep" : "text-ganache"
                }`}
              >
                {pillHref === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className={`absolute inset-0 -z-10 rounded-full ${
                      active ? "bg-framboise-soft" : "bg-lait-fraise"
                    }`}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
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
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-framboise px-6 pt-5 pb-8 text-white md:hidden"
            initial={
              reduce ? { opacity: 0 } : { clipPath: "circle(0% at 92% 4%)" }
            }
            animate={
              reduce ? { opacity: 1 } : { clipPath: "circle(150% at 92% 4%)" }
            }
            exit={
              reduce ? { opacity: 0 } : { clipPath: "circle(0% at 92% 4%)" }
            }
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Patsam</p>
              <button
                type="button"
                onClick={closeMenu}
                className="btn btn-sm bg-white text-framboise"
              >
                Fermer
              </button>
            </div>

            <nav className="mt-10 grid" aria-label="Navigation mobile">
              {mobileLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * 0.06,
                    duration: 0.5,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={
                      link.page && currentPage === link.page
                        ? "page"
                        : undefined
                    }
                    className="font-display block border-b border-white/25 py-3 text-[2.6rem] leading-tight aria-[current=page]:text-mangue"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.a
              href={contact.phoneHref}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-auto rounded-[1.5rem] bg-white/12 p-5"
            >
              <span className="block text-sm text-white/80">
                Une question ? Appelez-nous
              </span>
              <span className="text-2xl font-extrabold">
                {contact.phoneLabel}
              </span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
