"use client";

import { Activity, ShieldAlert, ShieldCheck, Cpu, Server, CheckCircle2, Clock, AlertTriangle, ArrowRight, LogOut, FileText, Star, X, MessageSquare, Lock, Key, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/config";
import { updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from "firebase/auth";
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

  useEffect(() => {
    if (user) {
      if (typeof window !== "undefined" && sessionStorage.getItem("client_pin_verified") === "true") {
        setIsPinVerified(true);
        setCheckingPin(false);
        fetchUserBookings();
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

  const fetchUserReviews = async () => {
    if (user) {
      const data = await getReviewsByUserId(user.uid);
      setUserReviews(data);
    }
  };

  async function hashPin(pin: string) {
    const enc = new TextEncoder().encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

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
      sessionStorage.setItem("client_pin_verified", "true");
    } else {
      // Verification
      const userData = await getUserById(user.uid);
      if (userData?.pin === hashed) {
        setIsPinVerified(true);
        sessionStorage.setItem("client_pin_verified", "true");
      } else {
        setPinError(true);
        setPinInput("");
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
      // 1. Update Display Name if changed
      if (profileForm.name !== user.displayName) {
        await updateProfile(user, { displayName: profileForm.name });
        await updateUserDoc(user.uid, { displayName: profileForm.name });
      }

      // 2. Update Email if changed (requires re-auth)
      if (profileForm.email !== user.email) {
        if (!profileForm.currentPassword) {
          throw new Error(language === "fr" ? "Veuillez saisir votre mot de passe pour changer d'email." : "Please enter your password to change email.");
        }
        const credential = EmailAuthProvider.credential(user.email!, profileForm.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, profileForm.email);
        await updateUserDoc(user.uid, { email: profileForm.email });
      }

      setProfileForm(p => ({ ...p, success: language === "fr" ? "Profil mis à jour !" : "Profile updated!", currentPassword: "" }));
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
      <div className="min-h-[100svh] bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[800px] h-[800px] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm relative z-10">
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-6 border border-white/10 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">
              {hasPinConfigured ? "Accès Sécurisé" : "Configuration Sécurité"}
            </h1>
            <p className="text-white/40 text-[11px] mb-8 leading-relaxed">
              {hasPinConfigured 
                ? "Veuillez entrer votre Code PIN à 4 chiffres pour accéder à vos devis." 
                : "Afin de protéger vos données, veuillez configurer un Code PIN à 4 chiffres."}
            </p>
            
            <form onSubmit={handlePinSubmit} className="w-full space-y-6">
              <div>
                <input 
                  type="password"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                  className={`w-full bg-[#050505] border ${pinError ? "border-red-500 text-red-500" : "border-white/10 text-white focus:border-white/30"} p-4 rounded-2xl text-center text-2xl font-black tracking-[1em] outline-none transition-all placeholder:text-white/10`}
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
                className="w-full py-4 bg-white text-[#0A0A0A] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {hasPinConfigured ? "Déverrouiller" : "Enregistrer mon PIN"}
              </button>
            </form>

            <button onClick={async () => { await logoutUser(); router.push("/"); }} className="mt-8 text-[10px] text-white/30 hover:text-white font-black uppercase tracking-widest transition-colors">
              Déconnexion
            </button>
          </div>
        </motion.div>
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
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-5 rounded-[2rem] shadow-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">
                    {t.dashboard.secure}
                  </span>
                  <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Connecté en AES-256</span>
                </div>
              </div>
              <button 
                onClick={() => logoutUser().then(() => router.push("/"))} 
                className="flex items-center gap-3 bg-[var(--red)]/10 hover:bg-[var(--red)] border border-[var(--red)]/20 hover:border-[var(--red)] px-6 py-5 rounded-[2rem] shadow-xl text-white transition-all group"
              >
                <LogOut className="w-5 h-5 text-[var(--red)] group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                   Sortie
                </span>
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 mb-12 w-fit mx-auto md:mx-0">
          {[
            { id: "projects", label: language === "fr" ? "Projets" : "Projects", icon: FileText },
            { id: "reviews", label: language === "fr" ? "Avis" : "Reviews", icon: Star },
            { id: "profile", label: language === "fr" ? "Compte" : "Account", icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-[var(--red)] text-white shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Requests Section */}
        {activeTab === "projects" && (
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
                  <div key={req.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md p-6 shadow-xl">
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
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-xl border border-white/10 relative group/table hidden md:block">
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
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <FadeUp delay={0.2} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-950/20"><Star className="w-5 h-5 text-amber-500 fill-current" /></div>
                {language === "fr" ? "Mes Témoignages" : "My Reviews"}
              </h2>
              <button onClick={() => { setEditingReview(null); setReviewRating(0); setReviewComment(""); setShowReviewModal(true); }} className="btn btn-red px-6 py-3 text-[10px] uppercase font-black tracking-widest shadow-[var(--shadow-red)] active:scale-95 transition-transform">
                {language === "fr" ? "Nouvel Avis" : "New Review"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userReviews.length === 0 ? (
                <div className="col-span-full py-20 text-center rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 uppercase font-black text-[10px] tracking-widest text-white/30">
                  {language === "fr" ? "Vous n'avez pas encore laissé d'avis." : "You haven't left any reviews yet."}
                </div>
              ) : userReviews.map((rev) => (
                <div key={rev.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-white/10"}`} />
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{rev.createdAt ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : "Récemment"}</span>
                    </div>
                    <p className="text-sm font-medium text-white/70 leading-relaxed mb-6 italic">"{rev.comment}"</p>
                  </div>
                  <div className="flex gap-4 border-t border-white/5 pt-4">
                    <button onClick={() => { setEditingReview(rev); setReviewRating(rev.rating); setReviewComment(rev.comment); setShowReviewModal(true); }} className="text-[9px] font-black uppercase text-white/40 hover:text-white transition-colors tracking-widest">Modifier</button>
                    <button onClick={() => handleDeleteUserReview(rev.id)} className="text-[9px] font-black uppercase text-red-500/60 hover:text-red-500 transition-colors tracking-widest">Supprimer</button>
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
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-950/20"><Users className="w-5 h-5 text-blue-500" /></div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {language === "fr" ? "Gestion du Compte" : "Account Settings"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Meta Cards */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--red)] flex items-center justify-center text-2xl font-black text-white mb-4 shadow-[var(--shadow-red)]">
                    {firstName[0]}
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">{user.displayName || "Sans Nom"}</h3>
                  <p className="text-xs font-black uppercase text-white/40 tracking-[0.2em] mt-1">{user.email}</p>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sécurité PIN</span>
                     <button onClick={() => setShowPinChangeModal(true)} className="text-[9px] font-black text-[var(--red)] uppercase tracking-widest">Modifier</button>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Mot de passe</span>
                     <button onClick={handlePasswordReset} className="text-[9px] font-black text-[var(--red)] uppercase tracking-widest">Réinitialiser</button>
                   </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="lg:col-span-2">
                <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
                  <AuraGradient color="var(--red)" className="bottom-0 right-0 w-64 h-64 opacity-[0.05]" />
                  <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] pl-1">Nom Complet</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-[#050505] border border-white/10 text-white p-4 rounded-xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] pl-1">Adresse Email</label>
                        <input 
                          type="email" 
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-[#050505] border border-white/10 text-white p-4 rounded-xl text-sm font-bold focus:border-[var(--red)] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] pl-1 flex items-center gap-2">
                         <Lock className="w-3 h-3" /> Mot de passe actuel
                         <span className="text-white/20 capitalize font-medium italic">(Requis pour changer d'email)</span>
                      </label>
                      <input 
                        type="password" 
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-[#050505] border border-white/10 text-white p-4 rounded-xl text-sm font-bold focus:border-white/30 outline-none transition-all placeholder:text-white/5"
                      />
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
                      <button 
                        type="submit" 
                        disabled={isUpdatingProfile}
                        className="relative group overflow-hidden px-8 py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.25em] rounded-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isUpdatingProfile ? "En cours..." : "Sauvegarder les modifications"}
                        </span>
                      </button>
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

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#111111] border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 z-10 overflow-hidden"
            >
              <AuraGradient color="var(--red)" className="top-0 right-0 w-64 h-64 opacity-10" />
              <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-[var(--red)] fill-current" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  {language === "fr" ? "Votre avis compte" : "Your feedback matters"}
                </h3>
                <p className="text-sm font-medium text-white/40 leading-relaxed">
                  {language === "fr" ? "Aidez-nous à affiner notre excellence en partageant votre expérience avec E-Jarnauld Soft." : "Help us refine our excellence by sharing your experience with E-Jarnauld Soft."}
                </p>
              </div>

              <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-4">
                    {language === "fr" ? "Note (1 à 5 étoiles)" : "Rating (1 to 5 stars)"}
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
                          (hoverRating || reviewRating) >= star ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "text-white/10"
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {editingReview && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Modification de l'avis du</span>
                    <span className="text-[10px] font-bold text-white tracking-widest">{new Date(editingReview.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-4">
                    {language === "fr" ? "Votre Témoignage" : "Your Testimonial"}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-4 left-4 w-5 h-5 text-white/20" />
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={language === "fr" ? "Ex: Déploiement parfait, équipe très réactive..." : "Ex: Perfect deployment, highly responsive team..."}
                      className="w-full h-32 pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white outline-none focus:border-[var(--red)]/50 focus:bg-[#1A1A1A] transition-all resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={reviewRating === 0 || isSubmittingReview || !reviewComment.trim()}
                  className="w-full py-4 rounded-xl bg-[var(--red)] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[var(--shadow-red)] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmittingReview ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    editingReview 
                      ? (language === "fr" ? "Mettre à jour" : "Update review")
                      : (language === "fr" ? "Publier mon avis" : "Publish review")
                  )}
                </button>
              </form>
            </motion.div>
          </div>
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
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Modifier le PIN</h3>
                <p className="text-xs font-medium text-white/40 leading-relaxed">
                  Protégez vos données. Vous ne pouvez modifier ce code qu'une fois toutes les 24h.
                </p>
              </div>

              <form onSubmit={handlePinChangeSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Ancien Code</label>
                  <input 
                    type="password"
                    value={pinChangeForm.oldPin}
                    onChange={(e) => setPinChangeForm(prev => ({ ...prev, oldPin: e.target.value, error: "" }))}
                    placeholder="••••"
                    maxLength={4}
                    required
                    className="w-full bg-[#050505] border border-white/10 text-white rounded-2xl text-center text-lg font-black tracking-[1em] p-4 focus:border-emerald-500 outline-none placeholder:text-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-2">Nouveau Code</label>
                  <input 
                    type="password"
                    value={pinChangeForm.newPin}
                    onChange={(e) => setPinChangeForm(prev => ({ ...prev, newPin: e.target.value, error: "" }))}
                    placeholder="••••"
                    maxLength={4}
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
                  <button type="submit" disabled={isChangingPin || pinChangeForm.newPin.length !== 4 || pinChangeForm.oldPin.length < 4} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-black font-black text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center">
                    {isChangingPin ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Confirmer"}
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
