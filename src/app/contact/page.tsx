"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { createContactMessage } from "@/lib/firebase/db";

export default function ContactPage() {
  const { t, language } = useI18n();

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "devis", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const validate = () => {
    if (!form.name.trim()) return t.contact.form.errors.name_req;
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) return t.contact.form.errors.email_inv;
    if (!form.message.trim() || form.message.length < 10) return t.contact.form.errors.msg_short;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await createContactMessage(form);
      setSuccess(true);
    } catch (err: any) {
      let errorMsg = t.contact.form.errors.network;
      if (err?.code === "permission-denied") errorMsg = t.contact.form.errors.denied;
      if (err?.code === "unavailable") errorMsg = t.contact.form.errors.overload;
      if (err?.message?.includes("quota")) errorMsg = t.contact.form.errors.quota;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const CONTACT_ITEMS = [
    { icon: MapPin, label: language === "fr" ? "SIÈGE SOCIAL" : "HEADQUARTERS", val: t.contact.hq_val },
    { icon: Phone, label: language === "fr" ? "APPEL & WHATSAPP" : "CALL & WHATSAPP", val: t.contact.phone_val, red: true },
    { icon: Phone, label: language === "fr" ? "LIGNE TECHNIQUE" : "TECH LINE", val: t.contact.tech_val },
    { icon: Mail, label: "EMAIL SUPPORT", val: t.contact.email_val },
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
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-[var(--charcoal)] mb-4 tracking-tighter">
                        {t.contact.form.success_title}
                      </h3>
                      <p className="text-sm font-medium text-[var(--slate)] mb-8">
                        {t.contact.form.success_desc}
                      </p>
                      <button onClick={() => { setSuccess(false); setForm({ name: "", email: "", phone: "", subject: "devis", message: "" }); }} className="btn btn-red px-8 py-3 text-[10px] uppercase font-black">
                        {t.contact.form.new_msg}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-6 relative z-10"
                      onSubmit={handleSubmit}
                    >
                      {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <input type="text" value={form.name} onChange={e => set("name", e.target.value)} className="form-input border-2 rounded-xl py-4" placeholder=" " id="contact-name" />
                          <label htmlFor="contact-name" className="floating-label font-bold">{t.contact.form.name}</label>
                        </div>
                        <div className="form-group">
                          <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="form-input border-2 rounded-xl py-4" placeholder=" " id="contact-email" />
                          <label htmlFor="contact-email" className="floating-label font-bold">{t.contact.form.email}</label>
                        </div>
                      </div>

                      <div className="form-group">
                        <select value={form.subject} onChange={e => set("subject", e.target.value)} className="form-input appearance-none border-2 rounded-xl py-4" id="contact-subject">
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
                        <textarea rows={6} value={form.message} onChange={e => set("message", e.target.value)} className="form-input resize-none border-2 rounded-xl py-4" placeholder=" " id="contact-message" />
                        <label htmlFor="contact-message" className="floating-label font-bold">{t.contact.form.message}</label>
                      </div>

                      <div className="pt-4">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                          className="btn btn-red text-base px-10 py-5 w-full md:w-auto justify-center font-black uppercase tracking-widest shadow-[var(--shadow-red)] disabled:opacity-60"
                        >
                           {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />{t.contact.form.sending}</> : <>{t.contact.form.send} <Send className="w-4 h-4 ml-2" /></>}
                        </motion.button>
                        <p className="text-[10px] font-black text-[var(--muted)] mt-5 flex items-center gap-2 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {t.contact.form.secure}
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
            </div>
          </SlideRight>
        </div>
      </div>
    </div>
  );
}
