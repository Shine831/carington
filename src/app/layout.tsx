import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/layout/PageTransition";
import { LanguageProvider } from "@/context/LanguageContext";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";


const APP_URL = "https://ejarnauld-soft.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "E-JARNAULD SOFT | Infogérance & Cybersécurité - Douala",
    template: "%s | E-JARNAULD SOFT",
  },
  description: "Sécurisez vos opérations et maximisez votre ROI avec E-JARNAULD SOFT — cabinet IT premium à Douala spécialisé en cybersécurité, infrastructure réseau et infogérance sur-mesure.",
  keywords: ["cybersécurité", "infogérance", "IT Douala", "infrastructure réseau", "sécurité informatique", "Cameroun", "cloud", "VoIP", "maintenance informatique"],
  authors: [{ name: "E-Jarnauld Soft", url: APP_URL }],
  creator: "E-Jarnauld Soft",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "E-JARNAULD SOFT",
    title: "E-JARNAULD SOFT | Infogérance & Cybersécurité - Douala",
    description: "Solutions IT premium à Douala : cybersécurité, infrastructure réseau, cloud et infogérance sur-mesure pour pros et entreprises.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "E-Jarnauld Soft - IT Management & Cybersecurity Douala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-JARNAULD SOFT | IT & Cybersécurité - Douala",
    description: "Solutions IT premium à Douala : cybersécurité, réseau, cloud et infogérance sur-mesure.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased font-sans">
        <LanguageProvider>
          <div className="noise-overlay" />
          <CustomCursor />
            <Navbar />
            <FloatingWhatsApp />
            <PageTransition>
              <main className="min-h-screen">
                {children}
              </main>
            </PageTransition>
            <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
