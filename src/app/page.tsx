"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ShieldCheck, Server, Network, ShieldAlert, ArrowRight, ChevronRight, Star, Zap, PhoneCall } from "lucide-react";
import Link from "next/link";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { TiltCard, MagneticButton, BentoCard, SpatialLayer } from "@/components/ui/InteractiveEffects";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { TestimonialsSection } from "@/components/ui/Testimonials";

export default function Home() {
  const { t, language } = useI18n();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  // Scrollytelling & Kinetic Typography
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  const SERVICES = [
    { 
      id: "cyber", 
      tag: t.services.cyber.tag, 
      icon: ShieldAlert, 
      title: t.services_page.items.cyber.title, 
      desc: t.services_page.items.cyber.desc,
      span: "md:col-span-2 lg:col-span-2",
      highlight: true
    },
    { 
      id: "infog", 
      tag: t.services.it.tag, 
      icon: Server, 
      title: t.services_page.items.it.title, 
      desc: t.services_page.items.it.desc,
      span: "md:col-span-1 lg:col-span-1"
    },
    { 
      id: "voip", 
      tag: t.services.infra.tag, 
      icon: PhoneCall, 
      title: t.services_page.items.voip.title, 
      desc: t.services_page.items.voip.desc,
      span: "md:col-span-1 lg:col-span-1"
    },
    {
      id: "cable",
      tag: t.services.cloud.tag,
      icon: Network,
      title: t.services_page.items.network_cable.title,
      desc: t.services_page.items.network_cable.desc,
      span: "md:col-span-2 lg:col-span-1"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--off-white)] overflow-hidden">

      {/* ── ELITE HERO (Pure Tech Refactor) ───────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 md:pt-32 overflow-hidden">
        <ParticleBackground />
        
        {/* Aura Gradients (Image Replacement) */}
        <AuraGradient color="var(--red)" className="top-[-10%] right-[-5%] w-[600px] h-[600px] opacity-[0.12]" delay={0} />
        <AuraGradient color="var(--charcoal)" className="bottom-[10%] left-[5%] w-[500px] h-[500px] opacity-[0.05]" delay={2} />

        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#E8E8EA_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.2] pointer-events-none" />

        {/* Spatial Depth Layers */}
        <SpatialLayer speed={0.4} className="top-1/4 left-[10%] opacity-20">
          <div className="w-12 h-12 border border-[var(--red)]/20 blur-[1px] rotate-12" />
        </SpatialLayer>
        <SpatialLayer speed={-0.6} className="bottom-1/4 right-[5%] opacity-10">
          <div className="w-24 h-24 border-2 border-[var(--red)] rounded-full blur-[4px]" />
        </SpatialLayer>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container-xl relative z-10 grid lg:grid-cols-2 gap-12 xl:gap-24 items-center py-20"
        >
          
          <div className="max-w-2xl">
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="tag-red py-1.5 px-4 backdrop-blur-md bg-white/40 border-white/60 shadow-sm">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--red)]"></span>
                  </span>
                  E-JARNALUD SOFT
                </span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--charcoal)] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{t.hero.location}</span>
                </div>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2}>
              <motion.h1 
                style={{ scale: textScale }}
                className="display-2xl text-[var(--charcoal)] mb-8 tracking-tighter leading-[0.95]"
              >
                {t.hero.title_v2.split("Informatique")[0]}<br/>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-[var(--red)]"
                >
                  {language === "fr" ? "Informatique" : "IT"}
                </motion.span><br/>
                {t.hero.title_v2.split("Informatique")[1] || t.hero.title_v2.split("IT")[1]}
              </motion.h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-body-lg mb-12 text-[var(--slate)] leading-relaxed max-w-lg border-l-2 border-[var(--red)]/20 pl-6">
                {t.hero.desc}
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="w-full max-w-md bg-white border-2 border-slate-100 rounded-2xl p-2 mb-10 flex items-center shadow-sm relative group overflow-hidden focus-within:border-[var(--red)]/50 focus-within:shadow-[var(--shadow-red)] transition-all">
                <div className="pl-4 pr-2 text-[var(--muted)] group-focus-within:text-[var(--red)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder={t.hero.search_placeholder} 
                  className="w-full py-3 px-2 bg-transparent outline-none text-sm font-bold text-[var(--charcoal)] placeholder:text-slate-400 placeholder:font-medium"
                />
                <Link href="/services">
                  <button className="bg-[var(--charcoal)] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--red)] transition-colors shadow-md">
                    {t.hero.btn_discover}
                  </button>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="flex flex-wrap gap-5 items-center">
                <Link href="/booking">
                  <MagneticButton>
                    <motion.span
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-red px-10 py-5 text-lg group relative flex items-center shadow-[var(--shadow-red)]"
                    >
                      <div className="flex items-center">
                        {t.hero.btn_audit_main}
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </motion.span>
                      </div>
                    </motion.span>
                  </MagneticButton>
                </Link>
              </div>
            </FadeUp>


            <FadeIn delay={0.6} className="mt-16 pt-8 border-t border-[var(--border)] max-w-sm">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                      USER
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[var(--charcoal)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    500+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-[11px] font-bold text-[var(--slate)] uppercase tracking-wider">
                    {t.hero.stats}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          <SlideRight delay={0.2} className="hidden lg:block relative">
            <TiltCard intensity={12} className="relative z-10">
              <div className="card backdrop-blur-xl bg-white/80 border-white/20 p-10 rounded-[2.5rem] shadow-[var(--shadow-xl)] overflow-hidden group min-h-[500px] flex flex-col border-2">
                {/* Pure Tech Background (No images) */}
                <div className="absolute inset-0 z-0">
                  <AuraGradient color="var(--red)" className="top-[20%] left-[20%] w-full h-full opacity-[0.08]" delay={1} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-auto">
                    <div className="p-3 bg-[var(--red)] rounded-2xl shadow-lg">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="label mb-1 uppercase tracking-widest text-[10px]">Security Engine</p>
                      <p className="text-xs font-black text-emerald-600 flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE MONITORING
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8 mt-12">
                    {[
                      { label: "Infrastructure Integrity", val: "99.9%" },
                      { label: "Encryption Layers", val: "Quantum-Safe" },
                      { label: "Response Priority", val: "Elite" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black uppercase text-[var(--charcoal)] tracking-wider">{item.label}</span>
                          <span className="text-[10px] font-bold text-[var(--red)]">{item.val}</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-[var(--red)] to-[#FF5C78] rounded-full" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 bg-[var(--charcoal)] rounded-2xl flex items-center gap-4 text-white">
                    <div className="flex-1">
                      <p className="text-[8px] text-red-500 font-black uppercase tracking-[0.3em] mb-1">Status Report</p>
                      <p className="text-sm font-bold tracking-tight">Zero Threats Detected</p>
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 border border-dashed border-white/20 rounded-full flex items-center justify-center shrink-0"
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </SlideRight>
        </motion.div>
      </section>

      {/* ── SERVICES BENTO (Pure Tech Refactor) ───────────────── */}
      <section className="section-py relative">
        <div className="container-xl relative z-10">
          <FadeUp className="mb-16">
            <span className="tag-red mb-4 inline-flex tracking-widest">{t.services.tag}</span>
            <h2 className="display-lg text-[var(--charcoal)]">{t.services.title}</h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ id, tag, icon: Icon, title, desc, span, highlight }) => (
              <StaggerItem key={id} className={span}>
                <Link href="/booking" className="block h-full">
                  <BentoCard highlight={false} className="h-full group border-2">
                    {/* Floating Aura for Bento */}
                    <AuraGradient 
                      color={highlight ? "var(--red)" : "var(--slate)"} 
                      className={`bottom-[-20%] right-[-10%] w-40 h-40 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity`} 
                    />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 ${
                        highlight 
                          ? "bg-[var(--red)] border-[var(--red)] shadow-[0_10px_30px_rgba(200,16,46,0.2)]" 
                          : "bg-white/10 border-white/20 group-hover:bg-[var(--red)] group-hover:border-[var(--red)]"
                      }`}>
                        <Icon className={`w-6 h-6 ${highlight ? "text-white" : "text-[var(--charcoal)] group-hover:text-white"}`} />
                      </div>
                      
                      <span className={`inline-flex py-1 px-3 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 self-start ${
                        highlight ? "bg-white/20 border-white/20 text-white" : "bg-black/5 border-black/5 text-[var(--muted)]"
                      }`}>{tag}</span>
                      <h3 className="text-xl font-black mb-3 mt-2 leading-tight text-[var(--charcoal)]">{title}</h3>
                      <p className="text-sm mb-8 text-[var(--slate)] leading-relaxed">{desc}</p>
                      
                      <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[var(--red)] transition-colors">
                          {t.services.explore}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </BentoCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── WHY US (Pure Tech Refactor) ────────────────────────── */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <SlideLeft>
              <span className="tag-red mb-4 inline-flex">{language === "fr" ? "Pourquoi E-Jarnauld ?" : "Why E-Jarnauld?"}</span>
              <h2 className="display-lg text-[var(--charcoal)] mb-8">
                {t.why.title.split("d'excellence")[0]}{t.why.title.split("excellence")[0]} <span className="text-[var(--red)] italic font-serif">{language === "fr" ? "d'excellence" : "excellence"}</span>.
              </h2>
              <p className="text-body mb-10 text-[var(--slate)] leading-relaxed">
                {t.why.desc}
              </p>
              
              <div className="grid sm:grid-cols-1 gap-8">
                {[
                  { icon: ShieldCheck, title: t.why.items.certs, text: t.why.items.certs_desc },
                  { icon: Zap, title: t.why.items.speed, text: t.why.items.speed_desc },
                  { icon: Server, title: t.why.items.sov, text: t.why.items.sov_desc },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group items-start border-b border-slate-100 pb-6 last:border-0">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--off-white)] border border-transparent group-hover:border-[var(--red)]/20 group-hover:bg-red-50 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                      <item.icon className="w-6 h-6 text-[var(--red)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[var(--charcoal)] mb-2 uppercase tracking-wide group-hover:text-[var(--red)] transition-colors">{item.title}</h4>
                      <p className="text-xs text-[var(--slate)] font-medium leading-relaxed max-w-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SlideLeft>
            
            <SlideRight className="relative">
              <div className="relative aspect-square max-w-sm mx-auto">
                <AuraGradient color="var(--red)" className="inset-0 w-full h-full opacity-[0.1]" />
                <BentoCard highlight className="h-full flex flex-col justify-center items-center text-center p-12 border-2">
                  <div className="w-20 h-20 bg-[var(--charcoal)] rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[var(--charcoal)]">{t.why.support_title}</h3>
                  <p className="text-sm text-[var(--slate)] mb-8 leading-relaxed">{t.why.support_desc}</p>
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm">
                        EJS
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 text-[var(--red)]">{t.why.team}</p>
                </BentoCard>
              </div>
            </SlideRight>
          </div>
        </div>
      </section>


      {/* ── TESTIMONIALS (Premium 2026) ────────────────────────── */}
      <TestimonialsSection language={language} />

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="section-py bg-[var(--off-white)]">
        <div className="container-xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <SlideLeft className="lg:col-span-5">
              <span className="tag-red mb-4 inline-flex tracking-widest">{t.faq.tag}</span>
              <h2 className="display-lg text-[var(--charcoal)] mb-6">{t.faq.title}</h2>
              <p className="text-body mb-8 text-[var(--slate)] leading-relaxed">
                {t.faq.desc}
              </p>
              
              <div className="p-8 bg-white rounded-[2rem] border-2 border-[var(--border)] shadow-sm">
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-3">{t.faq.question_placeholder}</p>
                <Link href="/contact" className="text-sm font-black text-[var(--red)] flex items-center gap-2 group">
                  {t.faq.contact_eng} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </SlideLeft>

            <SlideRight className="lg:col-span-7">
              <div className="space-y-4">
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
            </SlideRight>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ────────────────────────────────────────────── */}
      <section className="bg-[var(--charcoal)] py-28 mt-32 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="top-[-50%] right-[-10%] w-[1000px] h-[1000px] opacity-[0.1]" />
        
        <div className="container-xl relative z-10">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/5 text-white/60 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                {t.cta.tag}
              </span>
              <h2 className="display-lg text-white mb-6">
                {t.cta.title}
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                {t.cta.desc}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/booking">
                  <MagneticButton>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="btn btn-red px-12 py-5 text-lg font-black"
                    >
                      {t.nav.cta}
                    </motion.span>
                  </MagneticButton>
                </Link>
                <Link href="/contact">
                  <MagneticButton>
                    <motion.span className="btn btn-outline-white px-12 py-5 text-lg font-black">
                      {t.cta.btn_contact}
                    </motion.span>
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
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="font-bold text-[var(--charcoal)] group-hover:text-[var(--red)] transition-colors">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--red)] text-white' : 'bg-slate-100 text-[var(--muted)]'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-[var(--slate)] leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
