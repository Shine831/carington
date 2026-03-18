"use client";

import { Search, Server, ShieldAlert, Video, Code, PhoneCall, GraduationCap, PenTool, Network, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, SlideLeft } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function ServicesPage() {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");

  const SERVICES = [
    { id: "gestion-it", tag: "B2B / B2C", icon: Server, title: t.services_page.items.it.title, desc: t.services_page.items.it.desc },
    { id: "cybersecurite", tag: "B2B", icon: ShieldAlert, title: t.services_page.items.cyber.title, desc: t.services_page.items.cyber.desc },
    { id: "reseau", tag: "B2B / B2C", icon: Network, title: t.services_page.items.network.title, desc: t.services_page.items.network.desc },
    { id: "video", tag: "B2B / B2C", icon: Video, title: t.services_page.items.video.title, desc: t.services_page.items.video.desc },
    { id: "voip", tag: "B2B", icon: PhoneCall, title: t.services_page.items.voip.title, desc: t.services_page.items.voip.desc },
    { id: "dev", tag: "B2B / B2C", icon: Code, title: t.services_page.items.dev.title, desc: t.services_page.items.dev.desc },
    { id: "formation", tag: "B2B / B2C", icon: GraduationCap, title: t.services_page.items.formation.title, desc: t.services_page.items.formation.desc },
    { id: "maintenance", tag: "B2B / B2C", icon: PenTool, title: t.services_page.items.maintenance.title, desc: t.services_page.items.maintenance.desc },
  ];

  const filtered = SERVICES.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tag.toLowerCase().includes(query.toLowerCase()) ||
    s.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">
      
      {/* Header (Pure Tech Refactor) */}
      <section className="bg-white border-b border-[var(--border)] py-20 md:py-32 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-[0.06]" />
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--red)]" />
        
        <div className="container-xl relative z-10">
          <FadeUp>
            <span className="tag-red mb-6 inline-flex tracking-widest">{t.services_page.tag}</span>
            <h1 className="display-xl text-[var(--charcoal)] mb-6 max-w-2xl tracking-tighter leading-[0.95]">
              {t.services_page.title}
            </h1>
            <p className="text-body-lg max-w-xl mb-12 text-[var(--slate)] leading-relaxed">
              {t.services_page.desc}
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative max-w-xl group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--red)] transition-colors" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.services_page.search_placeholder}
                className="form-input pl-14 py-5 text-base border-2 shadow-sm focus:border-[var(--red)]/40 hover:border-slate-300 transition-all rounded-2xl"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Bento Grid (Pure Tech Refactor) */}
      <section className="section-py">
        <div className="container-xl">
          <SlideLeft>
            <div className="flex items-center justify-between mb-16 px-2">
              <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--red)]" />
                {filtered.length} {t.services_page.solutions_available}
              </p>
              <div className="h-px flex-1 bg-[var(--border)] mx-8 hidden md:block opacity-50" />
            </div>
          </SlideLeft>
          
          <AnimatePresence mode="popLayout">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {filtered.map((service, i) => {
                const isLarge = i < 2;
                const Icon = service.icon;
                
                return (
                  <StaggerItem 
                    key={service.id} 
                    className={`${isLarge ? "md:col-span-3 lg:col-span-3" : "md:col-span-3 lg:col-span-2"}`}
                  >
                    <motion.div layout className="h-full">
                      <Link href="/booking" className="block h-full">
                        <motion.div
                          whileHover={{ y: -8, borderColor: "var(--red)" }}
                          className="card h-full p-10 flex flex-col group relative overflow-hidden backdrop-blur-xl bg-white/80 border-2 transition-all duration-500 rounded-[2.5rem]"
                        >
                          <AuraGradient color="var(--red)" className="bottom-[-30%] right-[-20%] w-48 h-48 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" />
                          
                          <div className="flex items-start justify-between mb-12 relative z-10">
                            <div className="w-16 h-16 bg-slate-50 shadow-sm rounded-2xl flex items-center justify-center group-hover:bg-[var(--red)] group-hover:shadow-[0_10px_30px_rgba(200,16,46,0.2)] transition-all duration-500 shrink-0">
                              <Icon className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors duration-500" />
                            </div>
                            <span className="text-[9px] font-black tracking-widest text-[var(--muted)] border border-slate-200 px-4 py-1.5 rounded-full uppercase bg-white/50 group-hover:border-[var(--red)]/20 transition-colors">
                              {service.tag}
                            </span>
                          </div>
                          
                          <div className="relative z-10">
                            <h3 className={`${isLarge ? "text-2xl" : "text-xl"} font-black text-[var(--charcoal)] mb-4 tracking-tighter leading-tight`}>
                              {service.title}
                            </h3>
                            <p className="text-sm text-[var(--slate)] leading-relaxed mb-10 font-medium">
                              {service.desc}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative z-10 transition-colors group-hover:border-[var(--red)]/10">
                            <span className="text-[10px] font-black text-[var(--red)] tracking-widest flex items-center gap-2 uppercase">
                              {t.services_page.cta_card} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </span>
                            <span className="text-[9px] font-black text-slate-300 font-mono italic">#{String(i+1).padStart(2, '0')}</span>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-dashed">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg text-[var(--slate)] font-bold mb-8">{t.services_page.empty_results} "{query}".</p>
              <button onClick={() => setQuery("")} className="btn btn-red px-10 py-4 font-black uppercase text-[10px] tracking-widest">
                {t.services_page.show_all}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
