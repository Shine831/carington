"use client";

import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, language } = useI18n();

  const CONTACT_ITEMS = [
    { icon: MapPin, label: t.contact.items.hq, val: t.contact.items.hq_val },
    { icon: Phone, label: t.contact.items.std, val: "+237 600 00 00 00" },
    { icon: Phone, label: t.contact.items.urgency, val: "+237 699 99 99 99", red: true },
    { icon: Mail, label: t.contact.items.email, val: "contact@ejarnalud.cm" },
    { icon: Clock, label: t.contact.items.hours, val: t.contact.items.hours_val },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-32 bg-[var(--off-white)]">
      
      {/* Header (Pure Tech Refactor) */}
      <section className="bg-white border-b border-[var(--border)] pt-20 pb-24 md:pt-32 md:pb-32 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-2 bg-[var(--red)]" />
        
        {/* Gradients replacement for old manual orbs */}
        <AuraGradient color="var(--red)" className="top-[-10%] right-[-5%] w-[600px] h-[600px] opacity-[0.08]" />
        
        <div className="container-xl relative z-10">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <span className="tag-red py-1.5 px-5 backdrop-blur-md bg-white/40 border-white/60 shadow-sm uppercase tracking-widest text-[10px]">
                {t.contact.tag}
              </span>
              <span className="text-[10px] font-black text-[var(--muted)] tracking-widest uppercase">{t.contact.badge}</span>
            </div>
            <h1 className="display-xl text-[var(--charcoal)] mb-6 tracking-tighter leading-[0.95]">
              {t.contact.title_part1} <span className="gradient-text italic font-serif serif-italic">{t.contact.title_part2}</span>
            </h1>
            <p className="text-body-lg max-w-xl text-[var(--slate)] leading-relaxed border-l-2 border-[var(--border)] pl-8">
              {t.contact.desc}
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="container-xl py-20 md:py-32 mb-32">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-24 items-start">
          
          {/* Contact Info (i18n) */}
          <div className="lg:col-span-2 pt-12 md:pt-16">
            <SlideLeft>
              <h2 className="display-sm text-[var(--charcoal)] mb-12 tracking-tight uppercase font-black">{t.contact.info_title}</h2>
              <StaggerContainer className="space-y-4">
                {CONTACT_ITEMS.map(({ icon: Icon, label, val, red }) => (
                  <StaggerItem key={label}>
                    <motion.div
                      whileHover={{ x: 6, borderColor: "var(--red)" }}
                      className="card p-6 flex items-start gap-5 border-2 transition-all duration-300 rounded-2xl"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[var(--red)] transition-colors">
                        <Icon className={`w-5 h-5 ${red ? "text-[var(--red)]" : "text-[var(--charcoal)]"}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1.5">{label}</p>
                        <p className={`font-bold whitespace-pre-line text-sm leading-relaxed ${red ? "text-[var(--red)]" : "text-[var(--charcoal)]"}`}>{val}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </SlideLeft>
          </div>

          {/* Form (i18n & Pure Tech Card) */}
          <SlideRight className="lg:col-span-3">
            <div className="card p-6 md:p-16 shadow-[var(--shadow-xl)] border-2 rounded-[2.5rem] relative overflow-hidden bg-white/80 backdrop-blur-xl">
              <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-64 h-64 opacity-[0.03]" />
              
              <h2 className="display-sm text-[var(--charcoal)] mb-10 tracking-tight">{t.contact.form_title}</h2>
              <form className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <input type="text" className="form-input border-2 rounded-xl py-4" placeholder=" " id="contact-name" />
                    <label htmlFor="contact-name" className="floating-label font-bold">{t.contact.form.name}</label>
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-input border-2 rounded-xl py-4" placeholder=" " id="contact-email" />
                    <label htmlFor="contact-email" className="floating-label font-bold">{t.contact.form.email}</label>
                  </div>
                </div>

                <div className="form-group">
                  <select defaultValue="" className="form-input appearance-none border-2 rounded-xl py-4" id="contact-subject">
                    <option value="" disabled></option>
                    <option value="devis">{t.contact.form.subjects.quote}</option>
                    <option value="support">{t.contact.form.subjects.support}</option>
                    <option value="audit">{t.contact.form.subjects.audit}</option>
                    <option value="other">{t.contact.form.subjects.other}</option>
                  </select>
                  <label htmlFor="contact-subject" className="floating-label font-bold">{t.contact.form.subject}</label>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                <div className="form-group">
                  <textarea rows={6} className="form-input resize-none border-2 rounded-xl py-4" placeholder=" " id="contact-message" />
                  <label htmlFor="contact-message" className="floating-label font-bold">{t.contact.form.message}</label>
                </div>

                <div className="pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-red text-base px-10 py-5 w-full md:w-auto justify-center font-black uppercase tracking-widest shadow-[var(--shadow-red)]"
                  >
                    {t.contact.form.send} <Send className="w-4 h-4 ml-2" />
                  </motion.button>
                  <p className="text-[10px] font-black text-[var(--muted)] mt-5 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t.contact.form.secure}
                  </p>
                </div>
              </form>
            </div>
          </SlideRight>
        </div>
      </div>
    </div>
  );
}
