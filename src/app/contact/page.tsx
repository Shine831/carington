"use client";

import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const CONTACT_ITEMS = [
  { icon: MapPin, label: "Siège Social", val: "Immeuble TechHub, Akwa\nDouala, Cameroun" },
  { icon: Phone, label: "Standard", val: "+237 600 00 00 00" },
  { icon: Phone, label: "Urgence 24/7", val: "+237 699 99 99 99", red: true },
  { icon: Mail, label: "Email", val: "contact@ejarnalud.cm" },
  { icon: Clock, label: "Horaires", val: "Lun-Ven  08h00 – 18h00\nSamedi  09h00 – 13h00" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">
      
      {/* Header */}
      <section className="bg-white border-b border-[var(--border)] pt-20 pb-24 md:pt-32 md:pb-32 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--red)]" />
        
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--red)] opacity-[0.06] blur-[120px] rounded-full" />
        
        <div className="container-xl relative z-10">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <span className="tag-red py-1 px-4 backdrop-blur-md bg-white/40 border-white/60">
                Support & Partenariat
              </span>
              <span className="text-[10px] font-black text-[var(--muted)] tracking-widest uppercase">Équipe Dédiée</span>
            </div>
            <h1 className="display-xl text-[var(--charcoal)] mb-6 tracking-tighter leading-[0.95]">
              Parlons de votre <span className="gradient-text italic font-serif">Avenir.</span>
            </h1>
            <p className="text-body-lg max-w-xl text-[var(--slate)] leading-relaxed">
              Nos experts sont basés à Akwa, Douala. Réponse moyenne : <span className="text-[var(--red)] font-bold">1h45min</span>.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="container-xl py-16 md:py-24">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <SlideLeft>
              <h2 className="display-sm text-[var(--charcoal)] mb-8">Coordonnées</h2>
              <StaggerContainer className="space-y-4">
                {CONTACT_ITEMS.map(({ icon: Icon, label, val, red }) => (
                  <StaggerItem key={label}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="card p-5 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--red-light)] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[var(--red)]" />
                      </div>
                      <div>
                        <p className="label mb-1">{label}</p>
                        <p className={`font-semibold whitespace-pre-line text-sm leading-relaxed ${red ? "text-[var(--red)]" : "text-[var(--charcoal)]"}`}>{val}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </SlideLeft>
          </div>

          {/* Form */}
          <SlideRight className="lg:col-span-3">
            <div className="card p-8 md:p-12 shadow-[var(--shadow-md)]">
              <h2 className="display-sm text-[var(--charcoal)] mb-8">Envoyer un message</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <input type="text" className="form-input" placeholder=" " id="contact-name" />
                    <label htmlFor="contact-name" className="floating-label">Nom / Entreprise</label>
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-input" placeholder=" " id="contact-email" />
                    <label htmlFor="contact-email" className="floating-label">Email Professionnel</label>
                  </div>
                </div>

                <div className="form-group">
                  <select defaultValue="" className="form-input appearance-none" id="contact-subject">
                    <option value="" disabled></option>
                    <option value="devis">Demande de Devis</option>
                    <option value="support">Support Technique</option>
                    <option value="audit">Demande d'Audit IT/Cyber</option>
                    <option value="other">Autre</option>
                  </select>
                  <label htmlFor="contact-subject" className="floating-label">Sujet de votre demande</label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                <div className="form-group">
                  <textarea rows={5} className="form-input resize-none" placeholder=" " id="contact-message" />
                  <label htmlFor="contact-message" className="floating-label">Message (Décrivez votre besoin...)</label>
                </div>

                <div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn btn-red text-base px-8 py-4 shadow-[var(--shadow-red)]"
                  >
                    Envoyer le message <Send className="w-4 h-4" />
                  </motion.button>
                  <p className="text-xs text-[var(--muted)] mt-3">🔒 Données confidentielles · AES-256</p>
                </div>
              </form>
            </div>
          </SlideRight>
        </div>
      </div>
    </div>
  );
}
