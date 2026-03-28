"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight, LogOut, FileText, Star, X, MessageSquare, Lock, Key, Users, Eye, EyeOff, LayoutGrid, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { MagneticButton } from "@/components/ui/InteractiveEffects";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/config";
import { updateProfile, verifyBeforeUpdateEmail, sendPasswordResetEmail } from "firebase/auth";
import { updateUserDoc, updateReview, getReviewsByUserId, getBookings, setUserPin, getUserById, deleteBooking, createReview } from "@/lib/firebase/db";
import { logoutUser } from "@/lib/firebase/auth";

const STATUS_MAP = {
  fr: {
    PENDING:   { label: "En attente", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    ACTIVE:    { label: "En cours",   cls: "bg-blue-50 text-blue-600 border-blue-100" },
    COMPLETED: { label: "Terminé",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    REJECTED:  { label: "Rejeté",     cls: "bg-red-50 text-red-600 border-red-100" },
  },
  en: {
    PENDING:   { label: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    ACTIVE:    { label: "Active",   cls: "bg-blue-50 text-blue-600 border-blue-100" },
    COMPLETED: { label: "Completed",    cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    REJECTED:  { label: "Rejected",     cls: "bg-red-50 text-red-600 border-red-100" },
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
        const { updateProfile: fbUpdateProfile } = await import("firebase/auth");
        await fbUpdateProfile(user, { displayName: profileForm.name });
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-2xl border-2 border-[var(--red)] border-t-transparent"
        />
      </div>
    );
  }

  if (!isPinVerified) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden spatial-bg">
        <AuraGradient color="var(--red)" className="w-[1000px] h-[1000px] opacity-[0.05]" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="card-spatial p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-[var(--red-light)] text-[var(--red)] flex items-center justify-center mb-8 border border-red-100 shadow-spatial-sm">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="display-sm text-[var(--charcoal)] mb-4">
              {hasPinConfigured ? t.dashboard.security.pin_verify_title : t.dashboard.security.pin_setup_title}
            </h1>
            <p className="text-body-sm mb-12">
              {hasPinConfigured 
                ? t.dashboard.security.pin_verify_desc 
                : t.dashboard.security.pin_setup_desc}
            </p>
            
            <form onSubmit={handlePinSubmit} className="w-full space-y-8">
              <div>
                <input 
                  type="password"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  className={`w-full bg-[var(--off-white)] border ${pinError ? "border-red-500 text-red-500" : "border-[var(--border)] text-[var(--charcoal)] focus:border-[var(--red)]"} p-6 rounded-3xl text-center text-4xl font-black tracking-[1em] outline-none transition-all placeholder:text-[var(--muted)]/50 zero-jank`}
                />
                <AnimatePresence>
                  {pinError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="label text-red-500 mt-6 tracking-widest">
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
                className="btn-premium btn-premium-red w-full text-base py-6"
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
    <div className="min-h-screen pt-40 pb-40 bg-white spatial-bg overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[1000px] h-[1000px] opacity-[0.04]" />

      <div className="container-xl relative z-10">
        
        {/* Header Section (Kinetic Typography) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 border-b border-[var(--border)] pb-20">
          <FadeUp>
            <div className="flex items-center gap-4 mb-8">
              <span className="label text-[var(--red)]">{t.dashboard.title}</span>
              <div className="h-px w-12 bg-[var(--red)]/20" />
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Quantum-Secure</span>
              </div>
            </div>
            <h1 className="display-xl text-[var(--charcoal)] tracking-tighter leading-none italic">
              {t.dashboard.welcome} <span className="text-[var(--red)] not-italic">{firstName}.</span>
            </h1>
          </FadeUp>
          
          <FadeIn delay={0.3}>
            <div className="flex gap-4 p-2 bg-[var(--off-white)] rounded-full border border-[var(--border)] shadow-spatial-sm">
              {[
                { id: "projects", label: t.dashboard.tabs.projects, icon: LayoutGrid },
                { id: "reviews", label: t.dashboard.tabs.reviews, icon: Star },
                { id: "profile", label: t.dashboard.tabs.profile, icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "projects" | "reviews" | "profile")}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab.id
                      ? "bg-white text-[var(--charcoal)] shadow-spatial-md scale-105"
                      : "text-[var(--slate)] hover:text-[var(--charcoal)]"
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[var(--red)]" : ""}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Dynamic Bento Grid Content */}
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 gap-6">
                <h2 className="display-sm text-[var(--charcoal)]">{t.dashboard.projects.title}</h2>
                <Link href="/booking" className="w-full sm:w-auto">
                   <MagneticButton className="w-full sm:w-auto">
                     <span className="btn-premium btn-premium-red !px-8 !py-4 text-[10px] w-full sm:w-auto">
                       {t.dashboard.projects.new}
                     </span>
                   </MagneticButton>
                </Link>
              </div>

              {loading ? (
                <div className="py-40 flex justify-center"><Activity className="w-12 h-12 text-[var(--red)] animate-spin" /></div>
              ) : bookings.length === 0 ? (
                <div className="py-20 md:py-40 text-center rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-white/50 px-6">
                  <p className="label text-[var(--muted)]">{t.dashboard.projects.empty}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                  {bookings.map((req: any, i: number) => {
                    const status = STATUS_MAP[langKey][req.status as keyof typeof STATUS_MAP["fr"]] || STATUS_MAP[langKey].PENDING;
                    const date = req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : "N/A";
                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${i === 0 ? "lg:col-span-8" : "lg:col-span-4"} group`}
                      >
                        <div className="card-spatial p-8 md:p-12 h-full flex flex-col justify-between hover:border-[var(--red)]/20">
                          <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-12">
                               <div className="space-y-2">
                                  <span className="label text-[var(--red)]">#{req.id.slice(0, 8).toUpperCase()}</span>
                                  <h3 className="display-sm !text-4xl group-hover:italic transition-all duration-700">{req.serviceId}</h3>
                               </div>
                               <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.cls}`}>
                                 {status.label}
                               </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[var(--border)] pt-8 mb-8 md:mb-12">
                               <div>
                                  <p className="label text-[var(--muted)] mb-2">Request Date</p>
                                  <p className="text-xl font-black italic">{date}</p>
                               </div>
                               <div>
                                  <p className="label text-[var(--muted)] mb-2">Budget Range</p>
                                  <p className="text-xl font-black italic">{req.budget}</p>
                               </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                            {req.adminNote && (
                              <div className="p-6 md:p-8 bg-[var(--red-light)] border border-red-100 rounded-2xl md:rounded-3xl">
                                 <span className="label text-[var(--red)] block mb-4">Official Update</span>
                                 <p className="text-sm font-bold text-[var(--charcoal)] leading-relaxed italic">"{req.adminNote}"</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-4">
                               {req.status === "PENDING" && (
                                  <button
                                    onClick={() => handleDeleteRequest(req.id)}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    {t.dashboard.projects.cancel}
                                  </button>
                               )}
                               <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--charcoal)] group-hover:text-white transition-all duration-500 ml-auto">
                                  <ArrowRight className="w-5 h-5" />
                               </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="display-sm text-[var(--charcoal)]">{t.dashboard.reviews.title}</h2>
                <MagneticButton>
                  <button onClick={() => { setEditingReview(null); setReviewRating(0); setReviewComment(""); setShowReviewModal(true); }} className="btn-premium btn-premium-red !px-8 !py-4 text-[10px]">
                    {t.dashboard.reviews.new}
                  </button>
                </MagneticButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userReviews.length === 0 ? (
                  <div className="col-span-full py-40 text-center rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-white/50">
                    <p className="label text-[var(--muted)]">{language === "fr" ? "Aucun avis laissé" : "No reviews left yet"}</p>
                  </div>
                ) : userReviews.map((rev: any) => (
                  <div key={rev.id} className="card-spatial p-10 flex flex-col justify-between group hover:border-amber-400/30">
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"}`} />
                          ))}
                        </div>
                        <span className="label text-[var(--muted)]">{rev.createdAt ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : "New"}</span>
                      </div>
                      <p className="display-sm !text-2xl italic leading-tight mb-12">"{rev.comment}"</p>
                    </div>
                    <div className="flex gap-8 pt-8 border-t border-[var(--border)]">
                      <button onClick={() => { setEditingReview(rev); setReviewRating(rev.rating); setReviewComment(rev.comment); setShowReviewModal(true); }} className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] hover:text-[var(--charcoal)]">{t.dashboard.reviews.edit}</button>
                      <button onClick={() => handleDeleteUserReview(rev.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">{t.dashboard.reviews.delete}</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                 <div className="card-spatial p-12 text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[var(--charcoal)] flex items-center justify-center text-3xl font-black text-white mb-8 shadow-spatial-lg">
                      {firstName[0]}
                    </div>
                    <h3 className="display-sm !text-3xl mb-2">{user.displayName || "Client"}</h3>
                    <p className="label text-[var(--red)] mb-12 tracking-[0.3em] italic">{user.email}</p>

                    <div className="w-full space-y-4 pt-12 border-t border-[var(--border)]">
                       <button onClick={() => setShowPinChangeModal(true)} className="w-full py-4 rounded-2xl bg-[var(--off-white)] border border-[var(--border)] flex items-center justify-between px-6 group transition-all hover:bg-white">
                          <span className="label !text-[10px] group-hover:text-[var(--red)] transition-colors">{t.dashboard.profile.change_pin}</span>
                          <Key className="w-4 h-4 text-[var(--slate)]" />
                       </button>
                       <button onClick={handlePasswordReset} className="w-full py-4 rounded-2xl bg-[var(--off-white)] border border-[var(--border)] flex items-center justify-between px-6 group transition-all hover:bg-white">
                          <span className="label !text-[10px] group-hover:text-[var(--red)] transition-colors">{t.dashboard.profile.reset_password}</span>
                          <Lock className="w-4 h-4 text-[var(--slate)]" />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="card-spatial p-12 relative overflow-hidden">
                    <AuraGradient color="var(--red)" className="bottom-0 right-0 w-80 h-80 opacity-[0.03]" />
                    <h3 className="display-sm mb-12 italic">{t.dashboard.profile.title}</h3>

                    <form onSubmit={handleProfileUpdate} className="space-y-12 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="label text-[var(--muted)]">{t.dashboard.profile.full_name}</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                            className="form-input-spatial"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="label text-[var(--muted)]">{t.dashboard.profile.email}</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                            className="form-input-spatial"
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {profileForm.error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label text-red-500">{profileForm.error}</motion.p>}
                        {profileForm.success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label text-emerald-500">{profileForm.success}</motion.p>}
                      </AnimatePresence>

                      <motion.button 
                        type="submit" 
                        disabled={isUpdatingProfile}
                        whileHover={{ scale: 1.02 }}
                        className="btn-premium btn-premium-red px-12 py-5"
                      >
                        {isUpdatingProfile ? t.dashboard.profile.updating : t.dashboard.profile.save}
                      </motion.button>
                    </form>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Support Area (Asymmetric Bento) */}
        <div className="mt-24 md:mt-40 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">
           <div className="lg:col-span-8 card-spatial p-8 md:p-16 flex flex-col md:flex-row gap-12 md:gap-16 group hover:border-emerald-400/20">
              <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700">
                <Activity className="w-12 h-12" />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="display-sm italic">Live Monitoring</h3>
                  <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active SLA</span>
                  </div>
                </div>
                <p className="text-body mb-12 max-w-xl">Supervision proactive et maintenance automatisée de vos infrastructures. Disponibilité globale : 99.99%.</p>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 border-t border-[var(--border)] pt-12">
                   <div>
                      <p className="label text-[var(--muted)] mb-2">Systems</p>
                      <p className="text-xl font-black italic">Operational</p>
                   </div>
                   <div>
                      <p className="label text-[var(--muted)] mb-2">Network Load</p>
                      <p className="text-xl font-black italic text-emerald-600">Perfect</p>
                   </div>
                </div>
              </div>
           </div>

           <div className="lg:col-span-4 card-spatial p-8 md:p-16 bg-[var(--charcoal)] text-white group overflow-hidden">
              <AuraGradient color="var(--red)" className="top-0 right-0 w-80 h-80 opacity-[0.2]" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                   <Zap className="w-12 h-12 text-[var(--red)] mb-8 group-hover:scale-125 transition-transform duration-700" />
                   <h3 className="display-sm !text-3xl mb-6">Support <br/> Prioritaire.</h3>
                   <p className="text-sm font-medium text-slate-400 leading-relaxed mb-12">Intervention garantie en moins de 120min pour tous vos actifs numériques.</p>
                </div>
                <Link href="/contact" className="btn-premium btn-premium-red w-full !text-[10px]">
                  Ouvrir un Ticket
                </Link>
              </div>
           </div>
        </div>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg card-spatial p-12 bg-white"
            >
              <h3 className="display-sm !text-3xl mb-4 italic">{t.dashboard.reviews.modal_title}</h3>
              <p className="text-body-sm mb-12">{t.dashboard.reviews.modal_desc}</p>

              <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} className="space-y-12">
                <div className="space-y-4">
                  <label className="label">{t.dashboard.reviews.rating}</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-125 active:scale-90"
                      >
                        <Star className={`w-8 h-8 ${
                          (hoverRating || reviewRating) >= star ? "text-amber-400 fill-amber-400" : "text-slate-100"
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="label">{t.dashboard.reviews.comment}</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-input-spatial h-32 resize-none"
                    placeholder={language === "fr" ? "Dites-nous tout..." : "Your experience..."}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewRating === 0}
                  className="btn-premium btn-premium-red w-full"
                >
                  {isSubmittingReview ? <Activity className="w-5 h-5 animate-spin" /> : t.dashboard.reviews.submit}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
