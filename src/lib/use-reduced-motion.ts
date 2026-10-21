"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * Préférence "animations réduites", sans écart d'hydratation : le serveur et
 * le premier rendu client valent `false`, la vraie valeur arrive juste après.
 * (Le hook de motion lit la préférence dès le premier rendu client.)
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
