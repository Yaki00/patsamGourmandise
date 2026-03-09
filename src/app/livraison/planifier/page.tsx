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

  return (
    <div className="relative min-h-screen overflow-x-clip pb-10">
      <SiteHeader currentPage="livraison" />
      <main className="mx-auto w-[min(1100px,94%)] py-6 sm:w-[min(1100px,92%)] sm:py-10">
        <section className="glass rounded-3xl p-4 sm:p-8">
          <p className="mb-2 text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
            Livraison
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
            Choisir le jour et le creneau
          </h1>
          <p className="mt-3 max-w-3xl text-[#715260]">
            Indique ton horaire prefere, tes infos d&apos;acces et tes consignes.
            Nous confirmons le planning par SMS.
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[#fff2f7] px-4 py-2 text-sm font-semibold text-[#a34d74]">
            Note : les trompe-l&apos;oeil sont disponibles a partir de J+1.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white/70 p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#5d3f4d]">
                  Mode
                  <select
                    value={mode}
                    onChange={(event) => setMode(event.target.value as DeliveryMode)}
                    className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                  >
                    <option value="livraison">Livraison a domicile</option>
                    <option value="retrait">Retrait atelier (Houilles)</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#5d3f4d]">
                  Telephone
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="06 00 00 00 00"
                    className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#5d3f4d]">
                  Jour souhaite
                  <input
                    required
                    type="date"
                    min={tomorrowIso}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                  />
                </label>
                <label className="text-sm font-semibold text-[#5d3f4d]">
                  Creneau prefere
                  <select
                    value={slot}
                    onChange={(event) => setSlot(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                  >
                    <option value="09h-11h">09h - 11h</option>
                    <option value="11h-13h">11h - 13h</option>
                    <option value="14h-16h">14h - 16h</option>
                    <option value="16h-18h">16h - 18h</option>
                    <option value="18h-20h">18h - 20h</option>
                  </select>
                </label>
              </div>

              <fieldset className="rounded-xl bg-white/80 p-3">
                <legend className="px-1 text-sm font-semibold text-[#5d3f4d]">
                  Flexibilite
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFlexibility("strict")}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      flexibility === "strict"
                        ? "bg-[#ff72b6] text-white"
                        : "bg-white text-[#6d4d5a]"
                    }`}
                  >
                    Creneau strict
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlexibility("souple")}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      flexibility === "souple"
                        ? "bg-[#ff72b6] text-white"
                        : "bg-white text-[#6d4d5a]"
                    }`}
                  >
                    +/- 30 min ok
                  </button>
                </div>
              </fieldset>

              <label className="block text-sm font-semibold text-[#5d3f4d]">
                Interphone / code acces (optionnel)
                <input
                  value={interphone}
                  onChange={(event) => setInterphone(event.target.value)}
                  placeholder="Ex: Bat B - CODE 2458"
                  className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                />
              </label>

              <label className="block text-sm font-semibold text-[#5d3f4d]">
                Consignes (optionnel)
                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Ex: sonner a la porte de droite, appel 10 min avant..."
                  className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                Enregistrer mes preferences
              </button>
            </form>

            <aside className="rounded-2xl bg-white/70 p-4 sm:p-5">
              <p className="text-xs font-extrabold tracking-[0.15em] text-[#966a7d] uppercase">
                Recap planning
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#4f3340]">Ta preference livraison</h2>

              <ul className="mt-4 space-y-2 text-sm text-[#654754]">
                <li className="rounded-xl bg-white/80 p-3">
                  <span className="font-bold">Mode :</span>{" "}
                  {mode === "livraison" ? "Livraison a domicile" : "Retrait atelier"}
                </li>
                <li className="rounded-xl bg-white/80 p-3">
                  <span className="font-bold">Jour :</span> {date || "Non renseigne"}
                </li>
                <li className="rounded-xl bg-white/80 p-3">
                  <span className="font-bold">Creneau :</span> {slot}
                </li>
                <li className="rounded-xl bg-white/80 p-3">
                  <span className="font-bold">Flexibilite :</span>{" "}
                  {flexibility === "strict" ? "Creneau strict" : "+/- 30 min"}
                </li>
              </ul>

              {submitted ? (
                <div className="mt-4 rounded-xl bg-[#e6fff0] p-3 text-sm text-[#275c41]">
                  Preferences enregistrees. Tu peux maintenant finaliser la commande.
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#735665]">
                  Remplis le formulaire pour verrouiller ton jour et ton horaire prefere.
                </p>
              )}

              <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                <Link
                  href="/checkout"
                  className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-2.5 text-center text-sm font-bold text-white"
                >
                  Aller au checkout
                </Link>
                <Link href="/livraison" className="glass rounded-full px-5 py-2.5 text-center text-sm font-bold text-[#6d4d5a]">
                  Retour livraison
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
