"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { t, language } = useI18n();

  return (
    <div className="min-h-screen pt-32 pb-40 bg-[var(--off-white)] relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[800px] h-[800px] opacity-[0.03]" />
      <AuraGradient color="var(--charcoal)" className="bottom-[-20%] left-[-10%] w-[600px] h-[600px] opacity-[0.02]" />

      <div className="container-xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <FadeUp>
            <div className="flex items-center gap-4 mb-4">
              <span className="tag-red py-1 px-4 backdrop-blur-md bg-white/40 border-white/60 shadow-sm uppercase text-[10px] tracking-widest">
                Operations Node
              </span>
              <div className="h-px w-12 bg-slate-200" />
            </div>
            <h1 className="display-md text-[var(--charcoal)] tracking-tighter mb-2">
              {t.dashboard.title}
            </h1>
            <p className="text-body-sm text-[var(--slate)] font-medium">
              {t.dashboard.welcome} <span className="text-[var(--red)] font-black uppercase tracking-widest text-[11px]">Acme Corp Ops</span>
            </p>
          </FadeUp>
          
          <FadeIn delay={0.3}>
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl border-2 border-emerald-100 px-6 py-3 rounded-[1.5rem] shadow-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] text-emerald-700 font-black uppercase tracking-[0.2em]">
                {t.dashboard.secure}
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Top Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="card bg-white p-10 border-2 border-transparent hover:border-slate-100 transition-all shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-500">
                <Server className="w-20 h-20 text-[var(--charcoal)]" />
              </div>
              <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-4">{t.dashboard.stats.nodes}</p>
              <p className="text-4xl font-black text-[var(--charcoal)] tracking-tighter mb-4 italic font-serif serif-italic">24<span className="text-slate-300 text-2xl not-italic">/24</span></p>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> {t.dashboard.stats.uptime}
              </div>
            </motion.div>
          </StaggerItem>
          
          <StaggerItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="card bg-white p-10 border-2 border-transparent hover:border-slate-100 transition-all shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] group-hover:rotate-12 transition-all duration-700">
                <ShieldAlert className="w-20 h-20 text-[var(--charcoal)]" />
              </div>
              <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-4">{t.dashboard.stats.zero_breach}</p>
              <p className="text-4xl font-black text-[var(--charcoal)] tracking-tighter mb-4 italic font-serif serif-italic">0</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> 1,402 {t.dashboard.stats.threats}
              </div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div 
              whileHover={{ y: -5 }}
              className="card bg-white p-10 border-2 border-transparent hover:border-slate-100 transition-all shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-500">
                <Cpu className="w-20 h-20 text-[var(--charcoal)]" />
              </div>
              <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-4">{t.dashboard.stats.maintenance}</p>
              <p className="text-4xl font-black text-[var(--charcoal)] tracking-tighter mb-4 italic font-serif serif-italic">14 <span className="text-slate-300 text-2xl not-italic">{language === 'fr' ? 'Jours' : 'Days'}</span></p>
              <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                <Clock className="w-4 h-4" /> {t.dashboard.stats.scheduled}
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Active Requests */}
          <div className="lg:col-span-2 space-y-8">
            <FadeUp>
              <div className="flex items-center justify-between border-b pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight uppercase">{t.dashboard.sections.requests}</h2>
                  <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em] mt-1">Pending Validation Cycle</p>
                </div>
                <Link href="/admin">
                  <button className="text-[10px] font-black text-[var(--red)] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                    {t.dashboard.sections.archive}
                  </button>
                </Link>
              </div>
            </FadeUp>
            
            <StaggerContainer className="space-y-4">
              {[
                { 
                  title: language ==='fr' ? "Test de Restauration Serveur B" : "Server Rack B Restoration Test",
                  status: language ==='fr' ? "EN COURS" : "IN PROGRESS",
                  id: "EJ-4091",
                  time: "2h ago",
                  desc: language ==='fr' ? "Validation trimestrielle de récupération." : "Quarterly recovery validation."
                },
                { 
                  title: language ==='fr' ? "Provisionnement 3 Postes IT" : "Provision 3 Workstation Nodes",
                  status: language ==='fr' ? "ATTENTE MATÉRIEL" : "PENDING HARDWARE",
                  id: "EJ-4088",
                  time: "1d ago",
                  desc: language ==='fr' ? "Installation ingénierie Lenovo ThinkPads." : "Engineering hire laptop provisioning."
                }
              ].map((ticket, i) => (
                <StaggerItem key={ticket.id}>
                  <motion.div
                    whileHover={{ x: 10, borderColor: "var(--red)" }}
                    className="bg-white border-2 border-slate-50 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm group transition-all"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <span className="font-black text-[var(--charcoal)] tracking-tight text-lg">{ticket.title}</span>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                          ticket.status.includes("PROGRESS") || ticket.status.includes("COURS") 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--slate)] font-medium">{ticket.desc}</p>
                    </div>
                    <div className="text-left md:text-right shrink-0 bg-[var(--off-white)] p-4 rounded-2xl border-2 border-transparent group-hover:border-[var(--red)]/10 transition-all">
                      <p className="text-[10px] font-black text-[var(--charcoal)] tracking-widest uppercase mb-1">Ticket #{ticket.id}</p>
                      <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-tighter italic">{ticket.time}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* System Alerts */}
          <div className="space-y-8">
            <FadeUp>
              <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight uppercase pb-6 border-b">{t.dashboard.sections.alerts}</h2>
            </FadeUp>
            
            <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-10 space-y-8 shadow-sm h-full flex flex-col relative overflow-hidden">
               <AuraGradient color="var(--red)" className="top-[-20%] right-[-20%] w-64 h-64 opacity-[0.02]" />
               
               <StaggerContainer className="space-y-6 flex-1">
                 <StaggerItem>
                   <div className="flex items-start gap-6 group">
                     <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                       <AlertTriangle className="w-5 h-5 text-amber-500" />
                     </div>
                     <div>
                       <h4 className="text-xs font-black text-[var(--charcoal)] uppercase tracking-wider mb-2">Bandwidth Spike</h4>
                       <p className="text-[11px] text-[var(--slate)] leading-relaxed font-medium">Node-04 outbound throttled pending manual review.</p>
                       <p className="text-[9px] font-black text-[var(--muted)] uppercase mt-3 tracking-widest">14:32 Today</p>
                     </div>
                   </div>
                 </StaggerItem>

                 <div className="h-px w-full bg-slate-50" />

                 <StaggerItem>
                   <div className="flex items-start gap-6 group">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                       <ShieldAlert className="w-5 h-5 text-emerald-500" />
                     </div>
                     <div>
                       <h4 className="text-xs font-black text-[var(--charcoal)] uppercase tracking-wider mb-2">Patch Applied</h4>
                       <p className="text-[11px] text-[var(--slate)] leading-relaxed font-medium">CVE-2026-X automated hotfix successful. Zero downtime.</p>
                       <p className="text-[9px] font-black text-[var(--muted)] uppercase mt-3 tracking-widest">02:00 Yesterday</p>
                     </div>
                   </div>
                 </StaggerItem>
               </StaggerContainer>
               
               <Link href="/admin" className="block w-full mt-8">
                <button className="w-full py-5 border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-[var(--red)] hover:text-white hover:border-[var(--red)] transition-all flex items-center justify-center gap-3 group">
                  {t.dashboard.sections.logs} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
               </Link>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
