"use client";

// Aperçus "3D" en CSS/SVG des produits (cookies, trompe-l'œil, gâteaux, box),
// partagés par la fiche produit et la box à composer.

import { CSSProperties, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Product, productCatalog } from "@/data/products";

export type FormulaRow = { productId: string; flavor: string; qty: number };

export const normalizeFlavor = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getFlavorPalette = (flavor: string) => {
  const value = normalizeFlavor(flavor);
  if (value.includes("fraise") || value.includes("framboise")) {
    return { main: "#ff7ebf", dark: "#c94986", light: "#ffd0e9" };
  }
  if (value.includes("choco") || value.includes("cacao")) {
    return { main: "#8b5a3f", dark: "#4d2d1f", light: "#d7b59f" };
  }
  if (value.includes("caramel")) {
    return { main: "#d2914f", dark: "#8a5528", light: "#ffd9a5" };
  }
  if (value.includes("vanille")) {
    return { main: "#e8cf9c", dark: "#9a7a47", light: "#fff4d8" };
  }
  if (value.includes("pistache")) {
    return { main: "#95d7aa", dark: "#4f9869", light: "#ddf6e6" };
  }
  if (value.includes("mango") || value.includes("citron")) {
    return { main: "#ffba4b", dark: "#d68e1f", light: "#ffe9a8" };
  }
  return { main: "#c39cff", dark: "#7b5bbb", light: "#f2dfff" };
};

const getCookieFlavorDesign = (flavor: string) => {
  const value = normalizeFlavor(flavor);
  if (value.includes("fraise") || value.includes("framboise")) {
    return {
      type: "strawberry",
      chips: 6,
      chipColor: "#ff4d96",
      swirlColor: "#ffd8ec",
      crumbColor: "#ffd6e8",
    };
  }
  if (value.includes("choco") || value.includes("cacao")) {
    return {
      type: "choco",
      chips: 8,
      chipColor: "#4a2e23",
      swirlColor: "#bf9476",
      crumbColor: "#c9a48a",
    };
  }
  if (value.includes("caramel")) {
    return {
      type: "caramel",
      chips: 5,
      chipColor: "#9e5f35",
      swirlColor: "#ffd08b",
      crumbColor: "#f3c582",
    };
  }
  if (value.includes("vanille")) {
    return {
      type: "vanilla",
      chips: 4,
      chipColor: "#6f583d",
      swirlColor: "#fff3c6",
      crumbColor: "#f2e3be",
    };
  }
  if (value.includes("pistache")) {
    return {
      type: "pistachio",
      chips: 5,
      chipColor: "#4d8a60",
      swirlColor: "#dff5e7",
      crumbColor: "#c2e7cf",
    };
  }
  return {
    type: "classic",
    chips: 5,
    chipColor: "#6b4a34",
    swirlColor: "#f4dfb7",
    crumbColor: "#f3ddbb",
  };
};

const getCategoryPalette = (category: Product["category"]) => {
  if (category === "Trompe-l'œil") {
    return { main: "#f7b6cf", dark: "#b8678f", light: "#ffe3f1" };
  }
  if (category === "Gâteaux") {
    return { main: "#cba47a", dark: "#8a5b3b", light: "#f6e2c7" };
  }
  if (category === "Box") {
    return { main: "#b9b8ff", dark: "#6f6cc2", light: "#e8e7ff" };
  }
  return { main: "#e2b184", dark: "#94603d", light: "#ffe8c7" };
};

