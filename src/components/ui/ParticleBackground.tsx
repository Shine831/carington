"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: ReturnType<typeof createParticle>[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 0.5;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      const opacity = Math.random() * 0.5 + 0.2;

      return {
        x, y, size, speedX, speedY, opacity,
        update: function(mx: number, my: number) {
          this.x += this.speedX;
          this.y += this.speedY;

          const dx = this.x - mx;
          const dy = this.y - my;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            const force = (150 - distance) / 150;
            this.x += dx * force * 0.02;
            this.y += dy * force * 0.02;
          }

          if (this.x > canvas.width) this.x = 0;
          else if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          else if (this.y < 0) this.y = canvas.height;
        },
        draw: function() {
          if (!ctx) return;
          ctx.fillStyle = `rgba(200, 16, 46, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    };

    const init = () => {
      particles = [];
      const count = Math.min(Math.floor(window.innerWidth / 10), 100);
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(springX.get(), springY.get());
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [springX, springY, mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
