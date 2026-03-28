"use client";

import { User, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, History, AlertCircle, UserPlus, Eye, EyeOff, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";
import { loginUser, registerUser, loginWithGoogle, resetPassword, resendVerificationEmail } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { MagneticButton } from "@/components/ui/InteractiveEffects";

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

  useEffect(() => {
    if (!authLoading && user) {
      if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
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
        setError(language === "fr" ? "Identifiants invalides." : "Invalid credentials.");
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
      setError("Google Auth Error");
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
      setSuccess(language === "fr" ? "Lien envoyé ! Vérifiez vos spams." : "Link sent! Check your spams.");
    } catch (err: any) {
      setError("Firebase Error.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-2 border-[var(--red)] border-t-transparent animate-spin rounded-full" /></div>;

  if (pendingVerification) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 bg-white spatial-bg flex items-center justify-center relative overflow-hidden">
        <AuraGradient color="var(--red)" className="w-[800px] h-[800px] opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full card-spatial p-12 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="display-sm mb-4">Verify Identity</h2>
          <p className="text-body-sm mb-12">Activation link sent to: <br/> <strong className="text-[var(--charcoal)]">{pendingEmail}</strong></p>
          <div className="space-y-4">
             <button onClick={async () => { setLoading(true); try { await resendVerificationEmail(pendingEmail, pendingPassword); } finally { setLoading(false); } }} disabled={loading} className="btn-premium btn-premium-red w-full">Resend Email</button>
             <button onClick={() => setPendingVerification(false)} className="label text-[var(--muted)] hover:text-[var(--red)] block mx-auto py-2 transition-colors">Back to Login</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-white spatial-bg flex items-center justify-center relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[1000px] h-[1000px] opacity-[0.04]" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Visual Panel (Mobile: hidden or top) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <FadeUp>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-[var(--red)]/20" />
              <span className="label text-[var(--red)] tracking-[0.3em]">Carington OS</span>
            </div>
            <h1 className="display-lg tracking-tighter leading-tight mb-12">
              {isLogin ? "Digital Trust" : "Join the"} <br/>
              <span className="italic italic-aura text-[var(--red)]">{isLogin ? "Infrastructure." : "Elite Tier."}</span>
            </h1>
            
            <div className="space-y-10">
               {[
                 { icon: ShieldCheck, text: "Quantum-Safe Authentication" },
                 { icon: Briefcase, text: "High-Priority Response Units" },
                 { icon: History, text: "Real-time Operations Log" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-6 group">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--charcoal)] group-hover:text-white transition-all duration-700">
                     <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-[11px] font-black uppercase tracking-widest text-[var(--slate)] group-hover:text-[var(--charcoal)] transition-colors">{item.text}</span>
                 </div>
               ))}
            </div>
          </FadeUp>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-7 order-1 lg:order-2">
           <div className="card-spatial p-8 md:p-16 relative overflow-hidden">
              <AuraGradient color="var(--red)" className="bottom-0 right-0 w-64 h-64 opacity-[0.02]" />

              <AnimatePresence mode="wait">
                {isForgot ? (
                  <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 relative z-10">
                    <div>
                       <h3 className="display-sm !text-3xl italic mb-4">Password Recovery</h3>
                       <p className="text-body-sm italic opacity-60">Authentication protocols will be sent to your primary terminal.</p>
                    </div>
                    <form onSubmit={onForgotPassword} className="space-y-8">
                       {success && <div className="p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 text-xs font-bold leading-relaxed">{success}</div>}
                       <div className="space-y-4">
                          <label className="label">Terminal Email</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input-spatial" placeholder="identity@domain.com" />
                       </div>
                       <button type="submit" disabled={loading} className="btn-premium btn-premium-red w-full py-6">Authorize Recovery</button>
                       <button type="button" onClick={() => {setIsForgot(false); setIsLogin(true);}} className="label text-[var(--muted)] hover:text-[var(--red)] block mx-auto transition-colors">Abort & Return</button>
                    </form>
                  </motion.div>
                ) : isLogin ? (
                  <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 relative z-10">
                    <div>
                       <h3 className="display-sm !text-3xl italic mb-4">Access Terminal</h3>
                       <p className="text-body-sm italic opacity-60">Authorize your session via secure credentials.</p>
                    </div>

                    <form onSubmit={onLogin} className="space-y-8">
                       {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-[10px] font-black uppercase tracking-widest">{error}</div>}

                       <div className="grid grid-cols-1 gap-8">
                          <div className="space-y-4">
                             <label className="label">Identity UID</label>
                             <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input-spatial" placeholder="name@domain.com" />
                          </div>
                          <div className="space-y-4 relative">
                             <div className="flex justify-between items-center">
                               <label className="label">Secret Key</label>
                               <button type="button" onClick={() => setIsForgot(true)} className="text-[9px] font-black uppercase text-[var(--red)] opacity-60 hover:opacity-100">Forgotten?</button>
                             </div>
                             <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="form-input-spatial" placeholder="••••••••" />
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 bottom-5 text-[var(--muted)] hover:text-[var(--charcoal)]">
                               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                             </button>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <button type="submit" disabled={loading} className="btn-premium btn-premium-red w-full py-6">Initiate Handshake</button>

                          <div className="flex items-center gap-6">
                             <div className="h-px flex-1 bg-[var(--border)]" />
                             <span className="label !text-[9px] opacity-40">OAuth Protocols</span>
                             <div className="h-px flex-1 bg-[var(--border)]" />
                          </div>

                          <button type="button" onClick={onGoogleLogin} disabled={loading} className="btn-premium btn-premium-outline w-full py-5 !gap-4">
                            <svg width="20" height="20" viewBox="0 0 48 48"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24v9.01h13.157c-.566 3.038-2.28 5.614-4.854 7.346v6.106h7.862c4.597-4.236 7.367-10.48 7.367-17.764z" fill="#4285F4"/><path d="M24 48c6.48 0 11.916-2.146 15.888-5.82l-7.862-6.106c-2.13 1.43-4.856 2.274-8.026 2.274-6.182 0-11.416-4.174-13.29-9.784H2.612v6.306C6.548 42.638 14.744 48 24 48z" fill="#34A853"/><path d="M10.71 28.564A14.54 14.54 0 0 1 9.88 24c0-1.584.276-3.122.77-4.564v-6.306H2.614A23.96 23.96 0 0 0 0 24c0 3.884.932 7.562 2.614 10.87l8.096-6.306z" fill="#FBBC04"/><path d="M24 9.654c3.476 0 6.6 1.196 9.054 3.544l6.788-6.788C35.908 2.428 30.48 0 24 0 14.744 0 6.548 5.362 2.612 13.13l8.098 6.306C12.584 13.828 17.818 9.654 24 9.654z" fill="#EA4335"/></svg>
                            Continue with Google
                          </button>
                       </div>

                       <button type="button" onClick={() => setIsLogin(false)} className="label text-[var(--red)] block mx-auto hover:italic transition-all">Create New Node Identity</button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12 relative z-10">
                    <div>
                       <h3 className="display-sm !text-3xl italic mb-4">Initiate Registry</h3>
                       <p className="text-body-sm italic opacity-60">Register your entity on E-Jarnauld Global Mesh.</p>
                    </div>

                    <form onSubmit={onRegister} className="space-y-8">
                       <div className="grid grid-cols-1 gap-8">
                          <div className="space-y-4">
                             <label className="label">Full Legal Name</label>
                             <input type="text" value={name} onChange={e => setName(e.target.value)} required className="form-input-spatial" placeholder="Johnathan Doe" />
                          </div>
                          <div className="space-y-4">
                             <label className="label">Registry Email</label>
                             <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input-spatial" placeholder="contact@corp.com" />
                          </div>
                          <div className="space-y-4">
                             <label className="label">Encryption Secret</label>
                             <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input-spatial" placeholder="••••••••" />
                          </div>
                       </div>
                       <button type="submit" disabled={loading} className="btn-premium btn-premium-red w-full py-6">Commit to Registry</button>
                       <button type="button" onClick={() => setIsLogin(true)} className="label text-[var(--muted)] hover:text-[var(--red)] block mx-auto transition-colors">Already registered? Log In</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}
