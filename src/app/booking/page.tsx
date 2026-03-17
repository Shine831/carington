"use client";

import { ShieldCheck, Lock, ArrowRight, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const STEPS = [
  { num: "01", title: "Analyse", desc: "Nos ingénieurs étudient votre dossier en moins de 12 heures." },
  { num: "02", title: "Devis & SLA", desc: "Proposition technique avec délais, tarifs CFA et spécifications détaillées." },
  { num: "03", title: "Exécution", desc: "Intervention sur site ou déploiement distant certifié et sécurisé." },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">
      
      {/* Header */}
      <section className="bg-[var(--charcoal)] py-20 md:py-32 relative overflow-hidden">
        {/* Animated Background Orb */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--red)] blur-[120px] pointer-events-none"
        />
        
        <div className="container-xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <FadeUp>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[var(--red)]" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-red-200 uppercase">Portail Chiffré AES-256</span>
              </div>
              <h1 className="display-xl text-white mb-4 tracking-tighter">Planifiez votre <br/><span className="gradient-text italic font-serif">Résilience.</span></h1>
              <p className="text-gray-400 max-w-xl text-lg">Nos ingénieurs analysent votre infrastructure et proposent une stratégie sous 12h.</p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link href="https://wa.me/23700000000">
                <motion.span
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-white text-[var(--charcoal)] px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-wider inline-flex items-center gap-3 shadow-2xl"
                >
                  WhatsApp Direct <ChevronRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="container-xl py-16 md:py-20">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Form */}
          <SlideLeft className="lg:col-span-2">
            <div className="card p-8 md:p-12 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border)]">
                <h2 className="text-xl font-bold text-[var(--charcoal)]">Nouvelle Demande</h2>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> SSL Actif
                </span>
              </div>

              <form className="space-y-8">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-[var(--red)] text-white text-xs font-bold flex items-center justify-center">1</div>
                    <h3 className="font-bold text-[var(--charcoal)] text-sm uppercase tracking-wider">Profil Client</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Type de Structure</label>
                      <select defaultValue="b2b" className="form-input appearance-none">
                        <option value="b2b">Entreprise (B2B)</option>
                        <option value="b2c">Particulier (B2C)</option>
                        <option value="ong">Administration / ONG</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Entité / Demandeur</label>
                      <input type="text" className="form-input" placeholder="XYZ Sarl ou Jean Dupont" />
                    </div>
                    <div>
                      <label className="form-label">Email Sécurisé</label>
                      <input type="email" className="form-input" placeholder="contact@entreprise.com" />
                    </div>
                    <div>
                      <label className="form-label">Téléphone</label>
                      <input type="tel" className="form-input" placeholder="+237 6XX XX XX XX" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-[var(--red)] text-white text-xs font-bold flex items-center justify-center">2</div>
                    <h3 className="font-bold text-[var(--charcoal)] text-sm uppercase tracking-wider">Spécifications Techniques</h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="form-label">Service Principal</label>
                      <select defaultValue="cyber" className="form-input appearance-none">
                        <option value="cyber">Audit & Cybersécurité</option>
                        <option value="reseau">Installation Réseau</option>
                        <option value="infog">Infogérance & Serveurs</option>
                        <option value="video">Vidéosurveillance</option>
                        <option value="voip">Téléphonie VoIP</option>
                        <option value="dev">Développement Web/Logiciel</option>
                        <option value="maintenance">Maintenance Urgente</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="form-label">Budget Estimé</label>
                        <select defaultValue="undef" className="form-input appearance-none">
                          <option value="undef">Non défini</option>
                          <option>&lt; 500K CFA</option>
                          <option>500K – 2 Millions</option>
                          <option>2 – 10 Millions</option>
                          <option>&gt; 10 Millions CFA</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Délai Souhaité</label>
                        <select defaultValue="normal" className="form-input appearance-none">
                          <option value="urgent">Urgence (&lt; 24h)</option>
                          <option value="normal">Standard (1–2 semaines)</option>
                          <option value="planifie">Planifié (1 mois+)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Description du Besoin</label>
                      <textarea rows={5} className="form-input resize-y" placeholder="Infrastructure actuelle, blocages, attentes précises..." />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start pt-4 border-t border-[var(--border)]">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-red text-base px-10 py-4 shadow-[var(--shadow-red)]"
                  >
                    Soumettre la Requête <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <p className="text-xs text-[var(--muted)] mt-4">
                    En soumettant, vous acceptez nos{" "}
                    <Link href="#" className="underline hover:text-[var(--red)]">Conditions Générales</Link>.
                  </p>
                </div>
              </form>
            </div>
          </SlideLeft>

          {/* Sidebar */}
          <SlideRight>
            <div className="space-y-5">
              <div className="card p-7 red-border-left">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[var(--red)]" />
                  <h3 className="font-bold text-[var(--charcoal)] text-sm">Processus de Validation</h3>
                </div>
                <StaggerContainer className="space-y-6">
                  {STEPS.map(({ num, title, desc }) => (
                    <StaggerItem key={num}>
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-black text-[var(--red-light)] leading-none shrink-0">{num}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--charcoal)] text-sm mb-1">{title}</h4>
                          <p className="text-body-sm text-[0.82rem]">{desc}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
              
              <motion.div
                whileHover={{ y: -3 }}
                className="card p-6 text-center bg-[var(--off-white)]"
              >
                <ShieldCheck className="w-10 h-10 text-[var(--red)] mx-auto mb-3" />
                <p className="text-sm font-bold text-[var(--charcoal)]">Données 100% Sécurisées</p>
                <p className="text-xs text-[var(--muted)] mt-1">AES-256 · Hébergement Cameroun</p>
              </motion.div>
            </div>
          </SlideRight>
        </div>
      </div>
    </div>
  );
}
