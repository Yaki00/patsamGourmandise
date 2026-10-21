"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  formatPrice,
  getDeliveryDelay,
  Product,
  productCatalog,
} from "@/data/products";
import { SiteHeader } from "@/components/site-header";
import {
  CircularText,
  CountUp,
  easeOut,
  Magnetic,
  Marquee,
  Reveal,
  SplitWords,
  SprinkleField,
  TiltCard,
} from "@/components/fx";
import { useCart } from "@/context/cart-context";
import { flyToCart, sprinkleBurst } from "@/lib/sprinkles";
import { QtyStepper } from "@/components/qty-stepper";
import {
  Dynamic3DPreview,
  getPackSize,
  getPreviewOverlay,
} from "@/components/product-preview";

const catalog = productCatalog;
const byId = (id: string) =>
  catalog.find((item) => item.id === id) ?? catalog[0];
const heroSlides = [
  "layer-cake-signature",
  "cookie-triple-choco",
  "trompe-loeil-framboise",
  "cheesecake-mango-pop",
].map(byId);
const bestSellerProducts = [
  "cookie-triple-choco",
  "layer-cake-signature",
  "trompe-loeil-framboise",
].map(byId);
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
    tone: "bg-mangue text-ganache",
  },
  {
    title: "Réservez un créneau",
    text: "Livraison ou retrait à l'atelier, du matin au soir. Les trompe-l'œil se réservent la veille.",
    tone: "bg-pistache text-pistache-deep",
  },
  {
    title: "On sonne chez vous",
    text: "Préparé le jour même, livré frais dans un rayon de 50 km autour de Houilles.",
    tone: "bg-framboise text-white",
  },
];

const ribbonA = [
  "Livraison offerte dès 15 €",
  "Fait maison à Houilles",
  "Livré le jour même",
  "Retrait à l'atelier",
];
const ribbonB = [
  "Cookies XXL",
  "Trompe-l'œil à J+1",
  "Layer cakes",
  "Box à composer",
  "Sur mesure",
];

const storyText =
  "Un anniversaire, un baptême, un mariage ? On imagine le gâteau avec vous : thème, couleurs, parfums, nombre de parts. Vous donnez la date, on s'occupe du reste.";

