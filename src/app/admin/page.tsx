"use client";

import { useState } from "react";
import { Users, Briefcase, FileText, Settings, BarChart, Bell, Search, ChevronRight, AlertTriangle, Clock, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem, SlideLeft } from "@/components/ui/Motion";
import { AuraGradient } from "@/components/ui/AuraGradient";
import { useI18n } from "@/context/LanguageContext";

const REQUESTS = [
  { id: "REQ-001", client: "ABC Corporation", type: "Audit Cyber (B2B)", status: "pending" as const, value: "À chiffrer" },
  { id: "REQ-002", client: "Paul N.", type: "Installation Réseau", status: "active" as const, value: "850 000 FCFA" },
  { id: "REQ-003", client: "Ministère Commerce", type: "Infogérance Serveurs", status: "completed" as const, value: "5 500 000 FCFA" },
  { id: "REQ-004", client: "TechPrime Sarl", type: "Cybersécurité B2B", status: "active" as const, value: "2 200 000 FCFA" },
];

const STATUS_MAP = {
  fr: {
    pending:   { label: "En attente", cls: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    active:    { label: "En cours",   cls: "bg-blue-50 text-blue-800 border-blue-200" },
    completed: { label: "Terminé",    cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  },
  en: {
    pending:   { label: "Pending", cls: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    active:    { label: "Active",   cls: "bg-blue-50 text-blue-800 border-blue-200" },
    completed: { label: "Completed",    cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  }
};

export default function AdminDashboard() {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState("requests");

  const NAV = [
    { id: "dashboard", label: t.admin.nav.overview, icon: BarChart },
    { id: "requests",  label: t.admin.nav.requests, icon: FileText, badge: 4 },
    { id: "clients",   label: t.admin.nav.clients, icon: Users },
    { id: "services",  label: t.admin.nav.catalog, icon: Briefcase },
  ];

  const STATS = [
    { label: t.admin.stats.pending, value: "12", icon: AlertTriangle, colorCls: "bg-yellow-50 text-yellow-500" },
    { label: t.admin.stats.active, value: "8", icon: Clock, colorCls: "bg-blue-50 text-blue-500" },
    { label: t.admin.stats.completed, value: "145", icon: CheckCircle, colorCls: "bg-emerald-50 text-emerald-600" },
    { label: t.admin.stats.revenue, value: "18.2M", icon: TrendingUp, colorCls: "bg-red-50 text-[var(--red)]" },
  ];

  return (
    <div className="min-h-screen bg-[var(--off-white)] flex pt-24 md:pt-32 relative overflow-hidden">
      <AuraGradient color="var(--red)" className="top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-[0.02]" />
      
      {/* Sidebar - Pure Tech Design */}
      <motion.aside
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 xl:w-72 bg-[var(--charcoal)] flex flex-col fixed top-24 md:top-32 bottom-0 left-0 z-40 hidden md:flex border-r border-white/5"
      >
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--red)] flex items-center justify-center shadow-[var(--shadow-red)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t.admin.tag}</p>
              <p className="font-black text-white text-sm tracking-tight text-emerald-400">ACTIVE SESSION</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === id 
                  ? "bg-[var(--red)] text-white shadow-[var(--shadow-red)]" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-4"><Icon className="w-4 h-4" />{label}</span>
              {badge && (
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                  activeTab === id ? "bg-white text-[var(--red)]" : "bg-white/10 text-white/40"
                }`}>{badge}</span>
              )}
            </motion.button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
            <Settings className="w-4 h-4" /> {t.admin.nav.settings}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 xl:ml-72 flex flex-col min-h-screen relative z-10">
        
        {/* Top Header Bar */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl border-b border-[var(--border)] px-8 py-5 flex items-center justify-between sticky top-24 md:top-32 z-30"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--red)] transition-colors" />
            <input
              type="text"
              placeholder={language === "fr" ? "Rechercher client, ID..." : "Search client, ID..."}
              className="bg-[var(--off-white)] border-2 border-transparent rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:outline-none focus:border-[var(--red)]/20 focus:bg-white w-48 md:w-80 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative text-[var(--slate)] hover:text-[var(--red)] transition-all p-2"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--red)] rounded-full border-2 border-white" />
            </motion.button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[var(--charcoal)] uppercase tracking-widest">Admin User</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Superuser</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--charcoal)] text-white flex items-center justify-center font-black text-sm shadow-xl">A</div>
            </div>
          </div>
        </motion.header>

        <div className="p-8 md:p-12 flex-1 relative overflow-hidden">
          <AuraGradient color="var(--red)" className="bottom-[-10%] left-[-10%] w-[400px] h-[400px] opacity-[0.01]" delay={3} />
          
          {/* Stats Bento Grid */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {STATS.map(({ label, value, icon: Icon, colorCls }) => (
              <StaggerItem key={label}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card p-8 bg-white border-2 border-transparent hover:border-[var(--red)]/10 transition-all shadow-sm relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-3xl font-black text-[var(--charcoal)] tracking-tighter italic font-serif serif-italic">{value}</p>
                  </div>
                  <div className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${colorCls}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Table Control Header */}
          <FadeUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--charcoal)] tracking-tight uppercase">{t.admin.table.title}</h2>
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-1">Real-time engagement monitor</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-red text-[10px] font-black uppercase tracking-widest py-4 px-8 shadow-[var(--shadow-red)]"
              >
                {t.admin.table.new}
              </motion.button>
            </div>

            {/* Pure Tech Tablespace */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[var(--shadow-xl)] border-2 border-slate-50 relative">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[var(--off-white)]/50 border-b border-slate-100">
                      {[t.admin.table.id, t.admin.table.client, t.admin.table.service, t.admin.table.value, t.admin.table.status, ""].map(h => (
                        <th key={h} className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {REQUESTS.map((req, i) => {
                        const cfg = STATUS_MAP[language][req.status];
                        return (
                          <motion.tr
                            key={req.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="hover:bg-slate-50/50 transition-all group"
                          >
                            <td className="py-6 px-8 font-mono font-black text-[10px] text-[var(--red)]">{req.id}</td>
                            <td className="py-6 px-8 font-bold text-[var(--charcoal)] whitespace-nowrap tracking-tight">{req.client}</td>
                            <td className="py-6 px-8 text-xs font-medium text-[var(--slate)] whitespace-nowrap">{req.type}</td>
                            <td className="py-6 px-8 font-black text-[var(--charcoal)] whitespace-nowrap italic font-serif serif-italic">{req.value}</td>
                            <td className="py-6 px-8">
                              <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-sm ${cfg.cls}`}>
                                {cfg.label}
                              </span>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <button className="flex items-center gap-2 text-[10px] font-black text-[var(--red)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-[-10px]">
                                {t.admin.table.open} <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* Pagination footer */}
              <div className="px-8 py-6 bg-[var(--off-white)]/30 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                <span>
                  {t.admin.table.pagination.replace("{start}", "1").replace("{end}", "4").replace("{total}", "12")}
                </span>
                <div className="flex gap-4">
                  <button className="p-2 border-2 border-slate-200 rounded-xl hover:bg-white hover:border-[var(--red)]/40 transition-all disabled:opacity-20">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button className="p-2 border-2 border-slate-200 rounded-xl hover:bg-white hover:border-[var(--red)]/40 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}
