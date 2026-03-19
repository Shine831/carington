"use client";

import { useState } from "react";
import { ShieldCheck, Lock, ArrowRight, FileText, ChevronRight, CheckCircle2, AlertCircle, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { createBooking } from "@/lib/firebase/db";

const INITIAL = {
  clientType: "b2b",
  entity: "",
  email: "",
  phone: "",
  serviceId: "cyber",
  budget: "undef",
  timeframe: "normal",
  description: "",
};

export default function BookingPage() {
  const { t, language } = useI18n();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const validate = () => {
    if (!form.entity.trim()) return language === "fr" ? "Nom de l'entité requis." : "Entity name required.";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      return language === "fr" ? "Email invalide." : "Invalid email.";
    if (!form.phone.trim()) return language === "fr" ? "Numéro de téléphone requis." : "Phone number required.";
    if (!form.description.trim() || form.description.length < 20)
      return language === "fr" ? "Description trop courte (min. 20 caractères)." : "Description too short (min. 20 chars).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await createBooking({
        userId: user?.uid ?? null,
        ...form,
      });
      setSubmitted(true);
    } catch (err: any) {
      let errorMsg = language === "fr" ? "Erreur réseau. Impossible d'établir une connexion sécurisée." : "Network error. Unable to establish a secure connection.";
      if (err?.code === "permission-denied") errorMsg = language === "fr" ? "Accès refusé. Veuillez vérifier votre session ou rafraîchir la page." : "Access denied. Please check your session or refresh.";
      if (err?.code === "unavailable") errorMsg = language === "fr" ? "Le service est temporairement surchargé. Patientez quelques instants." : "Service is temporarily overloaded. Please wait a moment.";
      if (err?.message?.includes("quota")) errorMsg = language === "fr" ? "Limite de requêtes atteinte. Veuillez patienter avant de réessayer." : "Request limit reached. Please wait before retrying.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] pt-24 md:pt-32 bg-[var(--off-white)] relative overflow-hidden pb-32">
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
              {t.booking.title_part1} <br /><span className="italic font-serif serif-italic text-[var(--red)]">{t.booking.title_part2}</span>
            </h1>
            <p className="text-[var(--slate)] max-w-xl text-lg leading-relaxed font-medium">{t.booking.desc}</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white px-6 py-4 rounded-2xl shadow-[var(--shadow-glass)]">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.2em]">{t.booking.ssl}</span>
                <span className="text-[9px] text-[var(--slate)] font-bold">AES-256 E2E</span>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 px-4">

          {/* Main Form Portal */}
          <SlideLeft className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 md:p-12 shadow-[var(--shadow-glass)] relative overflow-hidden">
              <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-10%] w-64 h-64 opacity-[0.03]" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ──────────────── SUCCESS STATE ──────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-20 gap-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-[var(--charcoal)] tracking-tighter mb-3">
                        {language === "fr" ? "Demande envoyée !" : "Request Sent!"}
                      </h2>
                      <p className="text-sm text-[var(--slate)] font-medium max-w-sm leading-relaxed">
                        {language === "fr"
                          ? "Votre demande de devis a été enregistrée. Notre équipe vous contactera dans les 24h ouvrées."
                          : "Your quote request has been recorded. Our team will contact you within 24 business hours."}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      {user ? (
                        <Link href="/dashboard" className="btn btn-red px-8 py-4">
                          {language === "fr" ? "Voir mes demandes" : "View my requests"} <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link href="/account" className="btn btn-red px-8 py-4">
                          <User className="w-4 h-4" /> {language === "fr" ? "Créer un compte pour suivre" : "Create account to track"}
                        </Link>
                      )}
                      <button onClick={() => { setSubmitted(false); setForm(INITIAL); }} className="btn btn-outline px-8 py-4">
                        {language === "fr" ? "Nouvelle demande" : "New request"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ──────────────── FORM STATE ──────────────── */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/50 relative z-10">
                      <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight">{t.booking.new_request}</h2>
                      <span className="flex items-center gap-2 text-[9px] font-black text-[var(--charcoal)] bg-white/80 border border-slate-100 shadow-sm px-4 py-2 rounded-full uppercase tracking-widest">
                        INTAKE PROTOCOL
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                      {/* Error Banner */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 text-[var(--red)] p-4 rounded-xl flex items-center gap-3 text-xs font-bold"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                        </motion.div>
                      )}

                      {/* Step 1 — Client Info */}
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-[var(--red)] shadow-sm text-xs font-black flex items-center justify-center">1</div>
                          <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step1_title}</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Client type */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl relative">
                            <select value={form.clientType} onChange={e => set("clientType", e.target.value)}
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-type">
                              <option value="b2b">{language === "fr" ? "Entreprise (B2B)" : "Business (B2B)"}</option>
                              <option value="b2c">{language === "fr" ? "Particulier (B2C)" : "Individual (B2C)"}</option>
                              <option value="ong">{language === "fr" ? "Administration / ONG" : "Gov / NGO"}</option>
                            </select>
                            <label htmlFor="booking-type" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_type}</label>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]"><ChevronRight className="w-4 h-4 rotate-90" /></div>
                          </div>
                          {/* Entity */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                            <input type="text" value={form.entity} onChange={e => set("entity", e.target.value)} required
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-entity" />
                            <label htmlFor="booking-entity" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_entity}</label>
                          </div>
                          {/* Email */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-email" />
                            <label htmlFor="booking-email" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_email}</label>
                          </div>
                          {/* Phone */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} required
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 shadow-sm focus:bg-white" placeholder=" " id="booking-phone" />
                            <label htmlFor="booking-phone" className="floating-label font-bold text-[var(--slate)]">{t.booking.step1_phone}</label>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 — Project Details */}
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 text-[var(--red)] shadow-sm text-xs font-black flex items-center justify-center">2</div>
                          <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.step2_title}</h3>
                        </div>
                        <div className="space-y-6">
                          {/* Service */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl relative">
                            <select value={form.serviceId} onChange={e => set("serviceId", e.target.value)}
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-service">
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
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]"><ChevronRight className="w-4 h-4 rotate-90" /></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Budget */}
                            <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl relative">
                              <select value={form.budget} onChange={e => set("budget", e.target.value)}
                                className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-budget">
                                <option value="undef">{language === "fr" ? "Non défini" : "Undefined"}</option>
                                <option value="lt500">&lt; 500K CFA</option>
                                <option value="500to2m">500K – 2 Millions</option>
                                <option value="2to10m">2 – 10 Millions</option>
                                <option value="gt10m">&gt; 10 Millions CFA</option>
                              </select>
                              <label htmlFor="booking-budget" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_budget}</label>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]"><ChevronRight className="w-4 h-4 rotate-90" /></div>
                            </div>
                            {/* Timeframe */}
                            <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl relative">
                              <select value={form.timeframe} onChange={e => set("timeframe", e.target.value)}
                                className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 appearance-none shadow-sm focus:bg-white" id="booking-time">
                                <option value="urgent">{language === "fr" ? "Urgence (< 24h)" : "Urgent (< 24h)"}</option>
                                <option value="normal">{language === "fr" ? "Standard (1–2 semaines)" : "Standard (1–2 weeks)"}</option>
                                <option value="planifie">{language === "fr" ? "Planifié (1 mois+)" : "Planned (1 month+)"}</option>
                              </select>
                              <label htmlFor="booking-time" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_time}</label>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]"><ChevronRight className="w-4 h-4 rotate-90" /></div>
                            </div>
                          </div>
                          {/* Description */}
                          <div className="form-group bg-white/50 backdrop-blur-sm rounded-xl">
                            <textarea rows={6} value={form.description} onChange={e => set("description", e.target.value)} required
                              className="form-input border-2 border-white/80 bg-transparent rounded-xl py-4 resize-none shadow-sm focus:bg-white" placeholder=" " id="booking-desc" />
                            <label htmlFor="booking-desc" className="floating-label font-bold text-[var(--slate)]">{t.booking.step2_desc}</label>
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col items-start pt-10 border-t border-white/50">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          className="btn btn-red text-base px-12 py-5 w-full md:w-auto justify-center font-black uppercase tracking-widest shadow-[var(--shadow-red)] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> {language === "fr" ? "Envoi en cours..." : "Sending..."}</>
                          ) : (
                            <>{t.booking.submit} <ArrowRight className="w-5 h-5 ml-2" /></>
                          )}
                        </motion.button>
                        <p className="text-[10px] font-black text-[var(--muted)] mt-6 uppercase tracking-widest leading-loose">
                          {t.booking.terms}{" "}
                          <Link href="/terms" className="text-[var(--red)] hover:underline decoration-2 underline-offset-4 decoration-[var(--red)]/30 transition-all">
                            {language === "fr" ? "Conditions Générales" : "Terms of Service"}
                          </Link>.
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SlideLeft>

          {/* Sidebar */}
          <SlideRight>
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[var(--shadow-glass)] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/50">
                  <FileText className="w-5 h-5 text-[var(--red)]" />
                  <h3 className="font-black text-[var(--charcoal)] text-xs uppercase tracking-[0.2em]">{t.booking.process_title}</h3>
                </div>
                <StaggerContainer className="space-y-10">
                  {t.booking.steps.map(({ title, desc }: { title: string; desc: string }, i: number) => (
                    <StaggerItem key={title}>
                      <div className="flex items-start gap-4 group">
                        <span className="text-3xl font-black text-slate-200 group-hover:text-[var(--red)] transition-colors duration-500 leading-none shrink-0 italic font-serif serif-italic">
                          0{i + 1}
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
