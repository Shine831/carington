"use client";

import { motion, useInView, type Variants, type Transition } from "framer-motion";
import { useRef } from "react";

// Ultra-premium 2026 cubic-bezier curves (Apple/Stripe style)
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

// ─── Variants ──────────────────────────────────────────────────────────────────

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE_OUT } },
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
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
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
