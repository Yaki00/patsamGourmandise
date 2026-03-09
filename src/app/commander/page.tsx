"use client";

import Image from "next/image";
import { CSSProperties, FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, formatPrice, productCatalog } from "@/data/products";
import { useCart } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";

type FormulaRow = { productId: string; flavor: string; qty: number };

const categories = [
  "Toutes",
  ...Array.from(new Set(productCatalog.map((item) => item.category))),
];

const normalizeFlavor = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getFlavorPalette = (flavor: string) => {
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
  if (category === "Trompe-l'oeil") {
    return { main: "#f7b6cf", dark: "#b8678f", light: "#ffe3f1" };
  }
  if (category === "Gateaux") {
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
  if (value.includes("mango") || value.includes("mangue") || value.includes("passion")) {
    return {
      sponge: "#efb15d",
      spongeDark: "#b5752c",
      cream: "#fff5cf",
      glaze: "#ffbe45",
      topping: "#ff8c34",
    };
  }
  if (value.includes("fraise") || value.includes("fruits rouges") || value.includes("framboise")) {
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
      <ellipse cx="110" cy="106" rx="66" ry="20" fill={p.spongeDark} opacity="0.95" />

      <ellipse cx="110" cy="106" rx="66" ry="18" fill={p.cream} />
      <rect x="44" y="106" width="132" height="32" fill="url(#cakeSponge)" />
      <ellipse cx="110" cy="138" rx="66" ry="18" fill={p.spongeDark} opacity="0.95" />

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
      <ellipse cx="136" cy="56" rx="2.7" ry="1.5" fill="rgba(255,255,255,.45)" />
    </svg>
  );
}

const getTrompeFlavorKind = (flavor: string) => {
  const value = normalizeFlavor(flavor);
  if (value.includes("framboise") || value.includes("fraise")) {
    return "raspberry";
  }
  if (value.includes("mango") || value.includes("mangue") || value.includes("passion")) {
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
          <linearGradient id="pistachioShell" x1="0%" y1="0%" x2="100%" y2="100%">
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

const getPreviewOverlay = (category: Product["category"]) => {
  if (category === "Trompe-l'oeil") {
    return "from-[#ffddec]/55 to-[#e9fffb]/25";
  }
  if (category === "Gateaux") {
    return "from-[#ffe8c8]/55 to-[#fff7dd]/25";
  }
  if (category === "Box") {
    return "from-[#e5e4ff]/55 to-[#f7ebff]/25";
  }
  return "from-[#ffe7d0]/55 to-[#fff2d9]/25";
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
  if (category === "Trompe-l'oeil") {
    return (
      <div className="trompe-realistic float-pop">
        <TrompeFruitVisual flavor={flavor} />
      </div>
    );
  }

  if (category === "Gateaux") {
    return (
      <div className="layer-cake-realistic float-pop">
        <LayerCakeVisual flavor={flavor} />
      </div>
    );
  }

  const palette =
    category === "Cookies" ? getFlavorPalette(flavor) : getCategoryPalette(category);
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

function ProductBox3D({
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
      : category === "Trompe-l'oeil"
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

function Dynamic3DPreview({
  product,
  flavor,
  qty,
}: {
  product: Product;
  flavor: string;
  qty: number;
}) {
  const safeQty = Math.max(1, qty);

  return (
    <div className="preview-scene">
      {product.category === "Cookies" ? (
        <>
          <div className="single-model-stage">
            <span className="qty-chip">x{safeQty}</span>

            {safeQty <= 3 && (
              <div className="cookie-lineup">
                {Array.from({ length: safeQty }).map((_, idx) => (
                  <ThreeDItem
                    key={`cookie-single-${idx}`}
                    category="Cookies"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 4 && safeQty <= 7 && (
              <div className="cookie-pile">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ThreeDItem
                    key={`cookie-pile-${idx}`}
                    category="Cookies"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 8 && safeQty <= 14 && (
              <div className="model-scale">
                <ProductBox3D
                  category="Cookies"
                  flavor={flavor}
                  label={product.name}
                />
              </div>
            )}

            {safeQty >= 15 && (
              <div className="box-stack">
                <ProductBox3D
                  category="Cookies"
                  flavor={flavor}
                  label={product.name}
                />
                <ProductBox3D
                  category="Cookies"
                  flavor={flavor}
                  label={product.name}
                />
                <ProductBox3D
                  category="Cookies"
                  flavor={flavor}
                  label={product.name}
                />
              </div>
            )}
          </div>
        </>
      ) : product.category === "Trompe-l'oeil" ? (
        <>
          <div className="single-model-stage">
            <span className="qty-chip">x{safeQty}</span>

            {safeQty <= 3 && (
              <div className="trompe-lineup">
                {Array.from({ length: safeQty }).map((_, idx) => (
                  <ThreeDItem
                    key={`trompe-single-${idx}`}
                    category="Trompe-l'oeil"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 4 && safeQty <= 7 && (
              <div className="trompe-pile">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <ThreeDItem
                    key={`trompe-pile-${idx}`}
                    category="Trompe-l'oeil"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 8 && safeQty <= 14 && (
              <div className="model-scale">
                <ProductBox3D
                  category="Trompe-l'oeil"
                  flavor={flavor}
                  label={flavor}
                />
              </div>
            )}

            {safeQty >= 15 && (
              <div className="box-stack">
                <ProductBox3D
                  category="Trompe-l'oeil"
                  flavor={flavor}
                  label={flavor}
                />
                <ProductBox3D
                  category="Trompe-l'oeil"
                  flavor={flavor}
                  label={flavor}
                />
                <ProductBox3D
                  category="Trompe-l'oeil"
                  flavor={flavor}
                  label={flavor}
                />
              </div>
            )}
          </div>
        </>
      ) : product.category === "Gateaux" ? (
        <>
          <div className="single-model-stage">
            <span className="qty-chip">x{safeQty}</span>

            {safeQty <= 3 && (
              <div className="gateaux-lineup">
                {Array.from({ length: safeQty }).map((_, idx) => (
                  <ThreeDItem
                    key={`gateau-single-${idx}`}
                    category="Gateaux"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 4 && safeQty <= 7 && (
              <div className="gateaux-pile">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <ThreeDItem
                    key={`gateau-pile-${idx}`}
                    category="Gateaux"
                    flavor={flavor}
                    index={idx}
                  />
                ))}
              </div>
            )}

            {safeQty >= 8 && safeQty <= 14 && (
              <div className="model-scale">
                <ProductBox3D category="Gateaux" flavor={flavor} label={product.name} />
              </div>
            )}

            {safeQty >= 15 && (
              <div className="box-stack">
                <ProductBox3D category="Gateaux" flavor={flavor} label={product.name} />
                <ProductBox3D category="Gateaux" flavor={flavor} label={product.name} />
                <ProductBox3D category="Gateaux" flavor={flavor} label={product.name} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="single-model-stage">
            <div className="model-scale">
              <ProductBox3D
                category={product.category}
                flavor={flavor}
                label={product.name}
              />
            </div>
            <span className="qty-chip">x{safeQty}</span>
          </div>
        </>
      )}
    </div>
  );
}

function FormulaBox3DPreview({ rows }: { rows: FormulaRow[] }) {
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
    }))
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
      <p className="mt-2 text-sm font-bold text-[#634754]">
        {activeRows.reduce((sum, row) => sum + row.qty, 0)} piece(s) dans la box
      </p>
    </div>
  );
}

function CommanderPageContent() {
  const searchParams = useSearchParams();
  const requestedProductId = searchParams.get("product");
  const requestedProductFromUrl = requestedProductId
    ? productCatalog.find((item) => item.id === requestedProductId) ?? null
    : null;
  const { entries, addItem, setItemQty, subtotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    requestedProductFromUrl?.category ?? "Toutes"
  );
  const [modalOpen, setModalOpen] = useState(Boolean(requestedProductFromUrl));
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [modalProductId, setModalProductId] = useState<string | null>(
    requestedProductFromUrl?.id ?? null
  );
  const [modalFlavor, setModalFlavor] = useState<string>(
    requestedProductFromUrl?.flavors[0] ?? ""
  );
  const [modalQty, setModalQty] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formulaRows, setFormulaRows] = useState<FormulaRow[]>([
    { productId: "cookie-triple-choco", flavor: "Fraise", qty: 2 },
    { productId: "layer-cake-signature", flavor: "Vanille fruits rouges", qty: 1 },
    { productId: "trompe-loeil-framboise", flavor: "Framboise vanille", qty: 1 },
  ]);
  const [formulaFeedback, setFormulaFeedback] = useState<string>("");

  const filteredProducts =
    selectedCategory === "Toutes"
      ? productCatalog
      : productCatalog.filter((item) => item.category === selectedCategory);

  const selectedProduct = useMemo(
    () =>
      modalProductId
        ? productCatalog.find((item) => item.id === modalProductId) ?? null
        : null,
    [modalProductId]
  );

  useEffect(() => {
    if (!modalOpen && !formulaModalOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (modalOpen) {
          setModalOpen(false);
        } else {
          setFormulaModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [modalOpen, formulaModalOpen]);

  const cartItems = useMemo(() => {
    return entries
      .map((item) => {
        const product = productCatalog.find((catalogItem) => {
          return catalogItem.id === item.productId;
        });
        if (!product) return null;
        return {
          key: `${item.productId}::${item.flavor}`,
          ...product,
          flavor: item.flavor,
          qty: item.qty,
          total: product.price * item.qty,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        ...item,
      }));
  }, [entries]);

  const delivery = subtotal > 0 && subtotal < 60 ? 6.9 : 0;
  const grandTotal = subtotal + delivery;

  const formulaTotal = formulaRows.reduce((sum, row) => {
    const product = productCatalog.find((item) => item.id === row.productId);
    if (!product || row.qty <= 0) return sum;
    return sum + product.price * row.qty;
  }, 0);

  const updateFormulaProduct = (rowIndex: number, productId: string) => {
    const product = productCatalog.find((item) => item.id === productId);
    setFormulaRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex
          ? {
              productId,
              flavor: product?.flavors[0] ?? "Classique",
              qty: Math.max(1, row.qty),
            }
          : row
      )
    );
  };

  const updateFormulaFlavor = (rowIndex: number, flavor: string) => {
    setFormulaRows((previous) =>
      previous.map((row, index) => (index === rowIndex ? { ...row, flavor } : row))
    );
  };

  const updateFormulaQty = (rowIndex: number, qty: number) => {
    setFormulaRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex ? { ...row, qty: Math.max(0, Math.min(30, qty)) } : row
      )
    );
  };

  const addFormulaRow = () => {
    setFormulaRows((previous) => [
      ...previous,
      { productId: "cookie-triple-choco", flavor: "Fraise", qty: 1 },
    ]);
  };

  const removeFormulaRow = (rowIndex: number) => {
    setFormulaRows((previous) => previous.filter((_, index) => index !== rowIndex));
  };

  const addFormulaToCart = () => {
    const normalized = formulaRows
      .map((row) => {
        const product = productCatalog.find((item) => item.id === row.productId);
        if (!product || row.qty <= 0) return null;
        const safeFlavor = product.flavors.includes(row.flavor)
          ? row.flavor
          : product.flavors[0];
        return { productId: product.id, flavor: safeFlavor, qty: row.qty };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));

    if (normalized.length === 0) {
      setFormulaFeedback("Ajoute au moins un produit dans la formule.");
      return;
    }

    normalized.forEach((line) => addItem(line));

    setFormulaFeedback("Formule ajoutee au panier.");
  };

  const openConfigModal = (product: Product) => {
    setModalProductId(product.id);
    setModalFlavor(product.flavors[0] ?? "Classique");
    setModalQty(1);
    setModalOpen(true);
  };

  const confirmModalSelection = () => {
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    const flavor = modalFlavor || selectedProduct.flavors[0] || "Classique";
    const qty = Math.max(1, Math.min(30, modalQty));
    addItem({ productId, flavor, qty });
    setModalOpen(false);
  };

  const decreaseCartQty = (key: string) => {
    const [productId, flavor] = key.split("::");
    const line = cartItems.find((item) => item.key === key);
    if (!line) return;
    setItemQty(productId, flavor, line.qty - 1);
  };

  const increaseCartQty = (key: string) => {
    const [productId, flavor] = key.split("::");
    const line = cartItems.find((item) => item.key === key);
    if (!line) return;
    setItemQty(productId, flavor, line.qty + 1);
  };

  const submitOrder = (event: FormEvent) => {
    event.preventDefault();
    if (cartItems.length === 0) return;
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip pb-14">
      <div className="sugar-grain" />
      <div className="pointer-events-none fixed -top-40 -left-24 -z-10 h-96 w-96 rounded-full bg-[#ff8ccd]/30 blur-[85px]" />
      <div className="pointer-events-none fixed -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#8decc3]/30 blur-[95px]" />

      <SiteHeader currentPage="commander" />

      <main className="mx-auto w-[min(1200px,94%)] pt-6 sm:w-[min(1200px,92%)] sm:pt-10">
        <section className="animate-reveal is-visible mb-8">
          <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-[#966a7d] uppercase">
            Finaliser ma commande
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4f3340] sm:text-6xl">
            Compose ton panier gourmand
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#775766] sm:text-lg">
            Ajoute tes gateaux et cookies favoris, ajuste les quantites puis
            envoie ta demande de commande.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#6d4e5d]">
              Livraison sur Houilles (78) et alentours.
            </div>
            <div className="inline-flex rounded-full bg-[#fff2f7] px-4 py-2 text-sm font-semibold text-[#a34d74]">
              Trompe-l&apos;oeil disponibles a J+1 (pas le jour J).
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
          <section id="catalogue" className="space-y-4">
            <div className="glass flex flex-wrap gap-2 rounded-2xl p-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#ff72b6] to-[#ffa183] text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
                      : "bg-white text-[#6d4d5a]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <article className="glass group rounded-3xl p-4 shadow-[0_18px_45px_rgba(248,154,194,.14)]">
              <div className="relative mb-4 h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffd9ee] via-[#ffe9bf] to-[#d9ffe9]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="formula-card-preview">
                    <ProductBox3D category="Box" flavor="Mix surprise" label="BOX MIX" />
                  </div>
                </div>
                <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-[#6d4d5a]">
                  Personnalisable
                </span>
                <span className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-sm font-black text-[#4f3340]">
                  A partir de 29,00 EUR
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#553a46]">
                Formule Box Signature
              </h2>
              <p className="mt-1 text-sm text-[#765968]">
                Compose ta box : produits, parfums et quantites. Ex: 2 cookies +
                1 layer cake + 1 trompe-l&apos;oeil.
              </p>
              <button
                type="button"
                onClick={() => setFormulaModalOpen(true)}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
              >
                Selectionner
              </button>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredProducts.map((item) => (
                <article
                  key={item.id}
                  className={`glass group rounded-3xl p-4 shadow-[0_18px_45px_rgba(248,154,194,.14)] ${
                    item.category === "Box"
                      ? "ring-1 ring-[#ff8fc9]/55 shadow-[0_20px_50px_rgba(255,114,182,.26)]"
                      : ""
                  }`}
                >
                  <div className="relative mb-4 h-52 overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-[#6d4d5a]">
                      {item.tag}
                    </span>
                    <span className="absolute right-3 bottom-3 rounded-full bg-white px-3 py-1 text-sm font-black text-[#4f3340]">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#553a46]">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#765968]">{item.description}</p>
                  <p className="mt-2 text-xs font-bold text-[#8a6273]">
                    Parfums: {item.flavors.join(", ")}
                  </p>
                  <button
                    type="button"
                    onClick={() => openConfigModal(item)}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
                  >
                    Selectionner
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside id="panier" className="glass h-fit rounded-3xl p-4 sm:p-5">
            <h3 className="text-2xl font-black text-[#4f3340]">Mon panier</h3>
            {cartItems.length === 0 ? (
              <p className="mt-3 text-sm text-[#7a5d6a]">
                Ton panier est vide. Ajoute des produits depuis le catalogue.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.key}
                    className="rounded-2xl bg-white/70 p-3 text-sm text-[#5f434f]"
                  >
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs font-semibold text-[#7a5b6b]">
                      Parfum: {item.flavor}
                    </p>
                    <p>
                      {item.qty} x {formatPrice(item.price)} ={" "}
                      <span className="font-bold">{formatPrice(item.total)}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseCartQty(item.key)}
                        className="h-8 w-8 rounded-full bg-white text-base font-black text-[#734d5f] shadow"
                        aria-label={`Retirer ${item.name}`}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => increaseCartQty(item.key)}
                        className="h-8 w-8 rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] text-base font-black text-white shadow"
                        aria-label={`Ajouter ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 space-y-2 rounded-2xl bg-white/70 p-4 text-sm text-[#644653]">
              <p className="flex items-center justify-between">
                <span>Sous-total</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Livraison rapide</span>
                <span className="font-bold">{formatPrice(delivery)}</span>
              </p>
              <p className="flex items-center justify-between border-t border-white pt-2 text-base">
                <span className="font-extrabold">Total</span>
                <span className="font-extrabold">{formatPrice(grandTotal)}</span>
              </p>
            </div>

            <form onSubmit={submitOrder} className="mt-5 space-y-3">
              <input
                required
                placeholder="Nom complet"
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              />
              <input
                required
                type="tel"
                placeholder="Telephone"
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              />
              <textarea
                placeholder="Adresse de livraison"
                rows={3}
                className="w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
              />
              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Envoyer la commande
              </button>
            </form>

            {isSubmitted && (
              <p className="mt-3 rounded-xl bg-[#dffce9] px-3 py-2 text-sm font-semibold text-[#24583c]">
                Commande envoyee. On te recontacte rapidement pour confirmation.
              </p>
            )}
          </aside>
        </div>
      </main>

      {formulaModalOpen && (
        <div
          className="fixed inset-0 z-[75] flex items-start justify-center overflow-y-auto bg-black/45 p-2 sm:p-4"
          onClick={() => setFormulaModalOpen(false)}
        >
          <div
            className="glass grid max-h-[calc(100dvh-1rem)] w-full max-w-6xl grid-cols-1 gap-0 overflow-y-auto rounded-[1.4rem] lg:max-h-[calc(100dvh-2rem)] lg:grid-cols-2 lg:overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-white/72 p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
                    Formule box personnalisable
                  </p>
                  <h2 className="text-3xl font-black text-[#4f3340]">
                    Compose ta box librement
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setFormulaModalOpen(false)}
                  className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#734d5f]"
                >
                  Fermer
                </button>
              </div>

              <p className="text-sm text-[#6f515f]">
                Choisis les produits et parfums, puis ajoute ta formule en un clic.
              </p>

              <div className="mt-4 space-y-3">
                {formulaRows.map((row, index) => {
                  const product = productCatalog.find((item) => item.id === row.productId);
                  const flavors = product?.flavors ?? [];
                  return (
                    <div
                      key={`formula-row-${index}`}
                      className="rounded-2xl bg-white/70 p-3 grid gap-2 md:grid-cols-[1.3fr_1.1fr_88px_44px]"
                    >
                      <select
                        value={row.productId}
                        onChange={(event) =>
                          updateFormulaProduct(index, event.target.value)
                        }
                        className="rounded-xl border border-white/80 bg-white px-3 py-2 text-sm font-semibold text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                      >
                        {productCatalog
                          .filter((item) => item.category !== "Box")
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>

                      <select
                        value={row.flavor}
                        onChange={(event) => updateFormulaFlavor(index, event.target.value)}
                        className="rounded-xl border border-white/80 bg-white px-3 py-2 text-sm font-semibold text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                      >
                        {flavors.map((flavor) => (
                          <option key={flavor} value={flavor}>
                            {flavor}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={row.qty}
                        onChange={(event) =>
                          updateFormulaQty(index, Number(event.target.value))
                        }
                        className="rounded-xl border border-white/80 bg-white px-3 py-2 text-sm font-bold text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                      />

                      <button
                        type="button"
                        onClick={() => removeFormulaRow(index)}
                        className="rounded-xl bg-white text-sm font-black text-[#7a5769]"
                        aria-label="Retirer ligne formule"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addFormulaRow}
                  className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6d4d5a]"
                >
                  + Ajouter une ligne
                </button>
                <button
                  type="button"
                  onClick={addFormulaToCart}
                  className="rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,114,182,.35)]"
                >
                  Ajouter la formule au panier
                </button>
              </div>

              {formulaFeedback && (
                <p className="mt-3 text-sm font-semibold text-[#6a4c5b]">
                  {formulaFeedback}
                </p>
              )}
            </div>

            <div className="relative overflow-hidden p-4 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffe5f4] via-[#fff2ce] to-[#dffdeb]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd5e9]/45 to-[#fff4d8]/20" />
              <div className="relative z-10">
                <p className="text-xs font-extrabold tracking-[0.16em] text-[#7f5f6f] uppercase">
                  Apercu 3D de la formule
                </p>
                <h3 className="text-2xl font-black text-[#4f3340]">
                  Box personnalisee - {formatPrice(formulaTotal)}
                </h3>
                <FormulaBox3DPreview rows={formulaRows} />
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/45 p-2 sm:p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass grid max-h-[calc(100dvh-1rem)] w-full max-w-5xl grid-cols-1 gap-0 overflow-y-auto rounded-[1.4rem] lg:max-h-[calc(100dvh-2rem)] lg:grid-cols-2 lg:overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-white/72 p-4 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-extrabold tracking-[0.16em] text-[#966a7d] uppercase">
                    Configuration produit
                  </p>
                  <h2 className="text-3xl font-black text-[#4f3340]">
                    {selectedProduct.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#734d5f]"
                >
                  Fermer
                </button>
              </div>

              <p className="text-sm text-[#6f515f]">{selectedProduct.description}</p>

              <label className="mt-5 block text-sm font-bold text-[#725161]">
                Parfum
                <select
                  value={modalFlavor}
                  onChange={(event) => setModalFlavor(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/80 bg-white px-3 py-2 text-sm font-medium text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                >
                  {selectedProduct.flavors.map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5">
                <p className="text-sm font-bold text-[#725161]">Quantite</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalQty((value) => Math.max(1, value - 1))}
                    className="h-10 w-10 rounded-full bg-white text-lg font-black text-[#734d5f] shadow"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={modalQty}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setModalQty(
                        Number.isNaN(value) ? 1 : Math.min(30, Math.max(1, value))
                      );
                    }}
                    className="w-20 rounded-xl border border-white/80 bg-white px-3 py-2 text-center text-sm font-bold text-[#5f414d] outline-none focus:ring-2 focus:ring-[#ff9dd0]"
                  />
                  <button
                    type="button"
                    onClick={() => setModalQty((value) => Math.min(30, value + 1))}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] text-lg font-black text-white shadow"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/70 p-3 text-sm text-[#654755]">
                <p>
                  Selection: <b>{modalQty}</b> x <b>{selectedProduct.name}</b>
                </p>
                <p>
                  Parfum: <b>{modalFlavor}</b>
                </p>
                <p>
                  Prix estime: <b>{formatPrice(selectedProduct.price * modalQty)}</b>
                </p>
              </div>

              <button
                type="button"
                onClick={confirmModalSelection}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-[#ff72b6] to-[#ffa183] px-5 py-3 font-bold text-white shadow-[0_14px_35px_rgba(255,114,182,.32)] transition hover:-translate-y-0.5"
              >
                Ajouter au panier
              </button>
            </div>

            <div className="relative overflow-hidden p-4 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffe5f4] via-[#fff2ce] to-[#dffdeb]" />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getPreviewOverlay(
                  selectedProduct.category
                )}`}
              />
              <div className="relative z-10">
                <p className="text-xs font-extrabold tracking-[0.16em] text-[#7f5f6f] uppercase">
                  Apercu dynamique
                </p>
                <h3 className="text-2xl font-black text-[#4f3340]">
                  {modalQty} {modalQty > 1 ? "pieces" : "piece"} - {modalFlavor}
                </h3>

                <Dynamic3DPreview
                  product={selectedProduct}
                  flavor={modalFlavor}
                  qty={modalQty}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={null}>
      <CommanderPageContent />
    </Suspense>
  );
}
