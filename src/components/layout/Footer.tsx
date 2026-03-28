"use client";

import { Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Twitter, Shield, Globe } from 'lucide-react';
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
      {/* Background Aura */}
      <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-[800px] h-[800px] opacity-[0.03]" />
      
      <div className="container-xl pt-24 pb-12 relative z-10">
        <div className="flex flex-col gap-20">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="mb-10 transform hover:scale-105 transition-all duration-700 cursor-pointer">
                <Logo />
              </div>
              <h2 className="display-sm !text-4xl text-[var(--charcoal)] mb-8 tracking-tighter leading-[1.1] max-w-sm">
                {language === "fr"
                  ? "Architecturer la confiance numérique à Douala."
                  : "Architecting digital trust in Douala."}
              </h2>

              <div className="flex gap-4 mb-12">
                {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                  <motion.a
                    key={i} href="#"
                    whileHover={{ y: -4, backgroundColor: "var(--charcoal)", color: "white" }}
                    className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--slate)] transition-all bg-white shadow-spatial-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>

              <div className="w-full max-w-xs p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-5 group transition-all hover:bg-white hover:shadow-spatial-md">
                 <div className="w-12 h-12 rounded-2xl bg-[var(--red)] flex items-center justify-center shadow-red group-hover:rotate-12 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <p className="label !text-[10px] text-[var(--muted)] mb-1">Direct Ops</p>
                    <a href="tel:+237654749357" className="text-sm font-black text-[var(--charcoal)] hover:text-[var(--red)] transition-colors">+237 654 74 93 57</a>
                 </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
                  <div className="space-y-10">
                    <h4 className="label !text-[11px] text-[var(--charcoal)] !font-black tracking-[0.25em]">{t.footer.cols.solutions}</h4>
                    <ul className="space-y-6">
                      {[
                        { label: t.services_page.items.it.title, href: "/services" },
                        { label: t.services_page.items.cyber.title, href: "/services" },
                        { label: t.services_page.items.network.title, href: "/services" },
                        { label: t.services_page.items.video.title, href: "/services" }
                      ].map((link, i) => (
                        <li key={i}>
                          <Link href={link.href} className="text-[14px] font-bold text-[var(--slate)] hover:text-[var(--red)] transition-colors group flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--red)] transition-colors" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-10">
                    <h4 className="label !text-[11px] text-[var(--charcoal)] !font-black tracking-[0.25em]">{t.footer.cols.agency}</h4>
                    <ul className="space-y-6">
                      {[
                        { label: t.nav.about, href: "/about" },
                        { label: t.nav.contact, href: "/contact" },
                        { label: t.nav.cta, href: "/booking" },
                        { label: t.nav.account, href: "/account" }
                      ].map((link, i) => (
                        <li key={i}>
                          <Link href={link.href} className="text-[14px] font-bold text-[var(--slate)] hover:text-[var(--red)] transition-colors group flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--red)] transition-colors" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-10">
                    <h4 className="label !text-[11px] text-[var(--charcoal)] !font-black tracking-[0.25em]">{t.contact.info_title}</h4>
                    <ul className="space-y-8">
                      <li className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-[var(--red)]/20 transition-colors">
                           <MapPin className="w-5 h-5 text-[var(--red)]" />
                        </div>
                        <span className="text-[13px] font-bold text-[var(--slate)] leading-snug">Marché NDOPASSI, <br/> Douala, Cameroun</span>
                      </li>
                      <li className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-[var(--red)]/20 transition-colors">
                           <Mail className="w-5 h-5 text-[var(--red)]" />
                        </div>
                        <span className="text-[13px] font-bold text-[var(--slate)] break-all pt-2">cust_care@ejs-cm.com</span>
                      </li>
                    </ul>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Secure Protocol Active</p>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">&copy; {new Date().getFullYear()} E-JARNAULD SOFT</p>
            </div>

            <div className="flex flex-wrap items-center gap-8 justify-center md:justify-end">
               <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] hover:text-[var(--red)] transition-all">Privacy</Link>
               <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] hover:text-[var(--red)] transition-all">Terms</Link>
               <button className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--border)] hover:border-[var(--red)] transition-all text-[10px] font-black uppercase tracking-widest text-[var(--charcoal)] bg-white shadow-spatial-sm">
                  <Globe className="w-3.5 h-3.5 text-[var(--red)]" />
                  {language.toUpperCase()}
               </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
