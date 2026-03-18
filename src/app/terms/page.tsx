"use client";

import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function TermsPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-40 relative overflow-hidden bg-[var(--off-white)]">
      <AuraGradient color="var(--red)" className="bottom-[-10%] left-[-10%] w-[600px] h-[600px] opacity-[0.03]" />
      
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
              {language === "fr" ? "CGV / CGU" : "Terms & Conditions"}
            </h1>
          </div>

          <div className="card p-6 md:p-16 bg-white/80 backdrop-blur-xl border-2 max-w-4xl rounded-[3rem] shadow-sm">
            <div className="space-y-12 text-body">
              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "1. Services IT" : "1. IT Services"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "Les prestations de Carrington sont régies par des contrats de service spécifiques. Toute commande implique l'acceptation de nos protocoles de sécurité." 
                    : "Carrington's services are governed by specific service contracts. Any order implies acceptance of our security protocols."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "2. Responsabilité" : "2. Liability"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "Carrington s'engage à une obligation de moyens renforcée. La sécurité de l'infrastructure client reste une co-responsabilité." 
                    : "Carrington commits to an enhanced best-effort obligation. Client infrastructure security remains a shared responsibility."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tight mb-4">{language === "fr" ? "3. Juridiction" : "3. Jurisdiction"}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {language === "fr" 
                    ? "Tout litige relatif à l'utilisation de nos services sera soumis à la compétence exclusive des tribunaux de Douala, Cameroun." 
                    : "Any dispute relating to the use of our services will be subject to the exclusive jurisdiction of the courts of Douala, Cameroon."}
                </p>
              </section>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
