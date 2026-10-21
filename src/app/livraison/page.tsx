"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SiteHeader } from "@/components/site-header";
import { easeOut, Magnetic, Reveal, SplitWords } from "@/components/fx";
import { sprinkleBurst } from "@/lib/sprinkles";

type LookupResult = {
  city: string;
  postcode: string;
  distanceKm: number;
  zone: "A" | "B" | "C" | "Hors zone";
  priceLabel: string;
  // Décalage en km par rapport à l'atelier (est / sud), pour placer l'épingle.
  eastKm: number;
  southKm: number;
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
        )}&type=municipality&limit=1&lat=${HOUILLES.lat}&lon=${HOUILLES.lon}`,
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
        eastKm: (lon - HOUILLES.lon) * 111.32 * Math.cos(toRad(HOUILLES.lat)),
        southKm: (HOUILLES.lat - lat) * 110.57,
      });
      if (zone !== "Hors zone") {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        sprinkleBurst(rect.right - 60, rect.top + 40, 24);
      }
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
          <div>
            <SplitWords
              text="On livre autour de Houilles"
              className="display-lg"
            />
            <Reveal delay={0.35} y={16}>
              <p className="lede mt-4">
                Jusqu&apos;à 50 km autour de l&apos;atelier, le jour même. Les
                trompe-l&apos;œil sont livrés à J+1. Le retrait à l&apos;atelier
                est possible sur réservation.
              </p>
            </Reveal>

            <Reveal delay={0.5} y={24}>
              <form className="surface mt-8 p-5" onSubmit={handleLookup}>
                <label htmlFor="city" className="field-label">
                  Quel tarif pour ma ville ?
                </label>
                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="city"
                    value={cityInput}
                    onChange={(event) => setCityInput(event.target.value)}
                    placeholder="Sartrouville, Nanterre, Versailles…"
                    autoComplete="address-level2"
                    className="field mt-0! flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="btn btn-primary shine min-w-32"
                  >
                    {isSearching ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Recherche
                      </span>
                    ) : (
                      "Vérifier"
                    )}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {lookupError && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: [0, -6, 6, -3, 0] }}
                      exit={{ opacity: 0 }}
                      className="mt-3 text-[0.95rem] font-semibold text-framboise"
                      role="alert"
                    >
                      {lookupError}
                    </motion.p>
                  )}
                  {cityResult && (
                    <motion.div
                      key={cityResult.city}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                      className={`mt-4 rounded-2xl p-4 ${
                        cityResult.zone === "Hors zone"
                          ? "bg-lait-fraise"
                          : "bg-pistache/60"
                      }`}
                      role="status"
                    >
                      <p className="text-lg font-extrabold">
                        {cityResult.city} ({cityResult.postcode})
                      </p>
                      <p className="text-[0.95rem] text-cacao">
                        {cityResult.distanceKm.toFixed(1).replace(".", ",")} km
                        de l&apos;atelier
                        {cityResult.zone !== "Hors zone" && (
                          <>, zone {cityResult.zone}</>
                        )}
                      </p>
                      <p className="mt-1 font-bold text-framboise">
                        {cityResult.priceLabel}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Reveal>
          </div>

          <ZoneMap result={cityResult} />
        </section>

        <section className="mt-24">
          <SplitWords
            as="h2"
            text="Les tarifs par zone"
            className="display-md"
            inView
          />
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {zoneDetails.map((zone, index) => {
              const active = cityResult?.zone === zone.id;
              return (
                <Reveal key={zone.id} delay={index * 0.1}>
                  <motion.article
                    animate={{ y: active ? -8 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative isolate h-full overflow-hidden rounded-[1.75rem] p-6 transition-colors duration-500 ${
                      active ? "text-chantilly" : "surface"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="zone-card"
                        className="absolute inset-0 -z-10 bg-ganache"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`font-display absolute -right-2 -bottom-8 text-[8rem] leading-none ${
                        active ? "text-white/10" : "text-framboise/10"
                      }`}
                    >
                      {zone.id}
                    </span>
                    <p className="font-display text-3xl">Zone {zone.id}</p>
                    <p className="mt-1 font-semibold">{zone.range}</p>
                    <p
                      className={`mt-3 text-[0.95rem] ${active ? "text-chantilly/80" : "text-cacao"}`}
                    >
                      {zone.examples}
                    </p>
                    <p className="mt-4 text-xl font-extrabold">{zone.price}</p>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-6 text-cacao">
            Au-delà de 50 km, la livraison n&apos;est pas disponible.
          </p>
        </section>

        <Reveal className="mt-12 flex flex-wrap gap-3">
          <Magnetic>
            <Link href="/commander" className="btn btn-primary shine px-7">
              Commander
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/livraison/planifier" className="btn btn-outline">
              Choisir mon jour et mon créneau
            </Link>
          </Magnetic>
          <Link href="/contact" className="btn btn-soft">
            Poser une question
          </Link>
        </Reveal>
      </main>
    </div>
  );
}

const zoneDetails = [
  {
    id: "A",
    range: "Jusqu'à 15 km",
    examples:
      "Sartrouville, Chatou, Nanterre, Rueil-Malmaison, Saint-Germain-en-Laye, Versailles, Paris",
    price: "Offerte dès 15\u00a0€, sinon 5\u00a0€",
  },
  {
    id: "B",
    range: "De 15 à 25 km",
    examples: "Cergy, Pontoise, Les Mureaux, Montreuil, Vincennes, Massy",
    price: "5\u00a0€",
  },
  {
    id: "C",
    range: "De 25 à 50 km",
    examples:
      "Mantes-la-Jolie, Rambouillet, Chantilly, Évry-Courcouronnes, Chelles",
    price: "15\u00a0€",
  },
];

// Échelle : 50 km = 190 px, les anneaux sont proportionnels aux vrais rayons.
const PX_PER_KM = 190 / 50;

function ZoneMap({ result }: { result: LookupResult | null }) {
  const reduce = useReducedMotion();
  const activeZone = result?.zone;
  const rings = [
    { id: "C", r: 190, fill: "var(--chantilly)", label: "50 km" },
    { id: "B", r: 95, fill: "var(--framboise-soft)", label: "25 km" },
    { id: "A", r: 57, fill: "var(--pistache)", label: "15 km" },
  ];
  // Hors zone : l'épingle reste au bord de la carte, dans la bonne direction.
  const pin = result
    ? (() => {
        const scale = Math.min(
          1,
          196 /
            Math.max(1, Math.hypot(result.eastKm, result.southKm) * PX_PER_KM),
        );
        return {
          x: 200 + result.eastKm * PX_PER_KM * scale,
          y: 200 + result.southKm * PX_PER_KM * scale,
        };
      })()
    : null;

  return (
    <motion.figure
      className="mx-auto w-full max-w-[30rem]"
      aria-label="Carte des zones de livraison autour de Houilles"
      initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full overflow-visible"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="sweep"
            x1="200"
            y1="10"
            x2="80"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--framboise)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--framboise)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="map-clip">
            <circle cx="200" cy="200" r="190" />
          </clipPath>
        </defs>

        {rings.map((ring, index) => {
          const active = activeZone === ring.id;
          return (
            <motion.g
              key={ring.id}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: 0.3 + index * 0.12,
              }}
              style={{ transformOrigin: "200px 200px" }}
            >
              <motion.circle
                cx="200"
                cy="200"
                r={ring.r}
                animate={{ fill: active ? "#c8174f" : ring.fill }}
                transition={{ duration: 0.5 }}
                stroke="var(--ganache)"
                strokeWidth={active ? 3 : 1.5}
                strokeDasharray={ring.id === "C" ? "6 6" : undefined}
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
            </motion.g>
          );
        })}

        {/* Balayage radar */}
        {!reduce && (
          <g clipPath="url(#map-clip)">
            <g
              className="spin-slow"
              style={{
                transformOrigin: "200px 200px",
                animationDuration: "6s",
              }}
            >
              <path
                d="M200 200 L200 10 A190 190 0 0 0 66 66 Z"
                fill="url(#sweep)"
              />
              <line
                x1="200"
                y1="200"
                x2="200"
                y2="10"
                stroke="var(--framboise)"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
            </g>
          </g>
        )}

        <circle
          className="pulse-ring"
          cx="200"
          cy="200"
          r="16"
          fill="none"
          stroke="var(--ganache)"
          strokeWidth="2"
        />
        <circle
          cx="200"
          cy="200"
          r="7"
          fill={activeZone === "A" ? "#fff" : "var(--ganache)"}
        />
        <text
          x="200"
          y="226"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={activeZone === "A" ? "#fff" : "var(--ganache)"}
        >
          Houilles
        </text>

        <AnimatePresence>
          {result && pin && (
            <motion.g
              key={result.city}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.line
                x1="200"
                y1="200"
                x2={pin.x}
                y2={pin.y}
                stroke="var(--ganache)"
                strokeWidth="2.5"
                strokeDasharray="5 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: easeOut }}
              />
              <motion.g
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                  delay: 0.6,
                }}
              >
                <path
                  d={`M${pin.x} ${pin.y} c-10 -14 -16 -20 -16 -28 a16 16 0 1 1 32 0 c0 8 -6 14 -16 28z`}
                  fill="var(--mangue)"
                  stroke="var(--ganache)"
                  strokeWidth="2"
                />
                <circle
                  cx={pin.x}
                  cy={pin.y - 28}
                  r="6"
                  fill="var(--ganache)"
                />
                <text
                  x={pin.x}
                  y={pin.y - 52}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="var(--ganache)"
                  stroke="var(--chantilly)"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  {result.city}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.figure>
  );
}
