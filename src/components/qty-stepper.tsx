"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

/** Compteur − / + dont le chiffre défile dans le sens du changement. */
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 30,
  packSize = 0,
  quickPicksClassName = "",
  labelId,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Taille de boîte : affiche les raccourcis 1 / 1 boîte / 2 boîtes. */
  packSize?: number;
  quickPicksClassName?: string;
  labelId?: string;
}) {
  const [direction, setDirection] = useState(1);
  const quickPicks = packSize > 1 ? [1, packSize, packSize * 2] : [];

  const change = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    setDirection(clamped >= value ? 1 : -1);
    onChange(clamped);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className="inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-[inset_0_0_0_1.5px_var(--line)]"
        role="group"
        aria-labelledby={labelId}
        aria-label={labelId ? undefined : "Quantité"}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={() => change(value - 1)}
          disabled={value <= min}
          className="grid h-11 w-11 place-items-center rounded-full text-2xl font-bold text-ganache transition-colors hover:bg-lait-fraise disabled:opacity-30"
          aria-label="Retirer un article"
        >
          −
        </motion.button>
        <span
          className="relative grid h-11 w-14 place-items-center overflow-hidden text-2xl font-extrabold tabular-nums"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              key={value}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ y: dir > 0 ? 28 : -28, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                leave: (dir: number) => ({ y: dir > 0 ? -28 : 28, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="leave"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={() => change(value + 1)}
          disabled={value >= max}
          className="grid h-11 w-11 place-items-center rounded-full bg-framboise text-2xl font-bold text-white transition-colors hover:bg-framboise-deep disabled:opacity-30"
          aria-label="Ajouter un article"
        >
          +
        </motion.button>
      </div>
      {quickPicks.map((pick) => (
        <motion.button
          key={pick}
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => change(pick)}
          aria-pressed={value === pick}
          className={`rounded-full px-3.5 py-2 text-sm font-bold text-ganache shadow-[inset_0_0_0_1.5px_var(--line)] transition-colors hover:shadow-[inset_0_0_0_1.5px_var(--ganache)] aria-pressed:bg-ganache aria-pressed:text-chantilly ${quickPicksClassName}`}
        >
          {pick === 1
            ? "1 seul"
            : `${pick} (${pick / packSize} boîte${pick / packSize > 1 ? "s" : ""})`}
        </motion.button>
      ))}
    </div>
  );
}
