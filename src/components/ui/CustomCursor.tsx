"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true to prevent flash on mobile

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Optimized spring config to reduce CPU load and delay
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device uses a coarse pointer (touchscreen)
    const matchMediaTouch = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(matchMediaTouch.matches);

    if (matchMediaTouch.matches) return;

    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to throttle state updates
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (isHidden) setIsHidden(false);

        const target = e.target as HTMLElement;
        const isHoveringClickable = 
          window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button" ||
          target.closest("button") !== null ||
          target.closest("a") !== null;
          
        if (isPointer !== isHoveringClickable) {
           setIsPointer(isHoveringClickable);
        }
      });
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    
    document.body.classList.add("custom-cursor-body");

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("custom-cursor-body");
    };
  }, [mouseX, mouseY, isHidden, isPointer]);

  if (isTouchDevice) return null;

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
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--red)] rounded-full pointer-events-none z-[99999]"
      />
      
      {/* Outer Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHidden ? 0 : 0.4,
          scale: isPointer ? 2 : 1,
        }}
        className="fixed top-0 left-0 w-8 h-8 border border-[var(--red)] rounded-full pointer-events-none z-[99998] transition-transform duration-150 ease-out"
      >
        {isPointer && (
          <div 
            className="absolute inset-0 bg-[var(--red)] opacity-10 rounded-full animate-in zoom-in duration-200"
          />
        )}
      </motion.div>
    </>
  );
}
