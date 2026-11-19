"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

/**
 * Hero entrance timeline. Hero text is the LCP candidate, so it only moves
 * (transform) and is never hidden: it paints straight from the HTML.
 */
export function HeroIntro({ children, className }: { children: React.ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.1 } });
        tl.from("[data-hero-rise]", { y: 36 }, 0).from("[data-hero-fade]", { y: 18, stagger: 0.1, duration: 0.9 }, 0.1);
      });
    },
    { scope },
  );
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
