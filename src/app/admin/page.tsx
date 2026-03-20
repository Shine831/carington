"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, FileText, BarChart, Bell, Search, AlertTriangle, Clock, CheckCircle, Shield, Mail, LogOut, Eye, EyeOff, Trash2, Edit3, X, ArrowRight, Phone, Star, Lock, Key, ShieldAlert, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { getServices, getBookings, getUsers, getMessages, getReviews, updateBookingStatus, updateMessageStatus, updateService, deleteBooking, deleteService, createService, deleteReview, deleteUserDoc, BookingData, getUserById, setUserPin, markAllReviewsAsRead } from "@/lib/firebase/db";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ requests: any[], clients: any[], services: any[], messages: any[], reviews: any[] }>({ 
    requests: [], 
    clients: [], 
    services: [], 
    messages: [], 
    reviews: [] 
  });
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false); // Modals state

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Helper: translate Firebase error codes to friendly messages
  const friendlyFirebaseError = (code: string | undefined, fallback?: string): string => {
    const map: Record<string, string> = {
      "auth/wrong-password": "Mot de passe actuel incorrect.",
      "auth/invalid-credential": "Identifiants incorrects. Veuillez réessayer.",
      "auth/requires-recent-login": "Session expirée. Déconnectez-vous et reconnectez-vous pour effectuer cette action.",
      "auth/email-already-in-use": "Cet email est déjà utilisé par un autre compte.",
      "auth/invalid-email": "L'adresse email n'est pas valide.",
      "auth/operation-not-allowed": "Cette opération n'est pas autorisée. Contactez le support.",
      "auth/weak-password": "Le mot de passe est trop faible. Utilisez au moins 8 caractères.",
      "auth/network-request-failed": "Pas de connexion réseau. Vérifiez votre connexion internet.",
      "auth/too-many-requests": "Trop de tentatives. Veuillez patienter quelques minutes.",
      "auth/user-not-found": "Aucun compte trouvé pour cet email.",
      "auth/user-disabled": "Ce compte a été désactivé.",
    };
    return map[code || ""] || fallback || "Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

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
      const [reqs, clis, srvs, msgs, revs] = await Promise.all([
        getBookings(), getUsers(), getServices(), getMessages(), getReviews()
      ]);

      // Build a quick lookup map: uid → fresh user data (email, name)
      const userMap: Record<string, { email?: string; displayName?: string }> = {};
      clis.forEach((u: any) => {
        userMap[u.id] = { email: u.email, displayName: u.displayName };
      });

      // Enrich bookings: email from fresh user data, but keep original entity (company name)
      const enrichedReqs = reqs.map((req: any) => {
        const fresh = req.userId ? userMap[req.userId] : null;
        return {
          ...req,
          // Use fresh email but do NOT override entity (could be a company name, not personal name)
          email: fresh?.email || req.email,
          // Only update entity if it looks like a personal name (no company data stored)
          clientName: fresh?.displayName || req.entity,
        };
      });

      // Enrich reviews with latest authorName
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


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "reviews") {
      // Mark reviews as read in Firestore AND update local state immediately to clear badge
      // Note: we do NOT call fetchData() here to avoid badge flickering on re-fetch
      markAllReviewsAsRead().then(() => {
        setData(prev => ({
          ...prev,
          reviews: prev.reviews.map(r => ({ ...r, isRead: true }))
        }));
      });
    }
  }, [activeTab]);

  // Emergency PIN recovery for admin (requested: 250243)
  useEffect(() => {
    if (user && role === "ADMIN") {
      const recoveryDone = localStorage.getItem("admin_pin_recovery_250243_v2");
      if (!recoveryDone) {
        hashPin("250243").then((hashed) => {
          return setUserPin(user.uid, hashed);
        }).then(() => {
          localStorage.setItem("admin_pin_recovery_250243_v2", "true");
          // Note: no console.log here — sensitive operation
        });
      }
    }
  }, [user, role]);

  // Auto-logout after 30 minutes of admin inactivity
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.removeItem("admin_pin_verified");
        logoutUser().then(() => router.push("/account"));
      }, 30 * 60 * 1000); // 30 min
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
    const ok = window.confirm(
      language === "fr"
        ? "Fermer la session administrateur et vous déconnecter ?"
        : "Close admin session and log out?"
    );
    if (!ok) return;
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
    if (!user || !user.email) return;
    setPasswordChangeForm(p => ({ ...p, error: "", success: "" }));
    setIsChangingPassword(true);

    try {
      // Step 1: Re-authenticate with current password
      const credential = EmailAuthProvider.credential(user.email, passwordChangeForm.oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, passwordChangeForm.newPassword);
      setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "✓ Mot de passe mis à jour avec succès !" });
      
      setTimeout(() => {
        setShowPasswordChangeModal(false);
        setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "" });
      }, 3000);

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

      // 1. Update Display Name
      if (profileForm.name !== user.displayName) {
        await fbUpdateProfile(user, { displayName: profileForm.name });
        await updateUserDoc(user.uid, { displayName: profileForm.name });
      }

      // 2. Update Email
      if (profileForm.email !== user.email) {
        try {
          await fbUpdateEmail(user, profileForm.email);
          await updateUserDoc(user.uid, { email: profileForm.email });
        } catch (emailErr: any) {
          throw new Error(friendlyFirebaseError(emailErr.code, emailErr.message));
        }
      }

      setProfileForm(p => ({ ...p, success: "✓ Profil Administrateur mis à jour !" }));
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
      <div className="min-h-screen bg-[var(--off-white)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-red-100 bg-[var(--red-light)] mb-6 shadow-sm"><Shield className="w-6 h-6 text-[var(--red)] animate-pulse" /></div>
      </div>
    );
  }

  if (!isPinVerified) {
    const handlePinSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || pinInput.length < 4) return;
      
      // Brute-force protection
      const { canAttemptPin, trackPinFailure, resetPinAttempts } = await import("@/lib/firebase/db");
      if (!canAttemptPin(user.uid)) {
        setPinError(true);
        setPinInput("");
        return;
      }

      setPinError(false);
      const hashed = await hashPin(pinInput);
      
      if (!hasPinConfigured) {
        // Configuration
        await setUserPin(user.uid, hashed);
        resetPinAttempts(user.uid);
        setHasPinConfigured(true);
        setIsPinVerified(true);
        sessionStorage.setItem("admin_pin_verified", "true");
        fetchData();
      } else {
        // Verification
        const userData = await getUserById(user.uid);
        if (userData?.pin === hashed) {
          resetPinAttempts(user.uid);
          setIsPinVerified(true);
          sessionStorage.setItem("admin_pin_verified", "true");
          fetchData();
        } else {
          const remaining = trackPinFailure(user.uid);
          setPinError(true);
          setPinInput("");
          if (remaining <= 0) {
            // Force logout after lockout
            setTimeout(() => {
              sessionStorage.removeItem("admin_pin_verified");
              logoutUser().then(() => router.push("/account"));
            }, 2000);
          }
        }
      }
    };

    return (
      <div className="min-h-[100svh] bg-[var(--off-white)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[800px] h-[800px] opacity-[0.03]" />
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm relative z-10 zero-jank">
          <div className="bg-white/80 backdrop-blur-3xl border border-[var(--border)] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--red-light)] text-[var(--red)] flex items-center justify-center mb-6 border border-red-100 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[var(--charcoal)] tracking-tight mb-2">
              {hasPinConfigured ? "Accès Restreint" : "Initier Code Admin"}
            </h1>
            <p className="text-[var(--slate)] text-[11px] mb-8 leading-relaxed">
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
                  className={`w-full bg-[var(--off-white)] border ${pinError ? "border-red-500 text-red-500" : "border-[var(--border)] text-[var(--charcoal)] focus:border-[var(--red)]"} p-4 rounded-2xl text-center text-2xl font-black tracking-[1em] outline-none transition-all placeholder:text-[var(--muted)]/50 zero-jank`}
                />
                <AnimatePresence>
                  {pinError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-500 font-bold mt-3 uppercase tracking-widest zero-jank">
                      Code Incorrect
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={pinInput.length < 4}
                className="w-full py-4 bg-[var(--red)] rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(230,0,0,0.2)] disabled:opacity-50 zero-jank"
              >
                {hasPinConfigured ? "Déverrouiller" : "Enregistrer mon PIN"}
              </motion.button>
            </form>

            <button onClick={handleLogout} className="mt-8 text-[10px] text-[var(--muted)] hover:text-red-500 font-black uppercase tracking-widest transition-colors">
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
  const unreadReviewsCount = (data.reviews || []).filter(r => r.isRead === false).length;
  const totalNotifications = pendingReqsCount + unreadMsgsCount + unreadReviewsCount;

  const NAV = [
    { id: "requests", label: t.admin.nav.requests, icon: Briefcase },
    { id: "clients", label: t.admin.nav.clients, icon: Users },
    { id: "messages", label: t.admin.nav.messages, icon: Mail },
    { id: "reviews", label: t.admin.nav.testimonials, icon: Star, badge: (data.reviews || []).filter(r => r.isRead === false).length || 0 },
    { id: "services", label: t.admin.nav.catalog, icon: Search },
    { id: "profile", label: t.admin.nav.settings, icon: BarChart },
  ];

  const STATS = [
    { label: t.admin.stats.pending, val: data.requests.filter(r => r.status === "PENDING").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: t.admin.stats.active, val: data.requests.filter(r => r.status === "ACTIVE").length, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: t.admin.stats.completed, val: data.requests.filter(r => r.status === "COMPLETED").length, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: t.admin.stats.users, val: data.clients.length, icon: Users, color: "text-[var(--red)]", bg: "bg-[var(--red)]/10", border: "border-[var(--red)]/20" }
  ];

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-[100svh] bg-[var(--off-white)] flex pt-0 relative overflow-x-hidden text-[var(--charcoal)] font-sans pb-20 md:pb-0">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.03]" />

      {/* Sidebar (Desktop) */}
      <motion.aside className="w-64 xl:w-72 bg-white flex flex-col fixed top-0 bottom-0 left-0 z-40 hidden md:flex border-r border-slate-200 zero-jank shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[var(--red-light)] border border-red-100 flex items-center justify-center shadow-sm"><Shield className="w-5 h-5 text-[var(--red)]" /></div>
            <div>
              <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{t.admin.tag}</p>
              <p className="font-black text-[var(--charcoal)] text-sm tracking-tight"><span className="text-emerald-500">ACTIVE</span> SESSION</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 custom-scrollbar overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 zero-jank ${activeTab === id ? "bg-[var(--off-white)] text-[var(--red)] shadow-sm border border-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--charcoal)] hover:bg-[var(--off-white)]"}`}>
              <span className="flex items-center gap-4"><Icon className="w-4 h-4" />{label}</span>
              {badge && <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === id ? "bg-[var(--red)] text-white shadow-sm" : "bg-[var(--off-white)] border border-slate-200 text-[var(--muted)]"}`}>{badge}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-[var(--red)] hover:shadow-sm border border-transparent hover:border-red-100 rounded-xl transition-all zero-jank">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex items-center justify-between px-4 py-3 pb-safe md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-x-auto custom-scrollbar zero-jank">
        <div className="flex items-center gap-6 min-w-max mx-auto">
        {NAV.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1.5 p-2 transition-all relative zero-jank ${
              activeTab === id ? "text-[var(--red)] scale-110" : "text-[var(--muted)]"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
            {badge && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--red)] text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                {badge}
              </span>
            )}
            {activeTab === id && (
              <motion.div layoutId="activeTabMobile" className="absolute -bottom-1 w-6 h-0.5 bg-[var(--red)] rounded-full shadow-[0_2px_8px_rgba(230,0,0,0.4)]" />
            )}
          </button>
        ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1.5 p-2 text-[var(--muted)] hover:text-red-500 transition-colors zero-jank"
          >
            <LogOut className="w-5 h-5 text-red-500/80" />
            <span className="text-[7.5px] font-black uppercase tracking-widest">Sortie</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 xl:ml-72 flex flex-col min-h-[100svh] relative z-20">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-5 flex items-center justify-end sticky top-0 z-50 border-b border-slate-200 shadow-[0_5px_30px_rgba(0,0,0,0.02)] zero-jank">
          <div className="flex items-center gap-4 md:gap-6 relative">
            <button onClick={() => fetchData()} title="Actualiser les données" className="px-4 md:px-5 py-2.5 rounded-full bg-[var(--red-light)] border border-red-100 text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm focus:ring-4 ring-red-100 outline-none zero-jank">
               <Clock className="w-4 h-4" />
               <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button onClick={() => setShowPinChangeModal(true)} title="Modifier PIN Maître" className="relative text-emerald-600 hover:text-emerald-700 p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-all zero-jank">
              <Key className="w-5 h-5" />
            </button>

            <button onClick={() => setShowPasswordChangeModal(true)} title="Modifier Mot de Passe" className="relative text-amber-500 hover:text-amber-600 p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-all zero-jank">
              <ShieldAlert className="w-5 h-5" />
            </button>

            <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-[var(--slate)] hover:text-[var(--charcoal)] p-2.5 bg-[var(--off-white)] border border-slate-200 hover:border-slate-300 rounded-full transition-all zero-jank">
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-white shadow-sm" />}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-full right-0 sm:right-24 mt-2 w-[calc(100vw-2rem)] max-w-[360px] bg-white border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-3xl p-4 z-50 zero-jank">
                  <h4 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Centre de Notifications</h4>
                  {totalNotifications === 0 ? (
                    <p className="text-xs text-center text-[var(--muted)] py-4 font-bold">Aucune nouvelle notification.</p>
                  ) : (
                    <ul className="space-y-3">
                      {pendingReqsCount > 0 && (
                        <li onClick={() => { setActiveTab("requests"); setShowNotifications(false); }} className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-600 cursor-pointer hover:bg-amber-100 transition-all flex items-center gap-3 zero-jank"><AlertTriangle className="w-4 h-4" /> <strong>{pendingReqsCount}</strong> requêtes en attente</li>
                      )}
                      {unreadMsgsCount > 0 && (
                        <li onClick={() => { setActiveTab("messages"); setShowNotifications(false); }} className="p-3 bg-[var(--red-light)] border border-red-200 rounded-2xl text-xs font-bold text-[var(--red)] cursor-pointer hover:bg-red-100 transition-all flex items-center gap-3 zero-jank"><Mail className="w-4 h-4" /> <strong>{unreadMsgsCount}</strong> messages non lus</li>
                      )}
                      {unreadReviewsCount > 0 && (
                        <li onClick={() => { setActiveTab("reviews"); setShowNotifications(false); }} className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-600 cursor-pointer hover:bg-emerald-100 transition-all flex items-center gap-3 zero-jank"><Star className="w-4 h-4" /> <strong>{unreadReviewsCount}</strong> nouveaux témoignages</li>
                      )}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="text-[10px] font-black text-[var(--charcoal)] uppercase tracking-wider">Super Admin</p></div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[var(--red)] text-white flex items-center justify-center font-black text-xs md:text-sm border-2 border-white shadow-[0_5px_15px_rgba(230,0,0,0.3)]">SA</div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 flex-1 relative overflow-hidden z-10 w-full overflow-x-hidden">
          
          {/* Stats Bento */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {STATS.map(({ label, val, icon: Icon, color }) => (
              <StaggerItem key={label}>
                <div className="card p-5 md:p-8 bg-white border border-[var(--border)] relative h-full flex flex-col justify-between rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(230,0,0,0.05)] transition-all duration-300 zero-jank group">
                  <div className="relative z-10 mb-4">
                    <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.1em]">{label}</p>
                    <p className={`text-4xl md:text-5xl font-black ${color} tracking-tighter italic mt-1 drop-shadow-sm`}>{val}</p>
                  </div>
                  <div className={`absolute bottom-4 right-4 md:bottom-5 md:right-5 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border ${color.replace("text-", "bg-").replace("-500", "-50")} ${color.replace("text-", "border-").replace("-500", "-100")} shadow-sm group-hover:scale-110 transition-transform duration-300 zero-jank`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tables Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[var(--charcoal)] tracking-tight uppercase line-clamp-1">Base de données ({activeTab})</h2>
            </div>
            {activeTab === "services" && (
               <button onClick={() => setNewServiceModal(true)} className="btn btn-red px-6 py-3 text-[10px] uppercase font-black shadow-[var(--shadow-red)]">+ Ajouter Service</button>
            )}
          </div>
                   <div className="md:hidden space-y-6 mb-12">
            {activeTab === "requests" && data.requests.map((req) => {
              const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
              const accentColor = req.status === "PENDING" ? "bg-amber-500" : req.status === "ACTIVE" ? "bg-blue-500" : req.status === "COMPLETED" ? "bg-emerald-500" : "bg-[var(--red)]";
              
              return (
                <div key={req.id} className="relative group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md shadow-sm zero-jank">
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor} shadow-[0_0_15px_rgba(0,0,0,0.05)]`} />
                  
                  <div className="p-6 space-y-5">
                    <div className="flex justify-between items-start pl-2">
                       <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{req.createdAt ? new Date(req.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                        <h3 className="text-[var(--charcoal)] font-black text-xl tracking-tight leading-tight">{req.clientName || req.entity}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${mapObj.cls}`}>{mapObj.label}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--off-white)] rounded-2xl border border-slate-100 ml-2">
                      <div>
                        <p className="text-[9px] font-black uppercase text-[var(--muted)] tracking-widest mb-1">Service</p>
                        <p className="text-xs font-bold text-[var(--charcoal)] leading-tight">{req.serviceId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-[var(--muted)] tracking-widest mb-1">Budget</p>
                        <p className="text-sm font-black text-[var(--red)] italic">{req.budget}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pl-2">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[var(--red-light)] flex items-center justify-center border border-red-100"><Phone className="w-3.5 h-3.5 text-[var(--red)]" /></div>
                         <span className="text-sm font-bold text-[var(--slate)]">{req.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 pl-2">
                      <button onClick={() => setSelectedBooking(req)} className="flex-[1.5] py-4 bg-[var(--charcoal)] hover:bg-[#222] rounded-full text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 transition-all zero-jank">
                        <Eye className="w-4 h-4" /> Ouvrir
                      </button>
                      <div className="flex-1 relative">
                        <select 
                          value={req.status} 
                          onChange={(e) => attemptStatusChange(req.id, e.target.value)} 
                          className="w-full h-full py-4 bg-white border border-slate-200 text-[var(--charcoal)] rounded-full text-[10px] font-black uppercase tracking-widest px-4 focus:border-[var(--red)] outline-none appearance-none text-center shadow-sm zero-jank"
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
              const accentColor = msg.status === "UNREAD" ? "bg-[var(--red)]" : msg.status === "READ" ? "bg-[var(--slate)]" : "bg-emerald-500";

              return (
                <div key={msg.id} className="relative group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md shadow-sm zero-jank">
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor}`} />
                  <div className="p-6 space-y-5">
                    <div className="flex justify-between items-start pl-2">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                        <h3 className="text-[var(--charcoal)] font-black text-lg tracking-tight">{msg.name}</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${mapObj.cls}`}>{mapObj.label}</span>
                    </div>

                    <p className="text-xs text-[var(--slate)] font-bold px-4 py-3 bg-[var(--off-white)] rounded-2xl border border-slate-100 ml-2 leading-relaxed">
                      <span className="text-[var(--red)] block text-[10px] uppercase font-black mb-1">Sujet: {msg.subject}</span>
                      {msg.message}
                    </p>

                    <div className="flex gap-3 pt-2 pl-2">
                      <button onClick={() => setSelectedMessage(msg)} className="flex-[1.5] py-4 bg-[var(--red)] rounded-full text-white text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(230,0,0,0.15)] active:scale-95 transition-all zero-jank">
                        <Mail className="w-4 h-4" /> Lire Message
                      </button>
                      <button onClick={() => handleUpdateMessage(msg.id, "READ")} className="flex-1 py-4 bg-white border border-slate-200 text-[var(--charcoal)] hover:border-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm active:bg-slate-50 zero-jank">
                        Marquer Lu
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeTab === "clients" && data.clients.map((cli) => (
              <div key={cli.id} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md p-6 space-y-4 shadow-sm zero-jank">
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${cli.role === 'ADMIN' ? 'bg-[var(--red)]' : 'bg-blue-500'}`} />
                <div className="flex justify-between items-center pl-2">
                  <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{cli.createdAt ? new Date(cli.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</p>
                  <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${cli.role === 'ADMIN' ? 'bg-[var(--red-light)] text-[var(--red)] border-red-100' : 'bg-[var(--off-white)] text-[var(--slate)] border-[var(--border)]'}`}>{cli.role || "CLIENT"}</span>
                </div>
                <div className="pl-2">
                  <h3 className="text-[var(--charcoal)] font-black text-xl tracking-tight mb-1">{cli.displayName || "Client Sans Nom"}</h3>
                  <p className="text-[var(--red)] text-xs font-bold tracking-widest">{cli.email}</p>
                </div>
                <div className="pl-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                   <p className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">UID: {cli.uid.substring(0, 10)}...</p>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-[var(--off-white)] border border-[var(--border)] flex items-center justify-center shadow-sm"><Users className="w-4 h-4 text-[var(--slate)]" /></div>
                     {cli.role !== 'ADMIN' && (
                       <button onClick={() => handleDeleteClient(cli.uid)} className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-[var(--red)] text-[var(--red)] hover:text-white transition-colors shadow-sm zero-jank" title="Supprimer Client">
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            ))}

            {activeTab === "services" && data.services.map((srv) => (
              <div key={srv.id} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md p-6 space-y-5 shadow-sm zero-jank">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                <div className="flex justify-between items-start pl-2">
                   <span className="px-3 py-1.5 rounded-full bg-[var(--off-white)] text-[var(--slate)] text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">{srv.category || "General"}</span>
                   <span className="text-lg font-black text-emerald-600 italic tracking-tighter drop-shadow-sm">{srv.priceCFA} CFA</span>
                </div>
                <div className="pl-2">
                  <h3 className="text-[var(--charcoal)] font-black text-xl tracking-tight mb-2 uppercase leading-tight group-hover:text-[var(--red)] transition-colors">{srv.title}</h3>
                  <p className="text-[var(--slate)] text-xs leading-relaxed line-clamp-3 font-medium bg-[var(--off-white)] p-4 rounded-2xl border border-slate-100">{srv.description}</p>
                </div>
                <div className="flex gap-3 pl-2">
                  <button onClick={() => setEditServiceModal(srv)} className="flex-1 py-4 bg-[var(--charcoal)] rounded-full text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95 transition-all zero-jank">
                    <Edit3 className="w-4 h-4" /> Editer
                  </button>
                  <button onClick={() => handleDeleteService(srv.id)} className="flex-1 py-4 bg-red-50 hover:bg-red-100 text-[var(--red)] rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-all shadow-sm zero-jank">
                    <Trash2 className="w-4 h-4" /> Suppr
                  </button>
                </div>
              </div>
            ))}

            {activeTab === "reviews" && data.reviews.map((rev) => (
              <div key={rev.id} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md p-6 space-y-4 shadow-sm zero-jank">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-yellow-400" />
                <div className="flex justify-between items-start pl-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase">{rev.createdAt ? new Date(rev.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="pl-2">
                  <p className="text-[var(--slate)] text-sm italic line-clamp-3">"{rev.comment}"</p>
                  <p className="text-[10px] font-black uppercase text-amber-500 mt-2">{rev.authorName || "Client"} • {rev.serviceId || "Général"}</p>
                </div>
                <div className="flex gap-3 pl-2 pt-2 border-t border-slate-100">
                  <button onClick={() => handleDeleteReview(rev.id)} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-[var(--red)] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-all zero-jank">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            ))}

            {["requests", "clients", "messages", "services", "reviews"].includes(activeTab) &&
              (data[activeTab as keyof typeof data] as unknown[])?.length === 0 && (
              <div className="py-24 text-center rounded-[2.5rem] border border-dashed border-[var(--border)] bg-white backdrop-blur-xl shadow-sm zero-jank">
                <div className="w-16 h-16 rounded-full bg-[var(--off-white)] flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-[var(--slate)]" /></div>
                <p className="text-[var(--muted)] font-black uppercase tracking-[0.2em] text-xs">Aucune donnée détectée</p>
              </div>
            )}


          </div>

          <div className="bg-white rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative group/table hidden md:block zero-jank">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-[var(--muted)] md:hidden pointer-events-none group-hover/table:opacity-0 transition-opacity">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] vertical-text">Scroll</span>
              <ArrowRight className="w-3 h-3 rotate-0" />
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                
                {activeTab === "requests" && (
                  <>
                    <thead>
                      <tr className="bg-[var(--off-white)] border-b border-slate-200">{["Date", "Client", "Service / Délai", "Devis", "Statut", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-[var(--muted)]">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.requests.length === 0 ? (<tr><td colSpan={6} className="text-center py-20 text-[var(--muted)] font-bold">Aucune requête.</td></tr>) : data.requests.map((req) => {
                        const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                        return (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors group zero-jank">
                            <td className="py-5 px-6 font-mono text-[10px] text-[var(--muted)]">{req.createdAt ? new Date(req.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-5 px-6 font-black text-[var(--charcoal)] tracking-tight">{req.clientName || req.entity} <br/><span className="text-[var(--red)] text-[9px] font-bold tracking-widest">{req.phone}</span></td>
                            <td className="py-5 px-6 font-bold text-[var(--slate)]">{req.serviceId} <br/><span className="text-[9px] text-[var(--muted)] uppercase tracking-widest">{req.timeframe}</span></td>
                            <td className="py-5 px-6 font-black text-[var(--charcoal)] text-base">{req.budget}</td>
                            <td className="py-5 px-6"><span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${mapObj.cls}`}>{mapObj.label}</span></td>
                            <td className="py-5 px-6 flex items-center gap-2">
                              <select value={req.status} onChange={(e) => attemptStatusChange(req.id, e.target.value)} className="bg-white border border-slate-200 text-[var(--charcoal)] rounded-full text-[10px] p-2.5 px-4 font-bold uppercase cursor-pointer hover:border-slate-300 focus:border-[var(--red)] focus:outline-none focus:ring-2 ring-red-100 transition-all shadow-sm zero-jank">
                                <option value="PENDING" className="bg-white text-[var(--charcoal)]">PENDING</option>
                                <option value="ACTIVE" className="bg-white text-[var(--charcoal)]">ACTIVE</option>
                                <option value="COMPLETED" className="bg-white text-[var(--charcoal)]">COMPLETED</option>
                                <option value="REJECTED" className="bg-white text-[var(--charcoal)]">REJECTED</option>
                              </select>
                              <button onClick={() => setSelectedBooking(req)} className="p-2.5 bg-slate-100 rounded-full hover:bg-slate-200 text-[var(--charcoal)] transition-colors zero-jank" title="Voir détails"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteBooking(req.id)} className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors zero-jank" title="Supprimer définitivement"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {activeTab === "messages" && (
                  <>
                    <thead><tr className="bg-[var(--off-white)] border-b border-slate-200">{["Date", "Nom", "Email", "Sujet", "Statut", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-[var(--muted)]">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.messages.length === 0 ? (<tr><td colSpan={6} className="text-center py-20 text-[var(--muted)] font-bold">Aucun message.</td></tr>) : data.messages.map((msg) => {
                         const mapObj = STATUS_MAP[langKey][msg.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].UNREAD;
                         return (
                          <tr key={msg.id} className="hover:bg-slate-50 transition-colors group zero-jank">
                            <td className="py-5 px-6 font-mono text-[10px] text-[var(--muted)]">{msg.createdAt ? new Date(msg.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-5 px-6 font-black text-[var(--charcoal)]">{msg.name}</td>
                            <td className="py-5 px-6 font-bold text-[var(--red)]">{msg.email}</td>
                            <td className="py-5 px-6 font-medium text-[var(--slate)] max-w-[200px] truncate" title={msg.message}>{msg.subject}: {msg.message}</td>
                            <td className="py-5 px-6"><span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${mapObj.cls}`}>{mapObj.label}</span></td>
                            <td className="py-5 px-6 flex items-center gap-2">
                              <select value={msg.status} onChange={(e) => handleUpdateMessage(msg.id, e.target.value)} className="bg-white border border-slate-200 text-[var(--charcoal)] rounded-full text-[10px] p-2.5 px-4 font-bold uppercase cursor-pointer hover:border-slate-300 focus:border-[var(--red)] focus:outline-none focus:ring-2 ring-red-100 transition-all shadow-sm zero-jank">
                                <option value="UNREAD" className="bg-white text-[var(--charcoal)]">UNREAD</option>
                                <option value="READ" className="bg-white text-[var(--charcoal)]">READ</option>
                                <option value="REPLIED" className="bg-white text-[var(--charcoal)]">REPLIED</option>
                              </select>
                              <button onClick={() => setSelectedMessage(msg)} className="p-2.5 bg-slate-100 rounded-full hover:bg-slate-200 text-[var(--charcoal)] transition-colors zero-jank" title="Voir détails"><Eye className="w-4 h-4" /></button>
                            </td>
                          </tr>
                         )
                      })}
                    </tbody>
                  </>
                )}

                {activeTab === "clients" && (
                  <>
                    <thead><tr className="bg-[var(--off-white)] border-b border-slate-200">{["Date", "Nom", "Email", "Rôle", "ID", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-[var(--muted)]">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.clients.length === 0 ? (<tr><td colSpan={6} className="text-center py-10 text-[var(--muted)] font-bold">Aucun client.</td></tr>) : data.clients.map((cli) => (
                        <tr key={cli.id} className="hover:bg-slate-50 transition-colors zero-jank">
                          <td className="py-4 px-6 font-mono text-[9px] text-[var(--muted)]">{cli.createdAt ? new Date(cli.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6 font-black text-[var(--charcoal)]">{cli.displayName || "N/A"}</td>
                          <td className="py-4 px-6 font-bold text-[var(--slate)]">{cli.email}</td>
                          <td className="py-4 px-6"><span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm ${cli.role === 'ADMIN' ? 'bg-[var(--red-light)] text-[var(--red)] border-red-100' : 'bg-white text-[var(--slate)] border-slate-200'}`}>{cli.role || "CLIENT"}</span></td>
                          <td className="py-4 px-6 font-mono text-[9px] text-[var(--muted)]">{cli.uid}</td>
                          <td className="py-4 px-6 text-[10px] font-black text-slate-400">
                            {cli.role === 'ADMIN' ? (
                              <span className="text-[var(--muted)]">Auth Firebase</span>
                            ) : (
                              <button onClick={() => handleDeleteClient(cli.uid)} className="flex items-center gap-2 p-2 bg-red-50 text-red-500 rounded-full hover:bg-[var(--red)] hover:text-white transition-colors zero-jank border border-red-100 shadow-sm">
                                <Trash2 className="w-3.5 h-3.5" /> Supprimer
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
                    <thead><tr className="bg-[var(--off-white)] border-b border-slate-200">{["Titre", "Catégorie", "Prix CFA", "Description", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-[var(--muted)]">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.services.length === 0 ? (<tr><td colSpan={5} className="text-center py-10 text-[var(--muted)] font-bold">Catalogue vide.</td></tr>) : data.services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50 transition-colors zero-jank">
                          <td className="py-4 px-6 font-black text-[var(--charcoal)]">{srv.title}</td>
                          <td className="py-4 px-6 font-bold text-[var(--muted)] text-[10px] uppercase">{srv.category || "IT"}</td>
                          <td className="py-4 px-6 font-black text-[var(--charcoal)]">{srv.priceCFA}</td>
                          <td className="py-4 px-6 font-medium text-[var(--slate)] text-xs max-w-xs">{srv.description}</td>
                          <td className="py-4 px-6 flex items-center gap-2">
                            <button onClick={() => setEditServiceModal(srv)} className="p-2.5 bg-slate-100 text-[var(--charcoal)] rounded-full hover:bg-slate-200 transition-colors zero-jank shadow-sm"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteService(srv.id)} className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-full hover:bg-[var(--red)] hover:text-white transition-colors zero-jank shadow-sm"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
                {activeTab === "reviews" && (
                  <>
                    <thead><tr className="bg-[var(--off-white)] border-b border-slate-200">{["Date", "Client & Service", "Note", "Commentaire", "Action"].map(h => <th key={h} className="py-5 px-6 font-black uppercase tracking-[0.2em] text-[10px] text-[var(--muted)]">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.reviews.length === 0 ? (<tr><td colSpan={5} className="text-center py-10 text-[var(--muted)] font-bold">Aucun témoignage.</td></tr>) : data.reviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50 transition-colors zero-jank">
                          <td className="py-4 px-6 font-mono text-[9px] text-[var(--muted)]">{rev.createdAt ? new Date(rev.createdAt.seconds*1000).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6"><p className="font-black text-[var(--charcoal)]">{rev.authorName || "Client"}</p><p className="text-[9px] text-[var(--muted)] uppercase tracking-widest">{rev.serviceId || "Général"}</p></td>
                          <td className="py-4 px-6">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-[var(--slate)] text-xs italic max-w-xs truncate">"{rev.comment}"</td>
                          <td className="py-4 px-6">
                            <button onClick={() => handleDeleteReview(rev.id)} className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-[var(--red)] hover:text-white transition-colors border border-red-100 shadow-sm zero-jank" title="Supprimer">
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 zero-jank">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Meta Side */}
                <div className="space-y-6">
                  <div className="p-8 bg-white border border-[var(--border)] rounded-[2.5rem] flex flex-col items-center text-center relative overflow-hidden shadow-sm zero-jank">
                    <AuraGradient color="var(--red)" className="top-0 left-0 w-32 h-32 opacity-[0.05]" />
                    <div className="w-24 h-24 rounded-full bg-[var(--red-light)] flex items-center justify-center text-3xl font-black text-[var(--red)] mb-6 shadow-sm border border-red-100 relative group cursor-pointer">
                      <div className="absolute inset-0 bg-[var(--red)] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      {(user?.displayName || "A")[0]}
                    </div>
                    <h3 className="text-2xl font-black text-[var(--charcoal)] tracking-tight">{user?.displayName || "Administrateur"}</h3>
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mt-2">Accès Super-Privilégié</p>
                    <div className="mt-8 pt-8 border-t border-slate-100 w-full space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">SÉCURISÉ</span>
                         <span className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">Opérations AES-256</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[var(--muted)] uppercase">Version Système</span>
                        <span className="text-[10px] font-bold text-[var(--slate)]">V2.4.0-STABLE</span>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[var(--muted)] uppercase">Dernier Login</span>
                          <span className="text-[10px] font-bold text-[var(--slate)]">Aujourd{"'"}hui</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-[var(--border)] rounded-[2rem] space-y-3 shadow-sm zero-jank">
                    <button onClick={() => setShowPinChangeModal(true)} className="w-full flex items-center justify-between p-4 bg-[var(--off-white)] hover:bg-slate-100 rounded-xl transition-all border border-slate-200 group zero-jank">
                      <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-[var(--charcoal)]"><Key className="w-4 h-4 text-emerald-600" /> Code PIN Maître</span>
                      <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                    </button>
                    <button onClick={() => setShowPasswordChangeModal(true)} className="w-full flex items-center justify-between p-4 bg-[var(--off-white)] hover:bg-slate-100 rounded-xl transition-all border border-slate-200 group zero-jank">
                      <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-[var(--charcoal)]"><ShieldAlert className="w-4 h-4 text-amber-500" /> Mot de Passe</span>
                      <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                    </button>
                  </div>
                </div>

                {/* Form Main */}
                <div className="lg:col-span-2">
                   <div className="p-8 md:p-10 bg-white border border-[var(--border)] rounded-[3rem] relative overflow-hidden h-full shadow-[0_10px_30px_rgba(0,0,0,0.02)] zero-jank">
                     <AuraGradient color="var(--red)" className="bottom-[-10%] right-[-10%] w-64 h-64 opacity-[0.03]" />
                     <h3 className="text-2xl font-black text-[var(--charcoal)] tracking-tighter mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100"><Edit3 className="w-5 h-5 text-emerald-600" /></div>
                        Informations Administrateur
                     </h3>

                     <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] pl-1">Nom d{"'"}affichage</label>
                             <input 
                               type="text" 
                               value={profileForm.name} 
                               onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                               className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] p-5 rounded-2xl text-sm font-bold focus:border-[var(--red)] focus:ring-4 ring-red-100 outline-none transition-all placeholder:text-[var(--muted)]/50 zero-jank shadow-sm"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] pl-1">Email Principal</label>
                             <input 
                               type="email" 
                               value={profileForm.email} 
                               onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                               className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] p-5 rounded-2xl text-sm font-bold focus:border-[var(--red)] focus:ring-4 ring-red-100 outline-none transition-all placeholder:text-[var(--muted)]/50 zero-jank shadow-sm"
                             />
                           </div>
                        </div>

                        <AnimatePresence>
                          {profileForm.error && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[10px] font-black text-red-500 uppercase tracking-widest zero-jank">{profileForm.error}</motion.p>}
                          {profileForm.success && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest zero-jank">{profileForm.success}</motion.p>}
                        </AnimatePresence>

                        <div className="pt-6">
                           <button 
                             type="submit" 
                             disabled={isUpdatingProfile}
                             className="px-10 py-5 bg-[var(--charcoal)] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3 zero-jank"
                           >
                             {isUpdatingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sauvegarder Configuration"}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl zero-jank">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[var(--border)] w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-[var(--muted)] hover:text-[var(--charcoal)] p-2 transition-colors"><X className="w-6 h-6" /></button>
              <h2 className="text-xl md:text-2xl font-black text-[var(--charcoal)] uppercase tracking-tighter mb-6 mt-2">Détails de la demande</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Entité / Client</span><p className="font-bold text-[var(--charcoal)] text-base md:text-lg">{(selectedBooking as any).clientName || (selectedBooking as any).entity} <span className="text-[9px] bg-slate-100 text-[var(--slate)] border border-slate-200 px-2 py-1 rounded-full ml-2 shadow-sm">{(selectedBooking as any).clientType}</span></p></div>
                <div><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Email & Téléphone</span><p className="font-bold text-[var(--charcoal)] text-xs md:text-sm">{(selectedBooking as any).email}<br/>{(selectedBooking as any).phone}</p></div>
                <div><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Service Choisi</span><p className="font-bold text-[var(--red)]">{(selectedBooking as any).serviceId}</p></div>
                <div><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Budget Alloué</span><p className="font-black text-emerald-600 italic">{(selectedBooking as any).budget}</p></div>
                <div className="md:col-span-2"><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Délai d{"'"}intervention</span><p className="font-bold text-[var(--charcoal)]">{(selectedBooking as any).timeframe}</p></div>
                <div className="md:col-span-2"><span className="text-[var(--muted)] font-black text-[10px] uppercase tracking-widest block mb-1">Description Technique</span><p className="p-5 bg-[var(--off-white)] border border-slate-100 rounded-2xl text-[var(--slate)] whitespace-pre-line text-xs md:text-sm leading-relaxed shadow-sm">{(selectedBooking as any).description}</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Message Details Modal */}
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl zero-jank">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--border)] w-full max-w-2xl relative shadow-2xl">
              <button onClick={() => setSelectedMessage(null)} className="absolute top-6 right-6 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"><X className="w-6 h-6" /></button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--red-light)] text-[var(--red)] border border-red-100 flex items-center justify-center shadow-sm"><Mail className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-black text-[var(--charcoal)] tracking-tight">{selectedMessage.subject}</h2>
                  <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{selectedMessage.createdAt ? new Date(selectedMessage.createdAt.seconds*1000).toLocaleString() : 'Date inconnue'}</p>
                </div>
              </div>
              
              <div className="bg-[var(--off-white)] border border-slate-200 shadow-sm rounded-3xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-black block mb-1">Expéditeur</span>
                    <strong className="text-[var(--charcoal)] block text-sm">{selectedMessage.name} <span className="font-normal text-[var(--red)] ml-2">{selectedMessage.email}</span></strong>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-black block mb-3">Corps du message</span>
                  <p className="text-[var(--slate)] leading-relaxed whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedMessage(null)} className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[var(--charcoal)] font-black uppercase text-[10px] tracking-widest transition-colors zero-jank">Fermer</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Change Status & Admin Note Modal */}
        {statusPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl zero-jank">
            <div className="bg-white p-8 rounded-[2rem] border border-[var(--border)] w-full max-w-md relative shadow-2xl">
              <h2 className="text-xl font-black text-[var(--charcoal)] uppercase tracking-tighter mb-4">{t.admin.modals.status_update}</h2>
              <p className="text-xs text-[var(--slate)] mb-6">Vous passez le statut à <strong className="text-[var(--red)]">{statusPrompt.status}</strong>. Laissez un commentaire visible par le client.</p>
              <textarea 
                value={adminNote} 
                onChange={(e) => setAdminNote(e.target.value)} 
                placeholder={t.admin.modals.admin_note + "..."} 
                className="w-full bg-[var(--off-white)] border border-slate-200 p-4 rounded-2xl text-sm text-[var(--charcoal)] focus:border-[var(--red)] focus:ring-4 ring-red-100 outline-none mb-6 h-32 resize-none transition-all shadow-sm" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setStatusPrompt(null)} className="px-5 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-[var(--charcoal)] transition-all zero-jank">{t.admin.modals.cancel}</button>
                <button onClick={confirmStatusChange} className="px-5 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest bg-[var(--red)] text-white hover:bg-red-600 transition-all shadow-[0_5px_15px_rgba(230,0,0,0.3)] zero-jank">{t.admin.modals.save}</button>
              </div>
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
                  <button type="submit" className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]">Mettre à jour</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* PIN Change Modal */}
        {/* PIN Change Modal */}
        {showPinChangeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isChangingPin && setShowPinChangeModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md zero-jank" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-[var(--border)] shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden zero-jank"
            >
              <AuraGradient color="emerald" className="top-0 right-0 w-64 h-64 opacity-[0.05]" />
              <button disabled={isChangingPin} onClick={() => { setShowPinChangeModal(false); setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "" }); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--off-white)] border border-slate-200 flex items-center justify-center text-[var(--muted)] hover:text-[var(--charcoal)] hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-[var(--charcoal)] tracking-tight mb-1">Code PIN Maître</h3>
                <p className="text-[11px] font-medium text-[var(--slate)] leading-relaxed">Saisissez votre ancien PIN puis le nouveau (6 chiffres).</p>
              </div>

              <form onSubmit={handlePinChangeSubmit} className="space-y-4 relative z-10">
                {/* Old PIN */}
                <div>
                  <label className="block text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-2">Ancien Code PIN</label>
                  <div className="relative">
                    <input 
                      type={showOldPin ? "text" : "password"}
                      value={pinChangeForm.oldPin}
                      onChange={(e) => setPinChangeForm(prev => ({ ...prev, oldPin: e.target.value, error: "" }))}
                      placeholder="••••••"
                      maxLength={6}
                      required
                      className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] rounded-2xl text-center text-lg font-black tracking-[0.5em] pr-12 p-4 focus:border-[var(--red)] focus:ring-4 ring-red-100 outline-none placeholder:text-[var(--muted)]/50 transition-all shadow-sm zero-jank"
                    />
                    <button type="button" onClick={() => setShowOldPin(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors">
                      {showOldPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* New PIN */}
                <div>
                  <label className="block text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-2">Nouveau Code PIN (6 chiffres)</label>
                  <div className="relative">
                    <input 
                      type={showNewPin ? "text" : "password"}
                      value={pinChangeForm.newPin}
                      onChange={(e) => setPinChangeForm(prev => ({ ...prev, newPin: e.target.value, error: "" }))}
                      placeholder="••••••"
                      maxLength={6}
                      required
                      className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] rounded-2xl text-center text-lg font-black tracking-[0.5em] pr-12 p-4 focus:border-[var(--red)] focus:ring-4 ring-red-100 outline-none placeholder:text-[var(--muted)]/50 transition-all shadow-sm zero-jank"
                    />
                    <button type="button" onClick={() => setShowNewPin(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors">
                      {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {pinChangeForm.error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl zero-jank">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-[11px] text-red-500 font-bold">{pinChangeForm.error}</p>
                    </motion.div>
                  )}
                  {pinChangeForm.success && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl zero-jank">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] text-emerald-600 font-bold">{pinChangeForm.success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPin || pinChangeForm.newPin.length !== 6 || pinChangeForm.oldPin.length < 4} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2 zero-jank">
                    {isChangingPin ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Key className="w-4 h-4" /> Confirmer le changement</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Password Change Modal */}
        {/* Password Change Modal */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isChangingPassword && setShowPasswordChangeModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md zero-jank" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-[var(--border)] shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden zero-jank"
            >
              <AuraGradient color="amber" className="top-0 right-0 w-64 h-64 opacity-[0.05]" />
              <button disabled={isChangingPassword} onClick={() => { setShowPasswordChangeModal(false); setPasswordChangeForm({ oldPassword: "", newPassword: "", error: "", success: "" }); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--off-white)] border border-slate-200 flex items-center justify-center text-[var(--muted)] hover:text-[var(--charcoal)] hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-[var(--charcoal)] tracking-tight mb-1">Changer le Mot de Passe</h3>
                <p className="text-[11px] font-medium text-[var(--slate)] leading-relaxed">Confirmez votre identité puis saisissez le nouveau mot de passe.</p>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 relative z-10">
                {/* Current Password */}
                <div>
                  <label className="block text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-2">Mot de passe actuel</label>
                  <div className="relative">
                    <input 
                      type={showOldPassword ? "text" : "password"}
                      value={passwordChangeForm.oldPassword}
                      onChange={(e) => setPasswordChangeForm(prev => ({ ...prev, oldPassword: e.target.value, error: "" }))}
                      placeholder="Votre mot de passe actuel"
                      required
                      className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] p-4 pr-12 rounded-2xl text-sm font-bold focus:border-amber-500 focus:ring-4 ring-amber-100 outline-none transition-all placeholder:text-[var(--muted)]/50 shadow-sm zero-jank"
                    />
                    <button type="button" onClick={() => setShowOldPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors">
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* New Password */}
                <div>
                  <label className="block text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-2">Nouveau mot de passe (min. 8 caractères)</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      value={passwordChangeForm.newPassword}
                      onChange={(e) => setPasswordChangeForm(prev => ({ ...prev, newPassword: e.target.value, error: "" }))}
                      placeholder="Nouveau mot de passe sécurisé"
                      minLength={8}
                      required
                      className="w-full bg-[var(--off-white)] border border-slate-200 text-[var(--charcoal)] p-4 pr-12 rounded-2xl text-sm font-bold focus:border-amber-500 focus:ring-4 ring-amber-100 outline-none transition-all placeholder:text-[var(--muted)]/50 shadow-sm zero-jank"
                    />
                    <button type="button" onClick={() => setShowNewPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {passwordChangeForm.error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl zero-jank">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-[11px] text-red-500 font-bold">{passwordChangeForm.error}</p>
                    </motion.div>
                  )}
                  {passwordChangeForm.success && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl zero-jank">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] text-emerald-600 font-bold">{passwordChangeForm.success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPassword || !passwordChangeForm.newPassword || !passwordChangeForm.oldPassword} className="w-full py-4 bg-amber-500 hover:bg-amber-400 rounded-xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(245,158,11,0.3)] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2 zero-jank">
                    {isChangingPassword ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShieldAlert className="w-4 h-4" /> Confirmer le changement</>}
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
