import type { Metadata } from "next";
import { Bricolage_Grotesque, Shrikhand } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
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
  title: {
    default: "Patsam Gourmandise | Pâtisserie maison à Houilles",
    template: "%s | Patsam Gourmandise",
  },
  description:
    "Cookies, trompe-l'œil et layer cakes faits maison à Houilles (78). Livraison le jour même, J+1 pour les trompe-l'œil.",
  openGraph: {
    title: "Patsam Gourmandise",
    description:
      "Cookies, trompe-l'œil et layer cakes faits maison à Houilles (78), livrés le jour même.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${bricolage.variable} ${shrikhand.variable}`}>
        <MotionProvider>
          <CartProvider>
            {children}
            <SiteFooter />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
