import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commander",
  description:
    "Choisissez vos cookies, trompe-l'œil et gâteaux, le parfum et la quantité.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
