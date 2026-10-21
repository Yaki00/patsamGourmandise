import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader />
      <main className="mx-auto w-[min(800px,92%)] py-24 text-center">
        <p className="font-display text-[clamp(6rem,20vw,11rem)] leading-none text-framboise">
          404
        </p>
        <h1 className="display-lg mt-4">Cette page a été mangée</h1>
        <p className="lede mx-auto mt-4">
          Il n&apos;en reste plus une miette. La vitrine, elle, est toujours
          bien garnie.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary shine px-7">
            Retour à l&apos;accueil
          </Link>
          <Link href="/commander" className="btn btn-outline px-7">
            Commander
          </Link>
        </div>
      </main>
    </div>
  );
}
