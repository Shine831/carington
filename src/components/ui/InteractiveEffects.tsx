"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className = "", intensity = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function MagneticButton({ children, className = "", onClick, type = "button" }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 20 });
  const springY = useSpring(y, { stiffness: 400, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distanceX = e.clientX - cx;
    const distanceY = e.clientY - cy;
    
    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div
        style={{ x: springX, y: springY }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface SpatialLayerProps {
  children: ReactNode;
  speed?: number;
  direction?: 1 | -1;
  className?: string;
  zIndex?: number;
}

export function SpatialLayer({ children, speed = 0.5, direction = 1, className = "", zIndex = 1 }: SpatialLayerProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100 * direction}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, zIndex }}
      className={`absolute pointer-events-none ${className}`}
    >
      <motion.div style={{ opacity }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  highlight?: boolean;
}

export function BentoCard({ children, className = "", delay = 0, highlight = false }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`relative group overflow-hidden rounded-[2.5rem] p-8 border backdrop-blur-md transition-all duration-500 ${
        highlight 
          ? "bg-white/90 border-white/40 shadow-2xl" 
          : "bg-white/60 border-white/20 hover:bg-white/80"
      } ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
      
      {/* Dynamic Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[var(--red)]/10 to-transparent blur-[100px]" />
      </div>
    </motion.div>
  );
}
