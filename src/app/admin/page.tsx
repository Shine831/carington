"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Users, Briefcase, FileText, Settings, BarChart, Bell, Search, ChevronRight, AlertTriangle, Clock, CheckCircle, Shield, TrendingUp, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, SlideLeft } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getServices, getBookings, getUsers, getMessages, updateBookingStatus, updateMessageStatus, deleteBooking } from "@/lib/firebase/db";

const STATUS_MAP = {
  fr: {
    PENDING:   { label: "En attente", cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    ACTIVE:    { label: "En cours",   cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    COMPLETED: { label: "Terminé",    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    REJECTED:  { label: "Rejeté",     cls: "bg-red-500/10 text-red-500 border-red-500/20" },
    UNREAD:    { label: "Non lu",     cls: "bg-red-500/10 text-red-500 border-red-500/20" },
    READ:      { label: "Lu",         cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    REPLIED:   { label: "Répondu",    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }
  },
  en: {
    PENDING:   { label: "Pending", cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    ACTIVE:    { label: "Active",   cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    COMPLETED: { label: "Completed",    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    REJECTED:  { label: "Rejected",     cls: "bg-red-500/10 text-red-500 border-red-500/20" },
    UNREAD:    { label: "Unread",     cls: "bg-red-500/10 text-red-500 border-red-500/20" },
    READ:      { label: "Read",         cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    REPLIED:   { label: "Replied",    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }
  }
};

export default function AdminDashboard() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState({ requests: [] as any[], clients: [] as any[], services: [] as any[], messages: [] as any[] });
  const [loading, setLoading] = useState(true);

  // Route Protection: Keep out non-admins
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/account");
      else if (role !== "ADMIN") router.push("/dashboard");
    }
  }, [user, role, authLoading, router]);

  const fetchData = useCallback(async () => {
    if (role !== "ADMIN") return;
    setLoading(true);
    try {
      const [reqs, clis, srvs, msgs] = await Promise.all([
        getBookings(),
        getUsers(),
        getServices(),
        getMessages()
      ]);
      setData({ requests: reqs, clients: clis, services: srvs, messages: msgs });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateBooking = async (id: string, status: string) => {
    await updateBookingStatus(id, status);
    fetchData();
  };

  const handleUpdateMessage = async (id: string, status: any) => {
    await updateMessageStatus(id, status);
    fetchData();
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm(language === "fr" ? "Supprimer définitivement ?" : "Delete permanently?")) {
      await deleteBooking(id);
      fetchData();
    }
  };

  // Loading Screen
  if (authLoading || role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 mb-6">
          <Shield className="w-6 h-6 text-[var(--red)] animate-pulse" />
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-[var(--red)]" />
        </div>
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-6">Verifying Access...</p>
      </div>
    );
  }

  const pendingReqs = data.requests.filter(r => r.status === "PENDING").length;
  const unreadMsgs = data.messages.filter(m => m.status === "UNREAD").length;

  const NAV = [
    { id: "requests",  label: t.admin.nav.requests, icon: FileText, badge: pendingReqs > 0 ? pendingReqs : undefined },
    { id: "messages",  label: language === "fr" ? "Messages" : "Messages", icon: Mail, badge: unreadMsgs > 0 ? unreadMsgs : undefined },
    { id: "clients",   label: t.admin.nav.clients, icon: Users },
    { id: "services",  label: t.admin.nav.catalog, icon: Briefcase },
  ];

  const activeReqs = data.requests.filter(r => r.status === "ACTIVE").length;
  const solvedReqs = data.requests.filter(r => r.status === "COMPLETED").length;
  const vipClients = data.clients.filter(c => c.role === "VIP" || c.role === "CLIENT").length;

  const STATS = [
    { label: "Requêtes en attente", value: pendingReqs.toString(), icon: AlertTriangle, color: "text-[var(--red)]" },
    { label: "Interventions Actives", value: activeReqs.toString(), icon: Clock, color: "text-amber-500" },
    { label: "Dossiers Résolus", value: solvedReqs.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Total Utilisateurs", value: vipClients.toString(), icon: Users, color: "text-blue-500" },
  ];

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex pt-0 relative overflow-x-hidden text-slate-100 font-sans">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      {/* Sidebar - Dark Mode Surgical Design */}
      <motion.aside
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 xl:w-72 bg-[#050505] flex flex-col fixed top-0 bottom-0 left-0 z-40 hidden md:flex border-r border-white/10 shadow-[8px_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--red)] flex items-center justify-center shadow-[var(--shadow-red)] shadow-red-900/50">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t.admin.tag}</p>
              <p className="font-black text-white text-sm tracking-tight text-emerald-400">ACTIVE SESSION</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === id 
                  ? "bg-white/10 text-white shadow-xl border border-white/10 backdrop-blur-md" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-4"><Icon className="w-4 h-4" />{label}</span>
              {badge && (
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                  activeTab === id ? "bg-[var(--red)] text-white shadow-[var(--shadow-red)] shadow-red-900/50" : "bg-white/10 text-white/40"
                }`}>{badge}</span>
              )}
            </motion.button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <button onClick={() => window.open("https://console.firebase.google.com")} className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
            <Settings className="w-4 h-4" /> Console Firebase
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 xl:ml-72 flex flex-col min-h-[100svh] relative z-10 pb-28 md:pb-0">
        
        {/* Top Header Bar */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-[#0A0A0A]/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 z-30 border-b border-white/5 shadow-sm"
        >
          <div className="relative group max-w-md w-full mr-4 md:mr-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[var(--red)] transition-colors" />
            <input
              type="text"
              placeholder={language === "fr" ? "Rechercher..." : "Search..."}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[11px] font-black text-white placeholder-white/40 uppercase tracking-widest focus:outline-none focus:border-[var(--red)]/40 focus:bg-white/10 w-full transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative text-white/40 hover:text-white transition-all p-2 bg-white/5 border border-white/10 rounded-xl hidden sm:flex"
            >
              <Bell className="w-5 h-5" />
              {(pendingReqs > 0 || unreadMsgs > 0) && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-[#0A0A0A]" />}
            </motion.button>
            <div className="flex items-center gap-4 md:pl-6 md:border-l border-white/10 border-transparent">
              <div className="text-right hidden lg:block">
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Super Admin</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[var(--red)] rounded-full animate-pulse shadow-[0_0_10px_rgba(238,28,37,0.8)]" />
                  <p className="text-[9px] font-black text-[var(--red)] uppercase tracking-tighter">Root Access</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--red)] text-white flex items-center justify-center font-black text-sm shadow-[0_0_20px_rgba(238,28,37,0.3)] ring-2 ring-white/10">SA</div>
            </div>
          </div>
        </motion.header>

        <div className="p-4 md:p-8 lg:p-12 flex-1 relative overflow-hidden">
          {/* Stats Bento Grid */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {STATS.map(({ label, value, icon: Icon, color }, i) => (
              <StaggerItem key={label}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card p-5 md:p-8 bg-[#111111] border border-white/10 hover:border-[var(--red)]/50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group h-full flex flex-col justify-between"
                >
                  <div className="relative z-10 w-full mb-4 md:mb-0">
                    <p className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.1em] md:tracking-[0.2em] mb-2 md:mb-3 line-clamp-1">{label}</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter italic font-serif serif-italic">{value}</p>
                  </div>
                  <div className={`absolute bottom-5 right-5 md:top-6 md:right-6 md:bottom-auto w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 shadow-inner border border-white/5 ${color}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Table Control Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase line-clamp-1">Base de données ({activeTab})</h2>
                <p className="text-[9px] md:text-[10px] font-black text-[var(--red)] uppercase tracking-widest mt-1">Live Monitoring</p>
              </div>
              <motion.button
                onClick={fetchData}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-red w-full sm:w-auto text-[9px] md:text-[10px] justify-center font-black uppercase tracking-widest py-3 md:py-4 px-6 md:px-8 shadow-[var(--shadow-red)] shadow-red-900/50 border border-[var(--red)]"
              >
                Actualiser
              </motion.button>
            </div>

            {/* Dark Mode Server Table */}
            <div className="bg-[#111111] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/10 relative">
              <div className="overflow-x-auto custom-scrollbar pb-2">
                <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[700px]">
                  
                  {activeTab === "requests" && (
                    <>
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          {["Client", "Entité & Type", "Service", "Budget", "Statut", "Action"].map(h => (
                            <th key={h} className="py-4 md:py-6 px-4 md:px-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/50 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {data.requests.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-white/40 font-bold">Aucune requête.</td></tr>
                          ) : data.requests.map((req, i) => {
                            const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                            return (
                              <motion.tr key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-all group">
                                <td className="py-4 px-4 md:px-8 font-black text-[var(--red)]">{req.email} <br/><span className="text-white/40 text-[9px]">{req.phone}</span></td>
                                <td className="py-4 px-4 md:px-8 font-bold text-white tracking-tight">{req.entity} <br/><span className="text-white/40 uppercase tracking-widest text-[9px]">{req.clientType}</span></td>
                                <td className="py-4 px-4 md:px-8 text-[10px] md:text-xs font-medium text-white/70">{req.serviceId}</td>
                                <td className="py-4 px-4 md:px-8 font-black text-emerald-400 italic font-serif serif-italic">{req.budget}</td>
                                <td className="py-4 px-4 md:px-8">
                                  <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${mapObj.cls}`}>
                                    {mapObj.label}
                                  </span>
                                </td>
                                <td className="py-4 px-4 md:px-8">
                                  <select 
                                    value={req.status} 
                                    onChange={(e) => handleUpdateBooking(req.id, e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white/70 rounded-lg text-[10px] p-2 focus:outline-none focus:border-[var(--red)] font-bold uppercase tracking-widest"
                                  >
                                    <option value="PENDING">PENDING</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="REJECTED">REJECTED</option>
                                  </select>
                                  <button onClick={() => handleDeleteBooking(req.id)} className="ml-2 text-red-500/50 hover:text-red-500 font-bold text-[10px] uppercase">Supprimer</button>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                  {activeTab === "messages" && (
                    <>
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          {["Origine", "Sujet", "Message", "Date", "Statut", "Action"].map(h => (
                            <th key={h} className="py-4 px-4 md:px-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {data.messages.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-white/40 font-bold">Aucun message.</td></tr>
                          ) : data.messages.map((msg, i) => {
                            const mapObj = STATUS_MAP[langKey][msg.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].UNREAD;
                            const date = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
                            return (
                              <motion.tr key={msg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-all">
                                <td className="py-4 px-4 font-black text-white">{msg.name} <br/><span className="text-[var(--red)] text-[9px]">{msg.email}</span></td>
                                <td className="py-4 px-4 font-bold text-white/70">{msg.subject}</td>
                                <td className="py-4 px-4 font-medium text-white/50 max-w-xs truncate">{msg.message}</td>
                                <td className="py-4 px-4 text-[10px] text-white/40">{date}</td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${mapObj.cls}`}>
                                    {mapObj.label}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <select 
                                    value={msg.status} 
                                    onChange={(e) => handleUpdateMessage(msg.id, e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white/70 rounded-lg text-[10px] p-2 focus:outline-none focus:border-[var(--red)] font-bold uppercase tracking-widest"
                                  >
                                    <option value="UNREAD">UNREAD</option>
                                    <option value="READ">READ</option>
                                    <option value="REPLIED">REPLIED</option>
                                  </select>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                  {activeTab === "clients" && (
                    <>
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          {["Nom", "Email", "Rôle", "ID", "Date"].map(h => (
                            <th key={h} className="py-4 px-4 md:px-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {data.clients.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-white/40 font-bold">Aucun utilisateur.</td></tr>
                          ) : data.clients.map((cli, i) => {
                            const date = cli.createdAt ? new Date(cli.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
                            return (
                              <motion.tr key={cli.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-all">
                                <td className="py-4 px-4 font-black text-white">{cli.displayName || "N/A"}</td>
                                <td className="py-4 px-4 font-bold text-[var(--red)]">{cli.email}</td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${cli.role === 'ADMIN' ? 'bg-[var(--red)]/20 text-[var(--red)] border-[var(--red)]/50' : 'bg-white/5 text-white/60 border-white/10'}`}>
                                    {cli.role || "CLIENT"}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-mono text-[9px] text-white/30">{cli.uid}</td>
                                <td className="py-4 px-4 text-[10px] text-white/40">{date}</td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                  {activeTab === "services" && (
                    <>
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          {["Service ID", "Catégorie", "Titre", "Prix", "Action"].map(h => (
                            <th key={h} className="py-4 px-4 md:px-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {data.services.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-white/40 font-bold">Aucun service personnalisé.</td></tr>
                          ) : data.services.map((srv, i) => (
                              <motion.tr key={srv.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-all">
                                <td className="py-4 px-4 font-mono text-[9px] text-[var(--red)]">{srv.id}</td>
                                <td className="py-4 px-4 font-black text-white/50 uppercase tracking-widest text-[9px]">{srv.category || "General"}</td>
                                <td className="py-4 px-4 font-bold text-white">{srv.title}</td>
                                <td className="py-4 px-4 font-black text-emerald-400 italic font-serif serif-italic">{srv.priceCFA ? srv.priceCFA.toLocaleString() + " CFA" : "Sur devis"}</td>
                                <td className="py-4 px-4">
                                  <button className="text-white/40 hover:text-white border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all">Voir JSON</button>
                                </td>
                              </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                </table>
              </div>
              
            </div>
          </FadeUp>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-t border-white/10 pb-safe pb-4 pt-3 px-4 flex justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-1.5 p-2 relative group w-1/4"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabMobileAdmin" 
                  className="absolute -top-3 w-8 h-1 bg-[var(--red)] rounded-full shadow-[0_0_10px_rgba(238,28,37,1)]" 
                />
              )}
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-[var(--red)]" : "text-white/40 group-hover:text-white/70"}`} />
              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors line-clamp-1 ${isActive ? "text-white" : "text-white/40"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
