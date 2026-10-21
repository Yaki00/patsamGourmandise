"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import {
  CircularText,
  Magnetic,
  Reveal,
  SplitWords,
  SprinkleField,
} from "@/components/fx";
import { contact } from "@/data/site";
import { sprinkleBurst } from "@/lib/sprinkles";

const subjects = [
  "Demande de commande",
  "Gâteau sur mesure",
  "Devis pour un événement",
  "Question sur la livraison",
  "Autre demande",
];

export default function ContactPage() {
  const [subject, setSubject] = useState(subjects[0]);
  const [sent, setSent] = useState(false);

  // Pas encore de serveur d'envoi : la demande part en SMS pré-rempli.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${subject}, de la part de ${data.get("name") ?? ""}`,
      String(data.get("message") ?? ""),
      data.get("date") ? `Date souhaitée : ${data.get("date")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const button = event.currentTarget.querySelector<HTMLButtonElement>(
      "button[type=submit]",
    );
    const rect = button?.getBoundingClientRect();
    if (rect)
      sprinkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 36);
    setSent(true);
    window.location.href = `${contact.smsHref}?&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="contact" />
      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        <section className="relative grid items-center gap-10 pb-16 lg:grid-cols-[1.3fr_.7fr]">
          <SprinkleField className="-z-10 hidden opacity-70 sm:block lg:left-[62%]" />
          <div>
            <SplitWords text="Parlons de votre gâteau" className="display-xl" />
            <Reveal delay={0.4} y={16}>
              <p className="lede mt-5">
                Anniversaire, événement ou création sur mesure : le plus simple,
                c&apos;est d&apos;appeler ou d&apos;envoyer un SMS.
              </p>
            </Reveal>
            <Reveal delay={0.55} y={16} className="mt-8">
              <Magnetic strength={0.15}>
                <a
                  href={contact.phoneHref}
                  className="group font-display inline-flex items-center gap-4 text-[clamp(2.2rem,6vw,4.5rem)] leading-none text-framboise"
                >
                  <span className="grid h-[1.1em] w-[1.1em] shrink-0 place-items-center rounded-full bg-framboise text-[0.45em] text-white transition-transform duration-500 group-hover:rotate-[-20deg]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[0.9em] w-[0.9em]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
                    </svg>
                  </span>
                  <span className="underline-grow pb-1">
                    {contact.phoneLabel}
                  </span>
                </a>
              </Magnetic>
            </Reveal>
            <Reveal delay={0.65} y={16} className="mt-6 flex flex-wrap gap-3">
              <a href={contact.smsHref} className="btn btn-outline">
                Envoyer un SMS
              </a>
              <a href={`mailto:${contact.email}`} className="btn btn-soft">
                {contact.email}
              </a>
              <span className="btn btn-soft pointer-events-none">
                Snapchat : {contact.snapchat}
              </span>
            </Reveal>
          </div>

          <motion.div
            className="mx-auto"
            initial={{ opacity: 0, scale: 0, rotate: -120 }}
            animate={{ opacity: 1, scale: 1, rotate: 8 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: 0.5,
            }}
          >
            <CircularText
              text="RÉPONSE RAPIDE ✦ FAIT MAISON ✦ "
              className="bob relative h-56 w-56 rounded-full bg-mangue text-ganache shadow-[0_24px_40px_-20px_rgba(59,29,23,.6)]"
            >
              <span className="font-display text-6xl text-framboise">♥</span>
            </CircularText>
          </motion.div>
        </section>

        <section className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <SplitWords
              as="h2"
              text="Ou écrivez-nous"
              className="display-md"
              inView
            />
            <p className="mt-3 text-cacao">
              Remplissez le formulaire : votre demande s&apos;ouvre dans un SMS
              pré-rempli, il ne reste qu&apos;à l&apos;envoyer.
            </p>
            <p className="mt-6 text-cacao">
              Vous savez déjà ce que vous voulez ?{" "}
              <Link
                href="/commander"
                className="font-bold text-framboise underline"
              >
                Commandez directement
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1} y={30}>
            <form onSubmit={onSubmit} className="surface grid gap-5 p-6 sm:p-8">
              <fieldset>
                <legend className="field-label">Objet</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subjects.map((item) => {
                    const active = subject === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSubject(item)}
                        className={`relative isolate rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors duration-300 ${
                          active
                            ? "text-chantilly"
                            : "text-ganache shadow-[inset_0_0_0_1.5px_var(--line)] hover:shadow-[inset_0_0_0_1.5px_var(--ganache)]"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="subject-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-ganache"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                            }}
                          />
                        )}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Votre prénom
                  <input
                    name="name"
                    required
                    autoComplete="given-name"
                    className="field"
                  />
                </label>
                <label className="field-label">
                  Date souhaitée (facultatif)
                  <input name="date" type="date" className="field" />
                </label>
              </div>
              <label className="field-label">
                Votre demande
                <textarea
                  name="message"
                  required
                  placeholder="Nombre de parts, thème, parfums…"
                  rows={5}
                  className="field"
                />
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic strength={0.2}>
                  <button type="submit" className="btn btn-primary shine px-7">
                    Envoyer par SMS
                  </button>
                </Magnetic>
                <AnimatePresence>
                  {sent && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-semibold text-pistache-deep"
                      role="status"
                    >
                      Votre application SMS s&apos;ouvre avec le message.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
