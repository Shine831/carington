"use client";

import { useState } from "react";
import { Users, Briefcase, FileText, Settings, BarChart, Bell, Search, ChevronRight, AlertTriangle, Clock, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

const REQUESTS = [
  { id: "REQ-001", client: "ABC Corporation", type: "Audit Cyber (B2B)", status: "pending" as const, value: "À chiffrer" },
  { id: "REQ-002", client: "Paul N.", type: "Installation Réseau", status: "active" as const, value: "850 000 FCFA" },
  { id: "REQ-003", client: "Ministère Commerce", type: "Infogérance Serveurs", status: "completed" as const, value: "5 500 000 FCFA" },
  { id: "REQ-004", client: "TechPrime Sarl", type: "Cybersécurité B2B", status: "active" as const, value: "2 200 000 FCFA" },
];

const STATUS_MAP = {
  pending:   { label: "En attente", cls: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  active:    { label: "En cours",   cls: "bg-blue-50 text-blue-800 border-blue-200" },
  completed: { label: "Terminé",    cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

const NAV = [
  { id: "dashboard", label: "Vue d'ensemble", icon: BarChart },
  { id: "requests",  label: "Requêtes",        icon: FileText, badge: 4 },
  { id: "clients",   label: "Clients",         icon: Users },
  { id: "services",  label: "Catalogue",       icon: Briefcase },
];

const STATS = [
  { label: "En Attente", value: "12", icon: AlertTriangle, colorCls: "bg-yellow-50 text-yellow-500" },
  { label: "En Cours",   value: "8",  icon: Clock,         colorCls: "bg-blue-50 text-blue-500" },
  { label: "Terminés",   value: "145",icon: CheckCircle,   colorCls: "bg-emerald-50 text-emerald-600" },
  { label: "Revenus",    value: "18.2M", icon: TrendingUp, colorCls: "bg-red-50 text-[var(--red)]" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("requests");

  return (
    <div className="min-h-screen bg-[var(--off-white)] flex pt-[68px] md:pt-[76px]">
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-60 xl:w-64 bg-[var(--charcoal)] flex-col fixed top-[68px] md:top-[76px] bottom-0 left-0 z-40 hidden md:flex"
      >
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--red)] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Panel</p>
              <p className="text-gray-500 text-xs">E-JARNALUD SOFT</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-3">
          {NAV.map(({ id, label, icon: Icon, badge }) => (
            <motion.button
              key={id}
              onClick={() => setActive(id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                active === id ? "bg-[var(--red)] text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center gap-3"><Icon className="w-4 h-4" />{label}</span>
              {badge && <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
            </motion.button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Settings className="w-4 h-4" /> Paramètres
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 xl:ml-64 flex flex-col min-h-screen">
        
        {/* Top Bar */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border-b border-[var(--border)] px-5 md:px-8 py-4 flex items-center justify-between sticky top-[68px] md:top-[76px] z-30"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Rechercher client, ID..."
              className="bg-[var(--off-white)] border border-[var(--border)] rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/10 w-44 md:w-72 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative text-[var(--slate)] hover:text-[var(--red)] transition-colors p-2"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--red)] rounded-full" />
            </motion.button>
            <div className="w-9 h-9 rounded-full bg-[var(--red)] text-white flex items-center justify-center font-bold text-sm shadow-[var(--shadow-red)]">A</div>
          </div>
        </motion.header>

        <div className="p-5 md:p-8 flex-1">
          
          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(({ label, value, icon: Icon, colorCls }) => (
              <StaggerItem key={label}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="card p-5 bg-white flex items-start justify-between"
                >
                  <div>
                    <p className="label mb-2">{label}</p>
                    <p className="text-2xl md:text-3xl font-black text-[var(--charcoal)]">{value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorCls}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Table Header */}
          <FadeUp>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Requêtes Entrantes</h2>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-red text-sm py-2.5 px-5"
              >
                Nouveau Dossier
              </motion.button>
            </div>

            {/* Table */}
            <div className="card bg-white overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[var(--off-white)] border-b border-[var(--border)]">
                      {["ID", "Client", "Service", "Valeur", "Statut", ""].map(h => (
                        <th key={h} className="py-4 px-5 font-semibold text-xs uppercase tracking-wider text-[var(--muted)] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <AnimatePresence>
                      {REQUESTS.map((req, i) => {
                        const cfg = STATUS_MAP[req.status];
                        return (
                          <motion.tr
                            key={req.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="hover:bg-[var(--off-white)] transition-colors group"
                          >
                            <td className="py-4 px-5 font-mono font-bold text-xs text-[var(--charcoal)]">{req.id}</td>
                            <td className="py-4 px-5 font-semibold text-[var(--charcoal)] whitespace-nowrap">{req.client}</td>
                            <td className="py-4 px-5 text-[var(--slate)] whitespace-nowrap">{req.type}</td>
                            <td className="py-4 px-5 font-semibold text-[var(--charcoal)] whitespace-nowrap">{req.value}</td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                                {cfg.label}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button className="flex items-center gap-1 text-xs font-bold text-[var(--red)] opacity-0 group-hover:opacity-100 transition-opacity">
                                Ouvrir <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Affichage 1–4 sur 12 requêtes</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--off-white)] transition-colors disabled:opacity-40">Précédent</button>
                  <button className="px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--off-white)] transition-colors">Suivant</button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}
