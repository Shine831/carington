"use client";

import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-40 relative overflow-hidden bg-[var(--off-white)]">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.03]" />
      
      <div className="container-xl relative z-10">
        <FadeUp>
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--red)] mb-12 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" /> {language === "fr" ? "Retour à l'accueil" : "Back to Home"}
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--charcoal)] flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="display-lg text-[var(--charcoal)] tracking-tighter">
              {language === "fr" ? "Confidentialité" : "Privacy Policy"}
            </h1>
          </div>

          <div className="card p-6 md:p-16 bg-white/80 backdrop-blur-xl border-2 max-w-4xl rounded-[3rem] shadow-sm">
            <div className="space-y-12 text-body">
              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "1. Collecte des Données" : "1. Data Collection"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "E-JARNALUD SOFT s'engage à protéger l'intégrité de vos informations. Nous collectons uniquement les données nécessaires au chiffrage de vos projets et à la sécurisation de vos accès." 
                    : "E-JARNALUD SOFT is committed to protecting the integrity of your information. We only collect data necessary for project estimates and securing your access."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "2. Utilisation" : "2. Usage"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "Vos données ne sont jamais partagées avec des tiers. Elles sont stockées sur des serveurs souverains sécurisés conformément aux protocoles AES-256." 
                    : "Your data is never shared with third parties. It is stored on secure sovereign servers in accordance with AES-256 protocols."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "3. Contact" : "3. Contact"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "Pour toute demande concernant vos données personnelles, contactez notre DPO à security@ejarnalud.cm." 
                    : "For any request concerning your personal data, contact our DPO at security@ejarnalud.cm."}
                </p>
              </section>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
