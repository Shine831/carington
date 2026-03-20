"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Lenis v1 parameters for ultra-premium zero-jank scrolling
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      {/* @ts-expect-error Lenis ReactNode typing mismatch with React 19 */}
      {children}
    </ReactLenis>
  );
}
