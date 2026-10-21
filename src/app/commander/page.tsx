"use client";

import Image from "next/image";
import {
  CSSProperties,
  MouseEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { easeOut, Reveal, SplitWords, TiltCard } from "@/components/fx";
import { sprinkleBurst } from "@/lib/sprinkles";
import { ProductSheet } from "@/components/product-sheet";
import {
  FormulaBox3DPreview,
  FormulaRow,
  ProductBox3D,
} from "@/components/product-preview";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product, formatPrice, productCatalog } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";

const categories = [
  "Tout",
  ...Array.from(new Set(productCatalog.map((item) => item.category))),
];

function CommanderPageContent() {
  const searchParams = useSearchParams();
  const requestedProductId = searchParams.get("product");
  const requestedProductFromUrl = requestedProductId
    ? (productCatalog.find((item) => item.id === requestedProductId) ?? null)
    : null;
  const { entries, addItem, setItemQty, subtotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    requestedProductFromUrl?.category ?? "Tout",
  );
  const [modalOpen, setModalOpen] = useState(Boolean(requestedProductFromUrl));
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [modalProductId, setModalProductId] = useState<string | null>(
    requestedProductFromUrl?.id ?? null,
  );
  const [formulaRows, setFormulaRows] = useState<FormulaRow[]>([
    { productId: "cookie-triple-choco", flavor: "Fraise", qty: 2 },
    {
      productId: "layer-cake-signature",
      flavor: "Vanille fruits rouges",
      qty: 1,
    },
    {
      productId: "trompe-loeil-framboise",
      flavor: "Framboise vanille",
      qty: 1,
    },
  ]);
  const [formulaFeedback, setFormulaFeedback] = useState<string>("");

  const filteredProducts =
    selectedCategory === "Tout"
      ? productCatalog
      : productCatalog.filter((item) => item.category === selectedCategory);

  const selectedProduct = useMemo(
    () =>
      modalProductId
        ? (productCatalog.find((item) => item.id === modalProductId) ?? null)
        : null,
    [modalProductId],
  );

  // La fiche produit gère sa propre touche Échap ; ici, la box à composer.
  useEffect(() => {
    if (!formulaModalOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFormulaModalOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [formulaModalOpen]);

  const cartItems = useMemo(() => {
    return entries
      .map((item) => {
        const product = productCatalog.find((catalogItem) => {
          return catalogItem.id === item.productId;
        });
        if (!product) return null;
        return {
          key: `${item.productId}::${item.flavor}`,
          ...product,
          flavor: item.flavor,
          qty: item.qty,
          total: product.price * item.qty,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        ...item,
      }));
  }, [entries]);

  const formulaTotal = formulaRows.reduce((sum, row) => {
    const product = productCatalog.find((item) => item.id === row.productId);
    if (!product || row.qty <= 0) return sum;
    return sum + product.price * row.qty;
  }, 0);

  const updateFormulaProduct = (rowIndex: number, productId: string) => {
    const product = productCatalog.find((item) => item.id === productId);
    setFormulaRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex
          ? {
              productId,
              flavor: product?.flavors[0] ?? "Classique",
              qty: Math.max(1, row.qty),
            }
          : row,
      ),
    );
  };

  const updateFormulaFlavor = (rowIndex: number, flavor: string) => {
    setFormulaRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex ? { ...row, flavor } : row,
      ),
    );
  };

  const updateFormulaQty = (rowIndex: number, qty: number) => {
    setFormulaRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex
          ? { ...row, qty: Math.max(0, Math.min(30, qty)) }
          : row,
      ),
    );
  };

  const addFormulaRow = () => {
    setFormulaRows((previous) => [
      ...previous,
      { productId: "cookie-triple-choco", flavor: "Fraise", qty: 1 },
    ]);
  };

  const removeFormulaRow = (rowIndex: number) => {
    setFormulaRows((previous) =>
      previous.filter((_, index) => index !== rowIndex),
    );
  };

  const addFormulaToCart = (event: MouseEvent<HTMLButtonElement>) => {
    const normalized = formulaRows
      .map((row) => {
        const product = productCatalog.find(
          (item) => item.id === row.productId,
        );
        if (!product || row.qty <= 0) return null;
        const safeFlavor = product.flavors.includes(row.flavor)
          ? row.flavor
          : product.flavors[0];
        return { productId: product.id, flavor: safeFlavor, qty: row.qty };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (normalized.length === 0) {
      setFormulaFeedback("Ajoute au moins un produit dans la formule.");
      return;
    }

    normalized.forEach((line) => addItem(line));
    sprinkleBurst(event.clientX, event.clientY, 40);
    window.dispatchEvent(new CustomEvent("cart:bump"));
    setFormulaFeedback("Box ajoutée au panier !");
  };

  const openConfigModal = (product: Product) => {
    setModalProductId(product.id);
    setModalOpen(true);
  };

  const reduce = useReducedMotion();

  const decreaseCartQty = (key: string) => {
    const [productId, flavor] = key.split("::");
    const line = cartItems.find((item) => item.key === key);
    if (!line) return;
    setItemQty(productId, flavor, line.qty - 1);
  };

  const increaseCartQty = (key: string) => {
    const [productId, flavor] = key.split("::");
    const line = cartItems.find((item) => item.key === key);
    if (!line) return;
    setItemQty(productId, flavor, line.qty + 1);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="commander" />

      <main className="mx-auto w-[min(1200px,92%)] pt-12 sm:pt-16">
        <section className="mb-10 max-w-3xl">
          <SplitWords text="Composez votre commande" className="display-lg" />
          <Reveal delay={0.35} y={20}>
            <p className="lede mt-4">
              Choisissez un produit, son parfum et la quantité : l&apos;aperçu
              se met à jour en direct. Vous finalisez ensuite la livraison au
              panier.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <p className="note">
                <span className="note-dot" aria-hidden="true">
                  ✦
                </span>
                Livraison à Houilles (78) et jusqu&apos;à 50 km
              </p>
              <p className="note">
                <span
                  className="note-dot bg-framboise-soft!"
                  aria-hidden="true"
                >
                  !
                </span>
                Trompe-l&apos;œil : à commander la veille (J+1)
              </p>
            </div>
          </Reveal>
        </section>

        <div className="grid items-start gap-8 xl:grid-cols-[1fr_22rem]">
          <section id="catalogue" className="space-y-6">
            <div
              className="tabs"
              role="group"
              aria-label="Filtrer par catégorie"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 ${
                    selectedCategory === category
                      ? "text-chantilly"
                      : "text-ganache hover:bg-white/60"
                  }`}
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {selectedCategory === category && (
                    <motion.span
                      layoutId="commander-tab"
                      className="absolute inset-0 -z-10 rounded-full bg-ganache"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  {category}
                </button>
              ))}
            </div>

            <Reveal>
              <article
                className="band group grid overflow-hidden rounded-[1.75rem] sm:grid-cols-[1fr_1.1fr]"
                style={{ "--band": "var(--pistache)" } as CSSProperties}
              >
                <div className="relative grid min-h-56 place-items-center">
                  <span
                    aria-hidden="true"
                    className="spin-slow absolute h-44 w-44 rounded-full border-[3px] border-dashed border-pistache-deep/25"
                  />
                  <div className="formula-card-preview bob transition-transform duration-500 group-hover:scale-110">
                    <ProductBox3D
                      category="Box"
                      flavor="Mix surprise"
                      label="BOX MIX"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className="chip w-fit bg-chantilly!">
                    Prix selon la composition
                  </p>
                  <h2 className="display-md mt-3 text-pistache-deep!">
                    La box à composer
                  </h2>
                  <p className="mt-2 text-ganache">
                    Mélangez ce que vous voulez : 2 cookies, 1 layer cake, 1
                    trompe-l&apos;œil… Idéal pour offrir.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormulaModalOpen(true)}
                    className="btn btn-primary shine mt-5 w-fit"
                  >
                    Composer ma box
                  </button>
                </div>
              </article>
            </Reveal>

            <motion.div layout className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((item, index) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 2) * 0.08,
                      ease: easeOut,
                    }}
                  >
                    <TiltCard className="vitrine-card group h-full" max={6}>
                      <div className="vitrine-photo">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 768px) 420px, 92vw"
                          className="object-cover"
                        />
                        <span className="chip chip-framboise absolute top-3 right-3">
                          {item.tag}
                        </span>
                        <span className="price-tag absolute bottom-4 left-0">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="px-3 pt-5">
                        <h2 className="text-xl leading-tight font-extrabold text-ganache">
                          {item.name}
                        </h2>
                        <p className="mt-0.5 text-sm font-bold text-framboise first-letter:uppercase">
                          {item.unit}
                        </p>
                        <p className="mt-1.5 text-[0.98rem] text-cacao">
                          {item.description}
                        </p>
                        <p className="mt-3 text-sm text-cacao">
                          <span className="font-bold text-ganache">
                            {item.flavors.length} parfums
                          </span>{" "}
                          : {item.flavors.join(", ")}
                        </p>
                      </div>
                      <div className="mt-auto px-3 pt-5">
                        <button
                          type="button"
                          onClick={() => openConfigModal(item)}
                          className="btn btn-primary shine w-full"
                        >
                          Choisir le parfum
                        </button>
                      </div>
                    </TiltCard>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>

          <aside id="panier" className="surface p-6 xl:sticky xl:top-28">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl">Mon panier</h2>
              <p className="text-sm font-semibold text-cacao">
                {cartItems.reduce((sum, item) => sum + item.qty, 0)} article(s)
              </p>
            </div>
            {cartItems.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-lait-fraise p-4 text-[0.95rem] text-cacao">
                Votre panier est vide. Choisissez un produit pour commencer.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={
                        reduce ? false : { opacity: 0, x: 40, height: 0 }
                      }
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -40, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="flex items-center gap-3 overflow-hidden py-3"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-ganache">
                          {item.name}
                        </p>
                        <p className="truncate text-sm text-cacao">
                          {item.flavor}
                        </p>
                        <p className="text-sm font-bold tabular-nums">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => decreaseCartQty(item.key)}
                          className="btn btn-soft h-8! min-h-8! w-8 p-0!"
                          aria-label={`Retirer un ${item.name}`}
                        >
                          −
                        </button>
                        <motion.span
                          key={item.qty}
                          initial={
                            reduce ? false : { scale: 1.6, color: "#c8174f" }
                          }
                          animate={{ scale: 1, color: "#3b1d17" }}
                          className="w-6 text-center font-bold tabular-nums"
                        >
                          {item.qty}
                        </motion.span>
                        <button
                          type="button"
                          onClick={() => increaseCartQty(item.key)}
                          className="btn btn-primary h-8! min-h-8! w-8 p-0! shadow-none!"
                          aria-label={`Ajouter un ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between border-t-2 border-ganache pt-4">
              <span className="font-bold">Sous-total</span>
              <motion.span
                key={subtotal}
                initial={reduce ? false : { y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-extrabold tabular-nums"
              >
                {formatPrice(subtotal)}
              </motion.span>
            </div>
            <p className="mt-1 text-sm text-cacao">
              Frais de livraison calculés selon votre ville à l&apos;étape
              suivante.
            </p>

            <Link
              href="/checkout"
              aria-disabled={cartItems.length === 0}
              className={`btn btn-primary shine mt-5 w-full ${
                cartItems.length === 0 ? "pointer-events-none opacity-45" : ""
              }`}
            >
              Finaliser ma commande
            </Link>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {formulaModalOpen && (
          <motion.div
            key="formula"
            className="fixed inset-0 z-[75] flex items-start justify-center overflow-y-auto bg-ganache/55 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormulaModalOpen(false)}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="formula-dialog-title"
              className="grid max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl grid-cols-1 overflow-y-auto rounded-[2rem] bg-chantilly lg:max-h-[calc(100dvh-3rem)] lg:grid-cols-[1.1fr_.9fr] lg:overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6 sm:p-8 lg:overflow-y-auto">
                <div className="flex items-start justify-between gap-3">
                  <h2 id="formula-dialog-title" className="display-md">
                    Composez votre box
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFormulaModalOpen(false)}
                    className="btn btn-soft btn-round"
                    aria-label="Fermer"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-2 text-cacao">
                  Une ligne par produit : choisissez le parfum et la quantité.
                </p>

                <div className="mt-6 space-y-3">
                  {formulaRows.map((row, index) => {
                    const product = productCatalog.find(
                      (item) => item.id === row.productId,
                    );
                    const flavors = product?.flavors ?? [];
                    return (
                      <motion.div
                        key={`formula-row-${index}`}
                        layout
                        initial={
                          reduce ? false : { opacity: 0, y: -12, scale: 0.97 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 26,
                        }}
                        className="grid grid-cols-[1fr_5rem_2.5rem] gap-2 rounded-2xl bg-lait-fraise p-3 md:grid-cols-[1.3fr_1.1fr_5rem_2.5rem]"
                      >
                        <label className="col-span-3 md:col-span-1">
                          <span className="sr-only">Produit</span>
                          <select
                            value={row.productId}
                            onChange={(event) =>
                              updateFormulaProduct(index, event.target.value)
                            }
                            className="field mt-0! font-semibold"
                          >
                            {productCatalog
                              .filter((item) => item.category !== "Box")
                              .map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </label>

                        <label>
                          <span className="sr-only">Parfum</span>
                          <select
                            value={row.flavor}
                            onChange={(event) =>
                              updateFormulaFlavor(index, event.target.value)
                            }
                            className="field mt-0!"
                          >
                            {flavors.map((flavor) => (
                              <option key={flavor} value={flavor}>
                                {flavor}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span className="sr-only">Quantité</span>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={row.qty}
                            onChange={(event) =>
                              updateFormulaQty(
                                index,
                                Number(event.target.value),
                              )
                            }
                            className="field mt-0! text-center font-bold"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => removeFormulaRow(index)}
                          className="rounded-xl text-xl font-bold text-cacao hover:bg-white hover:text-framboise"
                          aria-label="Retirer cette ligne"
                        >
                          ×
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={addFormulaRow}
                    className="btn btn-outline btn-sm"
                  >
                    + Ajouter un produit
                  </button>
                  <button
                    type="button"
                    onClick={addFormulaToCart}
                    className="btn btn-primary shine"
                  >
                    Ajouter la box au panier
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {formulaFeedback && (
                    <motion.p
                      key={formulaFeedback + formulaTotal}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-2xl bg-pistache px-4 py-3 font-semibold text-pistache-deep"
                      role="status"
                    >
                      {formulaFeedback}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col justify-center bg-lait-fraise p-6 sm:p-8">
                <p className="text-sm font-semibold text-cacao">
                  Aperçu de votre box
                </p>
                <motion.p
                  key={formulaTotal}
                  initial={reduce ? false : { scale: 1.15, color: "#c8174f" }}
                  animate={{ scale: 1, color: "#3b1d17" }}
                  className="mt-1 origin-left text-4xl font-extrabold tabular-nums"
                >
                  {formatPrice(formulaTotal)}
                </motion.p>
                <FormulaBox3DPreview rows={formulaRows} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && selectedProduct && (
          <ProductSheet
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={() => setModalOpen(false)}
            initialView="stand"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={null}>
      <CommanderPageContent />
    </Suspense>
  );
}