const getGateauFlavorPalette = (flavor: string) => {
  const value = normalizeFlavor(flavor);
  if (value.includes("chocolat") || value.includes("choco")) {
    return {
      sponge: "#8e5b3f",
      spongeDark: "#573422",
      cream: "#f0dcc7",
      glaze: "#3f241a",
      topping: "#6f402d",
    };
  }
  if (
    value.includes("mango") ||
    value.includes("mangue") ||
    value.includes("passion")
  ) {
    return {
      sponge: "#efb15d",
      spongeDark: "#b5752c",
      cream: "#fff5cf",
      glaze: "#ffbe45",
      topping: "#ff8c34",
    };
  }
  if (
    value.includes("fraise") ||
    value.includes("fruits rouges") ||
    value.includes("framboise")
  ) {
    return {
      sponge: "#dc8ba7",
      spongeDark: "#a85d7a",
      cream: "#ffe9f1",
      glaze: "#d84980",
      topping: "#a31f52",
    };
  }
  return {
    sponge: "#c7a27d",
    spongeDark: "#8d6543",
    light: "#efd4b5",
    cream: "#fff4e1",
    glaze: "#d8b188",
    topping: "#9b6a46",
  };
};

function LayerCakeVisual({ flavor }: { flavor: string }) {
  const p = getGateauFlavorPalette(flavor);
  return (
    <svg viewBox="0 0 220 220" className="layer-cake-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cakeSponge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.sponge} />
          <stop offset="100%" stopColor={p.spongeDark} />
        </linearGradient>
        <linearGradient id="cakeGlaze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.glaze} />
          <stop offset="100%" stopColor={p.topping} />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="195" rx="72" ry="14" fill="rgba(56,32,40,.18)" />

      <ellipse cx="110" cy="72" rx="66" ry="20" fill={p.cream} />
      <rect x="44" y="72" width="132" height="34" fill="url(#cakeSponge)" />
      <ellipse
        cx="110"
        cy="106"
        rx="66"
        ry="20"
        fill={p.spongeDark}
        opacity="0.95"
      />

      <ellipse cx="110" cy="106" rx="66" ry="18" fill={p.cream} />
      <rect x="44" y="106" width="132" height="32" fill="url(#cakeSponge)" />
      <ellipse
        cx="110"
        cy="138"
        rx="66"
        ry="18"
        fill={p.spongeDark}
        opacity="0.95"
      />

      <ellipse cx="110" cy="138" rx="66" ry="18" fill={p.cream} />
      <rect x="44" y="138" width="132" height="34" fill="url(#cakeSponge)" />
      <ellipse cx="110" cy="172" rx="66" ry="18" fill={p.spongeDark} />

      <ellipse cx="110" cy="68" rx="66" ry="22" fill="url(#cakeGlaze)" />
      <path
        d="M57 69c6 6 3 15 0 21M84 69c5 5 3 13 1 18M112 69c5 6 4 15 1 22M138 68c6 6 5 16 2 21M162 69c6 7 4 16 1 21"
        stroke={p.glaze}
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle cx="84" cy="58" r="7" fill={p.topping} />
      <circle cx="110" cy="53" r="8" fill={p.topping} />
      <circle cx="136" cy="58" r="7" fill={p.topping} />
      <ellipse cx="84" cy="56" rx="2.7" ry="1.5" fill="rgba(255,255,255,.45)" />
      <ellipse cx="110" cy="51" rx="3" ry="1.6" fill="rgba(255,255,255,.45)" />
      <ellipse
        cx="136"
        cy="56"
        rx="2.7"
        ry="1.5"
        fill="rgba(255,255,255,.45)"
      />
    </svg>
  );
}

const getTrompeFlavorKind = (flavor: string) => {
  const value = normalizeFlavor(flavor);
  if (value.includes("framboise") || value.includes("fraise")) {
    return "raspberry";
  }
  if (
    value.includes("mango") ||
    value.includes("mangue") ||
    value.includes("passion")
  ) {
    return "mango";
  }
  if (value.includes("pistache")) {
    return "pistachio";
  }
  return "classic";
};

const getTrompePalette = (flavor: string) => {
  const kind = getTrompeFlavorKind(flavor);
  if (kind === "mango") {
    return { main: "#ffb642", dark: "#c67019", light: "#ffe59a" };
  }
  if (kind === "pistachio") {
    return { main: "#9bcf88", dark: "#4f7f3e", light: "#e3f2cc" };
  }
  if (kind === "raspberry") {
    return { main: "#df3b78", dark: "#8f1f4a", light: "#ffc7df" };
  }
  return { main: "#f2a7cd", dark: "#a25f83", light: "#ffe2f1" };
};

