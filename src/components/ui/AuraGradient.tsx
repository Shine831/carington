"use client";

import { motion } from "framer-motion";

interface AuraGradientProps {
  color?: string;
  className?: string;
  delay?: number;
}

export function AuraGradient({ color = "var(--red)", className = "", delay = 0 }: AuraGradientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.1, 1],
        rotate: [0, 90, 0]
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        delay,
        ease: "linear" 
      }}
      className={`absolute rounded-full blur-[120px] pointer-events-none -z-10 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
