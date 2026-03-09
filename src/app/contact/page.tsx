import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip pb-10">
      <SiteHeader currentPage="contact" />
      <main className="mx-auto w-[min(1000px,94%)] py-6 sm:w-[min(1000px,92%)] sm:py-10">
        <div className="glass rounded-3xl p-4 sm:p-8">
        <p className="mb-2 text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
          Contact
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
          Parlons de ta commande
        </h1>
        <p className="mt-3 max-w-2xl text-[#715260]">
          Pour un anniversaire, un evenement ou une creation sur mesure, envoie
          nous les details et on revient vers toi rapidement.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-bold text-[#5e424f]">Email</p>
            <p className="text-sm text-[#745867]">contact@patsam-gourmandise.fr</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-bold text-[#5e424f]">Telephone</p>
            <p className="text-sm text-[#745867]">06 00 00 00 00</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm font-bold text-[#5e424f]">Snapchat</p>
            <p className="text-sm text-[#745867]">patsam78</p>
          </div>
        </div>

        <form className="mt-6 grid gap-3">
          <input
            placeholder="Nom complet"
            className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
          />
          <input
            placeholder="Email"
            type="email"
            className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
          />
          <select
            defaultValue="commande"
            className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
          >
            <option value="commande">Objet : Demande de commande</option>
            <option value="personnalisation">Objet : Personnalisation produit</option>
            <option value="livraison">Objet : Question livraison</option>
            <option value="devis">Objet : Devis evenement</option>
            <option value="autre">Objet : Autre demande</option>
          </select>
          <textarea
            placeholder="Ton besoin (date, quantite, theme, parfums...)"
            rows={5}
            className="rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
          />
          <button
            type="button"
            className="w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] sm:w-fit"
          >
            Envoyer ma demande
          </button>
        </form>

        <div className="mt-7">
          <Link href="/commander" className="text-sm font-bold text-[#f24ea5]">
            Ou passer directement une commande
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
