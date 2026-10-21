"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  formatPrice,
  getDeliveryDelay,
  Product,
  productCatalog,
} from "@/data/products";
import { useCart } from "@/context/cart-context";
import { easeOut } from "@/components/fx";
import { QtyStepper } from "@/components/qty-stepper";
import {
  Dynamic3DPreview,
  getFlavorSwatch,
  getPackSize,
  getPreviewOverlay,
  OpenBoxPreview,
} from "@/components/product-preview";
import { flyToCart, sprinkleBurst } from "@/lib/sprinkles";

type View = "photo" | "stand";

// Économie d'une box par rapport au même nombre de cookies achetés à l'unité.
const BOX_SIZE = 6;
const getBoxSaving = (product: Product) => {
  if (product.category !== "Box") return 0;
  const cookie = productCatalog.find((item) => item.category === "Cookies");
  if (!cookie) return 0;
  return Math.max(0, cookie.price * BOX_SIZE - product.price);
};

const stagger = {
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};
const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

/** Fiche produit complète : visuel, parfum, quantité, ajout au panier. */
export function ProductSheet({
  product,
  onClose,
  initialView = "photo",
  photoLayoutId,
}: {
  product: Product;
  onClose: () => void;
  initialView?: View;
  /** Identifiant partagé avec la photo de la carte, pour l'effet d'agrandissement. */
  photoLayoutId?: string;
}) {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const [flavor, setFlavor] = useState(product.flavors[0] ?? "Classique");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<View>(initialView);
  const visualRef = useRef<HTMLDivElement>(null);
  const isBox = product.category === "Box";
  const saving = getBoxSaving(product);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [onClose]);

  // Toute modification montre le présentoir (ou la boîte ouverte).
  const compose = (update: () => void) => {
    update();
    setView("stand");
    setAdded(false);
  };

  const add = (event: MouseEvent<HTMLButtonElement>) => {
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
        aria-labelledby="product-sheet-title"
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
          className="relative min-h-[34rem] overflow-hidden rounded-t-[2rem] sm:min-h-[36rem] sm:rounded-t-none"
        >
          <motion.div
            layoutId={photoLayoutId}
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
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={flavor}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="font-display mb-auto pt-14 text-3xl text-ganache sm:text-4xl"
                  >
                    {flavor}
                  </motion.p>
                </AnimatePresence>
                {isBox ? (
                  <OpenBoxPreview flavor={flavor} qty={qty} />
                ) : (
                  <Dynamic3DPreview
                    product={product}
                    flavor={flavor}
                    qty={qty}
                  />
                )}
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
                ["stand", isBox ? "Ouvrir la boîte" : "Présentoir"],
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
                    layoutId="sheet-view-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ganache"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-soft btn-round absolute top-4 right-4 z-20 sm:hidden"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Détails */}
        <motion.div
          className="flex flex-col p-6 sm:max-h-[min(46rem,calc(100dvh-3rem))] sm:overflow-y-auto sm:p-8"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div
            variants={rise}
            className="flex items-start justify-between gap-3"
          >
            <span className="chip chip-framboise">{product.category}</span>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-soft btn-round transition-transform hover:rotate-90 max-sm:hidden"
              aria-label="Fermer"
            >
              ×
            </button>
          </motion.div>

          <motion.h2
            variants={rise}
            id="product-sheet-title"
            className="display-md mt-3"
          >
            {product.name}
          </motion.h2>
          <motion.p variants={rise} className="mt-2 text-cacao">
            {product.description}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2"
          >
            <span className="text-3xl font-extrabold tabular-nums">
              {formatPrice(product.price)}
            </span>
            <span className="font-semibold text-cacao">{product.unit}</span>
            {saving > 0 && (
              <motion.span
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 12,
                  delay: 0.5,
                }}
                className="rounded-full bg-pistache px-3 py-1 text-sm font-extrabold text-pistache-deep"
              >
                {formatPrice(saving)} d&apos;économie vs à l&apos;unité
              </motion.span>
            )}
          </motion.div>

          <motion.fieldset variants={rise} className="mt-6">
            <legend className="field-label">
              {isBox ? "Composition" : "Parfum"}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.flavors.map((value) => {
                const active = flavor === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => compose(() => setFlavor(value))}
                    className={`relative isolate flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[0.95rem] font-bold shadow-[inset_0_0_0_1.5px_var(--line)] transition-colors duration-300 ${
                      active
                        ? "text-chantilly"
                        : "text-ganache hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sheet-flavor-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-ganache"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      />
                    )}
                    <motion.span
                      aria-hidden="true"
                      className="h-7 w-7 shrink-0 rounded-full shadow-[inset_0_0_0_2px_rgba(255,255,255,.7)]"
                      style={{ background: getFlavorSwatch(product, value) }}
                      animate={{
                        rotate: active ? 360 : 0,
                        scale: active ? 1.1 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 16,
                      }}
                    />
                    {value}
                  </button>
                );
              })}
            </div>
          </motion.fieldset>

          <motion.ul
            variants={stagger}
            className="mt-6 grid gap-2 sm:grid-cols-3"
          >
            <Fact icon={<ClockIcon />} label="Délai">
              {getDeliveryDelay(product)}
            </Fact>
            <Fact icon={<SliceIcon />} label={isBox ? "Contenu" : "Format"}>
              <span className="block first-letter:uppercase">
                {product.unit}
              </span>
            </Fact>
            <Fact icon={<WheatIcon />} label="Allergènes">
              {product.allergens.join(", ")}
            </Fact>
          </motion.ul>

          {/* Sur mobile : barre collée en bas pour voir le visuel en composant */}
          <motion.div
            variants={rise}
            className="mt-auto pt-6 max-sm:sticky max-sm:bottom-0 max-sm:z-20 max-sm:-mx-6 max-sm:-mb-6 max-sm:rounded-b-[2rem] max-sm:bg-chantilly max-sm:px-6 max-sm:pb-5 max-sm:shadow-[0_-14px_24px_-18px_rgba(59,29,23,.5)]"
          >
            <p className="field-label max-sm:sr-only" id="sheet-qty-label">
              Quantité
            </p>
            <div className="mt-2">
              <QtyStepper
                value={qty}
                onChange={(next) => compose(() => setQty(next))}
                packSize={getPackSize(product.category)}
                quickPicksClassName="max-sm:hidden"
                labelId="sheet-qty-label"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ganache pt-4">
              <div>
                <p className="text-sm text-cacao max-sm:hidden">
                  {qty} × {flavor}
                </p>
                <motion.p
                  key={qty}
                  initial={reduce ? false : { y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-extrabold tabular-nums"
                >
                  {formatPrice(product.price * qty)}
                </motion.p>
              </div>
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

function Fact({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.li
      variants={rise}
      whileHover={{ y: -3 }}
      className="flex items-start gap-3 rounded-2xl bg-lait-fraise p-3 sm:flex-col sm:gap-2"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-framboise shadow-sm">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-bold text-cacao">{label}</span>
        <span className="block text-sm leading-snug font-semibold text-ganache">
          {children}
        </span>
      </span>
    </motion.li>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SliceIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 18h18L12 5 3 18Z" />
      <path d="M3 18v2h18v-2" />
      <path d="M9 13h6" />
    </svg>
  );
}

function WheatIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 21V9" />
      <path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M12 13c3 0 5-2 5-5-3 0-5 2-5 5Z" />
      <path d="M12 8c-2 0-3-1.5-3-3.5C11 4.5 12 6 12 8Z" />
      <path d="M12 8c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5Z" />
    </svg>
  );
}
