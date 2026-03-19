"use client";

import { User, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, History, AlertCircle, UserPlus, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlideLeft, SlideRight, StaggerContainer, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { loginUser, registerUser, loginWithGoogle, resetPassword, resendVerificationEmail } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, role, authLoading, router]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser({ email, password });
    } catch (err: any) {
      if (err.message === "EMAIL_NOT_VERIFIED") {
        setPendingEmail(email);
        setPendingPassword(password);
        setPendingVerification(true);
      } else {
        setError(language === "fr" ? "Identifiants invalides ou erreur Firebase" : "Invalid credentials or Firebase error");
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser({ email, password, name });
      // Show verification pending screen
      setPendingEmail(email);
      setPendingPassword(password);
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(language === "fr" ? "Erreur Google Sign-In" : "Google Sign-In Error");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await resetPassword(email);
      setSuccess(
        language === "fr"
          ? "Email envoyé ! Vérifiez votre boîte de réception. ⚠️ Si vous ne le voyez pas, consultez votre dossier SPAM/Courriers indésirables (expéditeur : noreply@firebase.com)."
          : "Email sent! Check your inbox. ⚠️ If you don't see it, check your SPAM/Junk folder (sender: noreply@firebase.com)."
      );
    } catch (err: any) {
      setError(language === "fr" ? "Email introuvable ou erreur Firebase." : "Email not found or Firebase error.");
    } finally {
      setLoading(false);
    }
  };

  const ICONS = [Briefcase, History, ShieldCheck, User];

  // Block access: if auth is loading show spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--off-white)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Email Verification Pending Screen
  if (pendingVerification) {
    return (
      <div className="min-h-[100svh] bg-[var(--off-white)] flex items-center justify-center py-24 px-4 relative overflow-hidden">
        <AuraGradient color="var(--red)" className="top-0 right-0 w-[500px] h-[500px] opacity-[0.06]" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-[var(--shadow-xl)] border border-white/60 z-10"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tighter mb-3">Vérifiez votre email</h2>
            <p className="text-sm text-[var(--slate)] font-medium leading-relaxed">
              Un email de confirmation a été envoyé à <strong className="text-[var(--charcoal)]">{pendingEmail}</strong>.<br/>
              Ouvrez votre boîte mail et cliquez sur le lien pour activer votre compte.
            </p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-[var(--red)] p-3 rounded-xl flex items-center gap-3 text-xs font-bold mb-6"><AlertCircle className="w-4 h-4" /> {error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-center gap-3 text-xs font-bold mb-6"><ShieldCheck className="w-4 h-4" /> {success}</div>}

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={async () => {
                setLoading(true); setError(""); setSuccess("");
                try {
                  await resendVerificationEmail(pendingEmail, pendingPassword);
                  setSuccess("Email renvoyé ! Vérifiez votre boîte de réception.");
                } catch { setError("Erreur lors du renvoi."); }
                finally { setLoading(false); }
              }}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[var(--red)] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[var(--shadow-red)] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Renvoyer l'email"}
            </motion.button>
            <button
              onClick={() => { setPendingVerification(false); setIsLogin(true); setError(""); setSuccess(""); }}
              className="w-full py-4 rounded-xl bg-transparent border-2 border-slate-200 text-[var(--muted)] text-[11px] font-black uppercase tracking-widest hover:border-[var(--red)]/30 transition-all"
            >
              ← Retour à la connexion
            </button>
          </div>

          <p className="text-center text-[10px] text-[var(--muted)] mt-6 font-medium">
            ⚠️ Ne trouvez pas l'email ? Vérifiez votre dossier SPAM.
          </p>
        </motion.div>
      </div>
    );
  }

  // Hard block: authenticated users cannot see the auth form at all
  // The useEffect redirect will kick in, but this prevents any form flash
  if (user) {
    return (
      <div className="min-h-screen bg-[var(--off-white)] flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--red)] border-t-transparent animate-spin" />
        <p className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">
          {language === "fr" ? "Redirection en cours..." : "Redirecting..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] pt-24 md:pt-32 bg-[var(--off-white)] flex items-center justify-center py-32 px-4 relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.05]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden shadow-[var(--shadow-glass)] border border-white/60 relative z-10 backdrop-blur-3xl bg-white/40">
        
        {/* Left panel — Dynamic Identity (Glassmorphism) */}
        <div className="bg-white/50 backdrop-blur-md p-8 md:p-16 flex flex-col justify-between h-full min-h-[500px] relative overflow-hidden border-r border-white/40">
          <AuraGradient color="var(--red)" className="bottom-[-20%] left-[-20%] w-64 h-64 opacity-[0.08]" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-txt" : "reg-txt"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-2 mb-10">
                  <div className="h-1.5 w-6 bg-[var(--red)] rounded-full" />
                  <div className="h-1.5 w-6 bg-[var(--red)] rounded-full opacity-50" />
                  <div className="h-1.5 w-6 bg-[var(--red)] rounded-full opacity-20" />
                </div>
                <h2 className="display-sm text-[var(--charcoal)] leading-[0.9] mb-8 tracking-tighter">
                  {isLogin ? "Portail" : "Rejoignez"}<br/>
                  <span className="italic font-serif text-[var(--red)]">
                    {isLogin ? "Sécurisé." : "l'Élite de la Cyber."}
                  </span>
                </h2>
                <p className="text-[var(--slate)] text-base leading-relaxed mb-12 font-medium max-w-sm">
                  {isLogin ? "Accédez à votre espace opérationnel chiffré. Gestion de vos infrastructures et suivi d'interventions." : "Accédez à un catalogue exclusif de solutions IT & Sécurité haute-performance. Inscription rapide et chiffrée."}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <StaggerContainer className="space-y-5">
              {(isLogin ? ["Suivi d'Interventions 24/7", "Tableaux de bord Sécurisés", "Facturation & Contrats"] : ["Protection Temps Réel", "Audit Certifié ISO 27001", "Support 2026", "Interface Intuitive"]).map((label, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <StaggerItem key={label}>
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[var(--red)] transition-all duration-500">
                        <Icon className="w-4 h-4 text-[var(--red)] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[var(--charcoal)] font-black text-xs uppercase tracking-widest">{label}</span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>

        {/* Right panel — Forms (Pure White) */}
        <div className="bg-white p-8 md:p-16 h-full flex flex-col justify-center relative overflow-hidden">
          <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-48 h-48 opacity-[0.02]" />
          
          <AnimatePresence mode="wait">
            {isForgot ? (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-[var(--charcoal)] mb-3 tracking-tighter uppercase">
                    {language === "fr" ? "Récupération" : "Recovery"}
                  </h3>
                  <p className="text-sm text-[var(--slate)] font-medium">
                    {language === "fr" ? "Entrez votre email. Nous vous enverrons un lien de réinitialisation." : "Enter your email. We'll send you a reset link."}
                  </p>
                </div>
                <form onSubmit={onForgotPassword} className="space-y-6 relative z-10">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-[var(--red)] p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" /> {success}
                    </div>
                  )}
                  <div className="form-group has-icon">
                    <Mail className="form-input-icon text-[var(--muted)]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="forgot-email" />
                    <label htmlFor="forgot-email" className="floating-label font-bold left-14">{t.account.login.email}</label>
                  </div>
                  <div className="pt-4">
                    <motion.button type="submit" disabled={loading || !!success} whileHover={{ scale: 1.02 }} className="btn btn-red w-full text-sm font-black py-5 shadow-[var(--shadow-red)] uppercase tracking-widest flex items-center justify-center gap-3">
                      {loading ? "..." : (language === "fr" ? "Envoyer le lien" : "Send Reset Link")} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <button onClick={() => { setIsForgot(false); setIsLogin(true); setError(""); setSuccess(""); }} className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.2em] hover:opacity-70 transition-all">
                    ← {language === "fr" ? "Retour à la connexion" : "Back to Login"}
                  </button>
                </div>
              </motion.div>
            ) : isLogin ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-[var(--charcoal)] mb-3 tracking-tighter uppercase">{t.account.login.title}</h3>
                  <p className="text-sm text-[var(--slate)] font-medium">{t.account.login.desc}</p>
                </div>

                <form onSubmit={onLogin} className="space-y-6 relative z-10">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-[var(--red)] p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}
                  
                  <div className="form-group has-icon">
                    <Mail className="form-input-icon text-[var(--muted)]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="login-email" />
                    <label htmlFor="login-email" className="floating-label font-bold left-14">{t.account.login.email}</label>
                  </div>
                  
                  <div className="form-group has-icon relative">
                    <Lock className="form-input-icon text-[var(--muted)]" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14 pr-12" placeholder=" " id="login-password" />
                    <label htmlFor="login-password" className="floating-label font-bold left-14">{t.account.login.password}</label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--red)] transition-colors p-1">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="pt-4">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn btn-red w-full text-sm font-black py-5 shadow-[var(--shadow-red)] uppercase tracking-widest flex items-center justify-center gap-3">
                      {loading ? "..." : t.account.login.submit} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="text-center mt-4">
                    <button type="button" onClick={() => { setIsForgot(true); setError(""); setSuccess(""); }} className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest hover:text-[var(--red)] transition-colors">
                      {language === "fr" ? "Mot de passe oublié ?" : "Forgot Password?"}
                    </button>
                  </div>
                </form>

                {/* Google Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">ou</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <motion.button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-slate-200 rounded-xl bg-white hover:border-[var(--red)]/30 hover:shadow-md transition-all text-[11px] font-black uppercase tracking-widest text-[var(--charcoal)]"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24v9.01h13.157c-.566 3.038-2.28 5.614-4.854 7.346v6.106h7.862c4.597-4.236 7.367-10.48 7.367-17.764z" fill="#4285F4"/>
                    <path d="M24 48c6.48 0 11.916-2.146 15.888-5.82l-7.862-6.106c-2.13 1.43-4.856 2.274-8.026 2.274-6.182 0-11.416-4.174-13.29-9.784H2.612v6.306C6.548 42.638 14.744 48 24 48z" fill="#34A853"/>
                    <path d="M10.71 28.564A14.54 14.54 0 0 1 9.88 24c0-1.584.276-3.122.77-4.564v-6.306H2.614A23.96 23.96 0 0 0 0 24c0 3.884.932 7.562 2.614 10.87l8.096-6.306z" fill="#FBBC04"/>
                    <path d="M24 9.654c3.476 0 6.6 1.196 9.054 3.544l6.788-6.788C35.908 2.428 30.48 0 24 0 14.744 0 6.548 5.362 2.612 13.13l8.098 6.306C12.584 13.828 17.818 9.654 24 9.654z" fill="#EA4335"/>
                  </svg>
                  Continuer avec Google
                </motion.button>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <button onClick={() => setIsLogin(false)} className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.2em] hover:opacity-70 transition-all">
                    {t.account.login.footer} (CRÉER UN COMPTE)
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reg-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-[var(--charcoal)] mb-3 tracking-tighter uppercase">REJOINDRE</h3>
                  <p className="text-sm text-[var(--slate)] font-medium">Créez votre accès sécurisé en quelques secondes.</p>
                </div>

                <form onSubmit={onRegister} className="space-y-6 relative z-10">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-[var(--red)] p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <div className="form-group has-icon">
                    <User className="form-input-icon text-[var(--muted)]" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="reg-name" />
                    <label htmlFor="reg-name" className="floating-label font-bold left-14">NOM COMPLET</label>
                  </div>
                  
                  <div className="form-group has-icon">
                    <Mail className="form-input-icon text-[var(--muted)]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="reg-email" />
                    <label htmlFor="reg-email" className="floating-label font-bold left-14">EMAIL</label>
                  </div>
                  
                  <div className="form-group has-icon relative">
                    <Lock className="form-input-icon text-[var(--muted)]" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14 pr-12" placeholder=" " id="reg-password" />
                    <label htmlFor="reg-password" className="floating-label font-bold left-14">MOT DE PASSE</label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--red)] transition-colors p-1">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="pt-4">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn btn-red w-full text-sm font-black py-5 shadow-[var(--shadow-red)] uppercase tracking-widest flex items-center justify-center gap-3">
                      {loading ? "..." : "S'INSCRIRE"} <UserPlus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>

                {/* Google Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">ou</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <motion.button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-slate-200 rounded-xl bg-white hover:border-[var(--red)]/30 hover:shadow-md transition-all text-[11px] font-black uppercase tracking-widest text-[var(--charcoal)]"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24v9.01h13.157c-.566 3.038-2.28 5.614-4.854 7.346v6.106h7.862c4.597-4.236 7.367-10.48 7.367-17.764z" fill="#4285F4"/>
                    <path d="M24 48c6.48 0 11.916-2.146 15.888-5.82l-7.862-6.106c-2.13 1.43-4.856 2.274-8.026 2.274-6.182 0-11.416-4.174-13.29-9.784H2.612v6.306C6.548 42.638 14.744 48 24 48z" fill="#34A853"/>
                    <path d="M10.71 28.564A14.54 14.54 0 0 1 9.88 24c0-1.584.276-3.122.77-4.564v-6.306H2.614A23.96 23.96 0 0 0 0 24c0 3.884.932 7.562 2.614 10.87l8.096-6.306z" fill="#FBBC04"/>
                    <path d="M24 9.654c3.476 0 6.6 1.196 9.054 3.544l6.788-6.788C35.908 2.428 30.48 0 24 0 14.744 0 6.548 5.362 2.612 13.13l8.098 6.306C12.584 13.828 17.818 9.654 24 9.654z" fill="#EA4335"/>
                  </svg>
                  Continuer avec Google
                </motion.button>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <button onClick={() => setIsLogin(true)} className="text-[10px] font-black text-[var(--red)] uppercase tracking-[0.2em] hover:opacity-70 transition-all">
                    DÉJÀ UN COMPTE ? SE CONNECTER
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
