"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INNER_SIZE = 4;
const RING_SIZE = 32;
const RING_BORDER = 1.5;

const springSmooth = { damping: 30, stiffness: 350 };
const springQuick = { damping: 28, stiffness: 500 };

export function MouseEffect() {
  const [mounted, setMounted] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const x = useSpring(cursorX, springSmooth);
  const y = useSpring(cursorY, springSmooth);
  const ringScale = useSpring(isHoveringInteractive ? 1.4 : 1, springQuick);
  const ringOpacity = useSpring(isHoveringInteractive ? 0.5 : 0.28);
  const innerOpacity = useSpring(isHoveringInteractive ? 0.9 : 0.6);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = (e.target as HTMLElement)?.closest?.(
        "a, button, [role='button'], [data-interactive], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      setIsHoveringInteractive(!!target);
    };

    const handleLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      setIsHoveringInteractive(false);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mounted, cursorX, cursorY]);

  useEffect(() => {
    ringScale.set(isHoveringInteractive ? 1.4 : 1);
    ringOpacity.set(isHoveringInteractive ? 0.5 : 0.28);
    innerOpacity.set(isHoveringInteractive ? 0.9 : 0.6);
  }, [isHoveringInteractive, ringScale, ringOpacity, innerOpacity]);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      aria-hidden
    >
      {/* Outer ring — subtle, professional */}
      <motion.div
        className="absolute rounded-full border border-white"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          left: -RING_SIZE / 2,
          top: -RING_SIZE / 2,
          x,
          y,
          opacity: ringOpacity,
          scale: ringScale,
          borderWidth: RING_BORDER,
        }}
      />
      {/* Inner dot — crisp, follows exactly */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: INNER_SIZE,
          height: INNER_SIZE,
          left: -INNER_SIZE / 2,
          top: -INNER_SIZE / 2,
          x,
          y,
          opacity: innerOpacity,
        }}
      />
    </div>
  );
}
