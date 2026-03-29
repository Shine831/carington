"use client";

import { Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { AuraGradient } from '@/components/ui/AuraGradient';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';

export default function Footer() {
  const { t, language } = useI18n();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="bg-white border-t border-[var(--border)] mt-auto relative overflow-hidden">
      {/* High-Impact Aura for Footer (White Mode Premium) */}
      <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-[800px] h-[800px] opacity-[0.04]" />
      <AuraGradient color="var(--slate)" className="top-[-10%] right-[-5%] w-[600px] h-[600px] opacity-[0.02]" />
      <AuraGradient color="var(--red)" className="top-[20%] right-[15%] w-[400px] h-[400px] opacity-[0.02]" delay={4} />
      
      <div className="container-xl pt-32 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 lg:gap-32">
          
          {/* Brand — Logo + Mission */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="mb-12 transform hover:scale-105 transition-transform duration-700">
              <Logo />
            </div>

            <p className="display-sm text-[var(--charcoal)] mb-12 max-w-lg tracking-tight leading-tight">
              {language === "fr" ? "L'élite de l'infogérance en Afrique Centrale." : "Elite IT services in Central Africa."}
            </p>

            <div className="flex gap-4 mb-16">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, backgroundColor: "var(--charcoal)", color: "white" }}
                  className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--slate)] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            <div className="space-y-4">
              <span className="label text-[var(--red)] tracking-[0.3em]">Direct Line</span>
              <a href="tel:+237654749357" className="text-3xl font-black text-[var(--charcoal)] block hover:text-[var(--red)] transition-colors tracking-tighter italic">
                +237 654 74 93 57
              </a>
            </div>
          </div>
          
          {/* Menu Sections (Layout Bento Style) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16">

            <div className="space-y-10">
              <h4 className="label tracking-[0.25em] text-[var(--muted)]">{t.footer.cols.solutions}</h4>
              <ul className="space-y-6">
                {[
                  { label: t.services_page.items.it.title, href: "/services" },
                  { label: t.services_page.items.cyber.title, href: "/services" },
                  { label: t.services_page.items.network.title, href: "/services" },
                  { label: t.services_page.items.video.title, href: "/services" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-[var(--slate)] hover:text-[var(--red)] transition-colors group flex items-center gap-2">
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="label tracking-[0.25em] text-[var(--muted)]">{t.footer.cols.agency}</h4>
              <ul className="space-y-6">
                {[
                  { label: t.nav.about, href: "/about" },
                  { label: t.nav.contact, href: "/contact" },
                  { label: t.nav.cta, href: "/booking" },
                  { label: t.nav.account, href: "/account" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-[var(--slate)] hover:text-[var(--red)] transition-colors group flex items-center gap-2">
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-10">
              <h4 className="label tracking-[0.25em] text-[var(--muted)]">{t.contact.info_title}</h4>
              <ul className="space-y-10">
                <li className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-[var(--red)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--charcoal)]">HQ</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--slate)] leading-relaxed">Marché NDOPASSI, <br/> Douala, Cameroun</span>
                </li>
                <li>
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-4 h-4 text-[var(--red)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--charcoal)]">Email</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--slate)]">cust_care@ejs-cm.com</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar — Ultra Minimalist */}
        <div className="mt-32 pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Systems Operational</p>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--muted)]">
            &copy; {new Date().getFullYear()} E-JARNAULD SOFT. {t.footer.copyright}
          </p>

          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-[var(--slate)]">
            <Link href="/privacy" className="hover:text-[var(--red)] transition-colors">{language === "fr" ? "Confidentialité" : "Privacy"}</Link>
            <Link href="/terms" className="hover:text-[var(--red)] transition-colors">{language === "fr" ? "Conditions" : "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