function TrompeFruitVisual({ flavor }: { flavor: string }) {
  const kind = getTrompeFlavorKind(flavor);

  if (kind === "mango") {
    return (
      <svg viewBox="0 0 200 200" className="trompe-svg" aria-hidden="true">
        <defs>
          <linearGradient id="mangoBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe49f" />
            <stop offset="52%" stopColor="#ffb540" />
            <stop offset="100%" stopColor="#e47f2f" />
          </linearGradient>
        </defs>
        <path
          d="M57 38c34-13 90 3 103 42 13 39-18 84-57 94-39 9-78-17-84-54C13 83 28 48 57 38Z"
          fill="url(#mangoBody)"
          stroke="#d17122"
          strokeWidth="3"
        />
        <ellipse cx="128" cy="128" rx="32" ry="18" fill="rgba(201,82,23,.28)" />
        <path
          d="M130 26c22-7 34 16 23 31-14 19-39 8-42-10-2-10 7-18 19-21Z"
          fill="#74be75"
          stroke="#447a45"
          strokeWidth="3"
        />
        <path d="M129 41c8 2 14 5 20 11" stroke="#ddffd9" strokeWidth="2" />
        <ellipse cx="80" cy="62" rx="20" ry="10" fill="rgba(255,255,255,.38)" />
      </svg>
    );
  }

  if (kind === "pistachio") {
    return (
      <svg viewBox="0 0 200 200" className="trompe-svg" aria-hidden="true">
        <defs>
          <linearGradient
            id="pistachioShell"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ecf6d0" />
            <stop offset="58%" stopColor="#9bc97d" />
            <stop offset="100%" stopColor="#6f9158" />
          </linearGradient>
        </defs>
        <path
          d="M40 84c0-33 29-58 62-58 35 0 59 28 59 61 0 41-31 80-75 80-27 0-46-22-46-42 0-11 6-25 22-31 12-5 21-3 28 2"
          fill="url(#pistachioShell)"
          stroke="#6e8b53"
          strokeWidth="3"
        />
        <path
          d="M74 76c17-15 49-9 58 11 5 13-3 25-16 30-19 6-36-2-43-15"
          fill="none"
          stroke="#51703f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="88" cy="62" r="3.2" fill="#7ca862" />
        <circle cx="102" cy="54" r="2.8" fill="#7ca862" />
        <circle cx="116" cy="58" r="3" fill="#7ca862" />
        <ellipse cx="74" cy="52" rx="16" ry="8" fill="rgba(255,255,255,.32)" />
      </svg>
    );
  }

  const berryDots = [
    [74, 48],
    [96, 45],
    [118, 50],
    [62, 66],
    [85, 65],
    [107, 64],
    [129, 67],
    [52, 86],
    [74, 84],
    [96, 84],
    [118, 84],
    [140, 86],
    [60, 106],
    [82, 105],
    [104, 105],
    [126, 105],
    [70, 126],
    [92, 124],
    [114, 124],
  ];

  return (
    <svg viewBox="0 0 200 200" className="trompe-svg" aria-hidden="true">
      <defs>
        <radialGradient id="raspBerry" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb8d5" />
          <stop offset="55%" stopColor="#db3a77" />
          <stop offset="100%" stopColor="#8f1f4a" />
        </radialGradient>
      </defs>
      {berryDots.map(([x, y], idx) => (
        <circle
          key={`berry-dot-${idx}`}
          cx={x}
          cy={y}
          r={11}
          fill="url(#raspBerry)"
          stroke="#7f1c44"
          strokeWidth="1.8"
        />
      ))}
      <path
        d="M85 33c8-10 24-10 32 0-11 7-21 7-32 0Z"
        fill="#6faf63"
        stroke="#4c8248"
        strokeWidth="2"
      />
      <ellipse cx="86" cy="58" rx="18" ry="8" fill="rgba(255,255,255,.28)" />
    </svg>
  );
}

