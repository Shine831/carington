"use client";

import { Shield, Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { AuraGradient } from '@/components/ui/AuraGradient';

export default function Footer() {
  const { t, language } = useI18n();

  return (
    <footer className="bg-[var(--charcoal)] text-white mt-auto relative overflow-hidden border-t border-white/5">
      {/* Subtle Aura for Footer */}
      <AuraGradient color="var(--red)" className="bottom-[-10%] left-[-5%] w-96 h-96 opacity-[0.05]" />
      
      <div className="container-xl py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-[var(--red)] flex items-center justify-center shadow-[0_0_20px_rgba(200,16,46,0.2)] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">
                E-JARNALUD<span className="text-[var(--red)]"> SOFT</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 max-w-xs">
              {t.footer.desc}
            </p>
            <div className="flex gap-5">
              {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-[var(--red)]/40 hover:bg-white/5 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Solutions (i18n) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.footer.cols.solutions}</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.it.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.cyber.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.network.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.video.title}</Link></li>
            </ul>
          </div>
          
          {/* Agency (i18n) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.footer.cols.agency}</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/about" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.contact}</Link></li>
              <li><Link href="/booking" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.cta}</Link></li>
              <li><Link href="/account" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.account}</Link></li>
            </ul>
          </div>

          {/* Contact (i18n) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.contact.info_title}</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <MapPin className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-slate-400 leading-relaxed font-medium">Akwa, Douala, Cameroon</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <Phone className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-slate-400 font-medium">+237 600 00 00 00</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-slate-400 font-medium">contact@ejarnalud.cm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <p>&copy; {new Date().getFullYear()} E-JARNALUD SOFT. {t.footer.copyright}</p>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white transition-colors">{language === "fr" ? "Confidentialité" : "Privacy"}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{language === "fr" ? "CGV / CGU" : "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
