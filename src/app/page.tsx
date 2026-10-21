"use client";

import { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  formatPrice,
  getDeliveryDelay,
  Product,
  productCatalog,
} from "@/data/products";
import { SiteHeader } from "@/components/site-header";

const catalog = productCatalog;
const heroProduct =
  catalog.find((item) => item.id === "layer-cake-signature") ?? catalog[0];
const heroSideProduct =
  catalog.find((item) => item.id === "cookie-triple-choco") ?? catalog[0];
const bestSellerProducts = [
  "cookie-triple-choco",
  "layer-cake-signature",
  "trompe-loeil-framboise",
]
  .map((id) => catalog.find((item) => item.id === id))
  .filter((item): item is Product => Boolean(item));
// Mis en avant sur 2 colonnes quand tout le catalogue est affiché.
const featuredIds = ["trompe-loeil-framboise", "layer-cake-signature"];
const categories = [
  "Tout",
  ...Array.from(new Set(catalog.map((item) => item.category))),
];

const reviews = [
  {
    id: "avis-1",
    name: "Inès B.",
    text: "Layer cake incroyable, visuel magnifique et goût ultra frais. Toute la famille a validé.",
    city: "Houilles",
  },
  {
    id: "avis-2",
    name: "Sabrina M.",
    text: "Commande simple, livraison rapide et produits conformes aux photos. Je recommande à 100 %.",
    city: "Nanterre",
  },
  {
    id: "avis-3",
    name: "Yassine K.",
    text: "Les trompe-l'œil sont bluffants. Service très pro et super communication avant la livraison.",
    city: "Bezons",
  },
];

const steps = [
  {
    title: "Choisissez vos douceurs",
    text: "Parfums, quantités, box à composer : tout se règle depuis la page Commander.",
  },
  {
    title: "Réservez un créneau",
    text: "Livraison ou retrait à l'atelier, du matin au soir. Les trompe-l'œil se réservent la veille.",
  },
  {
    title: "On sonne chez vous",
    text: "Préparé le jour même, livré frais dans un rayon de 50 km autour de Houilles.",
  },
];

