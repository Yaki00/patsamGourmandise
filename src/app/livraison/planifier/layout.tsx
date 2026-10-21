import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Choisir un créneau | Patsam Gourmandise" },
  description: "Choisissez le jour et le créneau de livraison ou de retrait.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