export const getPreviewOverlay = (category: Product["category"]) => {
  if (category === "Trompe-l'œil") {
    return "from-[#fde3ea] to-[#e4f1dc]";
  }
  if (category === "Gâteaux") {
    return "from-[#fbe7e4] to-[#fdf0d8]";
  }
  if (category === "Box") {
    return "from-[#efe9f8] to-[#fbe7e4]";
  }
  return "from-[#fdeedd] to-[#fbe7e4]";
};

function ThreeDItem({
  category,
  flavor,
  index,
}: {
  category: Product["category"];
  flavor: string;
  index: number;
}) {
  if (category === "Trompe-l'œil") {
    return (
      <div className="trompe-realistic float-pop">
        <TrompeFruitVisual flavor={flavor} />
      </div>
    );
  }

  if (category === "Gâteaux") {
    return (
      <div className="layer-cake-realistic float-pop">
        <LayerCakeVisual flavor={flavor} />
      </div>
    );
  }

  const palette =
    category === "Cookies"
      ? getFlavorPalette(flavor)
      : getCategoryPalette(category);
  const style = {
    "--tone-main": palette.main,
    "--tone-dark": palette.dark,
    "--tone-light": palette.light,
  } as CSSProperties;

  if (category === "Cookies") {
    const cookieDesign = getCookieFlavorDesign(flavor);
    return (
      <div
        className={`cookie-3d float-pop cookie-${cookieDesign.type}`}
        style={
          {
            ...style,
            "--chip-color": cookieDesign.chipColor,
            "--swirl-color": cookieDesign.swirlColor,
            "--crumb-color": cookieDesign.crumbColor,
          } as CSSProperties
        }
      >
        <span className="cookie-side" />
        <span className="cookie-rim" />
        <span className="cookie-highlight" />
        <span className="cookie-swirl" />
        {Array.from({ length: cookieDesign.chips }).map((_, dot) => (
          <span
            key={`${index}-${dot}`}
            className="cookie-chip"
            style={
              {
                "--chip-x": `${15 + ((dot * 17 + index * 8) % 60)}%`,
                "--chip-y": `${14 + ((dot * 23 + index * 6) % 62)}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="cake-3d float-pop" style={style}>
      <span className="cake-top" />
      <span className="cake-side" />
    </div>
  );
}

export function ProductBox3D({
  category,
  flavor,
  label,
}: {
  category: Product["category"];
  flavor: string;
  label: string;
}) {
  const isSignatureBox = category === "Box";
  const palette =
    category === "Cookies"
      ? getFlavorPalette(flavor)
      : category === "Trompe-l'œil"
        ? getTrompePalette(flavor)
        : getCategoryPalette(category);
  const style = {
    "--tone-main": palette.main,
    "--tone-dark": palette.dark,
    "--tone-light": palette.light,
  } as CSSProperties;

  return (
    <div
      className={`box-3d float-pop ${isSignatureBox ? "box-signature" : "box-premium"}`}
      style={style}
    >
      <span className="box-lid" />
      <span className="box-body" />
      {isSignatureBox && (
        <>
          <span className="box-cream-wave" />
          <span className="box-sticker">signature</span>
          <span className="box-spark spark-a" />
          <span className="box-spark spark-b" />
        </>
      )}
      <p className="box-label">{label}</p>
    </div>
  );
}

/** Boîte pâtissière rayée avec fenêtre, ruban et nœud (SVG). */
export function PastryBox({
  category,
  flavor,
  label,
  width = 130,
}: {
  category: Product["category"];
  flavor: string;
  label: string;
  width?: number;
}) {
  const palette =
    category === "Cookies"
      ? getFlavorPalette(flavor)
      : category === "Trompe-l'œil"
        ? getTrompePalette(flavor)
        : getCategoryPalette(category);
  const id = `box-${normalizeFlavor(flavor).replace(/[^a-z]/g, "")}-${category.length}`;
  return (
    <svg
      viewBox="0 0 160 132"
      width={width}
      height={(width * 132) / 160}
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <pattern
          id={`${id}-stripes`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <rect width="16" height="16" fill="#fffaf7" />
          <rect width="8" height="16" fill={palette.light} />
        </pattern>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.light} />
          <stop offset="100%" stopColor={palette.main} />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="124" rx="70" ry="7" fill="rgba(59,29,23,.2)" />
      {/* Corps rayé */}
      <rect
        x="14"
        y="52"
        width="132"
        height="70"
        rx="6"
        fill={`url(#${id}-stripes)`}
        stroke="rgba(59,29,23,.18)"
      />
      {/* Fenêtre avec les douceurs */}
      <rect
        x="38"
        y="66"
        width="84"
        height="34"
        rx="8"
        fill="rgba(255,255,255,.85)"
        stroke="rgba(59,29,23,.2)"
      />
      {[56, 80, 104].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="84" r="11" fill={palette.main} />
          <circle cx={cx - 3} cy="80" r="2.2" fill={palette.dark} />
          <circle cx={cx + 4} cy="86" r="2.2" fill={palette.dark} />
          <circle cx={cx - 2} cy="89" r="1.8" fill={palette.dark} />
          <ellipse
            cx={cx - 4}
            cy="78"
            rx="4"
            ry="2"
            fill="rgba(255,255,255,.45)"
          />
        </g>
      ))}
      <path d="M44 70 L58 70 L46 96 Z" fill="rgba(255,255,255,.5)" />
      {/* Étiquettes de part et d'autre du ruban */}
      <text
        x="44"
        y="114"
        textAnchor="middle"
        fontSize="11"
        fill="var(--framboise)"
        fontFamily="var(--font-shrikhand), serif"
      >
        Patsam
      </text>
      <text
        x="116"
        y="114"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        fill="var(--ganache)"
      >
        {label.length > 12 ? `${label.slice(0, 11)}…` : label}
      </text>
      {/* Couvercle */}
      <path d="M22 34 L138 34 L150 52 L10 52 Z" fill={`url(#${id}-lid)`} />
      <rect x="8" y="48" width="144" height="12" rx="4" fill={palette.main} />
      <rect
        x="8"
        y="56"
        width="144"
        height="4"
        rx="2"
        fill="rgba(59,29,23,.12)"
      />
      {/* Ruban et nœud */}
      <rect x="74" y="34" width="12" height="88" fill="var(--framboise)" />
      <rect x="74" y="34" width="4" height="88" fill="rgba(255,255,255,.25)" />
      <path
        d="M80 36 C64 18, 46 24, 54 36 C58 42, 70 40, 80 36 Z"
        fill="var(--framboise)"
        stroke="var(--framboise-deep)"
        strokeWidth="1.5"
      />
      <path
        d="M80 36 C96 18, 114 24, 106 36 C102 42, 90 40, 80 36 Z"
        fill="var(--framboise)"
        stroke="var(--framboise-deep)"
        strokeWidth="1.5"
      />
      <path
        d="M78 38 L70 54 M82 38 L90 54"
        stroke="var(--framboise)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="37" r="5.5" fill="var(--framboise-deep)" />
    </svg>
  );
}

// Nombre d'articles par boîte : au-delà, les articles se rangent en boîtes.
// 0 = pas de boîte (les gâteaux restent sur le présentoir).
const PACK_SIZE: Record<Product["category"], number> = {
  Cookies: 6,
  "Trompe-l'œil": 4,
  Gâteaux: 0,
  Box: 1,
};

const UNIT_LABEL: Record<Product["category"], [string, string]> = {
  Cookies: ["cookie", "cookies"],
  "Trompe-l'œil": ["trompe-l'œil", "trompe-l'œil"],
  Gâteaux: ["gâteau", "gâteaux"],
  Box: ["box", "box"],
};

// Taille d'affichage (px) et taille d'origine du visuel CSS/SVG.
const ITEM_SIZE: Record<Product["category"], { size: number; base: number }> = {
  Cookies: { size: 76, base: 74 },
  "Trompe-l'œil": { size: 84, base: 106 },
  Gâteaux: { size: 96, base: 100 },
  Box: { size: 76, base: 74 },
};

// Emplacements en pyramide sur le napperon : 3 en bas, 2 au-dessus.
const SLOTS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -0.5, y: 1 },
  { x: 0.5, y: 1 },
];

const MAX_VISIBLE_BOXES = 3;

const describe = (
  category: Product["category"],
  boxes: number,
  loose: number,
  qty: number,
) => {
  const pack = PACK_SIZE[category];
  const [one, many] = UNIT_LABEL[category];
  if (pack === 0) return `${qty} ${qty > 1 ? many : one}`;
  if (pack === 1) return `${boxes} ${boxes > 1 ? many : one}`;
  const parts: string[] = [];
  if (boxes > 0)
    parts.push(`${boxes} ${boxes > 1 ? "boîtes" : "boîte"} de ${pack}`);
  if (loose > 0) parts.push(`${loose} ${loose > 1 ? many : one}`);
  return parts.join(" + ");
};

export function Dynamic3DPreview({
  product,
  flavor,
  qty,
}: {
  product: Product;
  flavor: string;
  qty: number;
}) {
  const reduce = useReducedMotion();
  const category = product.category;
  const safeQty = Math.max(1, qty);
  const pack = PACK_SIZE[category];
  const boxes =
    pack === 0 ? 0 : pack === 1 ? safeQty : Math.floor(safeQty / pack);
  const loose =
    pack === 0
      ? Math.min(safeQty, SLOTS.length)
      : pack === 1
        ? 0
        : safeQty % pack;
  const overflow = safeQty - loose - boxes * Math.max(pack, 0);
  const { size, base } = ITEM_SIZE[category];

  // Quand une boîte se remplit, les articles en vrac s'envolent dedans.
  const [previousBoxes, setPreviousBoxes] = useState(boxes);
  const [packing, setPacking] = useState(false);
  if (previousBoxes !== boxes) {
    setPacking(boxes > previousBoxes);
    setPreviousBoxes(boxes);
  }

  const itemVariants = {
    hidden: { y: -170, opacity: 0, rotate: -25, scale: 0.7 },
    shown: { y: 0, opacity: 1, rotate: 0, scale: 1 },
    gone: (isPacking: boolean) =>
      isPacking
        ? {
            x: -140,
            y: 30,
            scale: 0.15,
            opacity: 0,
            rotate: -90,
            transition: { duration: 0.45 },
          }
        : {
            y: -50,
            scale: 0,
            opacity: 0,
            rotate: 40,
            transition: { duration: 0.25 },
          },
  };

  return (
    <div className="qty-stage">
      <div className="qty-stage-scene">
        <span aria-hidden="true" className="qty-doily scallop-frame" />

        <div className="qty-stage-content relative z-10">
          <motion.div layout className="flex items-end justify-center gap-6">
            {/* Boîtes empilées */}
            <AnimatePresence initial={false}>
              {boxes > 0 && (
                <motion.div
                  key="boxes"
                  layout
                  className="relative flex flex-col-reverse items-center"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                >
                  <AnimatePresence initial={false}>
                    {Array.from({
                      length: Math.min(boxes, MAX_VISIBLE_BOXES),
                    }).map((_, index) => (
                      <motion.div
                        key={`box-${index}`}
                        className={index > 0 ? "-mb-16" : ""}
                        style={{ zIndex: index }}
                        initial={
                          reduce ? false : { y: -180, rotate: -12, opacity: 0 }
                        }
                        animate={{
                          y: 0,
                          rotate: index % 2 ? 2 : -2,
                          opacity: 1,
                        }}
                        exit={{
                          y: -60,
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.25 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 15,
                        }}
                      >
                        <PastryBox
                          category={category}
                          flavor={flavor}
                          label={category === "Box" ? "Patsam" : flavor}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {boxes > MAX_VISIBLE_BOXES && (
                    <motion.span
                      key={boxes}
                      initial={{ scale: 1.6 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-4 z-20 rounded-full bg-framboise px-2.5 py-1 text-sm font-extrabold text-white shadow-lg"
                    >
                      ×{boxes}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Articles en vrac sur le napperon */}
            {pack !== 1 && (
              <motion.div
                layout
                className="relative"
                style={{ width: size * 3, height: size * 1.7 }}
              >
                <AnimatePresence>
                  {overflow > 0 && (
                    <motion.span
                      key={overflow}
                      initial={{ scale: 1.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 18,
                      }}
                      className="absolute -top-2 right-0 z-20 rounded-full bg-framboise px-3 py-1 text-sm font-extrabold text-white shadow-lg"
                    >
                      +{overflow}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence custom={packing} initial={false}>
                  {Array.from({ length: loose }).map((_, index) => {
                    const slot = SLOTS[index];
                    return (
                      <motion.div
                        key={`item-${index}`}
                        custom={packing}
                        variants={itemVariants}
                        initial={reduce ? false : "hidden"}
                        animate="shown"
                        exit="gone"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 13,
                        }}
                        className="absolute"
                        style={{
                          width: size,
                          height: size,
                          left: size * (1 + slot.x),
                          bottom: slot.y * size * 0.62,
                          zIndex: 10 - slot.y,
                        }}
                      >
                        <span aria-hidden="true" className="qty-item-shadow" />
                        <motion.div
                          key={flavor}
                          initial={reduce ? false : { rotateY: 90, scale: 0.8 }}
                          animate={{ rotateY: 0, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                            delay: index * 0.04,
                          }}
                          className="qty-item"
                          style={{ width: size, height: size }}
                        >
                          <div
                            style={{
                              transform: `scale(${size / base})`,
                              transformOrigin: "top left",
                            }}
                          >
                            <ThreeDItem
                              category={category}
                              flavor={flavor}
                              index={index}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${boxes}-${loose}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-ganache"
          >
            {describe(category, boxes, loose, safeQty)}
          </motion.p>
        </AnimatePresence>
        {pack > 1 && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={loose === 0 ? "full" : "missing"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-right text-sm text-cacao"
            >
              {loose === 0 ? (
                <span className="rounded-full bg-pistache px-3 py-1 font-bold text-pistache-deep">
                  Boîte complète !
                </span>
              ) : (
                <>
                  Encore{" "}
                  <span className="font-bold text-framboise">
                    {pack - loose}
                  </span>{" "}
                  pour remplir une boîte
                </>
              )}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export function FormulaBox3DPreview({ rows }: { rows: FormulaRow[] }) {
  const activeRows = rows
    .map((row) => {
      const product = productCatalog.find((item) => item.id === row.productId);
      if (!product || row.qty <= 0) return null;
      return { product, flavor: row.flavor, qty: row.qty };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const miniItems = activeRows.flatMap((row) =>
    Array.from({ length: Math.min(2, row.qty) }).map((_, idx) => ({
      key: `${row.product.id}-${row.flavor}-${idx}`,
      category: row.product.category,
      flavor: row.flavor,
    })),
  );

  return (
    <div className="preview-scene">
      <div className="formula-preview-stage">
        <div className="formula-box-main">
          <ProductBox3D category="Box" flavor="Mix surprise" label="BOX MIX" />
        </div>
        <div className="formula-mini-items">
          {miniItems.slice(0, 4).map((item, idx) => (
            <ThreeDItem
              key={item.key}
              category={item.category}
              flavor={item.flavor}
              index={idx}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-cacao">
        {activeRows.reduce((sum, row) => sum + row.qty, 0)} pièce(s) dans la box
      </p>
    </div>
  );
}
