import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "E-JARNALUD SOFT | IT Management & Cybersecurity",
  description: "Secure your operations and maximize your ROI with E-JARNALUD SOFT, Douala's premium IT infrastructure and cybersecurity firm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        <div className="noise-overlay" />
        <CustomCursor />
        <Navbar />
        <PageTransition>
          <main className="min-h-screen">
            {children}
          </main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
