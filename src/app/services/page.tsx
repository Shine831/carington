"use client";

import { Search, Server, ShieldAlert, Video, Code, PhoneCall, PenTool, Network, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, SlideLeft } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { getServices } from "@/lib/firebase/db";

const getIconForCategory = (cat: string) => {
  if (!cat) return Server;
  const c = cat.toLowerCase();
  if (c.includes("net") || c.includes("res") || c.includes("cab")) return Network;
  if (c.includes("voip") || c.includes("tel")) return PhoneCall;
  if (c.includes("cyber") || c.includes("sec") || c.includes("audit")) return ShieldAlert;
  if (c.includes("vid") || c.includes("cam") || c.includes("surv")) return Video;
  if (c.includes("web") || c.includes("dev") || c.includes("app")) return Code;
  if (c.includes("maint")) return PenTool;
  return Server;
};

export default function ServicesPage() {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((data) => {
      setServices(data.length > 0 ? data : []);
      setLoading(false);
    });
  }, []);

  const isSearching = query.trim().length > 0;
  const filtered = services.filter(s =>
    (s.title || "").toLowerCase().includes(query.toLowerCase()) ||
    (s.category || "").toLowerCase().includes(query.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 bg-[var(--off-white)]">
      
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
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--red)]/20 to-[var(--red)]/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/40 backdrop-blur-xl border-2 border-white/80 rounded-2xl shadow-sm group-focus-within:border-[var(--red)]/40 group-focus-within:shadow-[0_0_30px_rgba(200,16,46,0.1)] transition-all duration-500 overflow-hidden">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--red)] group-focus-within:scale-110 transition-all duration-500" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.services_page.search_placeholder}
                  className="w-full bg-transparent pl-14 pr-6 py-5 text-base text-[var(--charcoal)] font-bold focus:outline-none placeholder:text-[var(--muted)] placeholder:font-medium"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Bento Grid (Pure Tech Refactor) */}
      <section className="section-py mb-32">
        <div className="container-xl">
          <SlideLeft>
            <div className="flex items-center justify-between mb-16 px-2">
              <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--red)]" />
                {loading ? "..." : filtered.length} {t.services_page.solutions_available}
              </p>
              <div className="h-px flex-1 bg-[var(--border)] mx-8 hidden md:block opacity-50" />
            </div>
          </SlideLeft>
          
          <AnimatePresence mode="popLayout">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                /* Loading Skeleton */
                [1,2,3,4,5,6].map(n => (
                  <div key={n} className="h-64 rounded-[2.5rem] bg-white border-2 border-slate-50 animate-pulse" />
                ))
              ) : filtered.map((service, i) => {
                const Icon = getIconForCategory(service.category);
                
                return (
                  <StaggerItem 
                    key={service.id} 
                    className="md:col-span-1"
                  >
                    <motion.div layout className="h-full">
                      <Link href="/booking" className="block h-full">
                        <motion.div
                          whileHover={{ y: -8, borderColor: "var(--red)" }}
                          className="card h-full p-8 flex flex-col group relative overflow-hidden backdrop-blur-xl bg-white/80 border-2 transition-all duration-500 rounded-[2.5rem]"
                        >
                          <AuraGradient color="var(--red)" className="bottom-[-30%] right-[-20%] w-48 h-48 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" />
                          
                          <div className="flex items-start justify-between mb-10 relative z-10">
                            <div className="w-14 h-14 bg-slate-50 shadow-sm rounded-2xl flex items-center justify-center group-hover:bg-[var(--red)] group-hover:shadow-[0_10px_30px_rgba(200,16,46,0.2)] transition-all duration-500 shrink-0">
                              <Icon className="w-7 h-7 text-[var(--red)] group-hover:text-white transition-colors duration-500" />
                            </div>
                            <span className="text-[9px] font-black tracking-widest text-[var(--muted)] border border-slate-200 px-4 py-1.5 rounded-full uppercase bg-white/50 group-hover:border-[var(--red)]/20 transition-colors">
                              {service.category || "Service"}
                            </span>
                          </div>
                          
                          <div className="relative z-10">
                            <h3 className="text-xl font-black text-[var(--charcoal)] mb-4 tracking-tighter leading-tight">
                              {service.title}
                            </h3>
                            <p className="text-[13px] text-[var(--slate)] leading-relaxed mb-8 font-medium line-clamp-3">
                              {service.description}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between relative z-10 transition-colors group-hover:border-[var(--red)]/10">
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

          {!loading && isSearching && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-slate-200">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-[var(--charcoal)] mb-3 uppercase tracking-tight">{t.services_page.not_found}</h3>
              <p className="text-base text-[var(--slate)] font-medium mb-10 max-w-xs mx-auto">{t.services_page.not_found_desc}</p>
              <button onClick={() => setQuery("")} className="btn btn-red px-10 py-5 font-black uppercase text-[10px] tracking-widest shadow-[var(--shadow-red)]">
                {t.services_page.show_all}
              </button>
            </motion.div>
          )}

          {!loading && !isSearching && services.length === 0 && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
               <p className="text-slate-400 font-bold uppercase tracking-widest">{t.services_page.updating}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
