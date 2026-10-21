import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const channels = [
  {
    label: "Email",
    value: "contact@patsam-gourmandise.fr",
    href: "mailto:contact@patsam-gourmandise.fr",
  },
  { label: "Téléphone", value: "06 00 00 00 00", href: "tel:+33600000000" },
  { label: "Snapchat", value: "patsam78" },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="contact" />
      <main className="mx-auto grid w-[min(1100px,92%)] items-start gap-12 pt-12 sm:pt-16 lg:grid-cols-[.85fr_1.15fr]">
        <section className="hero-in">
          <h1 className="display-lg">Parlons de votre gâteau</h1>
          <p className="lede mt-4">
            Anniversaire, événement ou création sur mesure : envoyez-nous la
            date, le nombre de parts et vos envies. On revient vers vous
            rapidement.
          </p>

          <ul className="mt-10 grid gap-1">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-line py-4">
                <p className="text-sm font-semibold text-cacao">
                  {channel.label}
                </p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="text-xl font-extrabold text-ganache hover:text-framboise"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="text-xl font-extrabold text-ganache">
                    {channel.value}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-cacao">
            Vous savez déjà ce que vous voulez ?{" "}
            <Link
              href="/commander"
              className="font-bold text-framboise underline"
            >
              Commandez directement
            </Link>
            .
          </p>
        </section>

        <form className="surface grid gap-4 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Nom complet
              <input autoComplete="name" className="field" />
            </label>
            <label className="field-label">
              Email
              <input type="email" autoComplete="email" className="field" />
            </label>
          </div>
          <label className="field-label">
            Objet
            <select defaultValue="commande" className="field">
              <option value="commande">Demande de commande</option>
              <option value="personnalisation">
                Personnalisation d&apos;un produit
              </option>
              <option value="livraison">Question sur la livraison</option>
              <option value="devis">Devis pour un événement</option>
              <option value="autre">Autre demande</option>
            </select>
          </label>
          <label className="field-label">
            Votre demande
            <textarea
              placeholder="Date, nombre de parts, thème, parfums…"
              rows={6}
              className="field"
            />
          </label>
          <button
            type="button"
            className="btn btn-primary mt-2 w-full sm:w-fit"
          >
            Envoyer ma demande
          </button>
        </form>
      </main>
    </div>
  );
}
