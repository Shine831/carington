import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/layout/PageTransition";
import { LanguageProvider } from "@/context/LanguageContext";

import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "E-JARNAULD SOFT | IT Management & Cybersecurity",
  description: "Secure your operations and maximize your ROI with E-JARNAULD SOFT, Douala's premium IT infrastructure and cybersecurity firm.",
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

