"use client";

import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { AuraGradient } from '@/components/ui/AuraGradient';
import { Logo } from '@/components/Logo';

export default function Footer() {
  const { t, language } = useI18n();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="bg-[var(--charcoal)] text-white mt-auto relative overflow-hidden border-t border-white/5">
      {/* Subtle Aura for Footer */}
      <AuraGradient color="var(--red)" className="bottom-[-10%] left-[-5%] w-96 h-96 opacity-[0.05]" />
      
      <div className="container-xl pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand — Logo + Contact rapide */}
          <div className="lg:col-span-1">
            {/* Logo white variant for dark footer */}
            <div className="mb-8 [&_span]:!text-white [&_.text-\[var\(--slate\)\]]:!text-slate-400">
              <Logo />
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 max-w-xs">
              {t.footer.desc}
            </p>
            {/* Contact rapide : WhatsApp + Appel seulement */}
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/237654749357" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-[var(--red)] transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 group-hover:border-[var(--red)]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.559 4.146 1.534 5.884L0 24l6.266-1.504A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.371l-.36-.214-3.719.892.951-3.62-.234-.373A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
                  </svg>
                </span>
                <span className="text-xs font-bold">WhatsApp</span>
              </a>
              <a href="mailto:cust_care@ejs-cm.com"
                className="flex items-center gap-3 text-slate-400 hover:text-[var(--red)] transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 group-hover:border-[var(--red)]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold">cust_care@ejs-cm.com</span>
              </a>
            </div>
          </div>
          
          {/* Solutions (i18n) */}
          <div className="mt-12 lg:mt-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.footer.cols.solutions}</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.it.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.cyber.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.network.title}</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.services_page.items.video.title}</Link></li>
            </ul>
          </div>
          
          {/* Agency (i18n) */}
          <div className="mt-12 lg:mt-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.footer.cols.agency}</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/about" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.contact}</Link></li>
              <li><Link href="/booking" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.cta}</Link></li>
              <li><Link href="/account" className="text-slate-400 hover:text-[var(--red)] transition-colors">{t.nav.account}</Link></li>
            </ul>
          </div>

          {/* Contact (i18n) */}
          <div className="mt-12 lg:mt-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">{t.contact.info_title}</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <MapPin className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-slate-400 leading-relaxed font-medium">Marché NDOPASSI, Douala</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <Phone className="w-4 h-4 text-[var(--red)]" />
                </div>
                <div className="flex flex-col gap-1 text-slate-400 font-medium">
                  <span>+237 654 74 93 57</span>
                  <span>+237 697 16 72 59</span>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[var(--red)]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-slate-400 font-medium">cust_care@ejs-cm.com</span>
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
