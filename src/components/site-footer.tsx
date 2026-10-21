import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="band band-scallop-top mt-24 text-[#f6e4df]"
      style={{ "--band": "var(--ganache)" } as React.CSSProperties}
    >
      <div className="mx-auto grid w-[min(1200px,92%)] gap-10 pt-16 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1fr_1fr]">
        <section>
          <p className="font-display text-3xl text-[#ffd3df]">
            Patsam Gourmandise
          </p>
          <p className="mt-3 max-w-xs text-[0.95rem] text-[#e8cfc8]">
            Cookies, trompe-l&apos;œil et layer cakes faits maison à Houilles
            (78). Livraison dans un rayon de 50 km, retrait à l&apos;atelier sur
            réservation.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[#ffd3df]">Le site</h2>
          <nav className="mt-3 grid gap-1.5 text-[0.95rem]">
            <Link href="/" className="hover:text-white hover:underline">
              Accueil
            </Link>
            <Link
              href="/commander"
              className="hover:text-white hover:underline"
            >
              Commander
            </Link>
            <Link href="/checkout" className="hover:text-white hover:underline">
              Mon panier
            </Link>
            <Link
              href="/livraison"
              className="hover:text-white hover:underline"
            >
              Livraison
            </Link>
            <Link href="/contact" className="hover:text-white hover:underline">
              Contact
            </Link>
          </nav>
        </section>

        <section>
          <h2 className="text-sm font-bold text-[#ffd3df]">Nous joindre</h2>
          <ul className="mt-3 grid gap-1.5 text-[0.95rem]">
            <li>
              <a
                href="mailto:contact@patsam-gourmandise.fr"
                className="hover:text-white hover:underline"
              >
                contact@patsam-gourmandise.fr
              </a>
            </li>
            <li>
              <a
                href="tel:+33600000000"
                className="hover:text-white hover:underline"
              >
                06 00 00 00 00
              </a>
            </li>
            <li>Snapchat : patsam78</li>
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

      <div className="mx-auto flex w-[min(1200px,92%)] flex-wrap items-center justify-between gap-3 border-t border-white/15 py-6 text-sm text-[#d9bdb5]">
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
    </footer>
  );
}
