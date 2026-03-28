"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, FileText, BarChart, Bell, Search, AlertTriangle, Clock, CheckCircle, Shield, Mail, LogOut, Eye, EyeOff, Trash2, Edit3, X, ArrowRight, Phone, Star, Lock, Key, ShieldAlert, Activity, Settings, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getServices, getBookings, getUsers, getMessages, getReviews, updateBookingStatus, updateMessageStatus, updateService, deleteBooking, deleteService, createService, deleteReview, deleteUserDoc, getUserById, setUserPin, markAllReviewsAsRead } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const STATUS_MAP = {
  fr: {
    PENDING:   { label: "En attente", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    ACTIVE:    { label: "En cours",   cls: "bg-blue-50 text-blue-600 border-blue-100" },
    COMPLETED: { label: "Terminé",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    REJECTED:  { label: "Rejeté",     cls: "bg-red-50 text-red-600 border-red-100" },
    UNREAD:    { label: "Non lu",     cls: "bg-red-50 text-red-600 border-red-100" },
    READ:      { label: "Lu",         cls: "bg-slate-50 text-slate-500 border-slate-100" },
    REPLIED:   { label: "Répondu",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" }
  },
  en: {
    PENDING:   { label: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    ACTIVE:    { label: "Active",   cls: "bg-blue-50 text-blue-600 border-blue-100" },
    COMPLETED: { label: "Completed",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    REJECTED:  { label: "Rejected",     cls: "bg-red-50 text-red-600 border-red-100" },
    UNREAD:    { label: "Unread",     cls: "bg-red-50 text-red-600 border-red-100" },
    READ:      { label: "Read",         cls: "bg-slate-50 text-slate-500 border-slate-100" },
    REPLIED:   { label: "Replied",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" }
  }
};

export default function AdminDashboard() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState<{ requests: any[], clients: any[], services: any[], messages: any[], reviews: any[] }>({ 
    requests: [], 
    clients: [], 
    services: [], 
    messages: [], 
    reviews: [] 
  });
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

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
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [passwordChangeForm, setPasswordChangeForm] = useState({ oldPassword: "", newPassword: "", error: "", success: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: "", email: "", currentPassword: "", error: "", success: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const friendlyFirebaseError = (code: string | undefined, fallback?: string): string => {
    const map: Record<string, string> = {
      "auth/wrong-password": "Mot de passe actuel incorrect.",
      "auth/invalid-credential": "Identifiants incorrects. Veuillez réessayer.",
      "auth/requires-recent-login": "Session expirée. Déconnectez-vous et reconnectez-vous.",
    };
    return map[code || ""] || fallback || "Une erreur inattendue s'est produite.";
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/account"); return; }
      if (role !== "ADMIN") { router.push("/dashboard"); return; }

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
      const [reqs, clis, srvs, msgs, revs] = await Promise.all([
        getBookings(), getUsers(), getServices(), getMessages(), getReviews()
      ]);

      const userMap: Record<string, { email?: string; displayName?: string }> = {};
      clis.forEach((u: any) => {
        userMap[u.id] = { email: u.email, displayName: u.displayName };
      });

      const enrichedReqs = reqs.map((req: any) => {
        const fresh = req.userId ? userMap[req.userId] : null;
        return {
          ...req,
          email: fresh?.email || req.email,
          clientName: fresh?.displayName || req.entity,
        };
      });

      const enrichedRevs = revs.map((rev: any) => {
        const fresh = rev.userId ? userMap[rev.userId] : null;
        return {
          ...rev,
          authorName: fresh?.displayName || rev.authorName,
        };
      });

      setData({ requests: enrichedReqs, clients: clis, services: srvs, messages: msgs, reviews: enrichedRevs });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (activeTab === "reviews") {
      markAllReviewsAsRead().then(() => {
        setData(prev => ({
          ...prev,
          reviews: prev.reviews.map(r => ({ ...r, isRead: true }))
        }));
      });
    }
  }, [activeTab]);

  // Emergency PIN recovery (250243)
  useEffect(() => {
    if (user && role === "ADMIN") {
      const recoveryDone = localStorage.getItem("admin_pin_recovery_250243_v2");
      if (!recoveryDone) {
        hashPin("250243").then((hashed) => {
          return setUserPin(user.uid, hashed);
        }).then(() => {
          localStorage.setItem("admin_pin_recovery_250243_v2", "true");
        });
      }
    }
  }, [user, role]);

  // Auto-logout after 30 minutes
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.removeItem("admin_pin_verified");
        logoutUser().then(() => router.push("/account"));
      }, 30 * 60 * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    reset();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [router]);

  const handleLogout = async () => {
    if (!window.confirm(language === "fr" ? "Fermer la session ?" : "Logout?")) return;
    sessionStorage.removeItem("admin_pin_verified");
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
    if (confirm(language === "fr" ? "Supprimer ?" : "Delete?")) {
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
    if (confirm("Supprimer ce service ?")) {
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
      if (!userData) throw new Error("Server error.");
      const lastChange = userData.lastPinChange || 0;
      if (Date.now() - lastChange < 86400000 && lastChange !== 0) throw new Error("Limited to 1 change per 24h.");

      const oldHashed = await hashPin(pinChangeForm.oldPin);
      if (oldHashed !== userData.pin) throw new Error("Incorrect old PIN.");
      if (pinChangeForm.newPin.length !== 6) throw new Error("Must be 6 digits.");

      const newHashed = await hashPin(pinChangeForm.newPin);
      await setUserPin(user.uid, newHashed);
      setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "PIN Updated!" });
      setTimeout(() => setShowPinChangeModal(false), 2000);
    } catch (err: any) {
      setPinChangeForm(p => ({ ...p, error: err.message }));
    } finally {
      setIsChangingPin(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    setPasswordChangeForm(p => ({ ...p, error: "", success: "" }));
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordChangeForm.oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordChangeForm.newPassword);
      setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "Password Updated!" });
      setTimeout(() => setShowPasswordChangeModal(false), 2000);
    } catch (err: any) {
      setPasswordChangeForm(p => ({ ...p, error: friendlyFirebaseError(err.code, err.message) }));
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
      if (profileForm.name !== user.displayName) {
        await fbUpdateProfile(user, { displayName: profileForm.name });
        await updateUserDoc(user.uid, { displayName: profileForm.name });
      }
      if (profileForm.email !== user.email) {
        await fbUpdateEmail(user, profileForm.email);
        await updateUserDoc(user.uid, { email: profileForm.email });
      }
      setProfileForm(p => ({ ...p, success: "Profile Updated!" }));
    } catch (err: any) {
      setProfileForm(p => ({ ...p, error: err.message }));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm(language === "fr" ? "Supprimer ?" : "Delete?")) {
      await deleteReview(id);
      fetchData();
    }
  };

  const handleDeleteClient = async (uid: string) => {
    if (confirm(language === "fr" ? "Supprimer ?" : "Delete?")) {
      await deleteUserDoc(uid);
      fetchData();
    }
  };

  if (authLoading || role !== "ADMIN" || checkingPin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Activity className="w-12 h-12 text-[var(--red)] animate-spin" />
      </div>
    );
  }

  if (!isPinVerified) {
    const handlePinSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || pinInput.length < 4) return;
      const { canAttemptPin, trackPinFailure, resetPinAttempts } = await import("@/lib/firebase/db");
      if (!canAttemptPin(user.uid)) { setPinError(true); return; }
      const hashed = await hashPin(pinInput);
      const userData = await getUserById(user.uid);
      if (userData?.pin === hashed) {
        resetPinAttempts(user.uid);
        setIsPinVerified(true);
        sessionStorage.setItem("admin_pin_verified", "true");
        fetchData();
      } else {
        trackPinFailure(user.uid);
        setPinError(true);
        setPinInput("");
      }
    };

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 spatial-bg relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[1000px] h-[1000px] opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
          <div className="card-spatial p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-[2rem] bg-[var(--red-light)] text-[var(--red)] flex items-center justify-center mb-8 border border-red-100 shadow-spatial-sm">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="display-sm mb-4">Admin Auth</h1>
            <p className="text-body-sm mb-12">Restricted Area. Enter Master PIN.</p>
            <form onSubmit={handlePinSubmit} className="w-full space-y-8">
              <input type="password" value={pinInput} onChange={e => {setPinInput(e.target.value); setPinError(false);}} maxLength={6} autoFocus className={`form-input-spatial text-center text-4xl font-black tracking-[1em] ${pinError ? "border-red-500" : ""}`} />
              <motion.button type="submit" className="btn-premium btn-premium-red w-full py-6">Authorize</motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const langKey = (language === "fr" || language === "en") ? language : "fr";
  const pendingReqsCount = data.requests.filter(r => r.status === "PENDING").length;
  const unreadMsgsCount = data.messages.filter(m => m.status === "UNREAD").length;
  const unreadReviewsCount = (data.reviews || []).filter(r => r.isRead === false).length;
  const totalNotifications = pendingReqsCount + unreadMsgsCount + unreadReviewsCount;

  const NAV = [
    { id: "requests", label: t.admin.nav.requests, icon: Briefcase, badge: pendingReqsCount },
    { id: "clients", label: t.admin.nav.clients, icon: Users },
    { id: "messages", label: t.admin.nav.messages, icon: Mail, badge: unreadMsgsCount },
    { id: "reviews", label: t.admin.nav.testimonials, icon: Star, badge: unreadReviewsCount },
    { id: "services", label: t.admin.nav.catalog, icon: Database },
    { id: "profile", label: t.admin.nav.settings, icon: Settings },
  ];

  const STATS = [
    { label: "Pending Requests", val: pendingReqsCount, icon: Clock, color: "text-amber-500" },
    { label: "Active Nodes", val: data.requests.filter(r => r.status === "ACTIVE").length, icon: Activity, color: "text-blue-500" },
    { label: "Live Reviews", val: data.reviews.length, icon: Star, color: "text-emerald-500" },
    { label: "VIP Clients", val: data.clients.length, icon: Users, color: "text-[var(--red)]" }
  ];

  return (
    <div className="min-h-screen bg-white spatial-bg flex flex-col md:flex-row overflow-x-hidden pb-24 md:pb-0">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[800px] h-[800px] opacity-[0.03]" />

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-[var(--border)] p-4 flex items-center justify-around shadow-spatial-lg">
         {NAV.map(item => (
           <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? "text-[var(--red)] scale-110" : "text-[var(--muted)]"}`}>
             <item.icon className="w-5 h-5" />
             <span className="text-[8px] font-black uppercase tracking-widest">{item.id.slice(0, 3)}</span>
           </button>
         ))}
         <button onClick={handleLogout} className="text-red-500"><LogOut className="w-5 h-5" /></button>
      </div>

      <aside className="w-80 bg-white border-r border-[var(--border)] hidden md:flex flex-col p-8 z-50">
        <div className="mb-20">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
             <div className="w-12 h-12 rounded-2xl bg-[var(--charcoal)] text-white flex items-center justify-center font-black">SA</div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Super Admin</p>
                <p className="text-xs font-bold text-emerald-600">Active Console</p>
             </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-[var(--charcoal)] text-white shadow-spatial-md" : "text-[var(--slate)] hover:bg-slate-50 hover:text-[var(--charcoal)]"}`}>
              <span className="flex items-center gap-4"><item.icon className="w-4 h-4" />{item.label}</span>
              {(item.badge ?? 0) > 0 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${activeTab === item.id ? 'bg-[var(--red)] text-white' : 'bg-slate-100 text-[var(--slate)]'}`}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"><LogOut className="w-4 h-4" /> Exit Console</button>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative z-10 overflow-y-auto custom-scrollbar">
        <header className="h-24 bg-white/70 backdrop-blur-3xl border-b border-[var(--border)] px-12 flex items-center justify-between sticky top-0 z-40">
           <h2 className="display-sm !text-2xl italic tracking-tight">{activeTab.toUpperCase()} / DB_CONSOLE</h2>
           <div className="flex items-center gap-6">
              <button onClick={() => fetchData()} className="p-3 rounded-full border border-[var(--border)] hover:bg-slate-50 transition-colors"><Clock className="w-4 h-4 text-[var(--slate)]" /></button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 rounded-full border border-[var(--border)] hover:bg-slate-50 relative transition-colors"><Bell className="w-4 h-4 text-[var(--slate)]" />{totalNotifications > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-white" />}</button>
              <div className="h-10 w-px bg-[var(--border)]" />
              <div className="w-10 h-10 rounded-full bg-[var(--red)] text-white flex items-center justify-center font-black shadow-spatial-sm">SA</div>
           </div>
        </header>

        <div className="p-6 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
            {STATS.map(stat => (
              <div key={stat.label} className="card-spatial p-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity duration-700"><stat.icon className={`w-12 h-12 ${stat.color}`} /></div>
                <p className="label text-[var(--muted)] mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</h3>
                   <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "60%" }} className={`h-full ${stat.color.replace('text-', 'bg-')}`} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-spatial overflow-hidden bg-white/40">
             <div className="p-10 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="display-sm !text-xl italic">Core Records</h3>
                {activeTab === 'services' && <button onClick={() => setNewServiceModal(true)} className="btn-premium btn-premium-red !px-6 !py-3 !text-[10px]">Add Entry</button>}
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-[var(--border)]">
                         {activeTab === 'requests' && ["ID", "Client", "Service", "Budget", "Status", "Actions"].map(h => <th key={h} className="p-6 label !text-[9px] text-[var(--muted)]">{h}</th>)}
                         {activeTab === 'clients' && ["UID", "Identity", "Email", "Role", "Created", "Actions"].map(h => <th key={h} className="p-6 label !text-[9px] text-[var(--muted)]">{h}</th>)}
                         {activeTab === 'messages' && ["Date", "Name", "Subject", "Status", "Actions"].map(h => <th key={h} className="p-6 label !text-[9px] text-[var(--muted)]">{h}</th>)}
                         {activeTab === 'services' && ["Service Title", "Category", "Price", "Actions"].map(h => <th key={h} className="p-6 label !text-[9px] text-[var(--muted)]">{h}</th>)}
                         {activeTab === 'reviews' && ["Date", "Author", "Rating", "Status", "Actions"].map(h => <th key={h} className="p-6 label !text-[9px] text-[var(--muted)]">{h}</th>)}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {loading ? (<tr><td colSpan={6} className="p-20 text-center"><Activity className="w-8 h-8 text-[var(--red)] animate-spin mx-auto" /></td></tr>) : (
                        <>
                          {activeTab === 'requests' && data.requests.map(req => {
                             const status = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                             return (
                               <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-6 font-mono text-[10px] text-[var(--red)]">#{req.id.slice(0, 8)}</td>
                                  <td className="p-6 font-bold text-sm">{req.clientName || req.entity}</td>
                                  <td className="p-6 text-xs font-medium">{req.serviceId}</td>
                                  <td className="p-6 font-black italic">{req.budget}</td>
                                  <td className="p-6">
                                    <select value={req.status} onChange={(e) => attemptStatusChange(req.id, e.target.value)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border appearance-none cursor-pointer outline-none ${status.cls}`}>
                                       <option value="PENDING">PENDING</option>
                                       <option value="ACTIVE">ACTIVE</option>
                                       <option value="COMPLETED">COMPLETED</option>
                                       <option value="REJECTED">REJECTED</option>
                                    </select>
                                  </td>
                                  <td className="p-6 flex gap-2">
                                     <button onClick={() => setSelectedBooking(req)} className="p-2 rounded-lg bg-slate-100 hover:bg-[var(--charcoal)] hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                                     <button onClick={() => handleDeleteBooking(req.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </td>
                               </tr>
                             );
                          })}
                          {activeTab === 'clients' && data.clients.map(cli => (
                            <tr key={cli.id} className="hover:bg-slate-50/50 transition-colors">
                               <td className="p-6 font-mono text-[9px] text-[var(--muted)]">{cli.uid.slice(0, 12)}...</td>
                               <td className="p-6 font-bold text-sm">{cli.displayName || "Anonymous"}</td>
                               <td className="p-6 text-xs text-[var(--red)] font-bold">{cli.email}</td>
                               <td className="p-6"><span className="label !text-[8px] px-3 py-1 bg-slate-100 rounded-full">{cli.role || "CLIENT"}</span></td>
                               <td className="p-6 text-[10px] font-black">{cli.createdAt ? new Date(cli.createdAt.seconds*1000).toLocaleDateString() : "N/A"}</td>
                               <td className="p-6">{cli.role !== 'ADMIN' && <button onClick={() => handleDeleteClient(cli.uid)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>}</td>
                            </tr>
                          ))}
                          {activeTab === 'messages' && data.messages.map(msg => {
                             const status = STATUS_MAP[langKey][msg.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].UNREAD;
                             return (
                               <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-6 text-[10px] font-black">{msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                                  <td className="p-6 font-bold text-sm">{msg.name}</td>
                                  <td className="p-6 text-xs font-medium max-w-[200px] truncate">{msg.subject}</td>
                                  <td className="p-6">
                                     <select value={msg.status} onChange={(e) => handleUpdateMessage(msg.id, e.target.value)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border appearance-none cursor-pointer outline-none ${status.cls}`}>
                                        <option value="UNREAD">UNREAD</option>
                                        <option value="READ">READ</option>
                                        <option value="REPLIED">REPLIED</option>
                                     </select>
                                  </td>
                                  <td className="p-6 flex gap-2">
                                     <button onClick={() => setSelectedMessage(msg)} className="p-2 rounded-lg bg-slate-100 hover:bg-[var(--charcoal)] hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                                  </td>
                               </tr>
                             );
                          })}
                          {activeTab === 'services' && data.services.map(srv => (
                            <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                               <td className="p-6 font-bold text-sm">{srv.title}</td>
                               <td className="p-6 label !text-[8px] uppercase">{srv.category || "IT"}</td>
                               <td className="p-6 font-black italic">{srv.priceCFA} CFA</td>
                               <td className="p-6 flex gap-2">
                                  <button onClick={() => setEditServiceModal(srv)} className="p-2 rounded-lg bg-slate-100 hover:bg-blue-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteService(srv.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                               </td>
                            </tr>
                          ))}
                          {activeTab === 'reviews' && data.reviews.map(rev => (
                             <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6 text-[10px] font-black">{rev.createdAt ? new Date(rev.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-6 font-bold text-sm">{rev.authorName}</td>
                                <td className="p-6">
                                   <div className="flex gap-1">{Array.from({length:5}).map((_,i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"}`} />)}</div>
                                </td>
                                <td className="p-6"><span className="label !text-[8px] px-3 py-1 bg-slate-100 rounded-full">{rev.isRead ? "LIVE" : "NEW"}</span></td>
                                <td className="p-6"><button onClick={() => handleDeleteReview(rev.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button></td>
                             </tr>
                          ))}
                          {activeTab === 'profile' && (
                            <tr><td colSpan={6} className="p-0">
                               <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white">
                                  <div className="space-y-8">
                                     <h3 className="display-sm !text-2xl italic">Master Protocol</h3>
                                     <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="space-y-4"><label className="label">Identity</label><input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="form-input-spatial" /></div>
                                        <div className="space-y-4"><label className="label">Primary Email</label><input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="form-input-spatial" /></div>
                                        <button className="btn-premium btn-premium-red">Update Core</button>
                                     </form>
                                  </div>
                                  <div className="space-y-8 border-l border-[var(--border)] pl-12">
                                     <h3 className="display-sm !text-2xl italic">Secure Rotation</h3>
                                     <div className="space-y-4">
                                        <button onClick={() => setShowPinChangeModal(true)} className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-emerald-50"><span className="label group-hover:text-emerald-600 transition-colors">Rotate PIN</span><Key className="w-5 h-5 text-emerald-600" /></button>
                                        <button onClick={() => setShowPasswordChangeModal(true)} className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-amber-50"><span className="label group-hover:text-amber-600 transition-colors">Rotate Password</span><ShieldAlert className="w-5 h-5 text-amber-500" /></button>
                                     </div>
                                  </div>
                               </div>
                            </td></tr>
                          )}
                        </>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
         {showPinChangeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-spatial p-12 bg-white max-w-md w-full">
                  <h3 className="display-sm !text-2xl mb-8 italic">PIN Rotation</h3>
                  <form onSubmit={handlePinChangeSubmit} className="space-y-8">
                     <div className="space-y-4"><label className="label">Old PIN</label><input type="password" value={pinChangeForm.oldPin} onChange={e => setPinChangeForm({...pinChangeForm, oldPin: e.target.value})} className="form-input-spatial text-center text-2xl tracking-[0.5em]" maxLength={6} /></div>
                     <div className="space-y-4"><label className="label">New 6-Digit PIN</label><input type="password" value={pinChangeForm.newPin} onChange={e => setPinChangeForm({...pinChangeForm, newPin: e.target.value})} className="form-input-spatial text-center text-2xl tracking-[0.5em]" maxLength={6} /></div>
                     <button type="submit" className="btn-premium btn-premium-red w-full">Confirm Rotation</button>
                     <button type="button" onClick={() => setShowPinChangeModal(false)} className="w-full text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Cancel</button>
                  </form>
               </motion.div>
            </div>
         )}
         {statusPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-spatial p-12 bg-white max-w-md w-full">
              <h2 className="display-sm !text-2xl mb-4 italic">Status Update</h2>
              <p className="text-xs text-[var(--slate)] mb-8">Changing status to <strong className="text-[var(--red)]">{statusPrompt.status}</strong>. Add a note for the client:</p>
              <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Technical note..." className="form-input-spatial h-32 mb-8 resize-none" />
              <div className="flex gap-4">
                <button onClick={() => setStatusPrompt(null)} className="flex-1 btn-premium btn-premium-outline">Cancel</button>
                <button onClick={confirmStatusChange} className="flex-1 btn-premium btn-premium-red">Save</button>
              </div>
            </motion.div>
          </div>
         )}
      </AnimatePresence>
    </div>
  );
}
