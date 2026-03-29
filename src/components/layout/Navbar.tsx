"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, ChevronRight, Globe, LogOut, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '@/components/ui/InteractiveEffects';
import { useI18n } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/lib/firebase/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useI18n();
  const { user, role } = useAuth();
  const isAdmin = pathname?.startsWith("/admin");

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

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

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-[100] transition-all duration-700"
      >
        <div className="container-xl pt-4 md:pt-6">
          <div className={`flex items-center justify-between h-[72px] md:h-[84px] transition-all duration-700 px-6 md:px-10 rounded-full border border-white/50 shadow-spatial-md ${
            scrolled
              ? "bg-white/75 backdrop-blur-[40px] saturate-200"
              : "bg-white/45 backdrop-blur-[32px]"
          }`}>
            
            {/* Logo Section */}
            <div className="flex items-center gap-12">
              <Logo />

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`relative px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                        isActive ? "text-[var(--red)]" : "text-[var(--slate)] hover:text-[var(--charcoal)]"
                      }`}
                    >
                      {label}
                      <motion.span
                        layoutId="nav-pill"
                        className={`absolute inset-0 bg-[var(--red)]/5 rounded-full z-[-1] opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Selector */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 transition-all text-[10px] font-black uppercase tracking-widest text-[var(--charcoal)]"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--red)]" />
                {language.toUpperCase()}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link href={role === "ADMIN" ? "/admin" : "/dashboard"}>
                    <MagneticButton>
                      <motion.span className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[var(--charcoal)] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                        <User className="w-3.5 h-3.5" />
                        {user.displayName?.split(" ")[0] || t.nav.account}
                      </motion.span>
                    </MagneticButton>
                  </Link>
                  <button onClick={handleLogout} className="p-3 rounded-full hover:bg-red-50 text-[var(--slate)] hover:text-[var(--red)] transition-all">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/account" className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] hover:text-[var(--charcoal)] px-6">
                    {t.nav.account}
                  </Link>
                  <Link href="/booking">
                    <MagneticButton>
                      <span className="btn-premium btn-premium-red !px-8 !py-4 text-[10px]">
                        {t.nav.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile Interface */}
            <div className="flex lg:hidden items-center gap-4">
               <button onClick={toggleLanguage} className="text-[10px] font-black">{language.toUpperCase()}</button>
               <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--charcoal)] text-white"
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? <X className="w-5 h-5" key="x" /> : <Menu className="w-5 h-5" key="menu" />}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full p-4 z-[-1]"
            >
              <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-spatial-xl p-8 flex flex-col gap-4">
                {NAV_LINKS.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 px-2 text-2xl font-black text-[var(--charcoal)]"
                    >
                      {label}
                      <ChevronRight className="w-6 h-6 text-[var(--red)]" />
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                   {user ? (
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-premium btn-premium-red w-full">
                        {t.nav.account}
                      </Link>
                   ) : (
                      <>
                        <Link href="/account" onClick={() => setMenuOpen(false)} className="btn-premium btn-premium-outline w-full">
                          {t.nav.account}
                        </Link>
                        <Link href="/booking" onClick={() => setMenuOpen(false)} className="btn-premium btn-premium-red w-full">
                          {t.nav.cta}
                        </Link>
                      </>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
