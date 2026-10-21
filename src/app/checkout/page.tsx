"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { formatPrice, productCatalog } from "@/data/products";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/context/cart-context";
import {
  CircularText,
  easeOut,
  Magnetic,
  Reveal,
  SplitWords,
} from "@/components/fx";
import { sprinkleBurst } from "@/lib/sprinkles";

type Zone = "A" | "B" | "C";

const FREE_DELIVERY_FROM = 15;

const zones: { id: Zone; label: string; detail: string }[] = [
  { id: "A", label: "Moins de 15 km", detail: "Offerte dès 15 €, sinon 5 €" },
  { id: "B", label: "15 à 25 km", detail: "5 €" },
  { id: "C", label: "25 à 50 km", detail: "15 €" },
];

const payments = [
  { id: "cb", label: "Carte bancaire à la livraison" },
  { id: "virement", label: "Virement" },
  { id: "especes", label: "Espèces" },
];

const REQUIRED_FIELDS = 4;

export default function CheckoutPage() {
  const { entries, subtotal, setItemQty, clearCart, totalItems } = useCart();
  const reduce = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<Zone>("A");
  const [payment, setPayment] = useState("cb");
  const [filled, setFilled] = useState(0);

  const lines = useMemo(() => {
    return entries
      .map((entry) => {
        const product = productCatalog.find(
          (item) => item.id === entry.productId,
        );
        if (!product) return null;
        return {
          key: `${entry.productId}::${entry.flavor}`,
          product,
          flavor: entry.flavor,
          qty: entry.qty,
          total: product.price * entry.qty,
        };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line));
  }, [entries]);

  const delivery = useMemo(() => {
    if (subtotal <= 0) return 0;
    if (deliveryZone === "A") return subtotal >= FREE_DELIVERY_FROM ? 0 : 5;
    if (deliveryZone === "B") return 5;
    return 15;
  }, [deliveryZone, subtotal]);
  const grandTotal = subtotal + delivery;
  const missingForFree = Math.max(0, FREE_DELIVERY_FROM - subtotal);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lines.length === 0) return;
    clearCart();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      sprinkleBurst(window.innerWidth / 2, window.innerHeight * 0.35, 60);
    }, 350);
  };

  // Compte les champs obligatoires déjà valides pour la jauge de progression.
  const trackProgress = (event: FormEvent<HTMLFormElement>) => {
    const fields = Array.from(
      event.currentTarget.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement
      >("input[required], textarea[required]"),
    );
    setFilled(
      fields.filter((field) => field.value.trim() && field.checkValidity())
        .length,
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="checkout" />

      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.section
              key="merci"
              className="mx-auto max-w-xl py-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="mx-auto w-fit"
                initial={reduce ? false : { scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 12,
                  delay: 0.1,
                }}
              >
                <CircularText
                  text="MERCI ✦ MERCI ✦ MERCI ✦ "
                  className="relative h-40 w-40 rounded-full bg-mangue text-ganache"
                >
                  <span className="font-display text-4xl text-framboise">
                    ♥
                  </span>
                </CircularText>
              </motion.div>
              <SplitWords
                text="Commande envoyée !"
                className="display-lg mt-8"
                delay={0.3}
              />
              <Reveal delay={0.6} y={20}>
                <p className="lede mx-auto mt-4">
                  On vous rappelle très vite pour confirmer le créneau de
                  livraison et le paiement. Gardez votre téléphone à portée de
                  main.
                </p>
                <Magnetic>
                  <Link href="/" className="btn btn-primary shine mt-8 px-7">
                    Retour à l&apos;accueil
                  </Link>
                </Magnetic>
              </Reveal>
            </motion.section>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
              <section className="mb-10">
                <SplitWords
                  text="Finaliser la commande"
                  className="display-lg"
                />
                <Reveal delay={0.3} y={16}>
                  <p className="lede mt-3">
                    {totalItems} article(s) dans votre panier. Livraison à
                    Houilles (78) et jusqu&apos;à 50 km.
                  </p>
                </Reveal>
              </section>

              <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
                <Reveal y={30}>
                  <form
                    onSubmit={submitOrder}
                    onInput={trackProgress}
                    className="surface grid gap-10 p-6 sm:p-8"
                  >
                    <div>
                      <div className="flex items-center justify-between text-sm font-semibold text-cacao">
                        <span>Vos informations</span>
                        <span className="tabular-nums">
                          {filled}/{REQUIRED_FIELDS}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-lait-fraise">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-framboise to-mangue"
                          animate={{
                            width: `${(filled / REQUIRED_FIELDS) * 100}%`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 20,
                          }}
                        />
                      </div>
                    </div>

                    <fieldset className="grid gap-4">
                      <legend className="display-md mb-4">
                        Vos coordonnées
                      </legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="field-label">
                          Nom complet
                          <input
                            required
                            autoComplete="name"
                            className="field"
                          />
                        </label>
                        <label className="field-label">
                          Téléphone
                          <input
                            required
                            type="tel"
                            autoComplete="tel"
                            className="field"
                          />
                        </label>
                      </div>
                      <label className="field-label">
                        Email
                        <input
                          required
                          type="email"
                          autoComplete="email"
                          className="field"
                        />
                      </label>
                      <label className="field-label">
                        Adresse de livraison
                        <textarea
                          required
                          rows={3}
                          autoComplete="street-address"
                          className="field"
                        />
                      </label>
                    </fieldset>

                    <fieldset>
                      <legend className="display-md mb-2">
                        Distance depuis Houilles
                      </legend>
                      <p className="text-[0.95rem] text-cacao">
                        Un doute ?{" "}
                        <Link
                          href="/livraison"
                          className="font-bold text-framboise underline"
                        >
                          Vérifiez votre ville
                        </Link>
                        .
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {zones.map((zone) => {
                          const active = deliveryZone === zone.id;
                          return (
                            <label
                              key={zone.id}
                              className={`relative isolate cursor-pointer rounded-2xl p-4 transition-colors duration-300 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise ${
                                active
                                  ? "text-chantilly"
                                  : "bg-white shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="zone-pill"
                                  className="absolute inset-0 -z-10 rounded-2xl bg-ganache"
                                  transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 32,
                                  }}
                                />
                              )}
                              <input
                                type="radio"
                                name="zone"
                                value={zone.id}
                                checked={active}
                                onChange={() => setDeliveryZone(zone.id)}
                                className="sr-only"
                              />
                              <span className="block font-bold">
                                {zone.label}
                              </span>
                              <span
                                className={`text-sm ${active ? "text-chantilly/80" : "text-cacao"}`}
                              >
                                {zone.detail}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <Link
                        href="/livraison/planifier"
                        className="btn btn-soft btn-sm mt-4"
                      >
                        Choisir mon jour et mon créneau
                      </Link>
                    </fieldset>

                    <fieldset>
                      <legend className="display-md mb-4">Paiement</legend>
                      <div className="flex flex-wrap gap-2">
                        {payments.map((item) => {
                          const active = payment === item.id;
                          return (
                            <label
                              key={item.id}
                              className={`relative isolate cursor-pointer rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise ${
                                active
                                  ? "text-chantilly"
                                  : "text-ganache shadow-[inset_0_0_0_1.5px_var(--line)]"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="payment-pill"
                                  className="absolute inset-0 -z-10 rounded-full bg-ganache"
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 32,
                                  }}
                                />
                              )}
                              <input
                                type="radio"
                                name="payment"
                                value={item.id}
                                checked={active}
                                onChange={() => setPayment(item.id)}
                                className="sr-only"
                              />
                              {item.label}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <Magnetic strength={0.2}>
                      <button
                        type="submit"
                        disabled={lines.length === 0}
                        className="btn btn-primary shine w-full px-8 text-lg sm:w-fit"
                      >
                        Valider la commande ({formatPrice(grandTotal)})
                      </button>
                    </Magnetic>
                  </form>
                </Reveal>

                <Reveal delay={0.15} y={30} className="lg:sticky lg:top-28">
                  <aside className="surface p-6">
                    <h2 className="display-md">Récapitulatif</h2>
                    {lines.length === 0 ? (
                      <div className="mt-4 rounded-2xl bg-lait-fraise p-4 text-[0.95rem] text-cacao">
                        <p>Votre panier est vide.</p>
                        <Link
                          href="/commander"
                          className="mt-2 inline-block font-bold text-framboise underline"
                        >
                          Choisir des douceurs
                        </Link>
                      </div>
                    ) : (
                      <ul className="mt-4 divide-y divide-line">
                        <AnimatePresence initial={false}>
                          {lines.map((line) => (
                            <motion.li
                              key={line.key}
                              layout
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
                                  src={line.product.image}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">
                                  {line.product.name}
                                </p>
                                <p className="truncate text-sm text-cacao">
                                  {line.flavor}
                                </p>
                                <p className="text-sm font-bold tabular-nums">
                                  {formatPrice(line.total)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  className="btn btn-soft h-8! min-h-8! w-8 p-0!"
                                  aria-label={`Retirer un ${line.product.name}`}
                                  onClick={() =>
                                    setItemQty(
                                      line.product.id,
                                      line.flavor,
                                      line.qty - 1,
                                    )
                                  }
                                >
                                  −
                                </button>
                                <motion.span
                                  key={line.qty}
                                  initial={
                                    reduce
                                      ? false
                                      : { scale: 1.6, color: "#c8174f" }
                                  }
                                  animate={{ scale: 1, color: "#3b1d17" }}
                                  className="w-6 text-center font-bold tabular-nums"
                                >
                                  {line.qty}
                                </motion.span>
                                <button
                                  type="button"
                                  className="btn btn-primary h-8! min-h-8! w-8 p-0! shadow-none!"
                                  aria-label={`Ajouter un ${line.product.name}`}
                                  onClick={() =>
                                    setItemQty(
                                      line.product.id,
                                      line.flavor,
                                      line.qty + 1,
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}

                    {deliveryZone === "A" && subtotal > 0 && (
                      <div className="mt-4 rounded-2xl bg-lait-fraise p-4">
                        <p className="text-sm font-semibold">
                          {missingForFree > 0 ? (
                            <>
                              Plus que{" "}
                              <span className="text-framboise">
                                {formatPrice(missingForFree)}
                              </span>{" "}
                              pour la livraison offerte
                            </>
                          ) : (
                            <>Livraison offerte, bien joué !</>
                          )}
                        </p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-framboise to-mangue"
                            initial={false}
                            animate={{
                              width: `${Math.min(100, (subtotal / FREE_DELIVERY_FROM) * 100)}%`,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 18,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <dl className="mt-4 grid gap-1.5 border-t-2 border-ganache pt-4 text-[0.95rem]">
                      <div className="flex justify-between">
                        <dt>Sous-total</dt>
                        <dd className="font-bold tabular-nums">
                          {formatPrice(subtotal)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Livraison</dt>
                        <dd className="font-bold tabular-nums">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={delivery}
                              className={`inline-block ${subtotal > 0 && delivery === 0 ? "rounded-full bg-pistache px-2 text-pistache-deep" : ""}`}
                              initial={{ y: -8, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 8, opacity: 0 }}
                              transition={{ duration: 0.2, ease: easeOut }}
                            >
                              {subtotal > 0 && delivery === 0
                                ? "Offerte"
                                : formatPrice(delivery)}
                            </motion.span>
                          </AnimatePresence>
                        </dd>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <dt className="font-bold">Total</dt>
                        <motion.dd
                          key={grandTotal}
                          initial={
                            reduce ? false : { scale: 1.12, color: "#c8174f" }
                          }
                          animate={{ scale: 1, color: "#3b1d17" }}
                          className="origin-right text-2xl font-extrabold tabular-nums"
                        >
                          {formatPrice(grandTotal)}
                        </motion.dd>
                      </div>
                    </dl>
                  </aside>
                </Reveal>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