const bandStyle = (color: string) => ({ "--band": color }) as CSSProperties;

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("Tout");

  const visibleProducts =
    category === "Tout"
      ? catalog
      : catalog.filter((item) => item.category === category);

  useEffect(() => {
    if (!selectedProduct) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedProduct]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="home" />

      <main>
        {/* Hero */}
        <section className="mx-auto grid w-[min(1200px,92%)] items-center gap-12 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-20 lg:pb-28">
          <div className="hero-in">
            <p className="note">
              <span className="note-dot" aria-hidden="true">
                ✦
              </span>
              Pâtisserie maison à Houilles (78)
            </p>
            <h1 className="display-xl mt-6">
              Gourmand jusqu&apos;à la dernière miette.
            </h1>
            <p className="lede mt-6">
              Cookies XXL, trompe-l&apos;œil bluffants et layer cakes à étages,
              préparés à l&apos;atelier et livrés chez vous le jour même.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/commander" className="btn btn-primary">
                Commander
              </Link>
              <a href="#vitrine" className="btn btn-outline">
                Voir la vitrine
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="hero-photo-in scallop-frame relative aspect-square bg-framboise-soft">
              <Image
                src={heroProduct.image}
                alt={`${heroProduct.name}, gâteau à étages garni de fruits rouges`}
                fill
                priority
                sizes="(min-width: 1024px) 34rem, 92vw"
                className="object-cover"
              />
            </div>

            <div className="hero-photo-in scallop-frame absolute -bottom-6 -left-4 aspect-square w-[34%] bg-pistache p-[7%] sm:-left-10">
              <div className="scallop-frame relative h-full w-full">
                <Image
                  src={heroSideProduct.image}
                  alt={heroSideProduct.name}
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="sticker sticker-in absolute -top-2 right-0 h-28 w-28 rotate-[10deg] p-3 text-[0.95rem] sm:right-2 sm:h-32 sm:w-32 sm:text-base">
              Livré le jour même
            </p>

            <div className="absolute right-[6%] bottom-[12%] rotate-[-4deg]">
              <p className="price-tag">
                <span className="font-semibold">{heroProduct.name}</span>
                <span className="text-framboise">
                  {formatPrice(heroProduct.price)}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Bande infos */}
        <section
          className="band band-scallop-top band-scallop-bottom text-white"
          style={bandStyle("var(--framboise)")}
          aria-label="Infos livraison"
        >
          <ul className="mx-auto grid w-[min(1200px,92%)] gap-4 py-7 text-center sm:grid-cols-3 sm:gap-6">
            <li>
              <p className="font-display text-2xl">Livraison offerte</p>
              <p className="text-[0.95rem] text-white/85">
                dès 15 € à moins de 15 km
              </p>
            </li>
            <li>
              <p className="font-display text-2xl">Trompe-l&apos;œil à J+1</p>
              <p className="text-[0.95rem] text-white/85">
                le temps de les sculpter
              </p>
            </li>
            <li>
              <p className="font-display text-2xl">Retrait à l&apos;atelier</p>
              <p className="text-[0.95rem] text-white/85">
                sur réservation, à Houilles
              </p>
            </li>
          </ul>
        </section>

        {/* Vitrine */}
        <section
          id="vitrine"
          className="mx-auto w-[min(1200px,92%)] pt-24 pb-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="display-lg">La vitrine</h2>
              <p className="lede mt-3">
                Tout est préparé à la commande. Choisissez le parfum au moment
                d&apos;ajouter au panier.
              </p>
            </div>
            <div
              className="tabs"
              role="group"
              aria-label="Filtrer par catégorie"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="tab"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((item) => {
              const featured =
                category === "Tout" && featuredIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={`vitrine-card ${featured ? "lg:col-span-2" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(item)}
                    className="text-left"
                    aria-label={`Voir le détail : ${item.name}`}
                  >
                    <div
                      className={`vitrine-photo ${featured ? "lg:aspect-[2.43/1]" : ""}`}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes={
                          featured
                            ? "(min-width: 1024px) 790px, (min-width: 640px) 46vw, 92vw"
                            : "(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
                        }
                        className="object-cover"
                      />
                      <span
                        className={`chip absolute top-3 right-3 ${
                          item.category === "Trompe-l'œil" ||
                          item.category === "Box"
                            ? ""
                            : "chip-framboise"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <span className="price-tag absolute bottom-4 left-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="px-3 pt-5">
                      <h3 className="text-xl leading-tight font-extrabold text-ganache">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-[0.98rem] text-cacao">
                        {item.description}
                      </p>
                    </div>
                  </button>
                  <div className="mt-auto flex items-center justify-between gap-3 px-3 pt-5">
                    <p className="text-sm font-semibold text-cacao">
                      {getDeliveryDelay(item)}
                    </p>
                    <Link
                      href={`/commander?product=${encodeURIComponent(item.id)}`}
                      className="btn btn-primary btn-sm"
                    >
                      Commander
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Les plus commandés */}
        <section
          id="best"
          className="mx-auto grid w-[min(1200px,92%)] items-center gap-12 py-16 lg:grid-cols-[.9fr_1.1fr]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[9rem] bg-framboise-soft">
            <Image
              src={heroSideProduct.image}
              alt="Cookies Triple Choco tout juste sortis du four"
              fill
              sizes="(min-width: 1024px) 480px, 92vw"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="display-lg">Les plus commandés</h2>
            <p className="lede mt-3">
              Ce qui part en premier, semaine après semaine.
            </p>
            <ol className="mt-8 grid gap-1">
              {bestSellerProducts.map((item, index) => (
                <li key={item.id}>
                  <Link
                    href={`/commander?product=${encodeURIComponent(item.id)}`}
                    className="group grid grid-cols-[3rem_4.5rem_1fr_auto] items-center gap-4 border-b border-line py-4 sm:grid-cols-[4rem_5rem_1fr_auto]"
                  >
                    <span className="font-display text-5xl leading-none text-framboise sm:text-6xl">
                      {index + 1}
                    </span>
                    <span className="relative aspect-square overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="5rem"
                        className="object-cover"
                      />
                    </span>
                    <span>
                      <span className="block text-lg leading-tight font-extrabold text-ganache group-hover:text-framboise">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-cacao">
                        {item.description}
                      </span>
                    </span>
                    <span className="text-lg font-extrabold tabular-nums text-ganache">
                      {formatPrice(item.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link href="/commander" className="btn btn-primary mt-8">
              Composer ma commande
            </Link>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mx-auto w-[min(1200px,92%)] py-20">
          <h2 className="display-lg max-w-xl">
            Commander, c&apos;est trois étapes.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span
                  className={`scallop-frame font-display grid h-20 w-20 place-items-center text-4xl ${
                    [
                      "bg-mangue text-ganache",
                      "bg-pistache text-pistache-deep",
                      "bg-framboise text-white",
                    ][index]
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-ganache">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm text-cacao">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Avis */}
        <section
          id="avis"
          className="band band-scallop-top band-scallop-bottom mt-10 text-ganache"
          style={bandStyle("var(--chantilly)")}
        >
          <div className="mx-auto w-[min(1200px,92%)] py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="display-lg">Ils en redemandent</h2>
              <p className="text-lg text-cacao">
                <span className="font-display text-4xl text-framboise">
                  4,9
                </span>{" "}
                / 5 sur les retours clients
              </p>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="border-t-2 border-ganache pt-6"
                >
                  <p className="text-mangue" aria-label="5 étoiles sur 5">
                    ★★★★★
                  </p>
                  <blockquote className="mt-3 text-xl leading-snug font-medium">
                    « {review.text} »
                  </blockquote>
                  <figcaption className="mt-5 text-[0.95rem] text-cacao">
                    <span className="font-bold text-ganache">
                      {review.name}
                    </span>
                    , {review.city}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Sur mesure */}
        <section
          id="histoire"
          className="mx-auto w-[min(1200px,92%)] pt-28 pb-8 text-center"
        >
          <h2 className="display-lg mx-auto max-w-3xl">
            Un anniversaire, un baptême, un mariage ?
          </h2>
          <p className="lede mx-auto mt-5">
            On crée le gâteau sur mesure : thème, couleurs, parfums et nombre de
            parts. Dites-nous la date, on s&apos;occupe du reste.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">
              Demander un devis
            </Link>
            <Link href="/livraison" className="btn btn-outline">
              Zones de livraison
            </Link>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div
          className="dialog-backdrop fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto p-3 sm:items-center sm:p-6"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="dialog-panel grid w-full max-w-3xl overflow-hidden rounded-[2rem] bg-chantilly sm:grid-cols-[.9fr_1.1fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(min-width: 640px) 340px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <span className="chip chip-framboise">
                  {selectedProduct.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-soft btn-round"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>
              <h2 id="product-dialog-title" className="display-md mt-3">
                {selectedProduct.name}
              </h2>
              <p className="mt-2 text-cacao">{selectedProduct.description}</p>
              <p className="mt-4 text-2xl font-extrabold tabular-nums">
                {formatPrice(selectedProduct.price)}
              </p>

              <dl className="mt-5 grid gap-4 border-t border-line pt-5 text-[0.95rem]">
                <div>
                  <dt className="font-bold">Parfums</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {selectedProduct.flavors.map((flavor) => (
                      <span
                        key={flavor}
                        className="rounded-full bg-lait-fraise px-3 py-1 text-sm"
                      >
                        {flavor}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">Allergènes</dt>
                  <dd className="text-cacao">
                    {selectedProduct.allergens.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">Délai</dt>
                  <dd className="text-cacao">
                    {getDeliveryDelay(selectedProduct)}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/commander?product=${encodeURIComponent(selectedProduct.id)}`}
                className="btn btn-primary mt-6 w-full"
              >
                Choisir le parfum et commander
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
