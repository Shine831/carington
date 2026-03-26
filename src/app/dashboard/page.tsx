"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight, LogOut, FileText, Star, X, MessageSquare, Lock, Key, Users, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/config";
import { updateProfile, verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from "firebase/auth";
import { updateUserDoc, updateReview, getReviewsByUserId, getBookings, setUserPin, getUserById, deleteBooking, createReview } from "@/lib/firebase/db";
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
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Client";

  const [checkingPin, setCheckingPin] = useState(true);
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  
  // Pin Change State
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  const [pinChangeForm, setPinChangeForm] = useState({ oldPin: "", newPin: "", error: "", success: "" });
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Profile State
  const [activeTab, setActiveTab] = useState<"projects" | "reviews" | "profile">("projects");
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", currentPassword: "", error: "", success: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // PIN visibility toggles
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  // Helper: translate Firebase error codes
  const friendlyFirebaseError = (code: string | undefined, fallback?: string): string => {
    const map: Record<string, string> = {
      "auth/wrong-password": "Mot de passe actuel incorrect.",
      "auth/invalid-credential": "Identifiants incorrects. Veuillez réessayer.",
      "auth/requires-recent-login": "Pour sécurité, déconnectez-vous et reconnectez-vous avant de changer l'email.",
      "auth/email-already-in-use": "Cet email est déjà utilisé par un autre compte.",
      "auth/invalid-email": "L'adresse email n'est pas valide.",
      "auth/weak-password": "Le mot de passe est trop faible. Utilisez au moins 8 caractères.",
      "auth/network-request-failed": "Pas de connexion réseau. Vérifiez votre connexion.",
      "auth/too-many-requests": "Trop de tentatives. Veuillez patienter quelques minutes.",
    };
    return map[code || ""] || fallback || "Une erreur s'est produite. Veuillez réessayer.";
  };

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account");
    }
  }, [user, authLoading, router]);

  const fetchUserBookings = () => {
    if (user) {
      getBookings(user.uid)
        .then((data: any) => setBookings(data))
        .catch((err: any) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  const fetchUserReviews = async () => {
    if (user) {
      const data = await getReviewsByUserId(user.uid);
      setUserReviews(data);
    }
  };

  useEffect(() => {
    if (user) {
      if (typeof window !== "undefined" && sessionStorage.getItem("client_pin_verified") === "true") {
        setIsPinVerified(true);
        setCheckingPin(false);
        fetchUserBookings();
        fetchUserReviews();
        return;
      }

      getUserById(user.uid).then(userData => {
        if (userData && userData.pin) {
          setHasPinConfigured(true);
        } else {
          setHasPinConfigured(false);
        }
        setProfileForm({ name: user.displayName || "", email: user.email || "", currentPassword: "", error: "", success: "" });
        setCheckingPin(false);
      });
      fetchUserBookings();
      fetchUserReviews();
    }
  }, [user]);

  async function hashPin(pin: string) {
    const enc = new TextEncoder().encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

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
      sessionStorage.setItem("client_pin_verified", "true");
    } else {
      // Verification
      const userData = await getUserById(user.uid);
      if (userData?.pin === hashed) {
        resetPinAttempts(user.uid);
        setIsPinVerified(true);
        sessionStorage.setItem("client_pin_verified", "true");
      } else {
        const remaining = trackPinFailure(user.uid);
        setPinError(true);
        setPinInput("");
        if (remaining <= 0) {
          setTimeout(() => {
            sessionStorage.removeItem("client_pin_verified");
            logoutUser().then(() => router.push("/account"));
          }, 2000);
        }
      }
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

      // Check the 24h delay (86400000 ms)
      const lastChange = userData.lastPinChange || 0;
      const timeSinceChange = Date.now() - lastChange;
      if (timeSinceChange < 86400000 && lastChange !== 0) {
        throw new Error("Vous ne pouvez modifier votre PIN qu'une fois toutes les 24 heures par mesure de sécurité.");
      }

      // Verify old PIN
      const oldHashed = await hashPin(pinChangeForm.oldPin);
      if (oldHashed !== userData.pin) {
        throw new Error("L'ancien PIN est incorrect.");
      }

      // Verify new PIN length
      if (pinChangeForm.newPin.length !== 4) {
        throw new Error("Le nouveau PIN doit comporter 4 chiffres.");
      }

      // Save new PIN
      const newHashed = await hashPin(pinChangeForm.newPin);
      await setUserPin(user.uid, newHashed);
      setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "Votre PIN a été modifié avec succès !" });
      
      // Auto close after 3s
      setTimeout(() => {
        setShowPinChangeModal(false);
        setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "" });
      }, 3000);

    } catch (err: any) {
      setPinChangeForm(p => ({ ...p, error: err.message || "Une erreur est survenue." }));
    } finally {
      setIsChangingPin(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (confirm(language === "fr" ? "Annuler cette demande ?" : "Cancel this request?")) {
      await deleteBooking(id);
      fetchUserBookings();
    }
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) return;
    if (confirm(language === "fr" ? "Recevoir un lien de réinitialisation par email ?" : "Receive a reset link by email?")) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert(language === "fr" ? "Un lien de réinitialisation a été envoyé à votre adresse email." : "A reset link has been sent to your email.");
      } catch (e: any) {
        alert("Erreur: " + e.message);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    setProfileForm(p => ({ ...p, error: "", success: "" }));

    try {
      const profileUpdates: { displayName?: string; email?: string } = {};

      // 1. Update Display Name if changed
      if (profileForm.name !== user.displayName) {
        await updateProfile(user, { displayName: profileForm.name });
        await updateUserDoc(user.uid, { displayName: profileForm.name });
        profileUpdates.displayName = profileForm.name;
      }

      // 2. Propagate changes to all related Firestore documents (reviews, bookings)
      if (Object.keys(profileUpdates).length > 0) {
        const { propagateProfileUpdate } = await import("@/lib/firebase/db");
        await propagateProfileUpdate(user.uid, profileUpdates);
      }

      // 3. Update Email if changed
      if (profileForm.email !== user.email) {
        try {
          await verifyBeforeUpdateEmail(user, profileForm.email);
          setProfileForm(p => ({
            ...p,
            success: language === "fr"
              ? "✉️ Un lien de vérification a été envoyé à " + profileForm.email + ". Cliquez dessus pour confirmer le changement."
              : "✉️ A verification link was sent to " + profileForm.email + ". Click it to confirm the change."
          }));
          return;
        } catch (emailErr: any) {
          throw new Error(friendlyFirebaseError(emailErr.code, emailErr.message));
        }
      }

      setProfileForm(p => ({ ...p, success: language === "fr" ? "✓ Profil mis à jour avec succès !" : "✓ Profile updated successfully!" }));
    } catch (err: any) {
      setProfileForm(p => ({ ...p, error: err.message }));
    } finally {
      setIsUpdatingProfile(false);
    }
  };


  const handleDeleteUserReview = async (id: string) => {
    if (confirm(language === "fr" ? "Supprimer ce témoignage ?" : "Delete this review?")) {
      const { deleteReview } = await import("@/lib/firebase/db");
      await deleteReview(id);
      fetchUserReviews();
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsSubmittingReview(true);
    try {
      await updateReview(editingReview.id, {
        rating: reviewRating,
        comment: reviewComment
      });
      setEditingReview(null);
      setReviewRating(0);
      setReviewComment("");
      fetchUserReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || reviewRating === 0) return;
    setIsSubmittingReview(true);
    try {
      await createReview(
        user.uid,                              // userId  = Firebase UID (ownership)
        user.displayName || "Client",          // authorName = display name for public view
        "Expérience Générale",                 // serviceId
        reviewRating,
        reviewComment
      );
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewComment("");
      fetchUserReviews();
      alert(language === "fr" ? "Merci pour votre témoignage !" : "Thank you for your review!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Loading Screen
  if (authLoading || !user || checkingPin) {
    return (
      <div className="min-h-[100svh] bg-[var(--off-white)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isPinVerified) {
    return (
      <div className="min-h-[100svh] bg-[var(--off-white)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[800px] h-[800px] opacity-[0.03]" />
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm relative z-10 zero-jank">
          <div className="bg-white/80 backdrop-blur-3xl border border-[var(--border)] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--red-light)] text-[var(--red)] flex items-center justify-center mb-6 border border-red-100 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[var(--charcoal)] tracking-tight mb-2">
              {hasPinConfigured ? t.dashboard.security.pin_verify_title : t.dashboard.security.pin_setup_title}
            </h1>
            <p className="text-[var(--slate)] text-[11px] mb-8 leading-relaxed font-medium">
              {hasPinConfigured 
                ? t.dashboard.security.pin_verify_desc 
                : t.dashboard.security.pin_setup_desc}
            </p>
            
            <form onSubmit={handlePinSubmit} className="w-full space-y-6">
              <div>
                <input 
                  type="password"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  placeholder={t.dashboard.security.pin_placeholder}
                  maxLength={4}
                  autoFocus
                  className={`w-full bg-[var(--off-white)] border ${pinError ? "border-red-500 text-red-500" : "border-[var(--border)] text-[var(--charcoal)] focus:border-[var(--red)]"} p-4 rounded-2xl text-center text-2xl font-black tracking-[1em] outline-none transition-all placeholder:text-[var(--muted)]/50 zero-jank`}
                />
                <AnimatePresence>
                  {pinError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-red-500 font-bold mt-3 uppercase tracking-widest zero-jank">
                      {t.dashboard.security.pin_error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={pinInput.length < 4}
                className="w-full py-4 bg-[var(--red)] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(230,0,0,0.2)] disabled:opacity-50 zero-jank"
              >
                {hasPinConfigured ? t.dashboard.security.pin_submit_verify : t.dashboard.security.pin_submit_setup}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const langKey = language as "fr" | "en";

  return (
    <div className="min-h-[100svh] pt-32 pb-40 bg-[var(--off-white)] text-[var(--charcoal)] relative overflow-hidden">
      {/* Background Ambience */}
      <AuraGradient color="var(--red)" className="top-0 right-0 w-[800px] h-[800px] opacity-[0.04]" />

      <div className="container-xl relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-[var(--border)] pb-10">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-8 bg-[var(--red)] rounded-full shadow-[0_0_15px_rgba(230,0,0,0.3)]" />
              <span className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.25em]">
                {t.dashboard.title}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-[var(--charcoal)] tracking-tighter mb-4 leading-tight">
              {t.dashboard.welcome} <span className="text-[var(--red)]">{firstName}.</span>
            </h1>
            <p className="text-sm font-medium text-[var(--slate)] max-w-lg leading-relaxed">
              {language === "fr" 
                ? "Ravi de vous revoir. Suivez l'avancement de vos projets en temps réel." 
                : "Glad to see you back. Track your project progress in real-time."}
            </p>
          </FadeUp>
          
          <FadeIn delay={0.3}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-[var(--border)] px-6 py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] zero-jank">
                <ShieldCheck className="w-5 h-5 text-[var(--red)]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--charcoal)] font-black uppercase tracking-[0.2em]">
                    {t.dashboard.secure}
                  </span>
                  <span className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">Connecté en AES-256</span>
                </div>
              </div>
          </div>
          </FadeIn>
        </div>

        {/* Tab Switcher (Spatial Glass) */}
        <div className="flex gap-3 p-1.5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 mb-16 w-fit mx-auto md:mx-0 shadow-xl zero-jank">
          {[
            { id: "projects", label: t.dashboard.tabs.projects, icon: FileText },
            { id: "reviews", label: t.dashboard.tabs.reviews, icon: Star },
            { id: "profile", label: t.dashboard.tabs.profile, icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "projects" | "reviews" | "profile")}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 zero-jank ${
                activeTab === tab.id
                  ? "bg-[var(--red)] text-white shadow-[0_12px_30px_rgba(230,0,0,0.25)] scale-105"
                  : "text-[var(--slate)] hover:text-[var(--charcoal)] hover:bg-white/50"
              }`}
            >
              <tab.icon className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? "scale-110" : ""}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Requests Section */}
        {activeTab === "projects" && (
          <FadeUp delay={0.2} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--red-light)] flex items-center justify-center border border-red-100 shadow-sm"><FileText className="w-5 h-5 text-[var(--red)]" /></div>
                {t.dashboard.projects.title}
              </h2>
              <Link href="/booking" className="btn btn-red px-6 py-3 text-[10px] uppercase font-black tracking-widest rounded-full zero-jank shadow-sm hover:shadow-[0_10px_30px_rgba(230,0,0,0.2)]">
                {t.dashboard.projects.new}
              </Link>
            </div>

            {/* Mobile Bento Cards View */}
            <div className="md:hidden space-y-8">
              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" /></div>
              ) : bookings.length === 0 ? (
                <div className="py-24 text-center rounded-[2.5rem] bg-white border border-dashed border-slate-200 uppercase font-black text-[10px] tracking-widest text-[var(--muted)] shadow-sm zero-jank">{t.dashboard.projects.empty}</div>
              ) : bookings.map((req: any) => {
                const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : "N/A";
                const accentColor = req.status === "PENDING" ? "bg-yellow-500" : req.status === "ACTIVE" ? "bg-blue-500" : req.status === "COMPLETED" ? "bg-emerald-500" : "bg-red-500";
                
                return (
                  <div key={req.id} className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 backdrop-blur-xl p-8 shadow-xl zero-jank">
                    {/* Interior Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-[0.08] -mr-10 -mt-10 ${accentColor}`} />
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentColor}`} />

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                           <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">{t.dashboard.projects.id}{req.id.slice(0, 8).toUpperCase()}</span>
                           <h3 className="text-[var(--charcoal)] font-black text-2xl tracking-tight leading-none uppercase">{req.serviceId}</h3>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${mapObj.cls}`}>{mapObj.label}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-5 bg-white/50 rounded-2xl border border-white/60">
                        <div className="border-r border-slate-100 pr-2">
                          <p className="text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-1.5">{t.dashboard.projects.date}</p>
                          <p className="text-xs font-black text-[var(--charcoal)] tracking-widest">{date}</p>
                        </div>
                        <div className="pl-2">
                          <p className="text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-1.5">Budget</p>
                          <p className="text-xs font-black text-[var(--red)] italic tracking-tight">Analyse en cours</p>
                        </div>
                      </div>

                      {req.adminNote && (
                        <div className="p-5 bg-red-50/50 border border-red-100/50 rounded-2xl text-[12px] text-[var(--slate)] leading-relaxed font-medium">
                          <span className="text-[9px] font-black uppercase text-[var(--red)] block mb-2 tracking-[0.25em]">{t.dashboard.projects.admin_note}</span>
                          "{req.adminNote}"
                        </div>
                      )}

                      {req.status === "PENDING" && (
                        <button 
                          onClick={() => handleDeleteRequest(req.id)}
                          className="w-full py-5 bg-white border border-slate-200 rounded-full text-[var(--charcoal)] text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:border-red-200 hover:text-[var(--red)] transition-all shadow-sm active:scale-95 zero-jank"
                        >
                          <AlertTriangle className="w-4 h-4" /> {t.dashboard.projects.cancel}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="bg-white backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-sm border border-[var(--border)] relative group/table hidden md:block zero-jank">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[var(--off-white)] border-b border-slate-100">
                      {[t.dashboard.projects.id, t.dashboard.projects.date, language === "fr" ? "Service" : "Service", language === "fr" ? "Statut" : "Status", t.dashboard.projects.admin_note, "Action"].map(h => (
                        <th key={h} className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {loading ? (
                         <tr><td colSpan={6} className="text-center py-20"><div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin mx-auto shadow-[0_0_20px_rgba(238,28,37,0.3)]" /></td></tr>
                      ) : bookings.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-24 text-[var(--muted)] font-black uppercase tracking-[0.2em] text-xs leading-relaxed">{t.dashboard.projects.empty}</td></tr>
                      ) : bookings.map((req, i) => {
                        const mapObj = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                        const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
                        return (
                          <motion.tr key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="hover:bg-slate-50 transition-all group zero-jank">
                            <td className="py-6 px-8 font-mono font-black text-[10px] text-[var(--red)] tracking-widest">#{req.id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-6 px-8 font-black text-[var(--muted)] text-[11px] tracking-widest">{date}</td>
                            <td className="py-6 px-8 font-black text-[var(--charcoal)] text-sm tracking-tight uppercase">{req.serviceId}</td>
                            <td className="py-6 px-8">
                              <span className={`inline-flex items-center px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${mapObj.cls} bg-transparent`}>
                                {mapObj.label}
                              </span>
                            </td>
                            <td className="py-6 px-8 font-bold text-[var(--slate)] text-xs italic leading-relaxed max-w-xs truncate">
                              {req.adminNote || "-"}
                            </td>
                            <td className="py-6 px-8">
                              {req.status === "PENDING" && (
                                <button onClick={() => handleDeleteRequest(req.id)} className="text-[9px] font-black uppercase text-red-500 hover:text-[var(--red)] hover:bg-[var(--red-light)] tracking-widest border border-red-200 px-4 py-2 rounded-full transition-all bg-white zero-jank">
                                  {t.dashboard.projects.cancel}
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
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <FadeUp delay={0.2} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm"><Star className="w-5 h-5 text-amber-500 fill-current" /></div>
                {t.dashboard.reviews.title}
              </h2>
              <button onClick={() => { setEditingReview(null); setReviewRating(0); setReviewComment(""); setShowReviewModal(true); }} className="btn btn-red px-6 py-3 text-[10px] uppercase font-black tracking-widest shadow-[0_10px_30px_rgba(230,0,0,0.2)] active:scale-95 transition-transform zero-jank">
                {t.dashboard.reviews.new}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userReviews.length === 0 ? (
                <div className="col-span-full py-20 text-center rounded-[2.5rem] bg-white border border-dashed border-slate-200 uppercase font-black text-[10px] tracking-widest text-[var(--muted)]">
                  {language === "fr" ? "Vous n'avez pas encore laissé d'avis." : "You haven't left any reviews yet."}
                </div>
              ) : userReviews.map((rev: any) => (
                <div key={rev.id} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white backdrop-blur-md p-6 shadow-sm flex flex-col justify-between zero-jank">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"}`} />
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{rev.createdAt ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : "Récemment"}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--slate)] leading-relaxed mb-6 italic">{'"'}{rev.comment}{'"'}</p>
                  </div>
                  <div className="flex gap-4 border-t border-slate-100 pt-4">
                    <button onClick={() => { setEditingReview(rev); setReviewRating(rev.rating); setReviewComment(rev.comment); setShowReviewModal(true); }} className="text-[9px] font-black uppercase text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors tracking-widest">{t.dashboard.reviews.edit}</button>
                    <button onClick={() => handleDeleteUserReview(rev.id)} className="text-[9px] font-black uppercase text-red-500/80 hover:text-red-600 transition-colors tracking-widest">{t.dashboard.reviews.delete}</button>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <FadeUp delay={0.2} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm"><Users className="w-5 h-5 text-blue-500" /></div>
              <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight">
                {t.dashboard.profile.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Meta Cards */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-8 bg-white border border-[var(--border)] rounded-[2rem] flex flex-col items-center text-center shadow-sm zero-jank">
                  <div className="w-20 h-20 rounded-full bg-[var(--red)] flex items-center justify-center text-2xl font-black text-white mb-4 shadow-[0_10px_30px_rgba(230,0,0,0.3)]">
                    {firstName[0]}
                  </div>
                  <h3 className="text-xl font-black text-[var(--charcoal)] tracking-tight">{user.displayName || "Sans Nom"}</h3>
                  <p className="text-xs font-black uppercase text-[var(--muted)] tracking-[0.2em] mt-1">{user.email}</p>
                </div>

                <div className="p-8 bg-white border border-[var(--border)] rounded-[2rem] space-y-4 shadow-sm zero-jank">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">{t.dashboard.profile.security}</span>
                     <button onClick={() => setShowPinChangeModal(true)} className="text-[9px] font-black text-[var(--red)] uppercase tracking-widest hover:underline">{t.dashboard.profile.change_pin}</button>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">{language === "fr" ? "Mot de passe" : "Password"}</span>
                     <button onClick={handlePasswordReset} className="text-[9px] font-black text-[var(--red)] uppercase tracking-widest hover:underline">{t.dashboard.profile.reset_password}</button>
                   </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="lg:col-span-2">
                <div className="p-8 md:p-10 bg-white border border-[var(--border)] rounded-[2.5rem] relative overflow-hidden shadow-sm zero-jank">
                  <AuraGradient color="var(--red)" className="bottom-0 right-0 w-64 h-64 opacity-[0.03]" />
                  <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] pl-1">{t.dashboard.profile.full_name}</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-[var(--off-white)] border border-[var(--border)] text-[var(--charcoal)] p-4 rounded-xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all zero-jank"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] pl-1">{t.dashboard.profile.email}</label>
                        <input 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-[var(--off-white)] border border-[var(--border)] text-[var(--charcoal)] p-4 rounded-xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all zero-jank"
                        />
                      </div>
                    </div>


                    <AnimatePresence>
                      {profileForm.error && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{profileForm.error}</motion.p>
                      )}
                      {profileForm.success && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{profileForm.success}</motion.p>
                      )}
                    </AnimatePresence>

                    <div className="pt-4">
                      <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isUpdatingProfile}
                        className="relative group overflow-hidden px-8 py-4 bg-[var(--charcoal)] text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] disabled:opacity-50 zero-jank"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isUpdatingProfile ? t.dashboard.profile.updating : t.dashboard.profile.save}
                        </span>
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </FadeUp>
        )}
             {/* Support Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          <StaggerItem>
            <div className="relative overflow-hidden p-10 border border-slate-200 rounded-[2.5rem] bg-white shadow-sm flex items-start flex-col sm:flex-row gap-8 group transition-all duration-500 hover:border-red-200 hover:shadow-[0_20px_40px_rgba(230,0,0,0.06)] zero-jank">
              <AuraGradient color="var(--red)" className="top-[-20%] left-[-10%] w-64 h-64 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-[var(--red-light)] border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-[var(--red)] transition-all duration-500 shadow-sm">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-[var(--charcoal)]">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black tracking-tight leading-none">Support <span className="text-[var(--red)]">Prioritaire.</span></h3>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--red-light)] text-[var(--red)] text-[8px] font-black uppercase tracking-widest border border-red-100 shadow-sm">Active SLA</span>
                </div>
                <p className="text-sm text-[var(--slate)] font-medium leading-relaxed mb-6">Expertise critique à votre service. Intervention garantie en moins de 120min pour tous vos actifs numériques.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-y border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">Canaux Actifs</span>
                      <div className="flex gap-2 mt-1">
                        {["WhatsApp", "Email", "Ticket"].map(c => <span key={c} className="text-[8px] font-bold text-[var(--slate)] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">{c}</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block">Agent Dédié</span>
                      <span className="text-[10px] font-bold text-[var(--red)] tracking-tight uppercase">Support Premium</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      <div className="flex flex-col"><span className="text-[8px] font-black text-[var(--muted)] uppercase">Dispo 24/7/365</span><span className="text-[10px] font-bold text-[var(--charcoal)] tracking-widest">OPÉRATIONNEL</span></div>
                    </div>
                    <div className="flex flex-col"><span className="text-[8px] font-black text-[var(--muted)] uppercase">Latence Ticketing</span><span className="text-[10px] font-bold text-[var(--charcoal)] tracking-widest">87ms AVG</span></div>
                  </div>
                </div>

                <Link href="/contact" className="relative z-10 inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[var(--off-white)] border border-slate-200 text-[10px] font-black text-[var(--charcoal)] hover:bg-white hover:border-red-200 uppercase tracking-[0.2em] transition-all group/btn shadow-sm">
                  Ouvrir un ticket <ArrowRight className="w-4 h-4 text-[var(--red)] group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </StaggerItem>
          
          <StaggerItem>
             <div className="relative overflow-hidden p-10 border border-slate-200 rounded-[2.5rem] bg-white shadow-sm flex items-start flex-col sm:flex-row gap-8 group hover:border-emerald-200 hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] transition-all duration-500 zero-jank">
               <AuraGradient color="emerald" className="bottom-[-20%] right-[-10%] w-64 h-64 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
               <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 group-hover:bg-emerald-500 shadow-sm">
                 <Cpu className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
               </div>
               <div className="relative z-10 flex-1 text-[var(--charcoal)]">
                 <div className="flex items-center gap-3 mb-3">
                   <h3 className="text-2xl font-black tracking-tight">Cloud & <span className="text-emerald-500">Infra.</span></h3>
                   <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Live Monitor</span>
                 </div>
                 <p className="text-sm text-[var(--slate)] font-medium leading-relaxed mb-6">Supervision proactive et maintenance automatisée. Maîtrisez la croissance de votre infrastructure.</p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex items-center justify-between py-3 border-y border-slate-100">
                     <div className="flex flex-col">
                       <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">Localisations Nodes</span>
                       <div className="flex gap-2 mt-1">
                          {["Douala-C1", "Paris-V1"].map(l => <span key={l} className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{l}</span>)}
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block">Backups Actifs</span>
                       <span className="text-[10px] font-bold text-[var(--charcoal)] uppercase tabular-nums tracking-widest">14 / 30 Jours</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-8 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        <div className="flex flex-col"><span className="text-[8px] font-black text-[var(--muted)] uppercase">Global Uptime</span><span className="text-[10px] font-bold text-[var(--charcoal)] tracking-widest">99.99%</span></div>
                      </div>
                      <div className="flex flex-col"><span className="text-[8px] font-black text-[var(--muted)] uppercase">Resource Load</span><span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Excellent</span></div>
                   </div>
                 </div>

                 <Link href="/services" className="relative z-10 inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[var(--off-white)] border border-slate-200 text-[10px] font-black text-[var(--charcoal)] hover:bg-white hover:border-emerald-200 uppercase tracking-[0.2em] transition-all group/btn2 shadow-sm">
                   Explorer le catalogue <ArrowRight className="w-4 h-4 text-emerald-500 group-hover/btn2:translate-x-1 transition-transform" />
                 </Link>
               </div>
             </div>
          </StaggerItem>
        </StaggerContainer>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md zero-jank" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-[var(--border)] shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden zero-jank"
            >
              <AuraGradient color="var(--red)" className="top-0 right-0 w-64 h-64 opacity-[0.05]" />
              <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--off-white)] border border-slate-200 flex items-center justify-center text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--red-light)] border border-red-100 flex items-center justify-center mb-6 shadow-sm">
                  <Star className="w-8 h-8 text-[var(--red)] fill-current" />
                </div>
                <h3 className="text-2xl font-black text-[var(--charcoal)] tracking-tight mb-2">
                  {t.dashboard.reviews.modal_title}
                </h3>
                <p className="text-sm font-medium text-[var(--slate)] leading-relaxed">
                  {t.dashboard.reviews.modal_desc}
                </p>
              </div>

              <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-4">
                    {t.dashboard.reviews.rating}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-2 -m-2 group transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star className={`w-8 h-8 transition-colors ${
                          (hoverRating || reviewRating) >= star ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "text-slate-200"
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {editingReview && (
                  <div className="p-4 bg-[var(--off-white)] border border-slate-200 rounded-xl shadow-sm">
                    <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block mb-1">Modification de l'avis du</span>
                    <span className="text-[10px] font-bold text-[var(--charcoal)] tracking-widest">{new Date(editingReview.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-4">
                    {t.dashboard.reviews.comment}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-4 left-4 w-5 h-5 text-[var(--muted)]" />
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={language === "fr" ? "Votre expérience..." : "Your experience..."}
                      className="w-full h-32 pl-12 pr-4 py-4 bg-[var(--off-white)] border border-slate-200 rounded-2xl text-[var(--charcoal)] outline-none focus:border-[var(--red)] focus:ring-4 ring-red-100 transition-all resize-none shadow-sm zero-jank"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview || reviewRating === 0}
                    className="w-full py-5 bg-[var(--red)] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(230,0,0,0.2)] active:scale-95 transition-all disabled:opacity-50 zero-jank flex justify-center items-center gap-2"
                  >
                    {isSubmittingReview ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                      editingReview ? (language === "fr" ? "Mettre à jour" : "Update") : t.dashboard.reviews.submit
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* PIN Change Modal */}
        {showPinChangeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isChangingPin && setShowPinChangeModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md zero-jank" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-[var(--border)] shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden zero-jank"
            >
              <AuraGradient color="emerald" className="top-0 right-0 w-64 h-64 opacity-[0.05]" />
              <button disabled={isChangingPin} onClick={() => { setShowPinChangeModal(false); setPinChangeForm({ oldPin: "", newPin: "", error: "", success: "" }); }} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--off-white)] border border-slate-200 flex items-center justify-center text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 shadow-sm">
                  <Key className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-[var(--charcoal)] tracking-tight mb-1">Modifier mon PIN</h3>
                <p className="text-[11px] font-medium text-[var(--slate)] leading-relaxed">Saisissez votre ancien PIN puis le nouveau (4 chiffres). Limité à 1 changement par 24h.</p>
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
                      placeholder="••••"
                      maxLength={4}
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
                  <label className="block text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] mb-2">Nouveau Code PIN (4 chiffres)</label>
                  <div className="relative">
                    <input 
                      type={showNewPin ? "text" : "password"}
                      value={pinChangeForm.newPin}
                      onChange={(e) => setPinChangeForm(prev => ({ ...prev, newPin: e.target.value, error: "" }))}
                      placeholder="••••"
                      maxLength={4}
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] text-emerald-600 font-bold">{pinChangeForm.success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button type="submit" disabled={isChangingPin || pinChangeForm.newPin.length !== 4 || pinChangeForm.oldPin.length < 4} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2 zero-jank">
                    {isChangingPin ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Key className="w-4 h-4" />Confirmer</>}
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
