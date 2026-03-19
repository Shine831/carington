"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight, LogOut, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getBookings, deleteBooking } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";

const STATUS_MAP = {
  fr: {
    PENDING:   { label: "En attente", cls: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    ACTIVE:    { label: "En cours",   cls: "bg-blue-50 text-blue-800 border-blue-200" },
    COMPLETED: { label: "Terminé",    cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    REJECTED:  { label: "Rejeté",     cls: "bg-red-50 text-red-800 border-red-200" },
  },
  en: {
    PENDING:   { label: "Pending", cls: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    ACTIVE:    { label: "Active",   cls: "bg-blue-50 text-blue-800 border-blue-200" },
    COMPLETED: { label: "Completed",    cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    REJECTED:  { label: "Rejected",     cls: "bg-red-50 text-red-800 border-red-200" },
  }
};

export default function DashboardPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Client";

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account");
    }
  }, [user, authLoading, router]);

  const fetchUserBookings = () => {
    if (user) {
      setLoading(true);
      getBookings(user.uid)
        .then((data: any) => setBookings(data))
        .catch((err: any) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const handleDeleteRequest = async (id: string) => {
    if (confirm(language === "fr" ? "Annuler cette demande ?" : "Cancel this request?")) {
      await deleteBooking(id);
      fetchUserBookings();
    }
  };

  // Loading Screen
  if (authLoading || !user) {
    return (
      <div className="min-h-[100svh] bg-[var(--off-white)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-[100svh] pt-32 pb-40 bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <AuraGradient color="var(--red)" className="top-0 right-0 w-[600px] h-[600px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      <div className="container-xl relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-white/10 pb-10">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-8 bg-[var(--red)] rounded-full shadow-[0_0_15px_rgba(238,28,37,0.5)]" />
              <span className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.25em]">
                {t.dashboard.title}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
              Bonjour, <span className="text-[var(--red)]">{firstName}.</span>
            </h1>
            <p className="text-sm font-medium text-white/40 max-w-lg leading-relaxed">
              Ravi de vous revoir. Suivez l'avancement de vos projets et bénéficiez de notre expertise technique en temps réel.
            </p>
          </FadeUp>
          
          <FadeIn delay={0.3}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-5 rounded-[2rem] shadow-2xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">
                    {t.dashboard.secure}
                  </span>
                  <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Connecté en AES-256</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Requests Section */}
        <FadeUp delay={0.2} className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--red)]/10 flex items-center justify-center border border-[var(--red)]/20 shadow-lg shadow-red-950/20"><FileText className="w-5 h-5 text-[var(--red)]" /></div>
              {language === "fr" ? "Mes Demandes & Devis" : "My Requests & Quotes"}
            </h2>
            <Link href="/booking" className="btn btn-red px-6 py-3 text-[10px] uppercase font-black tracking-widest shadow-[var(--shadow-red)] active:scale-95 transition-transform">
              {language === "fr" ? "Nouveau Devis" : "New Quote"}
            </Link>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-6">
            {loading ? (
              <div className="py-20 flex justify-center"><div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" /></div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 uppercase font-black text-[10px] tracking-widest text-white/30">{language === "fr" ? "Aucune demande en cours." : "No active requests."}</div>
            ) : bookings.map((req) => {
              const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
              const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
              const accentColor = req.status === "PENDING" ? "bg-yellow-500" : req.status === "ACTIVE" ? "bg-blue-500" : req.status === "COMPLETED" ? "bg-emerald-500" : "bg-red-500";
              
              return (
                <div key={req.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-2xl p-6 shadow-2xl">
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor}`} />
                  
                  <div className="space-y-4 pl-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Dossier #{req.id.slice(0, 8).toUpperCase()}</span>
                         <h3 className="text-white font-black text-xl tracking-tight leading-tight uppercase">{req.serviceId}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${mapObj.cls} bg-transparent`}>{mapObj.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Date</p>
                        <p className="text-xs font-bold text-white tracking-widest">{date}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Budget</p>
                        <p className="text-xs font-black text-emerald-400 italic">Devis Client</p>
                      </div>
                    </div>

                    {req.adminNote && (
                      <div className="p-4 bg-[var(--red)]/5 border border-[var(--red)]/10 rounded-2xl italic text-[11px] text-white/70 leading-relaxed">
                        <span className="text-[9px] font-black uppercase text-[var(--red)] block mb-1 not-italic">Note Admin</span>
                        "{req.adminNote}"
                      </div>
                    )}

                    {req.status === "PENDING" && (
                      <button 
                        onClick={() => handleDeleteRequest(req.id)}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[var(--shadow-red)] active:scale-95 transition-all mt-4"
                      >
                        <AlertTriangle className="w-4 h-4" /> Annuler Demande
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative group/table hidden md:block">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    {["Dossier ID", "Date", "Service", "Statut", "Note Admin", "Action"].map(h => (
                      <th key={h} className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {loading ? (
                       <tr><td colSpan={6} className="text-center py-20"><div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin mx-auto shadow-[0_0_20px_rgba(238,28,37,0.3)]" /></td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-24 text-white/30 font-black uppercase tracking-[0.2em] text-xs leading-relaxed">{language === "fr" ? "Aucune demande en cours." : "No active requests."}</td></tr>
                    ) : bookings.map((req, i) => {
                      const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                      const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
                      return (
                        <motion.tr key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="hover:bg-white/5 transition-all group">
                          <td className="py-6 px-8 font-mono font-black text-[10px] text-[var(--red)] tracking-widest">#{req.id.slice(0, 8).toUpperCase()}</td>
                          <td className="py-6 px-8 font-black text-white/40 text-[11px] tracking-widest">{date}</td>
                          <td className="py-6 px-8 font-black text-white text-sm tracking-tight uppercase">{req.serviceId}</td>
                          <td className="py-6 px-8">
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${mapObj.cls} bg-transparent`}>
                              {mapObj.label}
                            </span>
                          </td>
                          <td className="py-6 px-8 font-bold text-white/60 text-xs italic leading-relaxed max-w-xs truncate">
                            {req.adminNote || "-"}
                          </td>
                          <td className="py-6 px-8">
                            {req.status === "PENDING" && (
                              <button onClick={() => handleDeleteRequest(req.id)} className="text-[9px] font-black uppercase text-red-500 hover:text-white hover:bg-red-500 tracking-widest border border-red-500/30 px-4 py-2 rounded-xl transition-all">
                                {language === "fr" ? "Annuler" : "Cancel"}
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>
             {/* Support Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          <StaggerItem>
            <div className="relative overflow-hidden p-10 border border-white/10 rounded-[2.5rem] bg-[#0D0D0D] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start flex-col sm:flex-row gap-8 group transition-all duration-500 hover:border-[var(--red)]/40 hover:shadow-[0_0_30px_rgba(238,28,37,0.1)]">
              <AuraGradient color="var(--red)" className="top-[-20%] left-[-10%] w-64 h-64 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-center justify-center shrink-0 group-hover:bg-[var(--red)] transition-all duration-500 shadow-lg shadow-red-950/20">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none">Support <span className="text-[var(--red)]">Prioritaire.</span></h3>
                  <span className="px-2 py-0.5 rounded-lg bg-[var(--red)]/10 text-[var(--red)] text-[8px] font-black uppercase tracking-widest border border-[var(--red)]/20 shadow-[0_0_10px_rgba(238,28,37,0.1)]">Active SLA</span>
                </div>
                <p className="text-sm text-white/40 font-medium leading-relaxed mb-6">Expertise critique à votre service. Intervention garantie en moins de 120min pour tous vos actifs numériques.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-y border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Canaux Actifs</span>
                      <div className="flex gap-2 mt-1">
                        {["WhatsApp", "Email", "Ticket"].map(c => <span key={c} className="text-[8px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">{c}</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Agent Dédié</span>
                      <span className="text-[10px] font-bold text-[var(--red)] tracking-tight uppercase">Support Premium</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <div className="flex flex-col"><span className="text-[8px] font-black text-white/40 uppercase">Dispo 24/7/365</span><span className="text-[10px] font-bold text-white tracking-widest">OPÉRATIONNEL</span></div>
                    </div>
                    <div className="flex flex-col"><span className="text-[8px] font-black text-white/40 uppercase">Latence Ticketing</span><span className="text-[10px] font-bold text-white tracking-widest">87ms AVG</span></div>
                  </div>
                </div>

                <Link href="/contact" className="relative z-10 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 hover:border-[var(--red)]/30 uppercase tracking-[0.2em] transition-all active:scale-95 shadow-inner group/btn">
                  Ouvrir un ticket <ArrowRight className="w-4 h-4 text-[var(--red)] group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
             <div className="relative overflow-hidden p-10 border border-white/5 rounded-[2.5rem] bg-[#050505] shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex items-start flex-col sm:flex-row gap-8 group ring-1 ring-white/10 hover:ring-[var(--red)]/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)] transition-all duration-500">
               <AuraGradient color="emerald" className="bottom-[-20%] right-[-10%] w-64 h-64 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity" />
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 group-hover:bg-[var(--red)] shadow-inner">
                 <Cpu className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors" />
               </div>
               <div className="relative z-10 flex-1">
                 <div className="flex items-center gap-3 mb-3">
                   <h3 className="text-2xl font-black text-white tracking-tight">Cloud & <span className="text-emerald-400">Infra.</span></h3>
                   <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Live Monitor</span>
                 </div>
                 <p className="text-sm text-white/70 font-medium leading-relaxed mb-6">Supervision proactive et maintenance automatisée. Maîtrisez la croissance de votre infrastructure.</p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex items-center justify-between py-3 border-y border-white/5">
                     <div className="flex flex-col">
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Localisations Nodes</span>
                       <div className="flex gap-2 mt-1">
                          {["Douala-C1", "Paris-V1"].map(l => <span key={l} className="text-[8px] font-black text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{l}</span>)}
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Backups Actifs</span>
                       <span className="text-[10px] font-bold text-white uppercase tabular-nums tracking-widest">14 / 30 Jours</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-8 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                        <div className="flex flex-col"><span className="text-[8px] font-black text-white/40 uppercase">Global Uptime</span><span className="text-[10px] font-bold text-white tracking-widest">99.99%</span></div>
                      </div>
                      <div className="flex flex-col"><span className="text-[8px] font-black text-white/40 uppercase">Resource Load</span><span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Excellent</span></div>
                   </div>
                 </div>

                 <Link href="/services" className="relative z-10 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 hover:border-emerald-500/30 uppercase tracking-[0.2em] transition-all active:scale-95 group/btn2">
                   Explorer le catalogue <ArrowRight className="w-4 h-4 text-emerald-400 group-hover/btn2:translate-x-1 transition-transform" />
                 </Link>
               </div>
             </div>
          </StaggerItem>
        </StaggerContainer>

      </div>
    </div>
  );
}
