"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 z-50 group">
      {/* 3 Red Pills Motif */}
      <div className="flex flex-col gap-[3px] items-center justify-center">
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.1 }}
          className="h-2 w-7 bg-[var(--red)] rounded-full group-hover:bg-[#ff2a33] transition-colors" />
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.2 }}
          className="h-2 w-8 bg-[var(--red)] rounded-full group-hover:bg-[#ff2a33] transition-colors" />
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.3 }}
          className="h-2 w-7 bg-[var(--red)] rounded-full group-hover:bg-[#ff2a33] transition-colors" />
      </div>

      <div className="flex flex-col">
        <span className="font-black text-xl leading-none text-[var(--charcoal)] tracking-tighter uppercase whitespace-nowrap">
          E-Jarnauld <span className="text-[var(--red)]">Soft</span>
        </span>
        <span className="text-[7.5px] font-black text-[var(--slate)] tracking-[0.2em] uppercase leading-none mt-1">
          Solutions Informatiques
        </span>
      </div>
    </Link>
  );
};
