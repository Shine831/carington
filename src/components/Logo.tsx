"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 z-50 group">
      <img src="/logo.jpg" alt="E-Jarnauld Soft Logo" className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform" />

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
