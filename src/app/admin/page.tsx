"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, FileText, BarChart, Bell, Search, AlertTriangle, Clock, CheckCircle, Shield, Mail, LogOut, Eye, Trash2, Edit3, X, ArrowRight, Phone, Star, Lock, Key, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getServices, getBookings, getUsers, getMessages, getReviews, updateBookingStatus, updateMessageStatus, updateService, deleteBooking, deleteService, createService, deleteReview, deleteUserDoc, BookingData, getUserById, setUserPin } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

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
  const [data, setData] = useState({ requests: [] as any[], clients: [] as any[], services: [] as any[], messages: [] as any[], reviews: [] as any[] });
  const [loading, setLoading] = useState(true);

  const [showNotifications, setShowNotifications] = useState(false)  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [statusPrompt, setStatusPrompt] = useState<{ id: string, status: string } | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [newServiceModal, setNewServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({ title: "", description: "", priceCFA: 0, category: "IT" });

  const [checkingPin, setCheckingPin] = useState(true);
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Security Modals
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  const [pinChangeForm, setPinChangeForm] = useState({ oldPin: "", newPin: "", error: "", success: "" });
  const [isChangingPin, setIsChangingPin] = useState(false);

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [passwordChangeForm, setPasswordChangeForm] = useState({ oldPassword: "", newPassword: "", error: "", success: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile State
  const [profileForm, setProfileForm] = useState({ name: "", email: "", currentPassword: "", error: "", success: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/account");
        return;
      }
      if (role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      if (typeof window !== "undefined" && sessionStorage.getItem("admin_pin_verified") === "true") {
        setIsPinVerified(true);
        setCheckingPin(false);
        return;
      }

      getUserById(user.uid).then(userData => {
        if (userData && userData.pin) setHasPinConfigured(true);
        else setHasPinConfigured(false);
        setProfileForm({ name: user.displayName || "Admin", email: user.email || "", currentPassword: "", error: "", success: "" });
        setCheckingPin(false);
      });
    }
  }, [user, role, authLoading, router]);

  async function hashPin(pin: string) {
    const enc = new TextEncoder().encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const fetchData = useCallback(async () => {
    if (role !== "ADMIN") return;
    setLoading(true);
    try {
      const [reqs, clis, srvs, msgs, revs] = await Promise.all([ getBookings(), getUsers(), getServices(), getMessages(), getReviews() ]);
      setData({ requests: reqs, clients: clis, services: srvs, messages: msgs, reviews: revs });
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

  const handlePinChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPinChangeForm(p => ({ ...p, error: "", success: "" }));
    setIsChangingPin(true);

    try {
      const userData = await getUserById(user.uid);
      if (!userData) throw new Error("Erreur serveur.");

      const lastChange = userData.lastPinChange || 0;
      const timeSinceChange = Date.now() - lastChange;
      if (timeSinceChange < 86400000 && lastChange !== 0) {
        throw new Error("Vous ne pouvez modifier votre PIN qu'une fois toutes les 24 heures.");
      }

      const oldHashed = await hashPin(pinChangeForm.oldPin);
      if (oldHashed !== userData.pin) {
        throw new Error("L'ancien PIN est incorrect.");
      }

      if (pinChangeForm.newPin.length !== 6) {
        throw new Error("Le nouveau PIN doit comporter 6 chiffres.");
      }

      const newHashed = await hashPin(pinChangeForm.newPin);
      await setUserPin(user.uid, newHashed);
      setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "Code PIN Maître modifié !" });
      
      setTimeout(() => {
        setShowPinChangeModal(false);
        setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "" });
      }, 3000);

    } catch (err: any) {
      setPinChangeForm(p => ({ ...p, error: err.message || "Erreur lors de la modification." }));
    } finally {
      setIsChangingPin(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!user.email)) return;
    setPasswordChangeForm(p => ({ ...p, error: "", success: "" }));
    setIsChangingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, passwordChangeForm.oldPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, passwordChangeForm.newPassword);
      setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "Mot de passe modifié avec succès !" });
      
      setTimeout(() => {
        setShowPasswordChangeModal(false);
        setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "" });
      }, 3000);

    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
         setPasswordChangeForm(p => ({ ...p, error: "Ancien mot de passe incorrect." }));
      } else {
         setPasswordChangeForm(p => ({ ...p, error: "L'opération a échoué. Essayez de vous reconnecter." }));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    setProfileForm(p => ({ ...p, error: "", success: "" }));

    try {
      const { updateProfile: fbUpdateProfile, updateEmail: fbUpdateEmail } = await import("firebase/auth");
      const { updateUserDoc } = await import("@/lib/firebase/db");

      // 1. Update Display Name
      if (profileForm.name !== user.displayName) {
        await fbUpdateProfile(user, { displayName: profileForm.name });
        await updateUserDoc(user.uid, { displayName: profileForm.name });
      }

      // 2. Update Email (requires re-auth)
      if (profileForm.email !== user.email) {
        if (!profileForm.currentPassword) {
           throw new Error("Mot de passe requis pour changer l'email.");
        }
        const credential = EmailAuthProvider.credential(user.email!, profileForm.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await fbUpdateEmail(user, profileForm.email);
        await updateUserDoc(user.uid, { email: profileForm.email });
      }

      setProfileForm(p => ({ ...p, success: "Profil Administrateur mis à jour !", currentPassword: "" }));
    } catch (err: any) {
      setProfileForm(p => ({ ...p, error: err.message }));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm(language === "fr" ? "Supprimer ce témoignage définitivement ?" : "Delete this review permanently?")) {
      await deleteReview(id);
      fetchData();
    }
  };

  const handleDeleteClient = async (uid: string) => {
    if (confirm(language === "fr" ? "Supprimer ce compte client définitivement ?" : "Delete this client account permanently?")) {
      try {
        await deleteUserDoc(uid);
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // Keep Loading screen minimalist
  if (authLoading || role !== "ADMIN" || checkingPin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--red)]/20 bg-white/5 mb-6"><Shield className="w-6 h-6 text-[var(--red)] animate-pulse" /></div>
      </div>
    );
  }

  if (!isPinVerified) {
    const handlePinSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || pinInput.length < 4) return;
      
      setPinError(false);
      const hashed = await hashPin(pinInput);
      
      if (!hasPinConfigured) {
        // Configuration
        await setUserPin(user.uid, hashed);
        setHasPinConfigured(true);
        setIsPinVerified(true);
        sessionStorage.setItem("admin_pin_verified", "true");
        fetchData();
      } else {
        // Verification
        const userData = await getUserById(user.uid);
        if (userData?.pin === hashed) {
          setIsPinVerified(true);
          sessionStorage.setItem("admin_pin_verified", "true");
          fetchData();
        } else {
          setPinError(true);
          setPinInput("");
        }
      }
    };

    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[800px] h-[800px] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm relative z-10">
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-[var(--red)]/20 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(200,16,46,0.1)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--red)]/10 text-[var(--red)] flex items-center justify-center mb-6 border border-[var(--red)]/20 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">
              {hasPinConfigured ? "Accès Restreint" : "Initier Code Admin"}
            </h1>
            <p className="text-white/40 text-[11px] mb-8 leading-relaxed">
              {hasPinConfigured 
                ? "Veuillez entrer le Code PIN Maître pour débloquer l'interface d'administration."
                : "Afin de protéger l'accès principal, veuillez configurer votre Code PIN."}
            </p>
            
            <form onSubmit={handlePinSubmit} className="w-full space-y-6">
              <div>
                <input 
                  type="password"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  placeholder="••••"
                  maxLength={6}
                  autoFocus
                  className={`w-full bg-[#050505] border ${pinError ? "border-red-500 text-red-500" : "border-white/10 text-white focus:border-[var(--red)]"} p-4 rounded-2xl text-center text-2xl font-black tracking-[1em] outline-none transition-all placeholder:text-white/10`}
                />
                <AnimatePresence>
                  {pinError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-500 font-bold mt-3 uppercase tracking-widest">
                      Code Incorrect
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={pinInput.length < 4}
                className="w-full py-4 bg-gradient-to-r from-[var(--red)] to-[#ff2a33] rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[var(--shadow-red)] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {hasPinConfigured ? "Déverrouiller" : "Enregistrer mon PIN"}
              </button>
            </form>

            <button onClick={handleLogout} className="mt-8 text-[10px] text-white/30 hover:text-red-500 font-black uppercase tracking-widest transition-colors">
              Fermer la session
            </button>
          </div>
        </motion.div>
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
    { id: "reviews",   label: language === "fr" ? "Témoignages" : "Reviews", icon: Star, badge: data.reviews.length > 0 ? data.reviews.length : undefined },
    { id: "profile",   label: language === "fr" ? "Compte" : "Account", icon: Shield },
  ];

  const STATS = [
    { label: "En attente", value: loading ? "..." : pendingReqsCount.toString(), icon: AlertTriangle, color: "text-[var(--red)]" },
    { label: "Actives", value: loading ? "..." : activeReqsCount.toString(), icon: Clock, color: "text-amber-500" },
    { label: "Résolus", value: loading ? "..." : solvedReqsCount.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Utilisateurs", value: loading ? "..." : vipClientsCount.toString(), icon: Users, color: "text-blue-500" },
  ];

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex pt-0 relative overflow-x-hidden text-slate-100 font-sans pb-20 md:pb-0">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

      {/* Sidebar (Desktop) */}
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

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around px-2 py-3 pb-safe md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {NAV.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1.5 p-2 transition-all relative ${
              activeTab === id ? "text-[var(--red)] scale-110" : "text-white/40"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[7.5px] font-black uppercase tracking-widest">{label}</span>
            {badge && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--red)] text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-[#050505] shadow-lg">
                {badge}
              </span>
            )}
            {activeTab === id && (
              <motion.div layoutId="activeTabMobile" className="absolute -bottom-1 w-6 h-0.5 bg-[var(--red)] rounded-full" />
            )}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1.5 p-2 text-white/40 active:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500/80" />
          <span className="text-[7.5px] font-black uppercase tracking-widest">Sortie</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 xl:ml-72 flex flex-col min-h-[100svh] relative z-20">
        
        {/* Top Header */}
        <header className="bg-[#0A0A0A]/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-5 flex items-center justify-end sticky top-0 z-50 border-b border-white/5">
          <div className="flex items-center gap-4 md:gap-6 relative">
            <button onClick={() => fetchData()} title="Actualiser les données" className="px-4 md:px-5 py-2.5 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95">
               <Clock className="w-4 h-4" />
               <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button onClick={() => setShowPinChangeModal(true)} title="Modifier PIN Maître" className="relative text-emerald-400 hover:text-white p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all">
              <Key className="w-5 h-5" />
            </button>

            <button onClick={() => setShowPasswordChangeModal(true)} title="Modifier Mot de Passe" className="relative text-amber-500 hover:text-white p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-all">
              <ShieldAlert className="w-5 h-5" />
            </button>

            <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-white/40 hover:text-white p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-[#0A0A0A]" />}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-full right-0 sm:right-24 mt-2 w-[calc(100vw-2rem)] max-w-[360px] bg-[#111111] border border-white/10 shadow-2xl rounded-2xl p-4 z-50">
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

            <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block"><p className="text-[10px] font-black text-white uppercase tracking-wider">Super Admin</p></div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[var(--red)] text-white flex items-center justify-center font-black text-xs md:text-sm ring-2 ring-white/10 shadow-[var(--shadow-red)]">SA</div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 flex-1 relative overflow-hidden z-10 w-full overflow-x-hidden">
          
          {/* Stats Bento */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <StaggerItem key={label}>
                <div className="card p-5 md:p-8 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-white/10 relative h-full flex flex-col justify-between rounded-2xl shadow-xl hover:border-white/20 transition-all">
                  <div className="relative z-10 mb-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em]">{label}</p>
                    <p className={`text-4xl md:text-5xl font-black ${color.replace("text-", "text-")} tracking-tighter italic mt-1 drop-shadow-lg`}>{value}</p>
                  </div>
                  <div className={`absolute bottom-4 right-4 md:bottom-5 md:right-5 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 ${color} shadow-inner`}>
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
                   <div className="md:hidden space-y-6 mb-12">
            {activeTab === "requests" && data.requests.map((req) => {
              const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
              const accentColor = req.status === "PENDING" ? "bg-yellow-500" : req.status === "ACTIVE" ? "bg-blue-500" : req.status === "COMPLETED" ? "bg-emerald-500" : "bg-red-500";
              
              return (
                <div key={req.id} className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md shadow-xl">
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor} shadow-[0_0_20px_rgba(0,0,0,0.5)]`} />
                  
                  <div className="p-6 space-y-5">
                    <div className="flex justify-between items-start pl-2">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{req.createdAt ? new Date(req.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                        <h3 className="text-white font-black text-xl tracking-tight leading-tight">{req.entity}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${mapObj.cls}`}>{mapObj.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 ml-2">
                      <div>
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Service</p>
                        <p className="text-xs font-bold text-white leading-tight">{req.serviceId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Budget</p>
                        <p className="text-sm font-black text-emerald-400 italic">{req.budget}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pl-2">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10"><Phone className="w-3.5 h-3.5 text-[var(--red)]" /></div>
                         <span className="text-sm font-bold text-white/70">{req.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 pl-2">
                      <button onClick={() => setSelectedBooking(req)} className="flex-[1.5] py-4 bg-gradient-to-r from-[var(--red)] to-[#ff2a33] hover:from-red-600 hover:to-red-500 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-[var(--shadow-red)] active:scale-95 transition-all">
                        <Eye className="w-5 h-5" /> Ouvrir
                      </button>
                      <div className="flex-1 relative">
                        <select 
                          value={req.status} 
                          onChange={(e) => attemptStatusChange(req.id, e.target.value)} 
                          className="w-full h-full py-4 bg-[#1A1A1A] border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest px-4 focus:border-[var(--red)] outline-none appearance-none text-center"
                        >
                          <option value="PENDING">Statut</option>
                          <option value="ACTIVE">Actif</option>
                          <option value="COMPLETED">Fini</option>
                          <option value="REJECTED">Refus</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeTab === "messages" && data.messages.map((msg) => {
              const mapObj = STATUS_MAP[langKey][msg.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].UNREAD;
              const accentColor = msg.status === "UNREAD" ? "bg-red-500" : msg.status === "READ" ? "bg-slate-500" : "bg-emerald-500";

              return (
                <div key={msg.id} className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md shadow-xl">
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor}`} />
                  <div className="p-6 space-y-5">
                    <div className="flex justify-between items-start pl-2">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                        <h3 className="text-white font-black text-lg tracking-tight">{msg.name}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${mapObj.cls}`}>{mapObj.label}</span>
                    </div>

                    <p className="text-xs text-white/60 font-bold px-4 py-3 bg-white/5 rounded-2xl border border-white/5 ml-2 leading-relaxed">
                      <span className="text-[var(--red)] block text-[10px] uppercase font-black mb-1">Sujet: {msg.subject}</span>
                      {msg.message}
                    </p>

                    <div className="flex gap-3 pt-2 pl-2">
                      <button onClick={() => setSelectedMessage(msg)} className="flex-[1.5] py-4 bg-gradient-to-r from-[var(--red)] to-[#ff2a33] rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-[var(--shadow-red)] active:scale-95 transition-all">
                        <Mail className="w-5 h-5" /> Lire Message
                      </button>
                      <button onClick={() => handleUpdateMessage(msg.id, "READ")} className="flex-1 py-4 bg-[#1A1A1A] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:bg-white/5">
                        Marquer Lu
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeTab === "clients" && data.clients.map((cli) => (
              <div key={cli.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${cli.role === 'ADMIN' ? 'bg-[var(--red)]' : 'bg-blue-500'}`} />
                <div className="flex justify-between items-center pl-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{cli.createdAt ? new Date(cli.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${cli.role === 'ADMIN' ? 'bg-[var(--red)]/20 text-[var(--red)] border-[var(--red)]/50' : 'bg-white/5 text-white/60 border-white/10'}`}>{cli.role || "CLIENT"}</span>
                </div>
                <div className="pl-2">
                  <h3 className="text-white font-black text-xl tracking-tight mb-1">{cli.displayName || "Client Sans Nom"}</h3>
                  <p className="text-[var(--red)] text-xs font-bold tracking-widest">{cli.email}</p>
                </div>
                <div className="pl-2 pt-3 border-t border-white/5 flex items-center justify-between">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">UID: {cli.uid.substring(0, 10)}...</p>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Users className="w-4 h-4 text-white/20" /></div>
                     {cli.role !== 'ADMIN' && (
                       <button onClick={() => handleDeleteClient(cli.uid)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500 text-red-500 hover:text-white transition-colors" title="Supprimer Client">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            ))}

            {activeTab === "services" && data.services.map((srv) => (
              <div key={srv.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md p-6 space-y-5 shadow-xl">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                <div className="flex justify-between items-start pl-2">
                   <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/50 text-[10px] font-black uppercase tracking-widest border border-white/5">{srv.category || "General"}</span>
                   <span className="text-lg font-black text-emerald-400 italic tracking-tighter shadow-emerald-500/20">{srv.priceCFA} CFA</span>
                </div>
                <div className="pl-2">
                  <h3 className="text-white font-black text-xl tracking-tight mb-2 uppercase leading-tight group-hover:text-[var(--red)] transition-colors">{srv.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-3 font-medium bg-white/5 p-4 rounded-2xl border border-white/5">{srv.description}</p>
                </div>
                <div className="flex gap-3 pl-2">
                  <button onClick={() => setEditServiceModal(srv)} className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                    <Edit3 className="w-4 h-4" /> Editer
                  </button>
                  <button onClick={() => handleDeleteService(srv.id)} className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20 active:scale-95 transition-all">
                    <Trash2 className="w-4 h-4" /> Suppr
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "reviews" && data.reviews.map((rev) => (
              <div key={rev.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-yellow-500" />
                <div className="flex justify-between items-start pl-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "fill-white/5 text-white/10"}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-white/40 uppercase">{rev.createdAt ? new Date(rev.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="pl-2">
                  <p className="text-white/80 text-sm italic line-clamp-3">"{rev.comment}"</p>
                  <p className="text-[10px] font-black uppercase text-yellow-500 mt-2">{rev.authorName || "Client"} • {rev.serviceId || "Général"}</p>
                </div>
                <div className="flex gap-3 pl-2 pt-2 border-t border-white/5">
                  <button onClick={() => handleDeleteReview(rev.id)} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20 active:scale-95 transition-all">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            ))}

            {data[activeTab as keyof typeof data].length === 0 && (
              <div className="py-24 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-[#0D0D0D]/50 backdrop-blur-xl">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-white/20" /></div>
                <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs">Aucune donnée détectée</p>
              </div>
            )}
          </div>

          <div className="bg-[#111111] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group/table hidden md:block">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white/20 md:hidden pointer-events-none group-hover/table:opacity-0 transition-opacity">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] vertical-text">Scroll</span>
              <ArrowRight className="w-3 h-3 rotate-0" />
            </div>
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
                          <td className="py-4 px-6 text-[10px] font-black text-white/30">
                            {cli.role === 'ADMIN' ? (
                              <span className="text-white/20">Auth Firebase</span>
                            ) : (
                              <button onClick={() => handleDeleteClient(cli.uid)} className="flex items-center gap-2 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                <Trash2 className="w-3 h-3" /> Supprimer
                              </button>
                            )}
                          </td>
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
                {activeTab === "reviews" && (
                  <>
                    <thead><tr className="bg-white/5 border-b border-white/10">{["Date", "Client & Service", "Note", "Commentaire", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-white/50">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {data.reviews.length === 0 ? (<tr><td colSpan={5} className="text-center py-10 text-white/40 font-bold">Aucun témoignage.</td></tr>) : data.reviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-white/5">
                          <td className="py-4 px-6 font-mono text-[9px] text-white/40">{rev.createdAt ? new Date(rev.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6"><p className="font-black text-white">{rev.authorName || "Client"}</p><p className="text-[9px] text-white/40 uppercase tracking-widest">{rev.serviceId || "Général"}</p></td>
                          <td className="py-4 px-6">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "fill-white/5 text-white/10"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-white/60 text-xs italic max-w-xs truncate">"{rev.comment}"</td>
                          <td className="py-4 px-6">
                            <button onClick={() => handleDeleteReview(rev.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Supprimer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Meta Side */}
                <div className="space-y-6">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden">
                    <AuraGradient color="var(--red)" className="top-0 left-0 w-32 h-32 opacity-10" />
                    <div className="w-24 h-24 rounded-full bg-[var(--red)] flex items-center justify-center text-3xl font-black text-white mb-6 shadow-[var(--shadow-red)]">
                      {(user?.displayName || "A")[0]}
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{user?.displayName || "Administrateur"}</h3>
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] mt-2">Accès Super-Privilégié</p>
                    <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase">Version Système</span>
                        <span className="text-[10px] font-bold text-white/60">V2.4.0-STABLE</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-white/20 uppercase">Dernier Login</span>
                         <span className="text-[10px] font-bold text-white/60">Aujourd'hui</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#111] border border-white/10 rounded-[2rem] space-y-3">
                    <button onClick={() => setShowPinChangeModal(true)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                      <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white"><Key className="w-4 h-4 text-emerald-400" /> Code PIN Maître</span>
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </button>
                    <button onClick={() => setShowPasswordChangeModal(true)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                      <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white"><ShieldAlert className="w-4 h-4 text-amber-500" /> Mot de Passe</span>
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </button>
                  </div>
                </div>

                {/* Form Main */}
                <div className="lg:col-span-2">
                   <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden h-full">
                     <AuraGradient color="var(--red)" className="bottom-[-10%] right-[-10%] w-64 h-64 opacity-[0.05]" />
                     <h3 className="text-2xl font-black text-white tracking-tighter mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><Edit3 className="w-5 h-5 text-emerald-400" /></div>
                        Informations Administrateur
                     </h3>

                     <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] pl-1">Nom d'affichage</label>
                             <input 
                               type="text" 
                               value={profileForm.name} 
                               onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                               className="w-full bg-[#050505] border border-white/10 text-white p-5 rounded-2xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all placeholder:text-white/5"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] pl-1">Email Principal</label>
                             <input 
                               type="email" 
                               value={profileForm.email} 
                               onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                               className="w-full bg-[#050505] border border-white/10 text-white p-5 rounded-2xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all placeholder:text-white/5"
                             />
                           </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                          <label className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] pl-1 flex items-center gap-2">
                             <Lock className="w-3 h-3" /> Mot de passe actuel
                             <span className="text-white/20 capitalize font-medium italic">(Nécessaire pour changer l'email)</span>
                          </label>
                          <input 
                            type="password" 
                            value={profileForm.currentPassword}
                            onChange={e => setProfileForm({...profileForm, currentPassword: e.target.value})}
                            placeholder="••••••••••••"
                            className="w-full bg-[#050505] border border-white/10 text-white p-5 rounded-2xl text-sm font-bold focus:border-white/20 outline-none transition-all placeholder:text-white/5"
                          />
                        </div>

                        <AnimatePresence>
                          {profileForm.error && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[10px] font-black text-red-500 uppercase tracking-widest">{profileForm.error}</motion.p>}
                          {profileForm.success && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{profileForm.success}</motion.p>}
                        </AnimatePresence>

                        <div className="pt-6">
                           <button 
                             type="submit" 
                             disabled={isUpdatingProfile}
                             className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                           >
                             {isUpdatingProfile ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Sauvegarder Configuration"}
                           </button>
                        </div>
                     </form>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        
        {/* Booking Details Modal */}
        {selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/10 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white p-2"><X className="w-6 h-6" /></button>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-6 mt-2">Détails de la demande</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Entité / Client</span><p className="font-bold text-white text-base md:text-lg">{selectedBooking.entity} <span className="text-[9px] bg-white/10 px-2 py-1 rounded ml-2">{selectedBooking.clientType}</span></p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Email & Téléphone</span><p className="font-bold text-white text-xs md:text-sm">{selectedBooking.email}<br/>{selectedBooking.phone}</p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Service Choisi</span><p className="font-bold text-[var(--red)]">{selectedBooking.serviceId}</p></div>
                <div><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Budget Alloué</span><p className="font-bold text-emerald-400 italic">{selectedBooking.budget}</p></div>
                <div className="md:col-span-2"><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Délai d'intervention</span><p className="font-bold text-white/80">{selectedBooking.timeframe}</p></div>
                <div className="md:col-span-2"><span className="text-white/40 font-black text-[10px] uppercase tracking-widest block mb-1">Description Technique</span><p className="p-4 bg-white/5 rounded-2xl text-white/80 whitespace-pre-line text-xs md:text-sm leading-relaxed">{selectedBooking.description}</p></div>
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

        {/* PIN Change Modal */}
        {showPinChangeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isChangingPin && setShowPinChangeModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#111111] border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden"
            >
              <AuraGradient color="var(--red)" className="top-0 right-0 w-64 h-64 opacity-10" />
              <button disabled={isChangingPin} onClick={() => setShowPinChangeModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Code PIN Admin</h3>
                <p className="text-xs font-medium text-white/40 leading-relaxed">
                  Modifiez votre code d'accès maître. (6 chiffres)
                </p>
              </div>

              <form onSubmit={handlePinChangeSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Ancien PIN</label>
                  <input 
                    type="password"
                    value={pinChangeForm.oldPin}
                    onChange={(e) => setPinChangeForm(prev => ({ ...prev, oldPin: e.target.value, error: "" }))}
                    placeholder="••••••"
                    maxLength={6}
                    required
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-2xl text-center text-lg font-black tracking-[1em] p-4 focus:border-emerald-500 outline-none placeholder:text-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Nouveau PIN</label>
                  <input 
                    type="password"
                    value={pinChangeForm.newPin}
                    onChange={(e) => setPinChangeForm(prev => ({ ...prev, newPin: e.target.value, error: "" }))}
                    placeholder="••••••"
                    maxLength={6}
                    required
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-2xl text-center text-lg font-black tracking-[1em] p-4 focus:border-emerald-500 outline-none placeholder:text-white/10"
                  />
                </div>
                
                <AnimatePresence>
                  {pinChangeForm.error && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                      {pinChangeForm.error}
                    </motion.p>
                  )}
                  {pinChangeForm.success && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center mt-2">
                      {pinChangeForm.success}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPin || pinChangeForm.newPin.length !== 6 || pinChangeForm.oldPin.length < 4} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-black font-black text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center">
                    {isChangingPin ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Confirmer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isChangingPassword && setShowPasswordChangeModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#111111] border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden"
            >
              <AuraGradient color="var(--red)" className="top-0 right-0 w-64 h-64 opacity-10" />
              <button disabled={isChangingPassword} onClick={() => setShowPasswordChangeModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Mot de passe</h3>
                <p className="text-xs font-medium text-white/40 leading-relaxed">
                  Modifiez les identifiants de connexion du compte Administrateur Principal.
                </p>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Ancien Mot de Passe</label>
                  <input 
                    type="password"
                    value={passwordChangeForm.oldPassword}
                    onChange={(e) => setPasswordChangeForm(prev => ({ ...prev, oldPassword: e.target.value, error: "" }))}
                    placeholder="Saisissez l'ancien mot de passe"
                    required
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-2xl text-sm font-bold p-4 focus:border-amber-500 outline-none placeholder:text-white/10 placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Nouveau Mot de Passe</label>
                  <input 
                    type="password"
                    value={passwordChangeForm.newPassword}
                    onChange={(e) => setPasswordChangeForm(prev => ({ ...prev, newPassword: e.target.value, error: "" }))}
                    placeholder="Saisissez le nouveau mot de passe"
                    required
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-2xl text-sm font-bold p-4 focus:border-amber-500 outline-none placeholder:text-white/10 placeholder:font-normal"
                  />
                </div>
                
                <AnimatePresence>
                  {passwordChangeForm.error && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                      {passwordChangeForm.error}
                    </motion.p>
                  )}
                  {passwordChangeForm.success && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center mt-2">
                      {passwordChangeForm.success}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPassword || !passwordChangeForm.newPassword || !passwordChangeForm.oldPassword} className="w-full py-4 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center">
                    {isChangingPassword ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Mettre à jour"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
