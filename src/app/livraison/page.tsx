"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteHeader } from "@/components/site-header";

type LookupResult = {
  city: string;
  postcode: string;
  distanceKm: number;
  zone: "A" | "B" | "C" | "Hors zone";
  priceLabel: string;
};

const HOUILLES = {
  lat: 48.9206,
  lon: 2.1898,
};

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const getZoneFromDistance = (distanceKm: number): LookupResult["zone"] => {
  if (distanceKm <= 15) return "A";
  if (distanceKm <= 25) return "B";
  if (distanceKm <= 50) return "C";
  return "Hors zone";
};

const getPriceLabel = (zone: LookupResult["zone"]) => {
  if (zone === "A") {
    return "Gratuit des 15 EUR de commande, sinon 5,00 EUR";
  }
  if (zone === "B") return "5,00 EUR";
  if (zone === "C") return "15,00 EUR";
  return "Livraison non disponible (au-dela de 50 km).";
};

export default function LivraisonPage() {
  const [cityInput, setCityInput] = useState("");
  const [cityResult, setCityResult] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    const query = cityInput.trim();
    if (!query) {
      setLookupError("Saisis une ville pour verifier la livraison.");
      setCityResult(null);
      return;
    }

    setIsSearching(true);
    setLookupError("");
    setCityResult(null);

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&type=municipality&limit=1`
      );
      if (!response.ok) {
        throw new Error("Erreur service adresse");
      }
      const data = (await response.json()) as {
        features?: Array<{
          geometry?: { coordinates?: [number, number] };
          properties?: { city?: string; postcode?: string };
        }>;
      };

      const best = data.features?.[0];
      const coords = best?.geometry?.coordinates;
      const city = best?.properties?.city;
      const postcode = best?.properties?.postcode;

      if (!coords || !city || !postcode) {
        setLookupError("Ville introuvable. Essaie avec un autre nom.");
        setCityResult(null);
        return;
      }

      const [lon, lat] = coords;
      const distanceKmRaw = distanceInKm(HOUILLES.lat, HOUILLES.lon, lat, lon);
      const distanceKm = Math.round(distanceKmRaw * 10) / 10;
      const zone = getZoneFromDistance(distanceKm);

      setCityResult({
        city,
        postcode,
        distanceKm,
        zone,
        priceLabel: getPriceLabel(zone),
      });
    } catch {
      setLookupError("Service temporairement indisponible. Reessaie dans un instant.");
      setCityResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip pb-10">
      <SiteHeader currentPage="livraison" />
      <main className="mx-auto w-[min(1000px,92%)] py-8 sm:py-10">
        <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="mb-2 text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
          Livraison
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[#4f3340] sm:text-5xl">
          Houilles (78) et ses alentours
        </h1>
        <p className="mt-3 max-w-3xl text-[#715260]">
          Nous livrons vos commandes gourmandes sur Houilles et jusqu&apos;a 50 km
          maximum. Le retrait atelier est aussi disponible sur reservation.
        </p>
        <p className="mt-2 inline-flex rounded-full bg-[#fff2f7] px-4 py-2 text-sm font-semibold text-[#a34d74]">
          Note : les trompe-l&apos;oeil sont disponibles a J+1 (pas le jour J).
        </p>

        <div className="mt-6 rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-extrabold text-[#5c3f4c]">
            Verifier le tarif de livraison par ville
          </p>
          <form className="mt-2 flex flex-wrap items-center gap-2" onSubmit={handleLookup}>
            <input
              value={cityInput}
              onChange={(event) => setCityInput(event.target.value)}
              placeholder="Ex: Houilles, Nanterre, Versailles..."
              className="min-w-[230px] flex-1 rounded-xl border border-white/80 bg-white px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)] disabled:opacity-60"
            >
              {isSearching ? "Recherche..." : "Verifier"}
            </button>
          </form>
          {lookupError && (
            <p className="mt-2 text-sm font-semibold text-[#a34d74]">{lookupError}</p>
          )}
          {cityResult && (
            <div className="mt-3 rounded-xl bg-[#fff7fb] p-3 text-sm text-[#6d4d5a]">
              <p className="font-extrabold">
                {cityResult.city} ({cityResult.postcode})
              </p>
              <p className="mt-1">Zone : {cityResult.zone}</p>
              <p>Distance estimee : {cityResult.distanceKm.toFixed(1)} km</p>
              <p className="font-semibold">{cityResult.priceLabel}</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="glass rounded-2xl p-4">
            <p className="text-sm font-extrabold text-[#5c3f4c]">Zone A</p>
            <p className="mt-1 text-sm text-[#735665]">Jusqu&apos;a 15 km autour de Houilles</p>
            <p className="mt-1 text-xs text-[#866676]">
              Exemples : Carrières-sur-Seine, Sartrouville, Bezons, Chatou,
              Montesson.
            </p>
            <p className="mt-2 text-sm font-bold text-[#5c3f4c]">
              Gratuit des 15 EUR de commande, sinon 5,00 EUR
            </p>
          </article>
          <article className="glass rounded-2xl p-4">
            <p className="text-sm font-extrabold text-[#5c3f4c]">Zone B</p>
            <p className="mt-1 text-sm text-[#735665]">Entre 15 km et 25 km</p>
            <p className="mt-1 text-xs text-[#866676]">
              Exemples : Nanterre, Colombes, Rueil-Malmaison, Le Vésinet,
              Courbevoie.
            </p>
            <p className="mt-2 text-sm font-bold text-[#5c3f4c]">5,00 EUR</p>
          </article>
          <article className="glass rounded-2xl p-4">
            <p className="text-sm font-extrabold text-[#5c3f4c]">Zone C</p>
            <p className="mt-1 text-sm text-[#735665]">Plus de 25 km et jusqu&apos;a 50 km max</p>
            <p className="mt-1 text-xs text-[#866676]">
              Exemples : Versailles, Saint-Germain-en-Laye, Boulogne-Billancourt.
            </p>
            <p className="mt-2 text-sm font-bold text-[#5c3f4c]">15,00 EUR</p>
          </article>
        </div>

        <p className="mt-4 text-sm font-semibold text-[#7a5b69]">
          Au-dela de 50 km : livraison non disponible.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/commander"
            className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-6 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)]"
          >
            Commander maintenant
          </Link>
          <Link
            href="/livraison/planifier"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#6d4d5a] shadow-[0_10px_25px_rgba(255,114,182,.15)]"
          >
            Choisir jour et creneau
          </Link>
          <Link href="/contact" className="glass rounded-full px-6 py-3 font-bold text-[#6d4d5a]">
            Poser une question
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
