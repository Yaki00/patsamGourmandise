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
  lon2: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
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
    return "Offerte dès 15 € de commande, sinon 5 €";
  }
  if (zone === "B") return "5 €";
  if (zone === "C") return "15 €";
  return "Pas de livraison au-delà de 50 km, mais le retrait à l'atelier reste possible.";
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
      setLookupError("Entrez une ville pour vérifier la livraison.");
      setCityResult(null);
      return;
    }

    setIsSearching(true);
    setLookupError("");
    setCityResult(null);

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query,
        )}&type=municipality&limit=1`,
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
        setLookupError(
          "Ville introuvable. Vérifiez l'orthographe ou essayez une commune voisine.",
        );
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
      setLookupError(
        "Le service d'adresses ne répond pas. Réessayez dans un instant.",
      );
      setCityResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader currentPage="livraison" />
      <main className="mx-auto w-[min(1100px,92%)] pt-12 sm:pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="hero-in">
            <h1 className="display-lg">On livre autour de Houilles</h1>
            <p className="lede mt-4">
              Jusqu&apos;à 50 km autour de l&apos;atelier, le jour même. Les
              trompe-l&apos;œil sont livrés à J+1. Le retrait à l&apos;atelier
              est possible sur réservation.
            </p>

            <form className="surface mt-8 p-5" onSubmit={handleLookup}>
              <label htmlFor="city" className="field-label">
                Quel tarif pour ma ville ?
              </label>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                <input
                  id="city"
                  value={cityInput}
                  onChange={(event) => setCityInput(event.target.value)}
                  placeholder="Houilles, Nanterre, Versailles…"
                  autoComplete="address-level2"
                  className="field mt-0! flex-1"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn btn-primary"
                >
                  {isSearching ? "Recherche…" : "Vérifier"}
                </button>
              </div>
              {lookupError && (
                <p
                  className="mt-3 text-[0.95rem] font-semibold text-framboise"
                  role="alert"
                >
                  {lookupError}
                </p>
              )}
              {cityResult && (
                <div
                  className="mt-4 rounded-2xl bg-lait-fraise p-4"
                  role="status"
                >
                  <p className="text-lg font-extrabold">
                    {cityResult.city} ({cityResult.postcode})
                  </p>
                  <p className="text-[0.95rem] text-cacao">
                    {cityResult.distanceKm.toFixed(1).replace(".", ",")} km de
                    l&apos;atelier
                    {cityResult.zone !== "Hors zone" && (
                      <>, zone {cityResult.zone}</>
                    )}
                  </p>
                  <p className="mt-1 font-bold text-framboise">
                    {cityResult.priceLabel}
                  </p>
                </div>
              )}
            </form>
          </div>

          <ZoneMap activeZone={cityResult?.zone} />
        </section>

        <section className="mt-20">
          <h2 className="display-md">Les tarifs par zone</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {zoneDetails.map((zone) => (
              <article
                key={zone.id}
                className={`rounded-[1.75rem] p-6 transition ${
                  cityResult?.zone === zone.id
                    ? "bg-ganache text-chantilly"
                    : "surface"
                }`}
              >
                <p className="font-display text-3xl">Zone {zone.id}</p>
                <p className="mt-1 font-semibold">{zone.range}</p>
                <p
                  className={`mt-3 text-[0.95rem] ${cityResult?.zone === zone.id ? "text-chantilly/80" : "text-cacao"}`}
                >
                  {zone.examples}
                </p>
                <p className="mt-4 text-xl font-extrabold">{zone.price}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-cacao">
            Au-delà de 50 km, la livraison n&apos;est pas disponible.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/commander" className="btn btn-primary">
            Commander
          </Link>
          <Link href="/livraison/planifier" className="btn btn-outline">
            Choisir mon jour et mon créneau
          </Link>
          <Link href="/contact" className="btn btn-soft">
            Poser une question
          </Link>
        </div>
      </main>
    </div>
  );
}

const zoneDetails = [
  {
    id: "A",
    range: "Jusqu'à 15 km",
    examples: "Carrières-sur-Seine, Sartrouville, Bezons, Chatou, Montesson",
    price: "Offerte dès 15 €, sinon 5 €",
  },
  {
    id: "B",
    range: "De 15 à 25 km",
    examples: "Nanterre, Colombes, Rueil-Malmaison, Le Vésinet, Courbevoie",
    price: "5 €",
  },
  {
    id: "C",
    range: "De 25 à 50 km",
    examples: "Versailles, Saint-Germain-en-Laye, Boulogne-Billancourt",
    price: "15 €",
  },
];

// Anneaux proportionnels aux rayons réels (15, 25 et 50 km).
function ZoneMap({ activeZone }: { activeZone?: LookupResult["zone"] }) {
  const rings = [
    { id: "C", r: 190, fill: "var(--chantilly)", label: "50 km" },
    { id: "B", r: 95, fill: "var(--framboise-soft)", label: "25 km" },
    { id: "A", r: 57, fill: "var(--pistache)", label: "15 km" },
  ];
  return (
    <figure
      className="mx-auto w-full max-w-[30rem]"
      aria-label="Carte des zones de livraison autour de Houilles"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full"
        role="img"
        aria-hidden="true"
      >
        {rings.map((ring) => {
          const active = activeZone === ring.id;
          return (
            <g key={ring.id}>
              <circle
                cx="200"
                cy="200"
                r={ring.r}
                fill={active ? "var(--framboise)" : ring.fill}
                stroke="var(--ganache)"
                strokeWidth={active ? 3 : 1.5}
                strokeDasharray={ring.id === "C" ? "6 6" : undefined}
                style={{ transition: "fill 300ms ease" }}
              />
              <text
                x="200"
                y={200 - ring.r + 20}
                textAnchor="middle"
                className="font-display"
                fontSize="18"
                fill={active ? "#fff" : "var(--ganache)"}
              >
                {ring.id}
              </text>
              <text
                x="200"
                y={200 + ring.r - 10}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={active ? "#fff" : "var(--cacao)"}
              >
                {ring.label}
              </text>
            </g>
          );
        })}
        <circle
          cx="200"
          cy="200"
          r="7"
          fill={activeZone === "A" ? "#fff" : "var(--ganache)"}
        />
        <text
          x="200"
          y="224"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={activeZone === "A" ? "#fff" : "var(--ganache)"}
        >
          Houilles
        </text>
      </svg>
    </figure>
  );
}
