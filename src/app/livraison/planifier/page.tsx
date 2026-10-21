"use client";

import Link from "next/link";
import {
  FormEvent,
  MouseEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import { easeOut, Magnetic, Reveal, SplitWords } from "@/components/fx";
import { sprinkleBurst } from "@/lib/sprinkles";

type DeliveryMode = "livraison" | "retrait";
type Flexibility = "strict" | "souple";

const slots = ["09h-11h", "11h-13h", "14h-16h", "16h-18h", "18h-20h"];
const DAYS_AHEAD = 14;

const toLocalIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Les dates dépendent du fuseau du visiteur : on ne les calcule qu'au navigateur.
const noop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

export default function PlanifierLivraisonPage() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();

  const days = useMemo(() => {
    if (!isClient) return [];
    return Array.from({ length: DAYS_AHEAD }, (_, index) => {
      const day = new Date();
      day.setHours(12, 0, 0, 0);
      day.setDate(day.getDate() + index + 1);
      return {
        iso: toLocalIso(day),
        weekday: day
          .toLocaleDateString("fr-FR", { weekday: "short" })
          .replace(".", ""),
        dayNumber: day.getDate(),
        month: day
          .toLocaleDateString("fr-FR", { month: "short" })
          .replace(".", ""),
        long: day.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      };
    });
  }, [isClient]);

  const [mode, setMode] = useState<DeliveryMode>("livraison");
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState("14h-16h");
  const [flexibility, setFlexibility] = useState<Flexibility>("strict");
  const [phone, setPhone] = useState("");
  const [interphone, setInterphone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedDay = days.find((day) => day.iso === (date ?? days[0]?.iso));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const button = event.currentTarget.querySelector<HTMLButtonElement>(
      "button[type=submit]",
    );
    const rect = button?.getBoundingClientRect();
    if (rect)
      sprinkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 36);
  };

  const pick =
    (setter: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
      setter();
      setSubmitted(false);
      event.currentTarget.blur();
    };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="livraison" />
      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        <section className="mb-10 max-w-3xl">
          <SplitWords
            text="Choisir le jour et le créneau"
            className="display-lg"
          />
          <Reveal delay={0.35} y={16}>
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
          </Reveal>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <Reveal y={30}>
            <form onSubmit={onSubmit} className="surface grid gap-9 p-6 sm:p-8">
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
                  ).map((option) => {
                    const active = mode === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`relative isolate cursor-pointer rounded-2xl p-4 transition-colors duration-300 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-framboise ${
                          active
                            ? "text-chantilly"
                            : "bg-white shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="mode-pill"
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
                          name="mode"
                          className="sr-only"
                          checked={active}
                          onChange={() => {
                            setMode(option.id);
                            setSubmitted(false);
                          }}
                        />
                        <span className="block font-bold">{option.label}</span>
                        <span
                          className={`text-sm ${active ? "text-chantilly/80" : "text-cacao"}`}
                        >
                          {option.hint}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="field-label">Jour souhaité</legend>
                <div className="-mx-2 mt-2 flex snap-x gap-2 overflow-x-auto px-2 pt-1 pb-3">
                  {days.length === 0
                    ? Array.from({ length: 7 }).map((_, index) => (
                        <span
                          key={index}
                          className="h-24 w-[4.5rem] shrink-0 animate-pulse rounded-2xl bg-lait-fraise"
                        />
                      ))
                    : days.map((day, index) => {
                        const active = selectedDay?.iso === day.iso;
                        return (
                          <motion.button
                            key={day.iso}
                            type="button"
                            aria-pressed={active}
                            aria-label={day.long}
                            onClick={pick(() => setDate(day.iso))}
                            initial={reduce ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: index * 0.03,
                              duration: 0.4,
                              ease: easeOut,
                            }}
                            whileHover={reduce ? undefined : { y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative isolate flex h-24 w-[4.5rem] shrink-0 snap-start flex-col items-center justify-center rounded-2xl transition-colors duration-300 ${
                              active
                                ? "text-white"
                                : "bg-white text-ganache shadow-[inset_0_0_0_1.5px_var(--line)]"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="day-pill"
                                className="absolute inset-0 -z-10 rounded-2xl bg-framboise shadow-[0_10px_20px_-8px_rgba(200,23,79,.6)]"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}
                            <span className="text-xs font-bold capitalize opacity-80">
                              {day.weekday}
                            </span>
                            <span className="font-display text-3xl leading-none">
                              {day.dayNumber}
                            </span>
                            <span className="text-xs font-semibold capitalize opacity-80">
                              {day.month}
                            </span>
                          </motion.button>
                        );
                      })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="field-label">Créneau préféré</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {slots.map((item) => {
                    const active = slot === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={active}
                        onClick={pick(() => setSlot(item))}
                        className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold tabular-nums transition-colors duration-300 ${
                          active
                            ? "text-chantilly"
                            : "text-ganache shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="slot-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-ganache"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                            }}
                          />
                        )}
                        {item.replace("-", " – ")}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="field-label">
                  Si on a un peu d&apos;avance ou de retard
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      { id: "strict", label: "Créneau strict" },
                      {
                        id: "souple",
                        label: "30 min de plus ou de moins, ça va",
                      },
                    ] as const
                  ).map((option) => {
                    const active = flexibility === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={pick(() => setFlexibility(option.id))}
                        className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 ${
                          active
                            ? "text-chantilly"
                            : "text-ganache shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="flex-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-ganache"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                            }}
                          />
                        )}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Téléphone
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="06 12 34 56 78"
                    className="field"
                  />
                </label>
                <label className="field-label">
                  Interphone ou code d&apos;accès (facultatif)
                  <input
                    value={interphone}
                    onChange={(event) => setInterphone(event.target.value)}
                    placeholder="Bât. B, code 2458"
                    className="field"
                  />
                </label>
              </div>

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

              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  className="btn btn-primary shine w-full px-8 sm:w-fit"
                >
                  Enregistrer mon créneau
                </button>
              </Magnetic>
            </form>
          </Reveal>

          <Reveal delay={0.15} y={30} className="lg:sticky lg:top-28">
            {/* Ticket récapitulatif avec bords festonnés */}
            <aside className="relative">
              <div className="surface overflow-hidden p-6">
                <p className="text-sm font-semibold text-cacao">
                  Votre créneau
                </p>
                <dl className="mt-4 grid gap-4">
                  <TicketRow
                    label="Mode"
                    value={
                      mode === "livraison"
                        ? "Livraison à domicile"
                        : "Retrait à l'atelier"
                    }
                  />
                  <TicketRow
                    label="Jour"
                    value={selectedDay ? selectedDay.long : "…"}
                    display
                  />
                  <TicketRow
                    label="Créneau"
                    value={slot.replace("-", " – ")}
                    display
                  />
                  <TicketRow
                    label="Souplesse"
                    value={
                      flexibility === "strict" ? "Créneau strict" : "± 30 min"
                    }
                  />
                </dl>

                <div className="my-5 border-t-2 border-dashed border-line" />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.p
                      key="ok"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                      }}
                      className="rounded-2xl bg-pistache p-4 font-semibold text-pistache-deep"
                      role="status"
                    >
                      Créneau enregistré. Vous pouvez finaliser votre commande.
                    </motion.p>
                  ) : (
                    <motion.p
                      key="todo"
                      exit={{ opacity: 0 }}
                      className="text-sm text-cacao"
                    >
                      On vous confirme le créneau par SMS après la commande.
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-5 grid gap-2">
                  <Link href="/checkout" className="btn btn-primary shine">
                    Finaliser ma commande
                  </Link>
                  <Link href="/livraison" className="btn btn-soft">
                    Voir les zones de livraison
                  </Link>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function TicketRow({
  label,
  value,
  display = false,
}: {
  label: string;
  value: string;
  display?: boolean;
}) {
  return (
    <div className="overflow-hidden">
      <dt className="text-sm text-cacao">{label}</dt>
      <AnimatePresence mode="wait" initial={false}>
        <motion.dd
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className={
            display
              ? "font-display text-2xl first-letter:uppercase"
              : "font-bold"
          }
        >
          {value}
        </motion.dd>
      </AnimatePresence>
    </div>
  );
}
