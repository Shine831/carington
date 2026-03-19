"use client";

import { ShieldCheck, Lock, ArrowRight, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function BookingPage() {
  const { t, language } = useI18n();

  return (
    <div className="min-h-[100svh] pt-24 md:pt-32 bg-[var(--off-white)] relative overflow-hidden pb-32">
      {/* Background Ambience */}
      <AuraGradient color="var(--red)" className="top-0 right-[-10%] w-[800px] h-[800px] opacity-[0.03]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container-xl relative z-10 max-w-6xl mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 px-4">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-8 bg-[var(--red)] rounded-full" />
              <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-[var(--red)] uppercase">
                <Lock className="w-3.5 h-3.5" /> {t.booking.tag}
              </span>
            </div>
            <h1 className="display-lg text-[var(--charcoal)] mb-4 tracking-tighter leading-[0.95]">
              {t.booking.title_part1} <br/><span className="italic font-serif serif-italic text-[var(--red)]">{t.booking.title_part2}</span>
            </h1>
            <p className="text-[var(--slate)] max-w-xl text-lg leading-relaxed font-medium">
              {t.booking.desc}
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white px-6 py-4 rounded-2xl shadow-[var(--shadow-glass)]">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.2em]">
                  {t.booking.ssl}
                </span>
                <span className="text-[9px] text-[var(--slate)] font-bold">AES-256 E2E</span>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 px-4">
          
          {/* Main Form Portal (Glassmorphism) */}
          <SlideLeft className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 md:p-12 shadow-[var(--shadow-glass)] relative overflow-hidden">
              <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-64 h-64 opacity-[0.03]" />
              
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/50 relative z-10">
                <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight">{t.booking.new_request}</h2>
                <span className="flex items-center gap-2 text-[9px] font-black text-[var(--charcoal)] bg-white/80 border border-slate-100 shadow-sm px-4 py-2 rounded-full uppercase tracking-widest">
                  INTAKE PROTOCOL
                </span>
              </div>

              <form className="space-y-12 relative z-10">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-[var(--red)] shadow-sm text-xs font-black flex items-center justify-center">1</div>
                    <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step1_title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 relative">
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                      <select defaultValue="b2b" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-type">
                        <option value="b2b">{language === "fr" ? "Entreprise (B2B)" : "Business (B2B)"}</option>
                        <option value="b2c">{language === "fr" ? "Particulier (B2C)" : "Individual (B2C)"}</option>
                        <option value="ong">{language === "fr" ? "Administration / ONG" : "Gov / NGO"}</option>
                      </select>
                      <label htmlFor="booking-type" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_type}</label>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                      <input type="text" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-entity" />
                      <label htmlFor="booking-entity" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_entity}</label>
                    </div>
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                      <input type="email" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-email" />
                      <label htmlFor="booking-email" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_email}</label>
                    </div>
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                      <input type="tel" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-phone" />
                      <label htmlFor="booking-phone" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_phone}</label>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-[var(--red)] shadow-sm text-xs font-black flex items-center justify-center">2</div>
                    <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step2_title}</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl relative">
                      <select defaultValue="cyber" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-service">
                        <option value="cyber">{t.services_page.items.cyber.title}</option>
                        <option value="reseau">{t.services_page.items.network.title}</option>
                        <option value="infog">{t.services_page.items.it.title}</option>
                        <option value="video">{t.services_page.items.video.title}</option>
                        <option value="voip">{t.services_page.items.voip.title}</option>
                        <option value="web">{t.services_page.items.web.title}</option>
                        <option value="maintenance">{t.services_page.items.maintenance.title}</option>
                        <option value="cable">{t.services_page.items.network_cable.title}</option>
                      </select>
                      <label htmlFor="booking-service" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_service}</label>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 relative">
                      <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                        <select defaultValue="undef" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-budget">
                          <option value="undef">{language === "fr" ? "Non défini" : "Undefined"}</option>
                          <option>&lt; 500K CFA</option>
                          <option>500K – 2 Millions</option>
                          <option>2 – 10 Millions</option>
                          <option>&gt; 10 Millions CFA</option>
                        </select>
                        <label htmlFor="booking-budget" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_budget}</label>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                      <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                        <select defaultValue="normal" className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-time">
                          <option value="urgent">{language === "fr" ? "Urgence (< 24h)" : "Urgent (< 24h)"}</option>
                          <option value="normal">{language === "fr" ? "Standard (1–2 semaines)" : "Standard (1–2 weeks)"}</option>
                          <option value="planifie">{language === "fr" ? "Planifié (1 mois+)" : "Planned (1 month+)"}</option>
                        </select>
                        <label htmlFor="booking-time" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_time}</label>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                      <textarea rows={6} className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 resize-none shadow-sm focus:bg-white" placeholder=" " id="booking-desc" />
                      <label htmlFor="booking-desc" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_desc}</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start pt-10 border-t border-white/50 transition-colors">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-red text-base px-12 py-5 w-full md:w-auto justify-center font-black uppercase tracking-widest shadow-[var(--shadow-red)]"
                  >
                    {t.booking.submit} <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                  <p className="text-[10px] font-black text-[var(--muted)] mt-6 uppercase tracking-widest leading-loose">
                    {t.booking.terms}{" "}
                    <Link href="#" className="text-[var(--red)] hover:underline decoration-2 underline-offset-4 decoration-[var(--red)]/30 transition-all">
                      {language === "fr" ? "Conditions Générales" : "Terms of Service"}
                    </Link>.
                  </p>
                </div>
              </form>
            </div>
          </SlideLeft>

          {/* Guidelines Sidebar */}
          <SlideRight>
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[var(--shadow-glass)] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/50">
                  <FileText className="w-5 h-5 text-[var(--red)]" />
                  <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.process_title}</h3>
                </div>
                <StaggerContainer className="space-y-10">
                  {t.booking.steps.map(({ title, desc }, i) => (
                    <StaggerItem key={title}>
                      <div className="flex items-start gap-4 group">
                        <span className="text-3xl font-black text-slate-200 group-hover:text-[var(--red)] transition-colors duration-500 leading-none shrink-0 italic font-serif serif-italic">
                          0{i+1}
                        </span>
                        <div>
                          <h4 className="font-black text-[var(--charcoal)] text-sm mb-2 uppercase tracking-tight">{title}</h4>
                          <p className="text-xs text-[var(--slate)] leading-relaxed font-medium">{desc}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
              
              <motion.div
                whileHover={{ y: -5, borderColor: "var(--red)" }}
                className="bg-white/80 p-10 text-center border-2 border-white rounded-[2.5rem] transition-all duration-300 shadow-[var(--shadow-glass)] backdrop-blur-xl"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xs font-black text-[var(--charcoal)] uppercase tracking-widest mb-2">{t.booking.secure_data}</p>
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">{t.booking.secure_desc}</p>
              </motion.div>
            </div>
          </SlideRight>
        </div>
      </div>
    </div>
  );
}
