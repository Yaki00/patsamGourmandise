import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une commande sur mesure ? Appelez ou envoyez un SMS à Patsam Gourmandise.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
