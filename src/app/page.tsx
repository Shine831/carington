"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Search, ShieldCheck, Server, Network, ShieldAlert, ArrowRight, ChevronRight, Star, Zap } from "lucide-react";
import Link from "next/link";
import { FadeUp, SlideLeft, SlideRight, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { TiltCard } from "@/components/ui/InteractiveEffects";

const SERVICES = [
  { id: "cyber", tag: "Sécurité", icon: ShieldAlert, title: "Audit Cybersécurité", desc: "Tests de pénétration, analyse des vulnérabilités, et mise en conformité ISO 27001." },
  { id: "reseau", tag: "Infrastructure", icon: Network, title: "Réseau & Câblage", desc: "Déploiement complet : câblage structuré, firewalls, VPN et configuration cloud." },
  { id: "infog", tag: "Maintenance", icon: Server, title: "Infogérance IT", desc: "Gestion proactive de votre parc : serveurs, postes, mises à jour critiques 24/7." },
];

const STATS = [
  { value: "500+", label: "Entreprises Clients" },
  { value: "99.9%", label: "Uptime Garanti" },
  { value: "< 2h", label: "Délai d'Intervention" },
  { value: "10 ans", label: "D'Expertise Locale" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.2) { 
        let frame = 0;
        const total = 60;
        const timer = setInterval(() => {
          frame++;
          setCount(Math.round((frame / total) * target));
          if (frame >= total) clearInterval(timer);
        }, 16);
        unsub();
      }
    });
    return () => unsub();
  }, [target, scrollYProgress]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[var(--off-white)] overflow-hidden">

      {/* ── ELITE HERO ────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--red)] opacity-[0.08] blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[var(--red)] opacity-[0.05] blur-[100px] rounded-full"
          />
        </div>

        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#E8E8EA_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.2] pointer-events-none" />

        <div className="container-xl relative z-10 grid lg:grid-cols-2 gap-12 xl:gap-24 items-center py-20">
          
          <div className="max-w-2xl">
            <FadeUp delay={0.1}>
              <div className="flex items-center gap-3 mb-8">
                <span className="tag-red py-1.5 px-4 backdrop-blur-md bg-white/40 border-white/60">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--red)]"></span>
                  </span>
                  Innovation IT · Douala
                </span>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2}>
              <h1 className="display-2xl text-[var(--charcoal)] mb-8 tracking-tighter">
                Architecture de <br/>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="gradient-text italic font-serif serif-italic"
                >
                  Confiance.
                </motion.span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-body-lg mb-12 text-[var(--slate)] leading-relaxed max-w-lg">
                E-JARNALUD SOFT fusionne l'expertise technique et la vision stratégique pour bâtir les infrastructures numériques les plus résilientes du Cameroun.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex flex-wrap gap-5 items-center">
                <Link href="/booking">
                  <motion.span
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(200,16,46,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-red px-10 py-5 text-lg group"
                  >
                    Lancer un Audit
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.span>
                  </motion.span>
                </Link>
                
                <Link href="/services">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="btn btn-ghost px-6 py-5 text-lg font-bold flex items-center gap-2 group"
                  >
                    Explorer Expertises
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Link>
              </div>
            </FadeUp>

            <FadeIn delay={0.6} className="mt-16 pt-8 border-t border-[var(--border)] max-w-sm">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Client" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-[var(--slate)]">
                  Approuvé par <span className="text-[var(--charcoal)] font-bold">500+ décideurs</span> à Douala.
                </p>
              </div>
            </FadeIn>
          </div>

          <SlideRight delay={0.2} className="hidden lg:block relative">
            {/* Decorative background element */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--red)]/10 to-transparent blur-3xl opacity-50 rounded-full" />
            
            <TiltCard intensity={12} className="relative z-10">
              <div className="card backdrop-blur-xl bg-white/80 border-white/20 p-10 rounded-[2rem] shadow-[var(--shadow-xl)] overflow-hidden group">
                {/* Floating shine effect */}
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                
                <div className="flex items-center justify-between mb-10">
                  <div className="p-3 bg-[var(--red)] rounded-2xl shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="label mb-1">Protection Active</p>
                    <p className="text-xs font-black text-emerald-600 flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      EN TEMPS RÉEL
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { label: "Surveillance Serveurs", val: "Optimale" },
                    { label: "Backups Cloud", val: "Synchronisés" },
                    { label: "Firewall (Cisco)", val: "Périmètre Actif" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-[var(--charcoal)]">{item.label}</span>
                        <span className="text-xs font-medium text-[var(--slate)]">{item.val}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

                <div className="mt-12 p-5 bg-[var(--charcoal)] rounded-2xl flex items-center gap-4 text-white">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Rapport de Sécurité</p>
                    <p className="text-base font-bold">Zéro Incident Détecté</p>
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </div>
              </div>
            </TiltCard>
            
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--charcoal)]">ISO 27001</p>
                <p className="text-[10px] text-[var(--muted)]">Certified Security</p>
              </div>
            </motion.div>
          </SlideRight>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)]"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--red)] to-transparent" />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="bg-[var(--charcoal)] py-16 md:py-20">
        <StaggerContainer className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {STATS.map(({ value, label }) => (
              <StaggerItem key={label}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">{value}</p>
                  <p className="text-sm text-gray-500 font-medium">{label}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="section-py">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-14">
            <SlideLeft>
              <div>
                <span className="tag-red mb-4 inline-flex">Expertise</span>
                <h2 className="display-lg text-[var(--charcoal)]">Ce que nous maîtrisons.</h2>
              </div>
            </SlideLeft>
            <SlideRight>
              <div className="flex flex-col items-start lg:items-end gap-3">
                <p className="text-body max-w-sm lg:text-right">Des solutions pour entreprises et particuliers, déployées avec rigueur et réactivité.</p>
                <Link href="/services" className="btn btn-outline text-sm">
                  Voir les 8 expertises <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </SlideRight>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {SERVICES.map(({ id, tag, icon: Icon, title, desc }) => (
              <StaggerItem key={id}>
                <Link href="/booking" className="block h-full">
                  <motion.div
                    whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="card h-full p-8 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover red corner */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[3rem] border-b-[3rem] border-l-transparent border-b-[var(--red)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    
                    <div className="w-12 h-12 bg-[var(--red-light)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--red)] transition-colors duration-300">
                      <Icon className="w-5 h-5 text-[var(--red)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    
                    <span className="tag-gray mb-3">{tag}</span>
                    <h3 className="text-lg font-bold text-[var(--charcoal)] mb-3 mt-2">{title}</h3>
                    <p className="text-body-sm mb-6">{desc}</p>
                    
                    <span className="flex items-center gap-2 text-sm font-semibold text-[var(--red)] group-hover:gap-3 transition-all duration-200">
                      Demander un devis <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────────── */}
      <section className="section-py bg-white border-t border-b border-[var(--border)]">
        <div className="container-xl">
          <FadeUp className="text-center mb-14">
            <span className="tag-red mb-4 inline-flex">Pourquoi nous</span>
            <h2 className="display-lg text-[var(--charcoal)] max-w-xl mx-auto">Une expertise, une garantie.</h2>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "Certifications Leaders", desc: "Partenaire officiel des plus grands éditeurs de solutions de sécurité au Cameroun." },
              { icon: "⚡", title: "Réactivité Garantie", desc: "Nos équipes interviennent sous 2 heures. SLA contractuel sur chaque offre." },
              { icon: "🔒", title: "Données Localisées", desc: "Vos données d'infrastructure restent en territoire camerounais, selon votre choix." },
              { icon: "📊", title: "Reporting Transparent", desc: "Rapport mensuel de sécurité et d'activité fourni pour tous les contrats IT." },
              { icon: "🤝", title: "Engagement B2B/B2C", desc: "Des offres calibrées aussi bien pour les grandes entreprises que les particuliers." },
              { icon: "🌍", title: "Present à Douala", desc: "Équipes terrain disponibles pour toute intervention physique ou câblage sur site." },
            ].map(({ icon, title, desc }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card p-6 h-full"
                >
                  <span className="text-3xl mb-4 block">{icon}</span>
                  <h3 className="font-bold text-[var(--charcoal)] mb-2">{title}</h3>
                  <p className="text-body-sm">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA BAND ────────────────────────────────────────────── */}
      <section className="bg-[var(--red)] py-20 md:py-28 relative overflow-hidden">
        {/* Background blur */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white opacity-[0.06] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white opacity-[0.04] pointer-events-none" />

        <div className="container-xl relative z-10">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                Premier audit offert
              </span>
              <h2 className="display-lg text-white mb-6">
                Prêt à sécuriser votre avenir numérique ?
              </h2>
              <p className="text-red-100 text-lg mb-10">
                Nos ingénieurs répondent sous 2 heures. Audit IT gratuit et sans engagement pour tout premier client.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/booking">
                  <motion.span
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn bg-white text-[var(--red)] font-bold px-8 py-4 text-base rounded-xl hover:bg-red-50 transition-colors shadow-xl inline-flex items-center gap-2"
                  >
                    Démarrer maintenant <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <Link href="/contact">
                  <motion.span
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                    whileTap={{ scale: 0.97 }}
                    className="btn border-2 border-white/40 text-white font-semibold px-8 py-4 text-base rounded-xl inline-flex items-center gap-2"
                  >
                    Nous contacter
                  </motion.span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
