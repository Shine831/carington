"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      );
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    
    // Add custom cursor class to body
    document.body.classList.add("custom-cursor-body");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("custom-cursor-body");
    };
  }, [mouseX, mouseY, isHidden]);

  return (
    <>
      {/* Principal Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHidden ? 0 : 1,
        }}
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--red)] rounded-full pointer-events-none z-[99999]"
      />
      
      {/* Outer Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHidden ? 0 : 0.4,
          scale: isPointer ? 2.5 : 1,
        }}
        className="fixed top-0 left-0 w-10 h-10 border border-[var(--red)] rounded-full pointer-events-none z-[99998] transition-transform duration-200"
      >
        {isPointer && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-[var(--red)] opacity-10 rounded-full"
          />
        )}
      </motion.div>
    </>
  );
}
