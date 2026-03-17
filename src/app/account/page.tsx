"use client";

import { User, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, History } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const FEATURES = [
  { icon: Briefcase, label: "Suivi de vos demandes en temps réel" },
  { icon: History, label: "Accès à l'historique complet des prestations" },
  { icon: ShieldCheck, label: "Connexion aux prestataires certifiés" },
  { icon: User, label: "Espace dédié pour vos avis et évaluations" },
];

export default function AccountPage() {
  return (
    <div className="min-h-[100svh] pt-[68px] md:pt-[76px] bg-[var(--off-white)] flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-[var(--shadow-xl)]">
        
        {/* Left panel — Red */}
        <SlideLeft className="h-full">
          <div className="bg-[var(--red)] p-10 md:p-12 flex flex-col justify-between h-full min-h-[400px] relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white opacity-[0.06] pointer-events-none" />
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-white opacity-[0.04] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold text-red-200 uppercase tracking-widest mb-6 block">Espace Client</span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
                Votre interface<br/>de gestion IT.
              </h2>
              <p className="text-red-100 text-sm leading-relaxed mb-10">
                Accédez à votre tableau de bord pour suivre vos projets, contacter nos équipes et gérer vos contrats.
              </p>
              <StaggerContainer className="space-y-4">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <StaggerItem key={label}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">{label}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
            <p className="text-red-200/70 text-xs mt-8 relative z-10">Accès sécurisé 24/7 · Protection des données garantie</p>
          </div>
        </SlideLeft>

        {/* Right panel — Login form */}
        <SlideRight>
          <div className="bg-white p-10 md:p-12">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-2">Connexion</h3>
              <p className="text-sm text-[var(--muted)]">Entrez vos identifiants pour accéder à votre espace.</p>
            </div>

            <form className="space-y-4">
              <div className="form-group has-icon">
                <Mail className="form-input-icon" />
                <input type="email" className="form-input" placeholder=" " id="login-email" />
                <label htmlFor="login-email" className="floating-label">Adresse Email</label>
              </div>
              
              <div className="form-group has-icon">
                <Lock className="form-input-icon" />
                <input type="password" className="form-input pr-16" placeholder=" " id="login-password" />
                <label htmlFor="login-password" className="floating-label">Mot de Passe</label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Link href="#" className="text-xs text-[var(--red)] font-semibold hover:underline">Oublié ?</Link>
                </div>
              </div>

              <Link href="/dashboard">
                <motion.span
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-red w-full text-base py-4 shadow-[var(--shadow-red)] mt-2 flex items-center justify-center gap-2"
                >
                  Accéder à mon espace <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </form>

            <div className="border-t border-[var(--border)] mt-8 pt-8 text-center">
              <p className="text-sm text-[var(--slate)] mb-4">Première visite ? Créez votre compte client.</p>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link href="/booking" className="btn btn-outline w-full justify-center">
                  Créer un compte
                </Link>
              </motion.div>
            </div>
          </div>
        </SlideRight>
      </div>
    </div>
  );
}