const bandStyle = (color: string) => ({ "--band": color }) as CSSProperties;

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!selectedProduct) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedProduct]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="home" />

      <LayoutGroup>
        <main>
          <Hero />
          <RibbonCross />
          <Vitrine onOpen={setSelectedProduct} />
          <BestSellers />
          <Steps />
          <Reviews />
          <Story />
        </main>

        <AnimatePresence>
          {selectedProduct && (
            <ProductDialog
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setSlide((value) => (value + 1) % heroSlides.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, [reduce, slide]);

  const product = heroSlides[slide];

  return (
    <section
      ref={ref}
      className="relative mx-auto grid w-[min(1200px,92%)] items-center gap-14 pt-12 pb-24 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-20 lg:pb-32"
    >
      <SprinkleField className="-z-10 hidden sm:block lg:left-[48%]" />

      <motion.div style={reduce ? undefined : { y: textY }}>
        <motion.p
          className="note"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="note-dot" aria-hidden="true">
            ✦
          </span>
          Pâtisserie maison à Houilles (78)
        </motion.p>
        <SplitWords
          text="Gourmand jusqu'à la dernière miette."
          className="display-xl mt-6"
          delay={0.15}
        />
        <motion.p
          className="lede mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easeOut }}
        >
          Cookies XXL, trompe-l&apos;œil bluffants et layer cakes à étages,
          préparés à l&apos;atelier et livrés chez vous le jour même.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: easeOut }}
        >
          <Magnetic>
            <Link href="/commander" className="btn btn-primary shine px-7">
              Commander
            </Link>
          </Magnetic>
          <Magnetic>
            <a href="#vitrine" className="btn btn-outline px-7">
              Voir la vitrine
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto w-full max-w-[34rem]"
        style={reduce ? undefined : { y: photoY, rotate: photoRotate }}
        initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.2 }}
      >
        {/* Plateau tournant : le feston tourne, la photo reste droite. */}
        <div className="turntable scallop-frame relative aspect-square bg-framboise-soft">
          <div className="turntable-counter absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={product.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: easeOut }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority={slide === 0}
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <CircularText
          text="LIVRÉ LE JOUR MÊME ✦ FAIT MAISON ✦ "
          className="bob absolute -top-4 -right-2 h-32 w-32 rounded-full bg-mangue text-ganache shadow-[0_14px_30px_-12px_rgba(59,29,23,.5)] sm:h-36 sm:w-36"
        >
          <span className="font-display text-3xl text-framboise">78</span>
        </CircularText>

        <div className="absolute bottom-[8%] -left-3 rotate-[-5deg] sm:-left-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={product.id}
              className="price-tag text-[1.05rem]"
              initial={{ opacity: 0, y: 14, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -14, rotate: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span className="font-semibold">{product.name}</span>
              <span className="text-framboise">
                {formatPrice(product.price)}
              </span>
            </motion.p>
          </AnimatePresence>
        </div>

        <div
          className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2"
          role="group"
          aria-label="Choisir la photo"
        >
          {heroSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.name}
              aria-pressed={slide === index}
              onClick={() => setSlide(index)}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  slide === index
                    ? "w-8 bg-framboise"
                    : "w-2 bg-ganache/25 hover:bg-ganache/50"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Rubans croisés ---------------- */

function RibbonCross() {
  return (
    <section aria-label="En bref" className="relative py-14">
      <Marquee
        speed={40}
        className="relative z-10 rotate-[-3deg] bg-framboise py-4 shadow-[0_16px_30px_-18px_rgba(59,29,23,.6)]"
      >
        {ribbonA.map((word) => (
          <span
            key={word}
            className="font-display flex items-center gap-8 pr-8 text-2xl text-white sm:text-3xl"
          >
            {word}
            <span aria-hidden="true" className="text-mangue">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
      <Marquee
        speed={48}
        reverse
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[2.5deg] bg-pistache py-3"
      >
        {ribbonB.map((word) => (
          <span
            key={word}
            className="flex items-center gap-8 pr-8 text-lg font-extrabold text-pistache-deep"
          >
            {word}
            <span aria-hidden="true">●</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* ---------------- Vitrine ---------------- */

function Vitrine({ onOpen }: { onOpen: (product: Product) => void }) {
  const [category, setCategory] = useState("Tout");
  const visibleProducts =
    category === "Tout"
      ? catalog
      : catalog.filter((item) => item.category === category);

  return (
    <section id="vitrine" className="mx-auto w-[min(1200px,92%)] pt-16 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SplitWords as="h2" text="La vitrine" className="display-lg" inView />
          <Reveal delay={0.1}>
            <p className="lede mt-3">
              Tout est préparé à la commande. Cliquez sur un gâteau pour choisir
              son parfum et l&apos;ajouter au panier.
            </p>
          </Reveal>
        </div>
        <div className="tabs" role="group" aria-label="Filtrer par catégorie">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 ${
                category === item
                  ? "text-chantilly"
                  : "text-ganache hover:bg-white/60"
              }`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {category === item && (
                <motion.span
                  layoutId="vitrine-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-ganache"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((item, index) => {
            const featured =
              category === "Tout" && featuredIds.includes(item.id);
            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.6,
                  delay: (index % 3) * 0.08,
                  ease: easeOut,
                }}
                className={featured ? "lg:col-span-2" : ""}
              >
                <TiltCard
                  className="vitrine-card group h-full"
                  max={featured ? 4 : 7}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(item)}
                    className="text-left"
                    aria-label={`Voir le détail : ${item.name}`}
                  >
                    <motion.div
                      layoutId={`photo-${item.id}`}
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
                      <span className="absolute inset-0 bg-gradient-to-t from-ganache/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="absolute right-4 bottom-4 translate-y-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-ganache opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        Choisir le parfum
                      </span>
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
                      <span className="price-tag absolute bottom-4 left-0 transition-transform duration-500 group-hover:-rotate-6">
                        {formatPrice(item.price)}
                      </span>
                    </motion.div>
                    <div className="px-3 pt-5">
                      <h3 className="text-xl leading-tight font-extrabold text-ganache transition-colors group-hover:text-framboise">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-framboise first-letter:uppercase">
                        {item.unit}
                      </p>
                      <p className="mt-1.5 text-[0.98rem] text-cacao">
                        {item.description}
                      </p>
                    </div>
                  </button>
                  <div className="mt-auto flex items-center justify-between gap-3 px-3 pt-5">
                    <p className="text-sm font-semibold text-cacao">
                      {getDeliveryDelay(item)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="btn btn-primary btn-sm shine"
                    >
                      Ajouter
                    </button>
                  </div>
                </TiltCard>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- Les plus commandés ---------------- */

function BestSellers() {
  const [active, setActive] = useState(0);
  const product = bestSellerProducts[active];

  return (
    <section
      id="best"
      className="mx-auto grid w-[min(1200px,92%)] items-center gap-12 py-20 lg:grid-cols-[.9fr_1.1fr]"
    >
      <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[9rem] bg-framboise-soft">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.id}
            className="absolute inset-0"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(75% at 50% 50%)" }}
            exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.2 } }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 480px, 92vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <span className="font-display absolute top-6 right-6 grid h-20 w-20 place-items-center rounded-full bg-chantilly text-4xl text-framboise">
          {active + 1}
        </span>
      </Reveal>

      <div>
        <SplitWords
          as="h2"
          text="Les plus commandés"
          className="display-lg"
          inView
        />
        <Reveal delay={0.1}>
          <p className="lede mt-3">
            Ce qui part en premier, semaine après semaine.
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-1">
          {bestSellerProducts.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.08,
                ease: easeOut,
              }}
            >
              <Link
                href={`/commander?product=${encodeURIComponent(item.id)}`}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`group relative grid grid-cols-[3rem_4.5rem_1fr_auto] items-center gap-4 overflow-hidden rounded-2xl border-b border-line px-2 py-4 transition-colors sm:grid-cols-[4rem_5rem_1fr_auto] ${
                  active === index ? "bg-chantilly" : ""
                }`}
              >
                <span
                  className={`font-display text-5xl leading-none transition-all duration-500 sm:text-6xl ${
                    active === index
                      ? "-rotate-6 text-framboise"
                      : "text-ganache/25"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="5rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span>
                  <span className="block text-lg leading-tight font-extrabold text-ganache">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-cacao">
                    {item.description}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-lg font-extrabold tabular-nums text-ganache">
                    {formatPrice(item.price)}
                  </span>
                  <span className="block text-xs font-semibold text-cacao">
                    {item.unit.split(",")[0]}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ol>
        <Reveal delay={0.3}>
          <Magnetic>
            <Link href="/commander" className="btn btn-primary shine mt-8 px-7">
              Composer ma commande
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Étapes ---------------- */

function Steps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });

  return (
    <section className="mx-auto w-[min(1200px,92%)] py-20">
      <SplitWords
        as="h2"
        text="Commander, c'est trois étapes."
        className="display-lg max-w-xl"
        inView
      />
      <ol
        ref={ref}
        className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8"
      >
        {/* Ligne de progression qui se dessine au scroll */}
        <span
          aria-hidden="true"
          className="absolute top-10 right-[16%] left-[16%] hidden h-1 rounded-full bg-ganache/10 md:block"
        />
        <motion.span
          aria-hidden="true"
          className="absolute top-10 left-[16%] hidden h-1 origin-left rounded-full bg-framboise md:block"
          style={{ scaleX: scrollYProgress, width: "68%" }}
        />
        {steps.map((step, index) => (
          <StepItem
            key={step.title}
            step={step}
            index={index}
            progress={scrollYProgress}
          />
        ))}
      </ol>
    </section>
  );
}

function StepItem({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const threshold = index / 2;
  const scale = useTransform(
    progress,
    [Math.max(0, threshold - 0.15), threshold],
    [0.6, 1],
  );
  const rotate = useTransform(
    progress,
    [Math.max(0, threshold - 0.15), threshold],
    [-90, 0],
  );
  return (
    <li className="relative">
      <motion.span
        style={reduce ? undefined : { scale, rotate }}
        className={`scallop-frame font-display relative grid h-20 w-20 place-items-center text-4xl ${step.tone}`}
        aria-hidden="true"
      >
        {index + 1}
      </motion.span>
      <Reveal delay={index * 0.1} y={20}>
        <h3 className="mt-5 text-2xl font-extrabold text-ganache">
          {step.title}
        </h3>
        <p className="mt-2 max-w-sm text-cacao">{step.text}</p>
      </Reveal>
    </li>
  );
}

/* ---------------- Avis ---------------- */

function Reviews() {
  return (
    <section
      id="avis"
      className="band band-scallop-top band-scallop-bottom mt-10 text-ganache"
      style={bandStyle("var(--chantilly)")}
    >
      <div className="mx-auto w-[min(1200px,92%)] py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitWords
            as="h2"
            text="Ils en redemandent"
            className="display-lg"
            inView
          />
          <Reveal>
            <p className="text-lg text-cacao">
              <CountUp
                to={4.9}
                decimals={1}
                className="font-display text-6xl text-framboise"
              />{" "}
              / 5 sur les retours clients
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.12}>
              <TiltCard className="h-full rounded-[1.75rem]" max={5}>
                <figure className="relative h-full overflow-hidden rounded-[1.75rem] bg-lait-fraise p-7">
                  <span
                    aria-hidden="true"
                    className="font-display absolute -top-6 right-4 text-[9rem] leading-none text-framboise/15"
                  >
                    &ldquo;
                  </span>
                  <p className="text-mangue" aria-label="5 étoiles sur 5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <motion.span
                        key={star}
                        className="inline-block text-xl"
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                          delay: 0.3 + index * 0.12 + star * 0.07,
                        }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </p>
                  <blockquote className="relative mt-3 text-xl leading-snug font-medium">
                    « {review.text} »
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-[0.95rem] text-cacao">
                    <span className="font-display grid h-10 w-10 place-items-center rounded-full bg-framboise text-lg text-white">
                      {review.name[0]}
                    </span>
                    <span>
                      <span className="block font-bold text-ganache">
                        {review.name}
                      </span>
                      {review.city}
                    </span>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Sur mesure : texte qui se colore au scroll ---------------- */

function Story() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const words = storyText.split(" ");

  return (
    <section
      id="histoire"
      className="relative mx-auto w-[min(1100px,92%)] pt-32 pb-8 text-center"
    >
      <p
        ref={ref}
        className="display-lg mx-auto leading-[1.12]"
        aria-label={storyText}
      >
        {words.map((word, index) => (
          <StoryWord
            key={`${word}-${index}`}
            word={word}
            index={index}
            total={words.length}
            progress={scrollYProgress}
          />
        ))}
      </p>
      <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
        <Magnetic>
          <Link href="/contact" className="btn btn-primary shine px-7">
            Demander un devis
          </Link>
        </Magnetic>
        <Magnetic>
          <Link href="/livraison" className="btn btn-outline px-7">
            Zones de livraison
          </Link>
        </Magnetic>
      </Reveal>
    </section>
  );
}

function StoryWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.15, 1]);
  const highlight = ["anniversaire,", "baptême,", "mariage", "date,"].includes(
    word,
  );
  return (
    <motion.span
      aria-hidden="true"
      style={reduce ? undefined : { opacity }}
      className={highlight ? "text-framboise" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

/* ---------------- Fiche produit ---------------- */

function ProductDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const [flavor, setFlavor] = useState(product.flavors[0] ?? "Classique");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  // La photo s'affiche à l'ouverture, le présentoir dès qu'on compose.
  const [view, setView] = useState<"photo" | "stand">("photo");
  const visualRef = useRef<HTMLDivElement>(null);

  const compose = (update: () => void) => {
    update();
    setView("stand");
    setAdded(false);
  };

  const add = (event: React.MouseEvent<HTMLButtonElement>) => {
    addItem({ productId: product.id, flavor, qty });
    const rect =
      visualRef.current?.getBoundingClientRect() ??
      event.currentTarget.getBoundingClientRect();
    sprinkleBurst(event.clientX, event.clientY);
    flyToCart(rect, product.image);
    setAdded(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto p-3 sm:items-center sm:p-6"
      initial={{ backgroundColor: "rgba(59,29,23,0)" }}
      animate={{ backgroundColor: "rgba(59,29,23,0.55)" }}
      exit={{ backgroundColor: "rgba(59,29,23,0)" }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="grid w-full max-w-5xl rounded-[2rem] bg-chantilly shadow-2xl max-sm:my-auto sm:grid-cols-[1fr_1.05fr] sm:overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Visuel : photo ou présentoir */}
        <div
          ref={visualRef}
          className="relative min-h-[26rem] overflow-hidden rounded-t-[2rem] sm:min-h-[34rem] sm:rounded-t-none"
        >
          <motion.div
            layoutId={`photo-${product.id}`}
            className="absolute inset-0"
            animate={{
              opacity: view === "photo" ? 1 : 0,
              scale: view === "photo" ? 1 : 1.08,
            }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 480px, 100vw"
              className="object-cover"
            />
            <span className="price-tag absolute bottom-6 left-0 text-lg">
              {formatPrice(product.price)}
            </span>
          </motion.div>

          <AnimatePresence>
            {view === "stand" && (
              <motion.div
                key="stand"
                className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-br p-5 sm:p-7 ${getPreviewOverlay(product.category)}`}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { clipPath: "circle(0% at 50% 100%)" }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { clipPath: "circle(150% at 50% 100%)" }
                }
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { clipPath: "circle(0% at 50% 100%)" }
                }
                transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
              >
                <p className="font-display mb-auto pt-12 text-3xl text-ganache sm:text-4xl">
                  {flavor}
                </p>
                <Dynamic3DPreview product={product} flavor={flavor} qty={qty} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interrupteur photo / présentoir */}
          <div
            className="absolute top-4 left-4 z-20 flex rounded-full bg-white/85 p-1 text-sm font-bold shadow-lg backdrop-blur"
            role="group"
            aria-label="Affichage"
          >
            {(
              [
                ["photo", "Photo"],
                ["stand", "Présentoir"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={`relative isolate rounded-full px-3.5 py-1.5 transition-colors ${
                  view === id ? "text-chantilly" : "text-ganache"
                }`}
              >
                {view === id && (
                  <motion.span
                    layoutId="view-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ganache"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="flex flex-col p-6 sm:max-h-[min(44rem,calc(100dvh-3rem))] sm:overflow-y-auto sm:p-8"
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.15 },
            },
          }}
        >
          <motion.div
            variants={item}
            className="flex items-start justify-between gap-3"
          >
            <span className="chip chip-framboise">{product.category}</span>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-soft btn-round transition-transform hover:rotate-90"
              aria-label="Fermer"
            >
              ×
            </button>
          </motion.div>
          <motion.h2
            variants={item}
            id="product-dialog-title"
            className="display-md mt-3"
          >
            {product.name}
          </motion.h2>
          <motion.p variants={item} className="mt-2 text-cacao">
            {product.description}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-2 text-sm font-semibold text-ganache"
          >
            {formatPrice(product.price)} {product.unit}
          </motion.p>

          <motion.fieldset variants={item} className="mt-5">
            <legend className="field-label">Parfum</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.flavors.map((value) => {
                const active = flavor === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => compose(() => setFlavor(value))}
                    className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold shadow-[inset_0_0_0_1.5px_var(--line)] transition-colors duration-300 ${
                      active
                        ? "text-chantilly"
                        : "text-ganache hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="home-flavor-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-ganache"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      />
                    )}
                    {value}
                  </button>
                );
              })}
            </div>
          </motion.fieldset>

          <motion.dl
            variants={item}
            className="mt-5 grid grid-cols-2 gap-4 text-[0.95rem]"
          >
            <div>
              <dt className="font-bold">Délai</dt>
              <dd className="text-cacao">{getDeliveryDelay(product)}</dd>
            </div>
            <div>
              <dt className="font-bold">Allergènes</dt>
              <dd className="text-cacao">{product.allergens.join(", ")}</dd>
            </div>
          </motion.dl>

          {/* Sur mobile : barre collée en bas pour voir le présentoir en ajoutant */}
          <motion.div
            variants={item}
            className="mt-auto pt-6 max-sm:sticky max-sm:bottom-0 max-sm:z-20 max-sm:-mx-6 max-sm:-mb-6 max-sm:rounded-b-[2rem] max-sm:bg-chantilly max-sm:px-6 max-sm:pb-5 max-sm:shadow-[0_-14px_24px_-18px_rgba(59,29,23,.5)]"
          >
            <p className="field-label max-sm:sr-only" id="home-qty-label">
              Quantité
            </p>
            <div className="mt-2">
              <QtyStepper
                value={qty}
                onChange={(next) => compose(() => setQty(next))}
                packSize={getPackSize(product.category)}
                quickPicksClassName="max-sm:hidden"
                labelId="home-qty-label"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ganache pt-4">
              <motion.p
                key={qty}
                initial={reduce ? false : { y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-extrabold tabular-nums"
              >
                {formatPrice(product.price * qty)}
              </motion.p>
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="rounded-full bg-pistache px-3 py-2 text-sm font-bold text-pistache-deep">
                      Ajouté !
                    </span>
                    <Link href="/checkout" className="btn btn-primary shine">
                      Voir mon panier
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key="add"
                    type="button"
                    onClick={add}
                    whileTap={{ scale: 0.95 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="btn btn-primary shine"
                  >
                    Ajouter au panier
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};
