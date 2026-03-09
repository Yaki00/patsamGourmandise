"use client";

import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, Product, productCatalog } from "@/data/products";
import { SiteHeader } from "@/components/site-header";

const catalog = productCatalog;
const carouselProducts = [...catalog, ...catalog];
const bestSellerProducts = [catalog[0], catalog[6], catalog[1]].filter(
  (item): item is (typeof catalog)[number] => Boolean(item)
);
const reviews = [
  {
    id: "avis-1",
    name: "Ines B.",
    text: "Layer cake incroyable, visuel magnifique et gout ultra frais. Toute la famille a valide.",
    rating: 5,
    city: "Houilles",
  },
  {
    id: "avis-2",
    name: "Sabrina M.",
    text: "Commande simple, livraison rapide et produits conformes aux photos. Je recommande a 100%.",
    rating: 5,
    city: "Nanterre",
  },
  {
    id: "avis-3",
    name: "Yassine K.",
    text: "Les trompe-l'oeil sont bluffants. Service tres pro et super communication avant la livraison.",
    rating: 5,
    city: "Bezons",
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const deliveryLabel = useMemo(() => {
    if (!selectedProduct) return "";
    return selectedProduct.category === "Trompe-l'oeil"
      ? "Delai de livraison : J+1"
      : "Delai de livraison : Jour meme";
  }, [selectedProduct]);

  useEffect(() => {
    const layerItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax-layer]")
    );
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".animate-reveal")
    );
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const scrollItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-speed]")
    );

    const moveLayers = (clientX: number, clientY: number) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

      layerItems.forEach((item) => {
        const depth = Number(item.dataset.depth ?? "0.1");
        const moveX = x * depth * 42;
        const moveY = y * depth * 42;
        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    };

    let scrollRaf = 0;
    const onPointerMove = (event: PointerEvent) => {
      moveLayers(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      layerItems.forEach((item) => {
        item.style.transform = "translate3d(0, 0, 0)";
      });
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const canUseScrollParallax = window.innerWidth >= 1024;
        scrollItems.forEach((item) => {
          if (!canUseScrollParallax) {
            item.style.transform = "translate3d(0, 0, 0)";
            return;
          }
          const speed = Number(item.dataset.scrollSpeed ?? "0.08");
          item.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        });
        scrollRaf = 0;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
    hero?.addEventListener("pointermove", onPointerMove);
    hero?.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      hero?.removeEventListener("pointermove", onPointerMove);
      hero?.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) {
        window.cancelAnimationFrame(scrollRaf);
      }
    };
  }, []);

  useEffect(() => {
    if (!isProductModalOpen) return;
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProductModalOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isProductModalOpen]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const onCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    product: Product
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(product);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip pb-10">
      <div className="sugar-grain" />
      <div className="pointer-events-none fixed -top-40 -left-24 -z-10 h-96 w-96 rounded-full bg-[#ff8ccd]/30 blur-[85px]" />
      <div className="pointer-events-none fixed -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#8decc3]/30 blur-[95px]" />

      <SiteHeader currentPage="home" />

      <main className="mx-auto w-[min(1200px,94%)] sm:w-[min(1200px,92%)]">
        <section
          data-hero
          className="grid min-h-[74vh] items-center gap-6 py-8 sm:gap-10 sm:py-14 lg:min-h-[88vh] lg:grid-cols-[1fr_1.05fr]"
        >
          <div className="animate-reveal">
            <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
              Boutique de patisserie en ligne
            </p>
            <h1 className="text-4xl leading-[0.96] font-black tracking-tight text-[#4f3340] sm:text-6xl lg:text-7xl">
              Ultra
              <span className="bg-gradient-to-r from-[#ff72b6] to-[#ff9d74] bg-clip-text text-transparent">
                {" "}
                Gourmand
              </span>
              <br />
              et visuellement
              <br />
              irresistible.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#775766] sm:text-lg">
              Cookies, trompe-l&apos;oeil et creations premium avec une
              experience tres visuelle, animee et memorable.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#6f4f5e]">
              <span className="glass rounded-full px-3 py-1.5">
                Livraison rapide
              </span>
              <span className="glass rounded-full px-3 py-1.5">
                Houilles (78) et alentours
              </span>
              <span className="glass rounded-full px-3 py-1.5">Fait maison</span>
              <span className="glass rounded-full px-3 py-1.5">
                Personnalisation complete
              </span>
            </div>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/commander"
                className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 text-center font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] transition hover:-translate-y-0.5"
              >
                Commander maintenant
              </Link>
              <a
                href="#best"
                className="glass rounded-full px-6 py-3 text-center font-bold text-[#6d4d5a]"
              >
                Top ventes
              </a>
            </div>
          </div>

          <div className="hero-card glass relative min-h-[22rem] overflow-hidden rounded-[1.5rem] sm:min-h-[30rem] sm:rounded-[2rem] lg:min-h-[34rem]">
            <Image
              src={catalog[6]?.image ?? catalog[0].image}
              alt="Layer cake signature"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f1f2a]/45 via-transparent to-transparent" />
            <span
              data-parallax-layer
              data-depth="0.2"
              className="absolute top-6 left-6 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#ff5cab]"
            >
              NOUVEAUTE
            </span>
            <span
              data-parallax-layer
              data-depth="0.12"
              className="absolute top-1/2 right-6 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#664650]"
            >
              100% artisanal premium
            </span>
            <div
              data-parallax-layer
              data-depth="0.1"
              className="glass absolute right-6 bottom-6 flex w-36 items-center gap-2 rounded-2xl p-2"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                <Image
                  src={catalog[1]?.image ?? catalog[0].image}
                  alt="Trompe-l'oeil artisanal"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#7f5e6d] uppercase">
                  Cookie
                </p>
                <p className="text-sm font-black text-[#4f3340]">5,90 EUR</p>
              </div>
            </div>
            <div
              data-parallax-layer
              data-depth="0.18"
              className="absolute top-[14%] right-[10%] h-24 w-24 rounded-full border border-white/70 bg-[#ff82c3]/30 blur-[2px]"
            />
            <div
              data-parallax-layer
              data-depth="0.25"
              className="absolute top-[24%] left-[6%] h-12 w-12 rounded-full bg-[#ffe291]/70"
            />
          </div>
        </section>

        <section className="animate-reveal py-2">
          <div className="home-location-banner">
            <p>
              Zone de livraison : <strong>Houilles (78)</strong> et ses alentours.
            </p>
            <p>Retrait et livraison rapide sur reservation.</p>
          </div>
        </section>

        <section id="collections" className="py-8 sm:py-10">
          <div className="animate-reveal mb-7">
            <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
              Collections
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
              Gateaux et cookies en vitrine
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalog.map((item) => (
              <article
                key={item.name}
                role="button"
                tabIndex={0}
                onClick={() => openProductModal(item)}
                onKeyDown={(event) => onCardKeyDown(event, item)}
                className={`animate-reveal glass group rounded-3xl p-4 shadow-[0_18px_45px_rgba(248,154,194,.14)] transition hover:-translate-y-1 ${
                  item.category === "Box"
                    ? "ring-1 ring-[#ff8fc9]/55 shadow-[0_20px_50px_rgba(255,114,182,.26)]"
                    : ""
                } cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ff8fc9] focus-visible:outline-none`}
              >
                <div className="relative mb-4 h-52 overflow-hidden rounded-2xl sm:h-56">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-[#6d4d5a]">
                    {item.tag}
                  </span>
                  <p className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-sm font-black text-[#4f3340]">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <h3 className="text-xl font-extrabold text-[#553a46]">
                  {item.name}
                </h3>
                <p className="mt-2 text-[#765968]">{item.description}</p>
                <Link
                  href={`/commander?product=${encodeURIComponent(item.id)}`}
                  onClick={(event) => event.stopPropagation()}
                  className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
                >
                  Commander
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="best" className="grid items-stretch gap-5 py-8 sm:py-10 lg:grid-cols-[1.08fr_.92fr]">
          <div className="animate-reveal relative min-h-[20rem] overflow-hidden rounded-[1.4rem] sm:min-h-[26rem] sm:rounded-[1.8rem]">
            <Image
              src={catalog[6]?.image ?? catalog[0].image}
              alt="Selection premium Patsam Gourmandise"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1621]/55 via-transparent to-transparent" />
            <p className="absolute left-4 bottom-16 text-2xl leading-none font-black text-white sm:left-6 sm:bottom-20 sm:text-4xl">
              Saveurs intenses
              <br />
              textures parfaites
            </p>
            <div className="absolute right-4 bottom-4 flex flex-wrap justify-end gap-2 sm:right-6">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#5d3f4d]">
                Frais du jour
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#5d3f4d]">
                Livraison rapide
              </span>
            </div>
          </div>

          <div className="animate-reveal glass rounded-[1.4rem] p-4 sm:rounded-[1.8rem] sm:p-6">
            <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
              Best-sellers
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-4xl">
              Les favoris qui partent en premier
            </h2>
            <p className="mt-2 text-[#735665]">
              Une selection ultra demandee cette semaine, prete a etre personnalisee.
            </p>
            <div className="mt-5 space-y-3">
              {bestSellerProducts.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/70 bg-white/60 p-3 shadow-[0_10px_24px_rgba(245,141,189,.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-extrabold text-[#563845]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#735665]">{item.description}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-black text-[#4f3340]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#ffe4f1] px-3 py-1 text-xs font-extrabold text-[#9b4f79]">
                      {item.tag}
                    </span>
                    <span className="text-xs font-semibold text-[#7d5d6d]">{item.category}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
              <Link
                href="/commander"
                className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 text-center font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] transition hover:-translate-y-0.5"
              >
                Commander ces best-sellers
              </Link>
              <a
                href="#collections"
                className="glass rounded-full px-5 py-3 text-center text-sm font-bold text-[#6d4d5a]"
              >
                Voir tout le catalogue
              </a>
            </div>
          </div>
        </section>

        <section className="animate-reveal py-8 sm:py-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
                Feed gourmand
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-4xl">
                Nos creations gourmandes
              </h2>
            </div>
            <a href="#collections" className="text-sm font-bold text-[#f24ea5]">
              Voir tout
            </a>
          </div>

          <div className="marquee-wrap">
            <div className="marquee-track">
              {carouselProducts.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl md:h-52 md:w-80"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="marquee-item-label">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="avis" className="py-8 sm:py-10">
          <div className="animate-reveal mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
                Avis clients
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
                Ils ont deja commande
              </h2>
            </div>
            <div className="rounded-2xl bg-white/75 px-4 py-3 text-sm text-[#6c4b59] shadow-[0_10px_24px_rgba(245,141,189,.12)]">
              <p className="font-black text-[#4f3340]">4.9 / 5</p>
              <p className="font-semibold">Base sur les retours clients</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="animate-reveal glass rounded-3xl p-5 shadow-[0_18px_45px_rgba(248,154,194,.14)]"
              >
                <p className="text-base leading-relaxed text-[#5e434f]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-[#553a46]">{review.name}</p>
                    <p className="text-xs font-semibold text-[#7b5d6c]">{review.city}</p>
                  </div>
                  <p className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-black text-[#a34d74]">
                    {"★".repeat(review.rating)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="histoire" className="animate-reveal py-12 text-center sm:py-16">
          <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
            Notre histoire
          </p>
          <h2 className="mx-auto max-w-4xl text-3xl leading-tight font-black tracking-tight text-[#4f3340] sm:text-5xl">
            Patsam Gourmandise transforme chaque commande en experience waouh.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[#785a68] sm:text-lg">
            Atelier artisanal, direction artistique forte et exigence premium.
            Un univers de marque fort, bien au-dela d&apos;une simple page catalogue.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/livraison"
              className="glass rounded-full px-5 py-2.5 text-sm font-bold text-[#6d4d5a]"
            >
              Infos livraison
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </main>

      {isProductModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/45 p-2 sm:p-4"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="glass w-full max-w-2xl rounded-[1.4rem] bg-white/88 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
                  Details produit
                </p>
                <h2 className="text-3xl font-black text-[#4f3340]">
                  {selectedProduct.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#734d5f]"
              >
                Fermer
              </button>
            </div>

            <p className="text-sm text-[#6f515f]">{selectedProduct.description}</p>

            <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[#654755]">
              <p className="font-semibold">{deliveryLabel}</p>
              <p className="mt-2 font-bold text-[#725161]">Allergenes</p>
              <p>{selectedProduct.allergens.join(", ")}</p>
              <p className="mt-2 font-bold text-[#725161]">Gouts disponibles</p>
              <p>{selectedProduct.flavors.join(", ")}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/commander?product=${encodeURIComponent(selectedProduct.id)}`}
                className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
              >
                Commander
              </Link>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="glass rounded-full px-5 py-2.5 text-sm font-bold text-[#6d4d5a]"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
