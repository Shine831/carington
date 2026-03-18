"use client";

import { User, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, History, AlertCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlideLeft, SlideRight, StaggerContainer, StaggerItem, FadeUp } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

export default function AccountPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(language === "fr" ? "Identifiants invalides" : "Invalid credentials");
      } else {
        router.push("/admin"); 
        router.refresh();
      }
    } catch (err) {
      setError(language === "fr" ? "Une erreur est survenue" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Success -> Switch to login
      setIsLogin(true);
      setError("");
      alert(language === "fr" ? "Compte créé ! Connectez-vous." : "Account created! Please sign in.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ICONS = [Briefcase, History, ShieldCheck, User];

  return (
    <div className="min-h-[100svh] pt-24 md:pt-32 bg-[var(--off-white)] flex items-center justify-center py-32 px-4 relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.03]" />
      
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden shadow-[var(--shadow-2xl)] border border-white/20 relative z-10">
        
        {/* Left panel — Dynamic Identity */}
        <div className="bg-[var(--red)] p-8 md:p-16 flex flex-col justify-between h-full min-h-[500px] relative overflow-hidden">
          <AuraGradient color="white" className="top-[-20%] left-[-20%] w-64 h-64 opacity-[0.1]" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-txt" : "reg-txt"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-[10px] font-black text-red-100 uppercase tracking-[0.3em] mb-10 block opacity-80">
                  {isLogin ? t.account.tag : "NOUVELLE IDENTITY"}
                </span>
                <h2 className="display-sm text-white leading-[0.9] mb-8 tracking-tighter">
                  {isLogin ? t.account.title_part1 : "Rejoignez"}<br/>
                  <span className="italic font-serif serif-italic opacity-90">
                    {isLogin ? t.account.title_part2 : "l'Élite de la Cyber"}
                  </span>
                </h2>
                <p className="text-red-50 text-base leading-relaxed mb-12 font-medium max-w-sm opacity-80">
                  {isLogin ? t.account.desc : "Accédez à un catalogue exclusif de solutions IT & Sécurité haute-performance."}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <StaggerContainer className="space-y-5">
              {(isLogin ? t.account.features : ["Protection Temps Réel", "Audit Certifié", "Support 2026", "Interface Intuitive"]).map((label, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <StaggerItem key={label}>
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-500">
                        <Icon className="w-4 h-4 text-white group-hover:text-[var(--red)] transition-colors" />
                      </div>
                      <span className="text-white text-sm font-bold tracking-tight">{label}</span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>

        {/* Right panel — Forms */}
        <div className="bg-white p-8 md:p-16 h-full flex flex-col justify-center relative overflow-hidden">
          <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-48 h-48 opacity-[0.02]" />
          
          <AnimatePresence mode="wait">
            {isLogin ? (
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
                  
                  <div className="form-group has-icon">
                    <Lock className="form-input-icon text-[var(--muted)]" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="login-password" />
                    <label htmlFor="login-password" className="floating-label font-bold left-14">{t.account.login.password}</label>
                  </div>

                  <div className="pt-4">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn btn-red w-full text-sm font-black py-5 shadow-[var(--shadow-red)] uppercase tracking-widest flex items-center justify-center gap-3">
                      {loading ? "..." : t.account.login.submit} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
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
                  
                  <div className="form-group has-icon">
                    <Lock className="form-input-icon text-[var(--muted)]" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input border-2 rounded-xl py-4 pl-14" placeholder=" " id="reg-password" />
                    <label htmlFor="reg-password" className="floating-label font-bold left-14">MOT DE PASSE</label>
                  </div>

                  <div className="pt-4">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} className="btn btn-red w-full text-sm font-black py-5 shadow-[var(--shadow-red)] uppercase tracking-widest flex items-center justify-center gap-3">
                      {loading ? "..." : "S'INSCRIRE"} <UserPlus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
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
