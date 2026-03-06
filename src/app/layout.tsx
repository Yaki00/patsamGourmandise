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
              <div>
                <p className="site-footer-brand">Patsam Gourmandise</p>
                <p className="site-footer-text">
                  Cookies, trompe-l&apos;oeil et creations artisanales premium.
                </p>
                <p className="site-footer-text">
                  Livraison : Houilles (78) et alentours.
                </p>
              <p className="site-footer-text">
                Site realise via{" "}
                <a
                  href="https://pixelbrain.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pixelbrain.fr
                </a>
                .
              </p>
              </div>
              <nav className="site-footer-links">
                <Link href="/">Accueil</Link>
                <Link href="/commander">Commander</Link>
                <Link href="/checkout">Checkout</Link>
                <Link href="/livraison">Livraison</Link>
                <Link href="/contact">Contact</Link>
              </nav>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
