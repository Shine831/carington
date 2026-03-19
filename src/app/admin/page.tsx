"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, FileText, BarChart, Bell, Search, AlertTriangle, Clock, CheckCircle, Shield, Mail, LogOut, Eye, Trash2, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getServices, getBookings, getUsers, getMessages, updateBookingStatus, updateMessageStatus, updateService, deleteBooking, deleteService, createService, BookingData } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";

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

  const [showNotifications, setShowNotifications] = useState(false)  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [statusPrompt, setStatusPrompt] = useState<{ id: string, status: string } | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [newServiceModal, setNewServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({ title: "", description: "", priceCFA: 0, category: "IT" });

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
      const [reqs, clis, srvs, msgs] = await Promise.all([ getBookings(), getUsers(), getServices(), getMessages() ]);
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

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const attemptStatusChange = (id: string, newStatus: string) => {
    setStatusPrompt({ id, status: newStatus });
    setAdminNote("");
  };

  const confirmStatusChange = async () => {
    if (!statusPrompt) return;
    await updateBookingStatus(statusPrompt.id, statusPrompt.status, adminNote);
    setStatusPrompt(null);
    setAdminNote("");
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


  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    await createService(newServiceForm);
    setNewServiceModal(false);
    fetchData();
  };

  const [editServiceModal, setEditServiceModal] = useState<any | null>(null);

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editServiceModal) return;
    const { id, title, description, priceCFA, category } = editServiceModal;
    await updateService(id, { title, description, priceCFA, category });
    setEditServiceModal(null);
    fetchData();
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Supprimer ce service du catalogue ?")) {
      await deleteService(id);
      fetchData();
    }
  };

  // Keep Loading screen minimalist
  if (authLoading || role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--red)]/20 bg-white/5 mb-6"><Shield className="w-6 h-6 text-[var(--red)] animate-pulse" /></div>
      </div>
    );
  }

  const pendingReqsCount = data.requests.filter(r => r.status === "PENDING").length;
  const unreadMsgsCount = data.messages.filter(m => m.status === "UNREAD").length;
  const activeReqsCount = data.requests.filter(r => r.status === "ACTIVE").length;
  const solvedReqsCount = data.requests.filter(r => r.status === "COMPLETED").length;
  const vipClientsCount = data.clients.length;
  const totalNotifications = pendingReqsCount + unreadMsgsCount;

  const NAV = [
    { id: "requests",  label: t.admin.nav.requests, icon: FileText, badge: pendingReqsCount > 0 ? pendingReqsCount : undefined },
    { id: "messages",  label: language === "fr" ? "Messages" : "Messages", icon: Mail, badge: unreadMsgsCount > 0 ? unreadMsgsCount : undefined },
    { id: "clients",   label: t.admin.nav.clients, icon: Users },
    { id: "services",  label: t.admin.nav.catalog, icon: Briefcase },
  ];

  const STATS = [
    { label: "En attente", value: loading ? "..." : pendingReqsCount.toString(), icon: AlertTriangle, color: "text-[var(--red)]" },
    { label: "Actives", value: loading ? "..." : activeReqsCount.toString(), icon: Clock, color: "text-amber-500" },
    { label: "Résolus", value: loading ? "..." : solvedReqsCount.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Utilisateurs", value: loading ? "..." : vipClientsCount.toString(), icon: Users, color: "text-blue-500" },
  ];

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex pt-0 relative overflow-x-hidden text-slate-100 font-sans">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      {/* Sidebar */}
      <motion.aside className="w-64 xl:w-72 bg-[#050505] flex flex-col fixed top-0 bottom-0 left-0 z-40 hidden md:flex border-r border-white/10">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--red)] flex items-center justify-center shadow-[var(--shadow-red)] shadow-red-900/50"><Shield className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t.admin.tag}</p>
              <p className="font-black text-white text-sm tracking-tight text-emerald-400">ACTIVE SESSION</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === id ? "bg-white/10 text-white shadow-xl border border-white/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              <span className="flex items-center gap-4"><Icon className="w-4 h-4" />{label}</span>
              {badge && <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeTab === id ? "bg-[var(--red)] text-white" : "bg-white/10 text-white/40"}`}>{badge}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#ff2a33] hover:bg-[#ff2a33]/10 rounded-2xl transition-all">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 xl:ml-72 flex flex-col min-h-[100svh] relative z-20 pb-28 md:pb-0">
        
        {/* Top Header */}
        <header className="bg-[#0A0A0A]/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-5 flex items-center justify-end sticky top-0 z-50 border-b border-white/5">
          <div className="flex items-center gap-4 md:gap-6 relative">
            <button onClick={() => fetchData()} className="mr-4 px-5 py-2.5 rounded-xl border border-[var(--red)]/50 text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               Actualiser les données
            </button>

            <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-white/40 hover:text-white p-2 bg-white/5 border border-white/10 rounded-xl hidden sm:flex">
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-[#0A0A0A]" />}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-full right-24 mt-2 w-80 bg-[#111111] border border-white/10 shadow-2xl rounded-2xl p-4 z-50">
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Centre de Notifications</h4>
                  {totalNotifications === 0 ? (
                    <p className="text-xs text-center text-white/40 py-4">Aucune nouvelle notification.</p>
                  ) : (
                    <ul className="space-y-3">
                      {pendingReqsCount > 0 && (
                        <li onClick={() => { setActiveTab("requests"); setShowNotifications(false); }} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-500 cursor-pointer hover:bg-yellow-500/20 transition-all flex items-center gap-3"><AlertTriangle className="w-4 h-4" /> <strong>{pendingReqsCount}</strong> requêtes en attente</li>
                      )}
                      {unreadMsgsCount > 0 && (
                        <li onClick={() => { setActiveTab("messages"); setShowNotifications(false); }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-[var(--red)] cursor-pointer hover:bg-red-500/20 transition-all flex items-center gap-3"><Mail className="w-4 h-4" /> <strong>{unreadMsgsCount}</strong> messages non lus</li>
                      )}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right"><p className="text-[10px] font-black text-white uppercase tracking-wider">Super Admin</p></div>
              <div className="w-10 h-10 rounded-xl bg-[var(--red)] text-white flex items-center justify-center font-black text-sm ring-2 ring-white/10 shadow-[var(--shadow-red)]">SA</div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 flex-1 relative overflow-hidden z-10">
          
          {/* Stats Bento */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <StaggerItem key={label}>
                <div className="card p-5 md:p-8 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-white/10 relative h-full flex flex-col justify-between rounded-2xl shadow-xl hover:border-white/20 transition-all">
                  <div className="relative z-10 mb-4">
                    <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.1em]">{label}</p>
                    <p className={`text-3xl md:text-5xl font-black ${color.replace("text-", "text-")} tracking-tighter italic mt-2 drop-shadow-lg`}>{value}</p>
                  </div>
                  <div className={`absolute bottom-5 right-5 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 ${color} shadow-inner`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tables Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase line-clamp-1">Base de données ({activeTab})</h2>
            </div>
            {activeTab === "services" && (
               <button onClick={() => setNewServiceModal(true)} className="btn btn-red px-6 py-3 text-[10px] uppercase font-black shadow-[var(--shadow-red)]">+ Ajouter Service</button>
            )}
          </div>

          <div className="bg-[#111111] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                
                {activeTab === "requests" && (
                  <>
                    <thead>
                      <tr className="bg-[#1A1A1A] border-b border-white/10">{["Date", "Client", "Service / Délai", "Devis", "Statut", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-white/50">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.requests.length === 0 ? (<tr><td colSpan={6} className="text-center py-20 text-white/40 font-bold">Aucune requête.</td></tr>) : data.requests.map((req) => {
                        const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                        return (
                          <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-5 px-6 font-mono text-[10px] text-white/40">{req.createdAt ? new Date(req.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-5 px-6 font-black text-white tracking-tight">{req.entity} <br/><span className="text-[var(--red)] text-[9px] font-bold tracking-widest">{req.phone}</span></td>
                            <td className="py-5 px-6 font-bold text-white/80">{req.serviceId} <br/><span className="text-[9px] text-white/40 uppercase tracking-widest">{req.timeframe}</span></td>
                            <td className="py-5 px-6 font-black text-emerald-400 italic text-base">{req.budget}</td>
                            <td className="py-5 px-6"><span className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner ${mapObj.cls}`}>{mapObj.label}</span></td>
                            <td className="py-5 px-6 flex items-center gap-2">
                              <select value={req.status} onChange={(e) => attemptStatusChange(req.id, e.target.value)} className="bg-[#222222] border border-white/10 text-white rounded-lg text-[10px] p-2.5 font-bold uppercase cursor-pointer hover:border-white/30 focus:border-[var(--red)] focus:outline-none transition-all">
                                <option value="PENDING" className="bg-[#1A1A1A] text-white">PENDING</option>
                                <option value="ACTIVE" className="bg-[#1A1A1A] text-white">ACTIVE</option>
                                <option value="COMPLETED" className="bg-[#1A1A1A] text-white">COMPLETED</option>
                                <option value="REJECTED" className="bg-[#1A1A1A] text-white">REJECTED</option>
                              </select>
                              <button onClick={() => setSelectedBooking(req)} className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors" title="Voir détails"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteBooking(req.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors" title="Supprimer définitivement"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {activeTab === "messages" && (
                  <>
                    <thead><tr className="bg-[#1A1A1A] border-b border-white/10">{["Date", "Nom", "Email", "Sujet", "Statut", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-white/50">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {data.messages.length === 0 ? (<tr><td colSpan={6} className="text-center py-20 text-white/40 font-bold">Aucun message.</td></tr>) : data.messages.map((msg) => {
                         const mapObj = STATUS_MAP[langKey][msg.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].UNREAD;
                         return (
                          <tr key={msg.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-5 px-6 font-mono text-[10px] text-white/40">{msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-5 px-6 font-black text-white">{msg.name}</td>
                            <td className="py-5 px-6 font-bold text-[var(--red)]">{msg.email}</td>
                            <td className="py-5 px-6 font-medium text-white/70 max-w-[200px] truncate" title={msg.message}>{msg.subject}: {msg.message}</td>
                            <td className="py-5 px-6"><span className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner ${mapObj.cls}`}>{mapObj.label}</span></td>
                            <td className="py-5 px-6 flex items-center gap-2">
                              <select value={msg.status} onChange={(e) => handleUpdateMessage(msg.id, e.target.value)} className="bg-[#222222] border border-white/10 text-white rounded-lg text-[10px] p-2.5 font-bold uppercase cursor-pointer hover:border-white/30 focus:border-[var(--red)] focus:outline-none transition-all">
                                <option value="UNREAD" className="bg-[#1A1A1A] text-white">UNREAD</option>
                                <option value="READ" className="bg-[#1A1A1A] text-white">READ</option>
                                <option value="REPLIED" className="bg-[#1A1A1A] text-white">REPLIED</option>
                              </select>
                              <button onClick={() => setSelectedMessage(msg)} className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors" title="Voir détails"><Eye className="w-4 h-4" /></button>
                            </td>
                          </tr>
                         )
                      })}
                    </tbody>
                  </>
                )}

                {activeTab === "clients" && (
                  <>
                    <thead><tr className="bg-white/5 border-b border-white/10">{["Date", "Nom", "Email", "Rôle", "ID", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-white/50">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {data.clients.length === 0 ? (<tr><td colSpan={6} className="text-center py-10 text-white/40 font-bold">Aucun client.</td></tr>) : data.clients.map((cli) => (
                        <tr key={cli.id} className="hover:bg-white/5">
                          <td className="py-4 px-6 font-mono text-[9px] text-white/40">{cli.createdAt ? new Date(cli.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6 font-black text-white">{cli.displayName || "N/A"}</td>
                          <td className="py-4 px-6 font-bold text-slate-300">{cli.email}</td>
                          <td className="py-4 px-6"><span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${cli.role === 'ADMIN' ? 'bg-[var(--red)]/20 text-[var(--red)] border-[var(--red)]/50' : 'bg-white/5 text-white/60 border-white/10'}`}>{cli.role || "CLIENT"}</span></td>
                          <td className="py-4 px-6 font-mono text-[9px] text-white/30">{cli.uid}</td>
                          <td className="py-4 px-6 text-[10px] font-black text-white/30">Auth handled in Firebase</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === "services" && (
                  <>
                    <thead><tr className="bg-white/5 border-b border-white/10">{["Titre", "Catégorie", "Prix CFA", "Description", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-white/50">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {data.services.length === 0 ? (<tr><td colSpan={5} className="text-center py-10 text-white/40 font-bold">Catalogue vide.</td></tr>) : data.services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-white/5">
                          <td className="py-4 px-6 font-black text-white">{srv.title}</td>
                          <td className="py-4 px-6 font-bold text-white/40 text-[10px] uppercase">{srv.category || "IT"}</td>
                          <td className="py-4 px-6 font-black text-emerald-400 italic">{srv.priceCFA}</td>
                          <td className="py-4 px-6 font-medium text-white/60 text-xs max-w-xs">{srv.description}</td>
                          <td className="py-4 px-6 flex items-center gap-2">
                            <button onClick={() => setEditServiceModal(srv)} className="p-2 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/40"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteService(srv.id)} className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        
        {/* Booking Details Modal */}
        {selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-2xl relative shadow-2xl">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">Détails de la demande</h2>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Entité / Client</span><p className="font-bold text-white text-lg">{selectedBooking.entity} <span className="text-[10px] bg-white/10 px-2 py-1 rounded ml-2">{selectedBooking.clientType}</span></p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Email & Téléphone</span><p className="font-bold text-white">{selectedBooking.email}<br/>{selectedBooking.phone}</p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Service Choisi</span><p className="font-bold text-[var(--red)]">{selectedBooking.serviceId}</p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Budget Alloué</span><p className="font-bold text-emerald-400 italic">{selectedBooking.budget}</p></div>
                <div className="col-span-2"><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Délai d'intervention</span><p className="font-bold text-white/80">{selectedBooking.timeframe}</p></div>
                <div className="col-span-2"><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Description Technique</span><p className="p-4 bg-white/5 rounded-xl text-white/80 whitespace-pre-line">{selectedBooking.description}</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Message Details Modal */}
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] p-8 rounded-3xl border border-[var(--red)]/20 w-full max-w-2xl relative shadow-[0_0_50px_rgba(200,16,46,0.1)]">
              <button onClick={() => setSelectedMessage(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--red)]/10 text-[var(--red)] flex items-center justify-center"><Mail className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">{selectedMessage.subject}</h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{selectedMessage.createdAt ? new Date(selectedMessage.createdAt.seconds*1000).toLocaleString() : 'Date inconnue'}</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-1">Expéditeur</span>
                    <strong className="text-white block text-sm">{selectedMessage.name} <span className="font-normal text-[var(--red)] ml-2">{selectedMessage.email}</span></strong>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block mb-3">Corps du message</span>
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedMessage(null)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black uppercase text-[10px] tracking-widest transition-colors">Fermer</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Change Status & Admin Note Modal */}
        {statusPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] p-8 rounded-3xl border border-[var(--red)]/40 w-full max-w-md relative shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Mettre à jour le statut</h2>
              <p className="text-xs text-white/60 mb-6">Vous passez le statut à <strong className="text-[var(--red)]">{statusPrompt.status}</strong>. Laissez un commentaire visible par le client.</p>
              <textarea 
                value={adminNote} 
                onChange={(e) => setAdminNote(e.target.value)} 
                placeholder="Message à l'attention du client (optionnel)..." 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white focus:border-[var(--red)] outline-none mb-6 h-32 resize-none" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setStatusPrompt(null)} className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-white/10 hover:bg-white/20 text-white transition-all">Annuler</button>
                <button onClick={confirmStatusChange} className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-[var(--red)] text-white hover:bg-red-600 transition-all shadow-[var(--shadow-red)]">Confirmer & Notifier</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Service Modal */}
        {newServiceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-md relative shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Ajouter au Catalogue</h2>
              <form onSubmit={handleCreateService} className="space-y-4">
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Titre du service</label><input required type="text" value={newServiceForm.title} onChange={e => setNewServiceForm({...newServiceForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Catégorie</label><input required type="text" value={newServiceForm.category} onChange={e => setNewServiceForm({...newServiceForm, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Prix CFA (Mettre 0 pour devis)</label><input required type="number" value={newServiceForm.priceCFA} onChange={e => setNewServiceForm({...newServiceForm, priceCFA: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Description Courte</label><textarea required value={newServiceForm.description} onChange={e => setNewServiceForm({...newServiceForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white h-24 resize-none" /></div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setNewServiceModal(false)} className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-white/10 hover:bg-white/20 text-white">Annuler</button>
                  <button type="submit" className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">Créer Service</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Edit Service Modal */}
        {editServiceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111] p-8 rounded-3xl border border-blue-500/20 w-full max-w-md relative shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Modifier le Service</h2>
              <form onSubmit={handleUpdateService} className="space-y-4">
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Titre</label><input required type="text" value={editServiceModal.title} onChange={e => setEditServiceModal({...editServiceModal, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:border-blue-500 outline-none transition-colors" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Catégorie</label><input required type="text" value={editServiceModal.category || ""} onChange={e => setEditServiceModal({...editServiceModal, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:border-blue-500 outline-none transition-colors" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Prix CFA (Mettre 0 pour devis)</label><input required type="number" value={editServiceModal.priceCFA} onChange={e => setEditServiceModal({...editServiceModal, priceCFA: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white focus:border-blue-500 outline-none transition-colors" /></div>
                <div><label className="text-[10px] font-black uppercase text-white/50 block mb-1">Description</label><textarea required value={editServiceModal.description} onChange={e => setEditServiceModal({...editServiceModal, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white h-24 resize-none focus:border-blue-500 outline-none transition-colors" /></div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setEditServiceModal(null)} className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-white/10 hover:bg-white/20 text-white">Annuler</button>
                  <button type="submit" className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">Mettre à jour</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
