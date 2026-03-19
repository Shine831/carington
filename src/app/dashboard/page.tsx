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
    <div className="min-h-[100svh] pt-32 pb-40 bg-[var(--off-white)] relative overflow-hidden">
      {/* Background Ambience */}
      <AuraGradient color="var(--red)" className="top-0 right-0 w-[600px] h-[600px] opacity-[0.03]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container-xl relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-white/50 pb-8">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-8 bg-[var(--red)] rounded-full" />
              <span className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.2em]">
                {t.dashboard.title}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-[var(--charcoal)] tracking-tighter mb-2">
              Espace <span className="text-[var(--red)]">Client.</span>
            </h1>
            <p className="text-sm font-medium text-[var(--slate)] max-w-lg leading-relaxed">
              Gérez vos services, suivez l'avancement de vos demandes de devis et interventions techniques en temps réel.
            </p>
          </FadeUp>
          
          <FadeIn delay={0.3}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white px-6 py-4 rounded-2xl shadow-[var(--shadow-glass)]">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.2em]">
                    {t.dashboard.secure}
                  </span>
                  <span className="text-[9px] text-[var(--slate)] font-bold">AES-256 E2E</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Requests Table Section */}
        <FadeUp delay={0.2} className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight flex items-center gap-3">
              <FileText className="w-6 h-6 text-[var(--red)]" /> 
              {language === "fr" ? "Mes Demandes & Devis" : "My Requests & Quotes"}
            </h2>
            <Link href="/booking" className="btn btn-red px-6 py-3 text-[10px] uppercase font-black tracking-widest shadow-[var(--shadow-red)]">
              {language === "fr" ? "Nouveau Devis" : "New Quote"}
            </Link>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-[var(--shadow-xl)] border border-white">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-white/50 border-b border-slate-100">
                    {["Dossier ID", "Date", "Service", "Statut", "Note Admin", "Action"].map(h => (
                      <th key={h} className="py-5 px-6 md:px-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slate)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  <AnimatePresence>
                    {loading ? (
                       <tr><td colSpan={6} className="text-center py-16"><div className="w-8 h-8 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin mx-auto" /></td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-16 text-[var(--slate)] font-bold">{language === "fr" ? "Aucune demande en cours." : "No active requests."}</td></tr>
                    ) : bookings.map((req, i) => {
                      const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                      const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
                      return (
                        <motion.tr key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="hover:bg-white/40 transition-all group">
                          <td className="py-6 px-6 md:px-8 font-mono font-black text-[10px] text-[var(--red)]">#{req.id.slice(0, 8).toUpperCase()}</td>
                          <td className="py-6 px-6 md:px-8 font-bold text-[var(--slate)] text-xs">{date}</td>
                          <td className="py-6 px-6 md:px-8 font-bold text-[var(--charcoal)] tracking-tight">{req.serviceId.toUpperCase()}</td>
                          <td className="py-6 px-6 md:px-8">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ${mapObj.cls}`}>
                              {mapObj.label}
                            </span>
                          </td>
                          <td className="py-6 px-6 md:px-8 font-bold text-[var(--charcoal)] text-xs italic">
                            {req.adminNote || "-"}
                          </td>
                          <td className="py-6 px-6 md:px-8">
                            {req.status === "PENDING" && (
                              <button onClick={() => handleDeleteRequest(req.id)} className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest border border-red-200 px-3 py-1 rounded-lg">
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
        <StaggerContainer className="grid md:grid-cols-2 gap-6">
          <StaggerItem>
            <div className="card bg-white/60 p-10 border border-white rounded-[2.5rem] shadow-[var(--shadow-glass)] flex items-start gap-6 group hover:border-red-100 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-[var(--red)] transition-colors duration-500">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--charcoal)] mb-3 tracking-tight">Support Prioritaire</h3>
                <p className="text-sm text-[var(--slate)] font-medium leading-relaxed mb-6">Un problème urgent ? Notre équipe technique intervient en moins de 2H pour les contrats actifs.</p>
                <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black text-[var(--charcoal)] hover:text-[var(--red)] uppercase tracking-widest transition-colors">
                  Ouvrir un ticket <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
             <div className="card bg-[#0A0A0A] p-10 border border-[#222] rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-start flex-col sm:flex-row gap-6 group relative overflow-hidden">
               <AuraGradient color="var(--red)" className="bottom-[-20%] right-[-10%] w-64 h-64 opacity-[0.1]" />
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative z-10 transition-colors group-hover:bg-[var(--red)]">
                 <Cpu className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-3">
                   <h3 className="text-xl font-black text-white tracking-tight">Cloud & Infra</h3>
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 </div>
                 <p className="text-sm text-white/50 font-medium leading-relaxed mb-6">Tous vos services réseau et cloud fonctionnent de manière optimale sur notre infrastructure Tier-III.</p>
                 <Link href="/services" className="flex items-center gap-2 text-[10px] font-black text-[var(--red)] hover:text-white uppercase tracking-widest transition-colors">
                   Explorer le catalogue <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
             </div>
          </StaggerItem>
        </StaggerContainer>

      </div>
    </div>
  );
}
