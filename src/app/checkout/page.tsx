"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { formatPrice, productCatalog } from "@/data/products";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
  const { entries, subtotal, setItemQty, clearCart, totalItems } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<"A" | "B" | "C">("A");

  const lines = useMemo(() => {
    return entries
      .map((entry) => {
        const product = productCatalog.find((item) => item.id === entry.productId);
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
    <main className="mx-auto w-[min(1100px,92%)] py-6 sm:py-14">
      <SiteHeader currentPage="checkout" />
      <section className="glass rounded-3xl p-6 sm:p-8">
        <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
          Checkout
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
          Finaliser la commande
        </h1>
        <p className="mt-2 text-[#735665]">
          {totalItems} article(s) dans ton panier - livraison sur Houilles (78)
          et alentours.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-[#dffce9] p-4">
            <p className="text-base font-extrabold text-[#1f5c3b]">
              Commande envoyee avec succes.
            </p>
            <p className="mt-1 text-sm text-[#2f6f4b]">
              Merci. Nous revenons vers toi rapidement pour confirmer la
              livraison et le paiement.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm font-bold text-[#2b6b48]">
              Retour a l&apos;accueil
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
            <form onSubmit={submitOrder} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Nom complet"
                  className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                />
                <input
                  required
                  type="tel"
                  placeholder="Telephone"
                  className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              />
              <textarea
                required
                rows={4}
                placeholder="Adresse de livraison"
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              />
              <select
                value={deliveryZone}
                onChange={(event) =>
                  setDeliveryZone(event.target.value as "A" | "B" | "C")
                }
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              >
                <option value="A">Zone A (jusqu&apos;a 15 km)</option>
                <option value="B">Zone B (jusqu&apos;a 25 km)</option>
                <option value="C">Zone C (jusqu&apos;a 50 km)</option>
              </select>
              <Link
                href="/livraison/planifier"
                className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6d4d5a] shadow-[0_10px_24px_rgba(255,114,182,.16)]"
              >
                Choisir mon jour et mon creneau
              </Link>
              <select
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                defaultValue="cb"
              >
                <option value="cb">Paiement CB a la livraison</option>
                <option value="virement">Virement</option>
                <option value="especes">Especes</option>
              </select>
              <button
                type="submit"
                disabled={lines.length === 0}
                className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Valider la commande
              </button>
            </form>

            <aside className="rounded-2xl bg-white/70 p-4">
              <h2 className="text-xl font-black text-[#4f3340]">Recap panier</h2>
              {lines.length === 0 ? (
                <p className="mt-3 text-sm text-[#7a5d6a]">
                  Ton panier est vide. Retourne sur la page commander.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {lines.map((line) => (
                    <li key={line.key} className="rounded-xl bg-white/80 p-3 text-sm text-[#5f434f]">
                      <p className="font-bold">{line.product.name}</p>
                      <p className="text-xs">Parfum : {line.flavor}</p>
                      <p className="text-xs">
                        {line.qty} x {formatPrice(line.product.price)} ={" "}
                        <span className="font-bold">{formatPrice(line.total)}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-white font-black text-[#734d5f]"
                          onClick={() =>
                            setItemQty(line.product.id, line.flavor, line.qty - 1)
                          }
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[#ff72b6] font-black text-white"
                          onClick={() =>
                            setItemQty(line.product.id, line.flavor, line.qty + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 space-y-1 border-t border-white pt-3 text-sm text-[#644653]">
                <p className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Livraison (Zone {deliveryZone})</span>
                  <span className="font-bold">{formatPrice(delivery)}</span>
                </p>
                <p className="flex justify-between text-base">
                  <span className="font-extrabold">Total</span>
                  <span className="font-extrabold">{formatPrice(grandTotal)}</span>
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
