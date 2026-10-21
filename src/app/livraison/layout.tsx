import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison",
  description:
    "Zones et tarifs de livraison autour de Houilles (78), jusqu'à 50 km.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
