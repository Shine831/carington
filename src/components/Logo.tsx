"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 md:gap-4 z-50 group shrink-0">
      {/* 3 Red Pills Motif (Original Logo Recreation in pure SVG for Perfect Scaling) */}
      <svg width="32" height="32" viewBox="0 0 100 100" className="shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(200,16,46,0.3)]">
        <rect x="0" y="10" width="100" height="20" rx="10" fill="var(--red)" />
        <rect x="0" y="40" width="100" height="20" rx="10" fill="var(--red)" />
        <rect x="0" y="70" width="100" height="20" rx="10" fill="var(--red)" />
      </svg>

      <div className="flex flex-col justify-center translate-y-0.5">
        <span className="font-black text-[15px] md:text-xl md:leading-none text-[var(--charcoal)] tracking-tighter uppercase whitespace-nowrap">
          E-Jarnauld <span className="text-[var(--red)]">Soft</span>
        </span>
        <span className="text-[6.5px] md:text-[7.5px] font-black text-[var(--slate)] tracking-[0.15em] md:tracking-[0.2em] uppercase leading-none mt-0.5 md:mt-1">
          Solutions Informatiques
        </span>
      </div>
    </Link>
  );
};
