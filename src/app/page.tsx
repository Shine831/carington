"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ShieldCheck, Server, Network, ShieldAlert, ArrowRight, Star, Zap, PhoneCall, ChevronRight, Activity, Target, Cpu } from "lucide-react";
import Link from "next/link";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { TiltCard, MagneticButton, BentoCard, SpatialLayer } from "@/components/ui/InteractiveEffects";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { TestimonialsSection } from "@/components/ui/Testimonials";

export default function Home() {
  const { t, language } = useI18n();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const SERVICES = [
    { 
      id: "cyber", 
      tag: t.services.cyber.tag, 
      icon: ShieldAlert, 
      title: t.services_page.items.cyber.title, 
      desc: t.services_page.items.cyber.desc,
      span: "lg:col-span-8",
      color: "var(--red)"
    },
    { 
      id: "infog", 
      tag: t.services.it.tag, 
      icon: Server, 
      title: t.services_page.items.it.title, 
      desc: t.services_page.items.it.desc,
      span: "lg:col-span-4",
      color: "var(--slate)"
    },
    { 
      id: "voip", 
      tag: t.services.infra.tag, 
      icon: PhoneCall, 
      title: t.services_page.items.voip.title, 
      desc: t.services_page.items.voip.desc,
      span: "lg:col-span-4",
      color: "var(--slate)"
    },
    {
      id: "cable",
      tag: t.services.cloud.tag,
      icon: Network,
      title: t.services_page.items.network_cable.title,
      desc: t.services_page.items.network_cable.desc,
      span: "lg:col-span-8",
      color: "var(--red)"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden spatial-bg">

      {/* ── ELITE HERO 2026 (Kinetic & Spatial) ───────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">

        {/* Spatial Elements */}
        <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[1000px] h-[1000px] opacity-[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.3]" />
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container-xl relative z-10"
        >
          <div className="max-w-5xl">
            <FadeUp delay={0.1}>
              <div className="flex items-center gap-4 mb-12">
                <span className="label text-[var(--red)] tracking-[0.4em]">Elite Architecture</span>
                <div className="h-px w-12 bg-[var(--red)]/30" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)]">EST. 2024</span>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2}>
              <h1 className="display-2xl text-[var(--charcoal)] mb-12 tracking-[-0.07em]">
                {t.hero.title_v2.split(language === "fr" ? "Informatique" : "IT")[0]}
                <span className="text-[var(--red)] italic relative inline-block">
                  {language === "fr" ? "Informatique" : "IT"}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -bottom-2 left-0 h-2 bg-[var(--red)]/10 rounded-full"
                  />
                </span>
                <br />
                {t.hero.title_v2.split(language === "fr" ? "Informatique" : "IT")[1]}
              </h1>
            </FadeUp>

            <div className="grid lg:grid-cols-12 gap-16 items-end">
              <div className="lg:col-span-7">
                <FadeUp delay={0.3}>
                  <p className="text-body-lg mb-16 text-[var(--slate)] max-w-xl leading-snug">
                    {t.hero.desc}
                  </p>
                </FadeUp>

                <div className="flex flex-wrap gap-8 items-center">
                  <FadeUp delay={0.4}>
                    <Link href="/booking">
                      <MagneticButton>
                        <span className="btn-premium btn-premium-red text-base px-12 py-6">
                          {t.hero.btn_audit_main}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </span>
                      </MagneticButton>
                    </Link>
                  </FadeUp>

                  <FadeUp delay={0.5}>
                    <Link href="/services" className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--charcoal)]">
                      <span className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--charcoal)] group-hover:text-white transition-all duration-500">
                        <Activity className="w-5 h-5" />
                      </span>
                      {t.hero.btn_discover}
                    </Link>
                  </FadeUp>
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <FadeIn delay={0.6}>
                  <div className="p-10 rounded-[3rem] border border-[var(--border)] bg-white/50 backdrop-blur-xl shadow-spatial-lg relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8">
                        <Target className="w-12 h-12 text-[var(--red)] opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                     </div>
                     <p className="label mb-6">{language === 'fr' ? 'Performance Réseau' : 'Network Performance'}</p>
                     <div className="text-6xl font-black italic tracking-tighter mb-4 text-[var(--charcoal)]">99.9%</div>
                     <p className="text-xs font-bold text-[var(--slate)] uppercase tracking-widest">{language === 'fr' ? 'Disponibilité Garantie' : 'Guaranteed Uptime'}</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── BENTO SERVICES (Refactored) ───────────────── */}
      <section className="section-py relative">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
            <FadeUp>
              <span className="label text-[var(--red)] block mb-6">{t.services.tag}</span>
              <h2 className="display-xl tracking-tight leading-none text-[var(--charcoal)]">{t.services.title}</h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-body max-w-md text-[var(--slate)] border-l-2 border-[var(--red)] pl-8">
                {language === 'fr' ? 'Une infrastructure robuste est le socle de votre croissance digitale.' : 'A robust infrastructure is the foundation of your digital growth.'}
              </p>
            </FadeUp>
          </div>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {SERVICES.map((srv, i) => (
              <StaggerItem key={srv.id} className={srv.span}>
                <Link href="/services" className="group block h-full">
                  <div className="h-full rounded-[3rem] border border-[var(--border)] bg-white p-10 md:p-14 transition-all duration-700 hover:shadow-spatial-xl hover:border-[var(--red)]/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                       <div className="w-16 h-16 rounded-2xl bg-[var(--off-white)] flex items-center justify-center mb-12 group-hover:bg-[var(--red)] group-hover:text-white transition-all duration-700">
                          <srv.icon className="w-8 h-8" />
                       </div>
                       <h3 className="display-sm mb-6 text-[var(--charcoal)] group-hover:text-[var(--red)] transition-colors duration-500">{srv.title}</h3>
                       <p className="text-body max-w-md">{srv.desc}</p>
                    </div>

                    <div className="mt-20 flex items-center justify-between relative z-10">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] group-hover:text-[var(--charcoal)] transition-colors">{t.services.explore}</span>
                       <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--red)] group-hover:bg-[var(--red)] group-hover:text-white transition-all duration-700">
                          <ArrowRight className="w-5 h-5" />
                       </div>
                    </div>

                    {/* Background Aura */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--red)]/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── WHY E-JARNAULD (Spatial Depth) ────────────────────────── */}
      <section className="section-py bg-[var(--charcoal)] text-white relative overflow-hidden">
        <AuraGradient color="var(--red)" className="bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] opacity-[0.1]" />

        <div className="container-xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <SlideLeft>
              <span className="label text-[var(--red)] mb-8 block">Carington Expertise</span>
              <h2 className="display-xl mb-12 tracking-tighter">
                {language === 'fr' ? 'La cybersécurité à un niveau' : 'Cybersecurity at a'} <span className="italic opacity-40">supérieur.</span>
              </h2>
              
              <div className="space-y-12">
                {[
                  { icon: ShieldCheck, title: t.why.items.certs, desc: t.why.items.certs_desc },
                  { icon: Zap, title: t.why.items.speed, desc: t.why.items.speed_desc },
                  { icon: Cpu, title: t.why.items.sov, desc: t.why.items.sov_desc },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--red)] transition-all duration-500">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-3 tracking-tight">{item.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SlideLeft>

            <SlideRight className="relative">
               <div className="aspect-square rounded-[4rem] bg-white p-16 flex flex-col justify-center items-center text-center shadow-spatial-xl relative group">
                  <div className="w-24 h-24 rounded-3xl bg-[var(--charcoal)] text-white flex items-center justify-center mb-12 shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="display-sm text-[var(--charcoal)] mb-6">{t.why.support_title}</h3>
                  <p className="text-body text-[var(--slate)] mb-12">{t.why.support_desc}</p>

                  <Link href="/contact">
                    <MagneticButton>
                      <span className="btn-premium btn-premium-red">
                        Contact Support
                      </span>
                    </MagneticButton>
                  </Link>
               </div>
            </SlideRight>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────── */}
      <TestimonialsSection language={language} />

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="section-py">
        <div className="container-xl">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <FadeUp>
              <span className="label text-[var(--red)] mb-8 block">{t.faq.tag}</span>
              <h2 className="display-lg tracking-tight mb-8 text-[var(--charcoal)]">{t.faq.title}</h2>
              <p className="text-body-lg text-[var(--slate)]">{t.faq.desc}</p>
            </FadeUp>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: language === "fr" ? "Quels sont vos délais d'intervention à Douala ?" : "What are your intervention times in Douala?",
                a: language === "fr"
                  ? "Pour nos clients sous contrat d'infogérance, nous garantissons une intervention sur site en moins de 2 heures pour les urgences critiques."
                  : "For our managed services clients, we guarantee on-site intervention in less than 2 hours for critical emergencies."
              },
              {
                q: language === "fr" ? "Comment garantissez-vous la sécurité ?" : "How do you guarantee security?",
                a: language === "fr"
                  ? "Nous appliquons les protocoles ISO 27001. Chaque infrastructure est protégée par des firewalls de nouvelle génération."
                  : "We apply ISO 27001 protocols. Every infrastructure is protected by next-generation firewalls."
              },
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────── */}
      <section className="section-py relative overflow-hidden">
        <AuraGradient color="var(--red)" className="top-[-50%] right-[-10%] w-[1200px] h-[1200px] opacity-[0.05]" />
        <div className="container-xl relative z-10 text-center">
          <FadeUp>
            <div className="max-w-4xl mx-auto">
              <span className="label text-[var(--red)] mb-12 block">{t.cta.tag}</span>
              <h2 className="display-2xl tracking-tighter mb-16 text-[var(--charcoal)]">{t.cta.title}</h2>

              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <Link href="/booking">
                  <MagneticButton>
                    <span className="btn-premium btn-premium-red text-lg px-16 py-8">
                      {t.nav.cta}
                    </span>
                  </MagneticButton>
                </Link>
                <Link href="/contact">
                  <MagneticButton>
                    <span className="btn-premium btn-premium-outline text-lg px-16 py-8">
                      {t.cta.btn_contact}
                    </span>
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-[var(--border)] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-10 flex items-center justify-between text-left group"
      >
        <span className="text-xl font-black text-[var(--charcoal)] group-hover:text-[var(--red)] transition-colors tracking-tight">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[var(--red)] text-white shadow-red' : 'bg-white border border-[var(--border)] text-[var(--slate)]'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="pb-10 text-body leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
