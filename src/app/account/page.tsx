"use client";

import { User, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, History } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function AccountPage() {
  const { t, language } = useI18n();

  const ICONS = [Briefcase, History, ShieldCheck, User];

  return (
    <div className="min-h-[100svh] pt-24 md:pt-32 bg-[var(--off-white)] flex items-center justify-center py-32 px-4 relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.03]" />
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden shadow-[var(--shadow-2xl)] border border-white/20 relative z-10">
        
        {/* Left panel — Pure Tech Red */}
        <SlideLeft className="h-full">
          <div className="bg-[var(--red)] p-12 md:p-16 flex flex-col justify-between h-full min-h-[500px] relative overflow-hidden">
            <AuraGradient color="white" className="top-[-20%] left-[-20%] w-64 h-64 opacity-[0.1]" />
            <AuraGradient color="black" className="bottom-[-20%] right-[-20%] w-96 h-96 opacity-[0.05]" />
            
            <div className="relative z-10">
              <span className="text-[10px] font-black text-red-100 uppercase tracking-[0.3em] mb-10 block opacity-80">
                {t.account.tag}
              </span>
              <h2 className="display-sm text-white leading-[0.9] mb-8 tracking-tighter">
                {t.account.title_part1}<br/>
                <span className="italic font-serif serif-italic opacity-90">{t.account.title_part2}</span>
              </h2>
              <p className="text-red-50 text-base leading-relaxed mb-12 font-medium max-w-sm opacity-80">
                {t.account.desc}
              </p>
              
              <StaggerContainer className="space-y-5">
                {t.account.features.map((label, i) => {
                  const Icon = ICONS[i % ICONS.length];
                  return (
                    <StaggerItem key={label}>
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-500">
                          <Icon className="w-4 h-4 text-white group-hover:text-[var(--red)] transition-colors" />
                        </div>
                        <span className="text-white text-sm font-bold tracking-tight">{label}</span>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
            
            <div className="pt-12 mt-auto relative z-10">
              <div className="h-px w-12 bg-white/20 mb-6" />
              <p className="text-red-100/60 text-[10px] font-black uppercase tracking-[0.2em]">
                {t.account.secure_badge}
              </p>
            </div>
          </div>
        </SlideLeft>

        {/* Right panel — Pure Tech Login */}
        <SlideRight>
          <div className="bg-white p-12 md:p-16 h-full flex flex-col justify-center relative overflow-hidden">
            <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-48 h-48 opacity-[0.02]" />
            
            <div className="mb-12 relative z-10">
              <h3 className="text-3xl font-black text-[var(--charcoal)] mb-3 tracking-tighter uppercase">{t.account.login.title}</h3>
              <p className="text-sm text-[var(--slate)] font-medium">{t.account.login.desc}</p>
            </div>

            <form className="space-y-6 relative z-10">
              <div className="form-group has-icon">
                <Mail className="form-input-icon text-[var(--muted)]" />
                <input type="email" className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="login-email" />
                <label htmlFor="login-email" className="floating-label font-bold left-14">{t.account.login.email}</label>
              </div>
              
              <div className="form-group has-icon">
                <Lock className="form-input-icon text-[var(--muted)]" />
                <input type="password" className="form-input border-2 rounded-xl py-4 pl-14 pr-20" placeholder=" " id="login-password" />
                <label htmlFor="login-password" className="floating-label font-bold left-14">{t.account.login.password}</label>
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Link href="#" className="text-[10px] font-black text-[var(--red)] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                    {t.account.login.forgot}
                  </Link>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/dashboard" className="block">
                  <motion.span
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-red w-full text-sm font-black uppercase tracking-widest py-5 shadow-[var(--shadow-red)] flex items-center justify-center gap-3"
                  >
                    {t.account.login.submit} <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </div>
            </form>

            <div className="mt-16 pt-10 border-t border-slate-100 text-center relative z-10">
              <p className="text-[11px] font-black text-[var(--muted)] uppercase tracking-widest mb-6 opacity-60">
                {t.account.login.footer}
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/booking" className="btn border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest w-full py-4 justify-center hover:border-[var(--red)]/40 hover:bg-slate-50 transition-all rounded-xl">
                  {t.account.login.create_btn}
                </Link>
              </motion.div>
            </div>
          </div>
        </SlideRight>
      </div>
    </div>
  );
}
