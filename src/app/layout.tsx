import type { Metadata } from "next";
import { Bricolage_Grotesque, Shrikhand } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const shrikhand = Shrikhand({
  variable: "--font-shrikhand",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patsam Gourmandise | Pâtisserie maison à Houilles",
  description:
    "Cookies, trompe-l'œil et layer cakes faits maison à Houilles (78). Livraison le jour même, J+1 pour les trompe-l'œil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${bricolage.variable} ${shrikhand.variable}`}>
        <CartProvider>
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
