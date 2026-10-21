import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Finalisez votre commande Patsam Gourmandise.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
