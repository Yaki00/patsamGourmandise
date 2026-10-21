"use client";

import { MotionConfig } from "motion/react";

// Respecte le réglage "animations réduites" du visiteur sur toutes les animations motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
