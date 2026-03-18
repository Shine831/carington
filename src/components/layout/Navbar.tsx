"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, User, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '@/components/ui/InteractiveEffects';
import { useI18n } from '@/context/LanguageContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();

  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[var(--shadow-sm)] border-b border-[var(--border)]"
            : "bg-white border-b border-[var(--border)]"
        }`}
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-[68px] md:h-[80px]">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }} 
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--red)] flex items-center justify-center shadow-[var(--shadow-red)]">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col -gap-1">
                <span className="font-black text-lg leading-tight tracking-tight text-[var(--charcoal)] uppercase">
                  E-JARNALUD<span className="text-[var(--red)]"> SOFT</span>
                </span>
                <span className="text-[10px] font-bold text-[var(--muted)] tracking-[0.2em] uppercase">
                  {language === "fr" ? "Architecture de Confiance" : "Architecture of Trust"}
                </span>
              </div>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-5 py-2 text-sm font-bold transition-colors group ${
                      isActive ? "text-[var(--red)]" : "text-[var(--slate)] hover:text-[var(--charcoal)]"
                    }`}
                  >
                    {label}
                    {isActive ? (
                      <motion.span 
                        layoutId="nav-active"
                        className="absolute inset-0 bg-[var(--red)]/5 rounded-xl -z-10" 
                      />
                    ) : (
                      <motion.span 
                        layoutId="nav-hover"
                        className="absolute inset-0 bg-[var(--off-white)] rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" 
                      />
                    )}
                    <span className={`absolute inset-x-5 bottom-1.5 h-0.5 bg-[var(--red)] rounded-full transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--off-white)] transition-all text-xs font-black uppercase tracking-widest text-[var(--charcoal)]"
              >
                <Globe className="w-4 h-4 text-[var(--red)]" />
                {language === "fr" ? "EN" : "FR"}
              </button>

              <Link href="/account">
                <motion.span
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                  className="btn btn-ghost text-sm flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" /> {t.nav.account}
                </motion.span>
              </Link>
              <Link href="/booking">
                <MagneticButton className="flex items-center">
                  <span className="btn btn-red text-sm px-5 py-2.5 flex items-center gap-1.5 shadow-[var(--shadow-red)]">
                    {t.nav.cta} <ChevronRight className="w-4 h-4" />
                  </span>
                </MagneticButton>
              </Link>
            </div>
            
            {/* Mobile burger */}
            <div className="flex lg:hidden items-center gap-3">
              <button 
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-[var(--off-white)] transition-colors text-xs font-black"
              >
                {language.toUpperCase()}
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[var(--charcoal)] p-2 rounded-lg hover:bg-[var(--off-white)] transition-colors"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {menuOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X className="w-6 h-6" />
                      </motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu className="w-6 h-6" />
                      </motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-[var(--border)] bg-white"
            >
              <div className="container-xl py-6 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }, i) => {
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between py-3 px-2 text-base font-semibold rounded-lg transition-all ${
                          isActive ? "text-[var(--red)] bg-[var(--red)]/5" : "text-[var(--charcoal)] hover:text-[var(--red)] hover:bg-[var(--off-white)]"
                        }`}
                      >
                        {label}
                        <ChevronRight className={`w-4 h-4 ${isActive ? "text-[var(--red)]" : "text-[var(--muted)]"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)] mt-2">
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full justify-center">{t.nav.account}</Link>
                  <Link href="/booking" onClick={() => setMenuOpen(false)} className="btn btn-red w-full justify-center">{t.nav.cta}</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
