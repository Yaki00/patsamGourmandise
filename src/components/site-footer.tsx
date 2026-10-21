import Link from "next/link";
import { Magnetic, Marquee, Reveal } from "@/components/fx";
import { contact } from "@/data/site";

const ribbonWords = [
  "Cookies XXL",
  "Trompe-l'œil",
  "Layer cakes",
  "Box à composer",
  "Fait maison",
  "Houilles (78)",
];

export function SiteFooter() {
  return (
    <footer className="mt-28 overflow-hidden">
      <Marquee speed={35} className="-rotate-2 bg-mangue py-4">
        {ribbonWords.map((word) => (
          <span
            key={word}
            className="font-display flex items-center gap-8 pr-8 text-3xl text-ganache sm:text-4xl"
          >
            {word}
            <span aria-hidden="true" className="text-framboise">
              ✦
            </span>
          </span>
        ))}
      </Marquee>

      <div
        className="band band-scallop-top -mt-3 text-[#f6e4df]"
        style={{ "--band": "var(--ganache)" } as React.CSSProperties}
      >
        <div className="mx-auto w-[min(1200px,92%)] pt-20">
          <Reveal className="grid items-end gap-8 border-b border-white/15 pb-16 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] text-[#ffd3df]">
                Une envie soudaine ?
              </p>
              <p className="mt-4 max-w-md text-lg text-[#e8cfc8]">
                Appelez ou envoyez un SMS : on vous dit ce qui sort du four
                aujourd&apos;hui.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Magnetic>
                <a
                  href={contact.phoneHref}
                  className="btn shine bg-framboise px-7 text-lg text-white hover:bg-framboise-deep"
                >
                  {contact.phoneLabel}
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={contact.smsHref}
                  className="btn border-2 border-white/30 px-7 text-lg text-white hover:border-white"
                >
                  Envoyer un SMS
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1fr_1fr]">
            <section>
              <p className="font-display text-3xl text-[#ffd3df]">
                Patsam Gourmandise
              </p>
              <p className="mt-3 max-w-xs text-[0.95rem] text-[#e8cfc8]">
                Cookies, trompe-l&apos;œil et layer cakes faits maison à
                Houilles (78). Livraison dans un rayon de 50 km, retrait à
                l&apos;atelier sur réservation.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#ffd3df]">Le site</h2>
              <nav className="mt-3 grid justify-items-start gap-1.5 text-[0.95rem]">
                {[
                  ["/", "Accueil"],
                  ["/commander", "Commander"],
                  ["/checkout", "Mon panier"],
                  ["/livraison", "Livraison"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="underline-grow hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#ffd3df]">Nous joindre</h2>
              <ul className="mt-3 grid justify-items-start gap-1.5 text-[0.95rem]">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="underline-grow hover:text-white"
                  >
                    {contact.phoneLabel}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="underline-grow hover:text-white"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>Snapchat : {contact.snapchat}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-bold text-[#ffd3df]">Bon à savoir</h2>
              <ul className="mt-3 grid gap-1.5 text-[0.95rem]">
                <li>Trompe-l&apos;œil : livrés à J+1</li>
                <li>Tout le reste : le jour même</li>
                <li>Paiement à la validation</li>
              </ul>
            </section>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display pointer-events-none -mb-[0.28em] text-center text-[25vw] leading-none text-white/[0.06] select-none"
        >
          Patsam
        </p>

        <div className="relative mx-auto flex w-[min(1200px,92%)] flex-wrap items-center justify-between gap-3 border-t border-white/15 py-6 text-sm text-[#d9bdb5]">
          <p>© {new Date().getFullYear()} Patsam Gourmandise</p>
          <p>
            Site réalisé par{" "}
            <a
              href="https://pixelbrain.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#ffd3df] hover:underline"
            >
              pixelbrain.fr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
