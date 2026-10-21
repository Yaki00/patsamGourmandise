"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { formatPrice, productCatalog } from "@/data/products";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/context/cart-context";

type Zone = "A" | "B" | "C";

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

export default function CheckoutPage() {
  const { entries, subtotal, setItemQty, clearCart, totalItems } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<Zone>("A");
  const [payment, setPayment] = useState("cb");

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
    if (deliveryZone === "A") return subtotal >= 15 ? 0 : 5;
    if (deliveryZone === "B") return 5;
    return 15;
  }, [deliveryZone, subtotal]);
  const grandTotal = subtotal + delivery;

  const submitOrder = (event: FormEvent) => {
    event.preventDefault();
    if (lines.length === 0) return;
    clearCart();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="checkout" />

      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        {submitted ? (
          <section className="hero-in mx-auto max-w-xl py-10 text-center">
            <p className="sticker sticker-in mx-auto h-32 w-32 rotate-[-8deg] font-display text-3xl font-normal">
              Merci !
            </p>
            <h1 className="display-lg mt-8">Commande envoyée</h1>
            <p className="lede mx-auto mt-4">
              On vous recontacte rapidement par téléphone pour confirmer le
              créneau de livraison et le paiement.
            </p>
            <Link href="/" className="btn btn-primary mt-8">
              Retour à l&apos;accueil
            </Link>
          </section>
        ) : (
          <>
            <section className="hero-in mb-10">
              <h1 className="display-lg">Finaliser la commande</h1>
              <p className="lede mt-3">
                {totalItems} article(s) dans votre panier. Livraison à Houilles
                (78) et jusqu&apos;à 50 km.
              </p>
            </section>

            <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
              <form
                onSubmit={submitOrder}
                className="surface grid gap-10 p-6 sm:p-8"
              >
                <fieldset className="grid gap-4">
                  <legend className="display-md mb-4">Vos coordonnées</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="field-label">
                      Nom complet
                      <input required autoComplete="name" className="field" />
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
                    {zones.map((zone) => (
                      <label
                        key={zone.id}
                        className={`cursor-pointer rounded-2xl p-4 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise ${
                          deliveryZone === zone.id
                            ? "bg-ganache text-chantilly"
                            : "bg-white shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="zone"
                          value={zone.id}
                          checked={deliveryZone === zone.id}
                          onChange={() => setDeliveryZone(zone.id)}
                          className="sr-only"
                        />
                        <span className="block font-bold">{zone.label}</span>
                        <span
                          className={`text-sm ${deliveryZone === zone.id ? "text-chantilly/80" : "text-cacao"}`}
                        >
                          {zone.detail}
                        </span>
                      </label>
                    ))}
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
                  <div className="tabs">
                    {payments.map((item) => (
                      <label
                        key={item.id}
                        className="tab cursor-pointer has-[:checked]:bg-ganache has-[:checked]:text-chantilly has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={item.id}
                          checked={payment === item.id}
                          onChange={() => setPayment(item.id)}
                          className="sr-only"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={lines.length === 0}
                  className="btn btn-primary w-full sm:w-fit"
                >
                  Valider la commande ({formatPrice(grandTotal)})
                </button>
              </form>

              <aside className="surface p-6 lg:sticky lg:top-28">
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
                    {lines.map((line) => (
                      <li
                        key={line.key}
                        className="flex items-center gap-3 py-3"
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
                          <span className="w-6 text-center font-bold tabular-nums">
                            {line.qty}
                          </span>
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
                      </li>
                    ))}
                  </ul>
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
                      {subtotal > 0 && delivery === 0
                        ? "Offerte"
                        : formatPrice(delivery)}
                    </dd>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <dt className="font-bold">Total</dt>
                    <dd className="text-2xl font-extrabold tabular-nums">
                      {formatPrice(grandTotal)}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
