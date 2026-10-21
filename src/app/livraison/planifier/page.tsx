"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";

type DeliveryMode = "livraison" | "retrait";
type Flexibility = "strict" | "souple";

export default function PlanifierLivraisonPage() {
  const tomorrowIso = useMemo(() => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    return next.toISOString().split("T")[0];
  }, []);

  const [mode, setMode] = useState<DeliveryMode>("livraison");
  const [date, setDate] = useState(tomorrowIso);
  const [slot, setSlot] = useState("14h-16h");
  const [flexibility, setFlexibility] = useState<Flexibility>("strict");
  const [phone, setPhone] = useState("");
  const [interphone, setInterphone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "À choisir";

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="livraison" />
      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        <section className="hero-in mb-10 max-w-3xl">
          <h1 className="display-lg">Choisir le jour et le créneau</h1>
          <p className="lede mt-4">
            Indiquez votre horaire préféré et vos infos d&apos;accès. On vous
            confirme le passage par SMS.
          </p>
          <p className="note mt-6">
            <span className="note-dot" aria-hidden="true">
              !
            </span>
            Trompe-l&apos;œil : livraison à partir de J+1
          </p>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={onSubmit} className="surface grid gap-8 p-6 sm:p-8">
            <fieldset>
              <legend className="field-label">Livraison ou retrait ?</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      id: "livraison",
                      label: "Livraison à domicile",
                      hint: "Dans un rayon de 50 km",
                    },
                    {
                      id: "retrait",
                      label: "Retrait à l'atelier",
                      hint: "À Houilles, sur réservation",
                    },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-2xl p-4 transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise ${
                      mode === option.id
                        ? "bg-ganache text-chantilly"
                        : "bg-white shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      className="sr-only"
                      checked={mode === option.id}
                      onChange={() => setMode(option.id)}
                    />
                    <span className="block font-bold">{option.label}</span>
                    <span
                      className={`text-sm ${mode === option.id ? "text-chantilly/80" : "text-cacao"}`}
                    >
                      {option.hint}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                Jour souhaité
                <input
                  required
                  type="date"
                  min={tomorrowIso}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="field"
                />
              </label>
              <label className="field-label">
                Téléphone
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="06 00 00 00 00"
                  className="field"
                />
              </label>
            </div>

            <fieldset>
              <legend className="field-label">Créneau préféré</legend>
              <div className="tabs mt-2">
                {slots.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="tab tabular-nums"
                    aria-pressed={slot === item}
                    onClick={() => setSlot(item)}
                  >
                    {item.replace("-", " – ")}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="field-label">
                Si on a un peu d&apos;avance ou de retard
              </legend>
              <div className="tabs mt-2">
                <button
                  type="button"
                  className="tab"
                  aria-pressed={flexibility === "strict"}
                  onClick={() => setFlexibility("strict")}
                >
                  Créneau strict
                </button>
                <button
                  type="button"
                  className="tab"
                  aria-pressed={flexibility === "souple"}
                  onClick={() => setFlexibility("souple")}
                >
                  30 min de plus ou de moins, ça va
                </button>
              </div>
            </fieldset>

            <label className="field-label">
              Interphone ou code d&apos;accès (facultatif)
              <input
                value={interphone}
                onChange={(event) => setInterphone(event.target.value)}
                placeholder="Bât. B, code 2458"
                className="field"
              />
            </label>

            <label className="field-label">
              Consignes (facultatif)
              <textarea
                rows={3}
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder="Sonner à la porte de droite, appeler 10 min avant…"
                className="field"
              />
            </label>

            <button type="submit" className="btn btn-primary w-full sm:w-fit">
              Enregistrer mon créneau
            </button>
          </form>

          <aside className="surface p-6 lg:sticky lg:top-28">
            <h2 className="display-md">Votre créneau</h2>
            <dl className="mt-5 grid gap-4">
              <div>
                <dt className="text-sm text-cacao">Mode</dt>
                <dd className="font-bold">
                  {mode === "livraison"
                    ? "Livraison à domicile"
                    : "Retrait à l'atelier"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-cacao">Jour</dt>
                <dd className="font-display text-2xl first-letter:uppercase">
                  {dateLabel}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-cacao">Créneau</dt>
                <dd className="font-display text-2xl">
                  {slot.replace("-", " – ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-cacao">Souplesse</dt>
                <dd className="font-bold">
                  {flexibility === "strict" ? "Créneau strict" : "± 30 min"}
                </dd>
              </div>
            </dl>

            {submitted ? (
              <p
                className="mt-6 rounded-2xl bg-pistache p-4 font-semibold text-pistache-deep"
                role="status"
              >
                Créneau enregistré. Vous pouvez finaliser votre commande.
              </p>
            ) : null}

            <div className="mt-6 grid gap-2">
              <Link href="/checkout" className="btn btn-primary">
                Finaliser ma commande
              </Link>
              <Link href="/livraison" className="btn btn-soft">
                Voir les zones de livraison
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const slots = ["09h-11h", "11h-13h", "14h-16h", "16h-18h", "18h-20h"];
