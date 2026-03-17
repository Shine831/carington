"use client";

import { Search, Server, ShieldAlert, Video, Code, PhoneCall, GraduationCap, PenTool, Network, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, SlideLeft } from "@/components/ui/Motion";

const SERVICES = [
  { id: "gestion-it", tag: "B2B / B2C", icon: Server, title: "Gestion IT & Infogérance", desc: "Maintenance préventive, helpdesk, mises à jour critiques et licences logicielles." },
  { id: "cybersecurite", tag: "B2B", icon: ShieldAlert, title: "Audit & Cybersécurité", desc: "Tests d'intrusion (Pen-Testing), sécurisation cloud/hybride et analyse des vulnérabilités." },
  { id: "reseau", tag: "B2B / B2C", icon: Network, title: "Réseau & Câblage Structuré", desc: "Câblage Cat6A, firewalls, Wi-Fi entreprise et VPN sécurisé." },
  { id: "video", tag: "B2B / B2C", icon: Video, title: "Vidéosurveillance IP", desc: "Caméras HD, sauvegarde cloud immuable et surveillance mobile en temps réel." },
  { id: "voip", tag: "B2B", icon: PhoneCall, title: "Téléphonie VoIP", desc: "Standards IP, files d'attente, enregistrements et intégration CRM." },
  { id: "dev", tag: "B2B / B2C", icon: Code, title: "Développement Web & Logiciel", desc: "Plateformes sur-mesure (Next.js, React), outils métiers et ERP adaptés aux PME." },
  { id: "formation", tag: "B2B / B2C", icon: GraduationCap, title: "Formation IT Sur-Mesure", desc: "Cybersécurité pour collaborateurs, formation technique des recrues IT." },
  { id: "maintenance", tag: "B2B / B2C", icon: PenTool, title: "Maintenance Curative Urgente", desc: "Intervention rapide sur serveurs RAID, routeurs, et postes défectueux." },
];

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const filtered = SERVICES.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tag.toLowerCase().includes(query.toLowerCase()) ||
    s.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-[68px] md:pt-[76px] bg-[var(--off-white)]">
      
      {/* Header */}
      <section className="bg-white border-b border-[var(--border)] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1 bg-[var(--red)]" />
        <div className="container-xl">
          <FadeUp>
            <span className="tag-red mb-5 inline-flex">8 Expertises Certifiées</span>
            <h1 className="display-xl text-[var(--charcoal)] mb-4 max-w-2xl">Catalogue des Services Techniques.</h1>
            <p className="text-body-lg max-w-xl mb-10">Solutions B2B et B2C qualifiées. Déployées par des ingénieurs certifiés depuis Douala.</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filtrer : Réseau, Urgence, PME..."
                className="form-input pl-12 py-4 text-base shadow-[var(--shadow-sm)]"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="section-py">
        <div className="container-xl">
          <SlideLeft>
            <div className="flex items-center justify-between mb-12">
              <p className="text-sm text-[var(--muted)] font-bold uppercase tracking-widest">
                <span className="text-[var(--red)] mr-2">//</span> {filtered.length} Solutions Disponibles
              </p>
              <div className="h-px flex-1 bg-[var(--border)] mx-8 hidden md:block" />
            </div>
          </SlideLeft>
          
          <AnimatePresence mode="popLayout">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {filtered.map((service, i) => {
                const isLarge = i === 0 || i === 1;
                const Icon = service.icon;
                
                return (
                  <StaggerItem 
                    key={service.id} 
                    className={`${isLarge ? "md:col-span-3 lg:col-span-3" : "md:col-span-3 lg:col-span-2"}`}
                  >
                    <motion.div layout className="h-full">
                      <Link href="/booking" className="block h-full">
                        <motion.div
                          whileHover={{ y: -8, boxShadow: "var(--shadow-lg)" }}
                          className="card h-full p-8 md:p-10 flex flex-col group relative overflow-hidden backdrop-blur-sm bg-white/60 border-white/40"
                        >
                          {/* Grainy background highlight on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--red)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center group-hover:bg-[var(--red)] group-hover:shadow-[var(--shadow-red)] transition-all duration-500 shrink-0">
                              <Icon className="w-6 h-6 text-[var(--red)] group-hover:text-white transition-colors duration-500" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-[var(--muted)] border border-[var(--border)] px-3 py-1 rounded-full uppercase">
                              {service.tag}
                            </span>
                          </div>
                          
                          <div className="relative z-10">
                            <h3 className={`${isLarge ? "text-2xl" : "text-xl"} font-black text-[var(--charcoal)] mb-4 tracking-tight`}>
                              {service.title}
                            </h3>
                            <p className="text-body text-sm leading-relaxed mb-8">
                              {service.desc}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-6 border-t border-[var(--border)] flex items-center justify-between relative z-10">
                            <span className="text-xs font-bold text-[var(--red)] group-hover:translate-x-1 transition-transform flex items-center gap-2">
                              DEMANDER DEVIS <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-mono text-[var(--muted)]">0{i+1}</span>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-[var(--muted)]"
            >
              <p className="text-xl mb-4">Aucun résultat pour "{query}".</p>
              <button onClick={() => setQuery("")} className="btn btn-outline">Tout afficher</button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
