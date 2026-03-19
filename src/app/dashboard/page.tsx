"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getBookings } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";

export default function DashboardPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState<any[]>([]);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account");
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  // Fetch Firestore data once user is authenticated
  useEffect(() => {
    if (user) {
      getBookings(user.uid)
        .then((data) => setBookings(data))
        .catch((err) => console.error("Firestore Error:", err));
    }
  }, [user]);

  // Loading Screen to prevent flickering
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--off-white)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-40 bg-[var(--off-white)] relative overflow-hidden">
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
            <p className="text-sm font-medium text-[var(--slate)]">
              Gérez vos services et suivez nos interventions en temps réel.
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
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md hover:border-red-200 hover:bg-red-50 hover:text-[var(--red)] transition-all text-[10px] font-black uppercase tracking-widest text-[var(--slate)]"
              >
                <LogOut className="w-4 h-4" />
                {language === "fr" ? "Déconnexion" : "Logout"}
              </motion.button>
            </div>
          </FadeIn>
        </div>

        {/* Client Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Services (Bento Left) */}
          <StaggerContainer className="lg:col-span-8 space-y-6">
            <StaggerItem>
              <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-[var(--shadow-glass)]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[var(--charcoal)] tracking-tight">Mes Services Actifs</h2>
                  <Link href="/services">
                    <button className="flex items-center gap-2 text-[10px] font-black text-[var(--red)] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                      Nouveau Service <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").length > 0 ? (
                    bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white border text-left p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[var(--red)]/30 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-[var(--off-white)] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-50 transition-colors">
                            <Activity className="w-5 h-5 text-[var(--red)]" />
                          </div>
                          <div>
                            <h3 className="font-black text-[var(--charcoal)] text-sm tracking-tight mb-1">{ticket.service.title}</h3>
                            <p className="text-xs text-[var(--slate)] font-medium">Contrat #{ticket.id.split('-')[0]}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${
                          ticket.status === "CONFIRMED" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {ticket.status === "CONFIRMED" ? "ACTIF" : "EN ATTENTE"}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-[var(--off-white)] rounded-2xl border border-dashed border-slate-200">
                      <Server className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-[var(--muted)]">Aucun service en cours.</p>
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Intervention History (Bento Right) */}
          <StaggerContainer className="lg:col-span-4 space-y-6">
            <StaggerItem>
              <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-[var(--shadow-glass)] h-full">
                <h2 className="text-xl font-black text-[var(--charcoal)] tracking-tight mb-8">Historique des Interventions</h2>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                  {bookings.filter(b => b.status === "COMPLETED").length > 0 ? (
                    bookings.filter(b => b.status === "COMPLETED").map((ticket, i) => (
                      <div key={ticket.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-slate-100 group-[.is-active]:bg-[var(--red)] shadow shrink-0 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-slate-100 bg-white group-[.is-active]:border-[var(--red)]/20 shadow-sm transition-all text-xs">
                          <div className="font-black text-[var(--charcoal)] mb-1">{ticket.service.title}</div>
                          <div className="text-[10px] font-medium text-[var(--slate)]">Intervention finalisée le {new Date(ticket.date || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-medium text-[var(--muted)] ml-10">Aucune intervention passée.</p>
                  )}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </div>
    </div>
  );
}
