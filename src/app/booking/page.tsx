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
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">
      
      {/* Header (Pure Tech Refactor) */}
      <section className="bg-[var(--charcoal)] py-20 md:py-32 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="top-[-30%] right-[-10%] w-[800px] h-[800px] opacity-[0.12]" />
        
        <div className="container-xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <FadeUp>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Lock className="w-6 h-6 text-[var(--red)]" />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-red-200 uppercase">{t.booking.tag}</span>
              </div>
              <h1 className="display-xl text-white mb-6 tracking-tighter leading-[0.95]">
                {t.booking.title_part1} <br/><span className="gradient-text italic font-serif serif-italic">{t.booking.title_part2}</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg leading-relaxed font-medium">
                {t.booking.desc}
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link href="https://wa.me/23700000000">
                <motion.span
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn bg-white text-[var(--charcoal)] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest inline-flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white"
                >
                  {t.booking.whatsapp} <ChevronRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="container-xl py-20 md:py-28">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Form (i18n & Pure Tech Refactor) */}
          <SlideLeft className="lg:col-span-2">
            <div className="card p-10 md:p-16 shadow-[var(--shadow-xl)] border-2 rounded-[2.5rem] bg-white/80 backdrop-blur-xl relative overflow-hidden">
              <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-64 h-64 opacity-[0.03]" />
              
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-100">
                <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight">{t.booking.new_request}</h2>
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.booking.ssl}
                </span>
              </div>

              <form className="space-y-12 relative z-10">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-[var(--red)] text-white text-xs font-black flex items-center justify-center shadow-[0_5px_15px_rgba(200,16,46,0.2)]">1</div>
                    <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step1_title}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <select defaultValue="b2b" className="form-input border-2 rounded-xl py-4 appearance-none" id="booking-type">
                        <option value="b2b">{language === "fr" ? "Entreprise (B2B)" : "Business (B2B)"}</option>
                        <option value="b2c">{language === "fr" ? "Particulier (B2C)" : "Individual (B2C)"}</option>
                        <option value="ong">{language === "fr" ? "Administration / ONG" : "Gov / NGO"}</option>
                      </select>
                      <label htmlFor="booking-type" className="floating-label font-bold">{t.booking.step1_type}</label>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="text" className="form-input border-2 rounded-xl py-4" placeholder=" " id="booking-entity" />
                      <label htmlFor="booking-entity" className="floating-label font-bold">{t.booking.step1_entity}</label>
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-input border-2 rounded-xl py-4" placeholder=" " id="booking-email" />
                      <label htmlFor="booking-email" className="floating-label font-bold">{t.booking.step1_email}</label>
                    </div>
                    <div className="form-group">
                      <input type="tel" className="form-input border-2 rounded-xl py-4" placeholder=" " id="booking-phone" />
                      <label htmlFor="booking-phone" className="floating-label font-bold">{t.booking.step1_phone}</label>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-[var(--red)] text-white text-xs font-black flex items-center justify-center shadow-[0_5px_15px_rgba(200,16,46,0.2)]">2</div>
                    <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step2_title}</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="form-group">
                      <select defaultValue="cyber" className="form-input border-2 rounded-xl py-4 appearance-none" id="booking-service">
                        <option value="cyber">{t.services_page.items.cyber.title}</option>
                        <option value="reseau">{t.services_page.items.network.title}</option>
                        <option value="infog">{t.services_page.items.it.title}</option>
                        <option value="video">{t.services_page.items.video.title}</option>
                        <option value="voip">{t.services_page.items.voip.title}</option>
                        <option value="dev">{t.services_page.items.dev.title}</option>
                        <option value="maintenance">{t.services_page.items.maintenance.title}</option>
                      </select>
                      <label htmlFor="booking-service" className="floating-label font-bold">{t.booking.step2_service}</label>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <select defaultValue="undef" className="form-input border-2 rounded-xl py-4 appearance-none" id="booking-budget">
                          <option value="undef">{language === "fr" ? "Non défini" : "Undefined"}</option>
                          <option>&lt; 500K CFA</option>
                          <option>500K – 2 Millions</option>
                          <option>2 – 10 Millions</option>
                          <option>&gt; 10 Millions CFA</option>
                        </select>
                        <label htmlFor="booking-budget" className="floating-label font-bold">{t.booking.step2_budget}</label>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                      <div className="form-group">
                        <select defaultValue="normal" className="form-input border-2 rounded-xl py-4 appearance-none" id="booking-time">
                          <option value="urgent">{language === "fr" ? "Urgence (< 24h)" : "Urgent (< 24h)"}</option>
                          <option value="normal">{language === "fr" ? "Standard (1–2 semaines)" : "Standard (1–2 weeks)"}</option>
                          <option value="planifie">{language === "fr" ? "Planifié (1 mois+)" : "Planned (1 month+)"}</option>
                        </select>
                        <label htmlFor="booking-time" className="floating-label font-bold">{t.booking.step2_time}</label>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea rows={6} className="form-input border-2 rounded-xl py-4 resize-none" placeholder=" " id="booking-desc" />
                      <label htmlFor="booking-desc" className="floating-label font-bold">{t.booking.step2_desc}</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start pt-10 border-t border-slate-100 transition-colors hover:border-[var(--red)]/10">
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

          {/* Sidebar (i18n & Pure Tech Refactor) */}
          <SlideRight>
            <div className="space-y-6">
              <div className="card p-8 border-2 rounded-3xl relative overflow-hidden bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/20">
                  <FileText className="w-5 h-5 text-[var(--red)]" />
                  <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.process_title}</h3>
                </div>
                <StaggerContainer className="space-y-10">
                  {t.booking.steps.map(({ title, desc }, i) => (
                    <StaggerItem key={title}>
                      <div className="flex items-start gap-4 group">
                        <span className="text-3xl font-black text-slate-100 group-hover:text-[var(--red)] transition-colors duration-500 leading-none shrink-0 italic font-serif serif-italic">
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
                className="card p-10 text-center bg-white border-2 rounded-3xl transition-all duration-300 shadow-sm"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
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
