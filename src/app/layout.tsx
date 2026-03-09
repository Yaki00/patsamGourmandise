import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patsam Gourmandise | Boutique en ligne",
  description:
    "Patsam Gourmandise : cookies, trompe-l'oeil et patisseries artisanales dans un univers pastel ultra gourmand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <footer className="site-footer">
            <div className="site-footer-inner">
              <div className="site-footer-grid">
                <section>
                  <p className="site-footer-brand">Patsam Gourmandise</p>
                  <p className="site-footer-text">
                    Cookies, trompe-l&apos;oeil et patisseries artisanales premium.
                  </p>
                  <p className="site-footer-text">
                    Livraison sur Houilles (78) et alentours, retrait atelier sur reservation.
                  </p>
                </section>

                <section>
                  <p className="site-footer-title">Navigation</p>
                  <nav className="site-footer-links">
                    <Link href="/">Accueil</Link>
                    <Link href="/commander">Commander</Link>
                    <Link href="/checkout">Checkout</Link>
                    <Link href="/livraison">Livraison</Link>
                    <Link href="/contact">Contact</Link>
                  </nav>
                </section>

                <section>
                  <p className="site-footer-title">Contact</p>
                  <p className="site-footer-text">Email : contact@patsam-gourmandise.fr</p>
                  <p className="site-footer-text">Telephone : 06 00 00 00 00</p>
                  <p className="site-footer-text">Snapchat : patsam78</p>
                </section>

                <section>
                  <p className="site-footer-title">Informations</p>
                  <p className="site-footer-text">Trompe-l&apos;oeil : delai J+1</p>
                  <p className="site-footer-text">Autres produits : livraison le jour meme</p>
                  <p className="site-footer-text">Paiement a la validation de commande</p>
                </section>
              </div>

              <div className="site-footer-bottom">
                <p className="site-footer-text">
                  © {new Date().getFullYear()} Patsam Gourmandise - Tous droits reserves.
                </p>
                <p className="site-footer-text">
                  Site realise via{" "}
                  <a
                    href="https://pixelbrain.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>pixelbrain.fr</strong>
                  </a>
                  .
                </p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
