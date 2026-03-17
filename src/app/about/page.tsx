"use client";

import { ShieldCheck, Award, Target, Users, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const PILLARS = [
  { icon: ShieldCheck, title: "Sécurité Totale", desc: "Protocoles de protection de niveau militaire, appliqués aux réalités des PME de Douala." },
  { icon: Award, title: "Certifications", desc: "Partenariats officiels avec les leaders mondiaux du hardware et du logiciel IT." },
  { icon: Target, title: "Précision d'Exécution", desc: "Respect scrupuleux des délais, des cahiers des charges et des SLA pour chaque projet." },
  { icon: Users, title: "Équipe Dédiée 24/7", desc: "Ingénieurs d'astreinte disponibles pour les urgences critiques, 7j/7." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">

      {/* Hero */}
      <section className="bg-white border-b border-[var(--border)] pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--red)]" />
        
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--red)] opacity-[0.06] blur-[120px] rounded-full" />
        
        <div className="container-xl relative z-10">
          <SlideLeft>
            <div className="flex items-center gap-3 mb-8">
              <span className="tag-red py-1 px-4 backdrop-blur-md bg-white/40 border-white/60">
                Héritage & Vision
              </span>
              <span className="text-[10px] font-black text-[var(--muted)] tracking-widest uppercase">Depuis 2014</span>
            </div>
          </SlideLeft>
          <FadeUp delay={0.1}>
            <h1 className="display-xl text-[var(--charcoal)] max-w-4xl mb-8 tracking-tighter leading-[0.95]">
              Bâtir la <span className="gradient-text italic font-serif">Résilience</span> Numérique du Cameroun.
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-body-lg max-w-2xl text-[var(--slate)] leading-relaxed">
              Fondée à Douala, E-JARNALUD SOFT fusionne l'excellence technique et l'innovation continue pour protéger les actifs les plus critiques de nos clients.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Red quote */}
      <section className="bg-[var(--red)] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-white opacity-[0.03] skew-x-12 pointer-events-none" />
        <div className="container-xl relative z-10">
          <FadeUp>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight max-w-3xl">
              "Nous n'installons pas des logiciels.<br className="hidden md:block"/>
              Nous architecturons des écosystèmes robustes et des boucliers numériques."
            </blockquote>
            <cite className="block text-red-200 text-sm font-medium mt-6 not-italic">— Fondateur, E-JARNALUD SOFT</cite>
          </FadeUp>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-py">
        <div className="container-xl">
          <FadeUp className="text-center mb-14">
            <span className="tag-red mb-4 inline-flex">Nos Engagements</span>
            <h2 className="display-lg text-[var(--charcoal)]">Pourquoi nous faire confiance ?</h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="card p-7 text-center group h-full"
                >
                  <div className="w-14 h-14 bg-[var(--red-light)] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[var(--red)] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[var(--red)] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-[var(--charcoal)] mb-2">{title}</h3>
                  <p className="text-body-sm">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Promise section */}
      <section className="section-py bg-white border-t border-b border-[var(--border)]">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SlideLeft>
              <span className="tag-red mb-5 inline-flex">L'Engagement Écarlate</span>
              <h2 className="display-md text-[var(--charcoal)] mb-8">Ce que nous promettons.</h2>
              <div className="space-y-5">
                {[
                  "Premier audit IT offert sans engagement pour chaque nouveau client.",
                  "Souveraineté totale des données clients sur le territoire camerounais.",
                  "Temps de réponse critique (downtime) inférieur à 2 heures via TMA.",
                  "Rapport mensuel de sécurité transparent pour tous vos systèmes gérés.",
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--off-white)] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--red)] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-[var(--slate)] font-medium text-[0.9375rem]">{item}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/services">
                  <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-red inline-flex">
                    Voir nos services <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link href="/contact" className="btn btn-outline">Parler à un expert</Link>
              </div>
            </SlideLeft>

            <SlideRight>
              <div className="space-y-4">
                {[
                  { val: "500+", label: "Clients actifs au Cameroun", width: 90 },
                  { val: "10 ans", label: "D'expertise continue dans l'IT", width: 100 },
                  { val: "99.9%", label: "Satisfaction client mesurée", width: 99 },
                ].map(({ val, label, width }, i) => (
                  <div key={label} className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[var(--slate)]">{label}</span>
                      <span className="text-xl font-black text-[var(--charcoal)]">{val}</span>
                    </div>
                    <div className="h-2 bg-[var(--off-white)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="h-full bg-[var(--red)] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SlideRight>
          </div>
        </div>
      </section>
    </div>
  );
}
