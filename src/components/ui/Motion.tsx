"use client";

import { motion, useInView, type Variants, type Transition } from "framer-motion";
import { useRef } from "react";

// Custom cubic-bezier, typed as a 4-tuple to satisfy Framer Motion's Easing type
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

// ─── Variants ──────────────────────────────────────────────────────────────────

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const slideInRightVariant: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const staggerContainerVariant: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AnimatedProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// ─── Components ────────────────────────────────────────────────────────────────

export function FadeUp({ children, className = "", delay = 0 }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const transition: Transition = { delay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUpVariant}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = "", delay = 0 }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const transition: Transition = { delay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInVariant}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, className = "", delay = 0 }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const transition: Transition = { delay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={slideInLeftVariant}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ children, className = "", delay = 0 }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const transition: Transition = { delay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={slideInRightVariant}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "" }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainerVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: AnimatedProps) {
  return (
    <motion.div variants={staggerItemVariant} className={className}>
      {children}
    </motion.div>
  );
}

export function ScaleUp({ children, className = "", delay = 0 }: AnimatedProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const transition: Transition = { delay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={scaleUpVariant}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
