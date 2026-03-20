"use client";

import { ShieldCheck, Award, Target, Users, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { MagneticButton } from "@/components/ui/InteractiveEffects";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t, language } = useI18n();

  return (
    <div className="min-h-screen pt-24 md:pt-32 bg-[var(--off-white)]">

      {/* Hero (White/Red 2026 Premium Refactor) */}
      <section className="relative min-h-[70vh] flex items-center pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-white border-b border-[var(--border)]">
        <ParticleBackground />
        
        {/* Aura Gradients (Bright clean style) */}
        <AuraGradient color="var(--red)" className="top-[-10%] right-[-5%] w-[800px] h-[800px] opacity-[0.06]" delay={0} />
        <AuraGradient color="var(--slate)" className="bottom-[10%] left-[10%] w-[600px] h-[600px] opacity-[0.03]" delay={3} />

        
        <div className="container-xl relative z-10">
          <SlideLeft>
            <div className="flex items-center gap-3 mb-8 px-1">
              <span className="tag-red py-1.5 px-5 backdrop-blur-md bg-[var(--red-light)] border border-red-100 text-[var(--red)] uppercase tracking-widest text-[10px] shadow-sm rounded-full">
                {t.about.tag}
              </span>
              <span className="text-[10px] font-black text-[var(--muted)] tracking-widest uppercase bg-slate-50 px-3 py-1.5 rounded-full border">{t.about.since}</span>
            </div>
          </SlideLeft>
          <FadeUp delay={0.1}>
            <h1 className="display-xl text-[var(--charcoal)] max-w-4xl mb-8 tracking-tighter leading-[0.95]">
              {t.about.title_part1} <span className="text-[var(--red)] italic font-serif serif-italic">{t.about.title_part2}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-body-lg max-w-2xl text-[var(--slate)] leading-relaxed border-l-2 border-[var(--red)]/20 pl-8 font-medium">
              {t.about.desc}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Red quote (i18n) */}
      <section className="bg-[var(--red)] py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-white opacity-[0.03] skew-x-12 pointer-events-none" />
        <div className="container-xl relative z-10">
          <FadeUp>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight max-w-3xl italic font-serif serif-italic">
              "{t.about.quote}"
            </blockquote>
            <cite className="block text-red-200 text-[10px] font-black uppercase tracking-[0.3em] mt-8 not-italic">— {t.about.quote_author}, E-JARNALUD SOFT</cite>
          </FadeUp>
        </div>
      </section>

      {/* Pillars (i18n) */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <FadeUp className="text-center mb-16">
            <span className="tag-red mb-4 inline-flex tracking-widest uppercase text-[10px]">{t.about.commit_tag}</span>
            <h2 className="display-lg text-[var(--charcoal)] tracking-tight">{t.about.commit_title}</h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.pillars.map(({ title, desc }, i) => {
              const Icon = [ShieldCheck, Award, Target, Users][i % 4];
              return (
                <StaggerItem key={title}>
                  <motion.div
                    whileHover={{ y: -8, borderColor: "var(--red)" }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                    className="card p-10 text-center group h-full border-2 transition-all duration-500 rounded-[2.5rem] bg-white zero-jank shadow-sm hover:shadow-[0_20px_40px_rgba(230,0,0,0.06)]"
                  >
                    <div className="w-16 h-16 bg-[var(--off-white)] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[var(--red-light)] transition-all duration-500 border border-slate-100 group-hover:border-red-100">
                      <Icon className="w-7 h-7 text-[var(--charcoal)] group-hover:text-[var(--red)] transition-colors duration-500" />
                    </div>
                    <h3 className="font-black text-[var(--charcoal)] mb-4 uppercase text-xs tracking-widest">{title}</h3>
                    <p className="text-sm text-[var(--slate)] leading-relaxed font-medium">{desc}</p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Promise section (i18n) */}
      <section className="section-py relative overflow-hidden bg-[var(--off-white)] mb-32">
        <AuraGradient color="var(--red)" className="top-[50%] right-[-10%] w-80 h-80 opacity-[0.03]" />
        
        <div className="container-xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <SlideLeft>
              <span className="tag-red mb-6 inline-flex tracking-widest uppercase text-[10px]">{t.about.promise_tag}</span>
              <h2 className="display-md text-[var(--charcoal)] mb-8 tracking-tight">{t.about.promise_title}</h2>
              <div className="space-y-4">
                {t.about.promises.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 8 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                    className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--red)] shadow-sm hover:shadow-[0_10px_30px_rgba(230,0,0,0.05)] transition-all zero-jank"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--red-light)] flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                      <CheckCircle className="w-4 h-4 text-[var(--red)]" />
                    </div>
                    <p className="text-[var(--slate)] font-bold text-sm leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 flex flex-wrap gap-6">
                <Link href="/services">
                  <MagneticButton>
                    <motion.span whileHover={{ scale: 1.05, y: -2 }} className="btn btn-red px-10 py-5 font-black uppercase text-[10px] tracking-widest shadow-[var(--shadow-red)]">
                      {t.about.view_services} <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.span>
                  </MagneticButton>
                </Link>
                <Link href="/contact">
                  <MagneticButton>
                    <motion.span className="btn btn-outline border-slate-200 hover:border-[var(--red)]/40 px-10 py-5 font-black uppercase text-[10px] tracking-widest bg-white">
                      {t.about.talk_expert}
                    </motion.span>
                  </MagneticButton>
                </Link>
              </div>
            </SlideLeft>

            <SlideRight>
              <div className="space-y-6">
                {[
                  { val: "500+", label: t.about.stats.clients, width: 90 },
                  { val: "10 years", label: t.about.stats.years, width: 100 },
                  { val: "99.9%", label: t.about.stats.sat, width: 99 },
                ].map(({ val, label, width }, i) => (
                  <div key={label} className="card p-10 bg-white border-2 rounded-[2rem] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{label}</span>
                      <span className="text-2xl font-black text-[var(--charcoal)] tracking-tighter italic font-serif serif-italic">{val}</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        transition={{ delay: i * 0.15, duration: 1.5, ease: "circOut" }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-[var(--red)] to-[#FF5C78] rounded-full"
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
