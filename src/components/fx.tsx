"use client";

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";

export const easeOut = [0.2, 0.8, 0.2, 1] as const;

/** Apparition au scroll (une seule fois). */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Titre dont les mots montent un par un derrière un masque. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const play = !inView || seen;
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {/* Le masque déborde un peu : Shrikhand est penchée et a des jambages. */}
          <span
            aria-hidden="true"
            className="-mx-[0.12em] -my-[0.1em] inline-block overflow-hidden px-[0.12em] py-[0.1em] align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "115%", rotate: 6 }}
              animate={play ? { y: "0%", rotate: 0 } : undefined}
              transition={{
                duration: 0.9,
                delay: delay + index * 0.07,
                ease: easeOut,
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Bouton/lien attiré par le curseur. */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  const reduce = useReducedMotion();
  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * strength);
        y.set((event.clientY - rect.top - rect.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Carte inclinable en 3D avec reflet qui suit le curseur. */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 20,
  });
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,.45), transparent 55%)`;
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className ?? ""}`}
      style={
        reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }
      }
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        setHover(false);
      }}
    >
      {children}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light transition-opacity duration-300"
          style={{ background: glare, opacity: hover ? 1 : 0 }}
        />
      )}
    </motion.div>
  );
}

/** Ruban qui défile en boucle. */
export function Marquee({
  children,
  speed = 30,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${className ?? ""}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Texte circulaire qui tourne (macaron). */
export function CircularText({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`grid place-items-center ${className ?? ""}`}>
      <svg
        viewBox="0 0 200 200"
        className="spin-slow absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <path
            id="circle-text"
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text fontSize="19" fontWeight="800" fill="currentColor">
          <textPath href="#circle-text" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="sr-only">{text}</span>
      {children}
    </div>
  );
}

/** Compteur qui défile jusqu'à sa valeur à l'apparition. */
export function CountUp({
  to,
  decimals = 0,
  className,
}: {
  to: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const format = (value: number) => value.toFixed(decimals).replace(".", ",");
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: easeOut,
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = format(value);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {format(reduce ? to : 0)}
    </span>
  );
}

const SPRINKLES = [
  { x: 6, y: 18, r: 30, c: "var(--framboise)", d: 0.6 },
  { x: 14, y: 72, r: -40, c: "var(--mangue)", d: 1 },
  { x: 44, y: 8, r: 70, c: "var(--pistache)", d: 0.4 },
  { x: 52, y: 88, r: -15, c: "var(--framboise)", d: 0.8 },
  { x: 88, y: 12, r: 10, c: "var(--ganache)", d: 0.5 },
  { x: 95, y: 56, r: -60, c: "var(--mangue)", d: 1.2 },
  { x: 72, y: 94, r: 45, c: "var(--pistache)", d: 0.7 },
  { x: 30, y: 40, r: 85, c: "var(--mangue)", d: 0.3 },
  { x: 62, y: 30, r: -30, c: "var(--framboise)", d: 0.9 },
  { x: 3, y: 46, r: 20, c: "var(--pistache)", d: 0.5 },
  { x: 80, y: 74, r: -75, c: "var(--framboise)", d: 0.6 },
  { x: 38, y: 92, r: 5, c: "var(--ganache)", d: 1.1 },
];

/** Vermicelles décoratifs qui fuient le curseur (parallaxe). */
export function SprinkleField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const mx = useSpring(0, { stiffness: 60, damping: 15 });
  const my = useSpring(0, { stiffness: 60, damping: 15 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      mx.set(event.clientX / window.innerWidth - 0.5);
      my.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    >
      {SPRINKLES.map((s, index) => (
        <Sprinkle
          key={index}
          sprinkle={s}
          index={index}
          mx={mx}
          my={my}
          reduce={Boolean(reduce)}
        />
      ))}
    </div>
  );
}

function Sprinkle({
  sprinkle,
  index,
  mx,
  my,
  reduce,
}: {
  sprinkle: (typeof SPRINKLES)[number];
  index: number;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  reduce: boolean;
}) {
  const x = useTransform(mx, (v) => v * -80 * sprinkle.d);
  const y = useTransform(my, (v) => v * -80 * sprinkle.d);
  return (
    <motion.span
      className="absolute block h-[22px] w-[7px] rounded-full shadow-[0_2px_3px_rgba(59,29,23,.18)]"
      style={{
        left: `${sprinkle.x}%`,
        top: `${sprinkle.y}%`,
        background: sprinkle.c,
        x,
        y,
      }}
      initial={
        reduce ? false : { opacity: 0, scale: 0, rotate: sprinkle.r - 180 }
      }
      animate={{ opacity: 1, scale: 1, rotate: sprinkle.r }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 12,
        delay: 0.6 + index * 0.05,
      }}
    />
  );
}
