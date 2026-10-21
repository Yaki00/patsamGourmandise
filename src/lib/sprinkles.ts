// Petites animations "vermicelles" en Web Animations API, sans dépendance.

const SPRINKLE_COLORS = [
  "#c8174f",
  "#f7b84b",
  "#b9d9a5",
  "#f9d3dc",
  "#3b1d17",
  "#ffffff",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Explosion de vermicelles depuis un point de l'écran. */
export function sprinkleBurst(x: number, y: number, count = 28) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 60 + Math.random() * 110;
    const rotate = Math.random() * 720 - 360;
    const width = 4 + Math.random() * 3;
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${width}px;height:${
      width * 3
    }px;border-radius:99px;background:${
      SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]
    };pointer-events:none;z-index:200;box-shadow:0 1px 2px rgba(59,29,23,.25)`;
    document.body.appendChild(el);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    el.animate(
      [
        { transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotate}deg) scale(1)`,
          opacity: 1,
          offset: 0.7,
        },
        {
          transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${
            dy + 60
          }px)) rotate(${rotate * 1.3}deg) scale(.6)`,
          opacity: 0,
        },
      ],
      {
        duration: 900 + Math.random() * 400,
        easing: "cubic-bezier(.15,.8,.3,1)",
      },
    ).onfinish = () => el.remove();
  }
}

/** Fait voler une vignette produit jusqu'au panier de l'en-tête. */
export function flyToCart(from: DOMRect, imageUrl: string) {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target || prefersReducedMotion()) {
    window.dispatchEvent(new CustomEvent("cart:bump"));
    return;
  }
  // L'en-tête peut être caché (scroll) : on le fait revenir et on vise sa
  // position finale, sans la translation en cours.
  window.dispatchEvent(new CustomEvent("header:show"));
  const header = target.closest("header");
  const shift = header
    ? new DOMMatrixReadOnly(getComputedStyle(header).transform).m42
    : 0;
  const raw = target.getBoundingClientRect();
  const to = new DOMRect(raw.x, raw.y - shift, raw.width, raw.height);
  const size = 72;
  const ghost = document.createElement("span");
  ghost.style.cssText = `position:fixed;left:${from.left + from.width / 2 - size / 2}px;top:${
    from.top + from.height / 2 - size / 2
  }px;width:${size}px;height:${size}px;border-radius:999px;background:center/cover url("${imageUrl}");box-shadow:0 0 0 4px #fff,0 12px 30px rgba(59,29,23,.35);pointer-events:none;z-index:200`;
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.8)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0.6 },
    ],
    { duration: 750, easing: "cubic-bezier(.5,0,.3,1)" },
  ).onfinish = () => {
    ghost.remove();
    window.dispatchEvent(new CustomEvent("cart:bump"));
    sprinkleBurst(to.left + to.width / 2, to.top + to.height / 2, 14);
  };
}
