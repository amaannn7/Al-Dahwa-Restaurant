"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveals: an IntersectionObserver decides when, GSAP animates
 * (transforms + opacity only, staggered per batch, cleaned up via matchMedia
 * revert). IntersectionObserver also catches jumps (anchor links, restored
 * scroll position), where scroll-event triggers can miss elements. Motion identity
 * follows the motion-design skill's "premium" archetype: one decelerating
 * curve, 0.8s entrances, 80ms stagger, short travel (24px).
 * Elements marked [data-reveal] stay visible with JS off or reduced motion.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    const html = document.documentElement;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
          if (ctx.conditions?.reduce) {
            gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
            return;
          }
          gsap.set(targets, { opacity: 0, y: 24 });
          const io = new IntersectionObserver(
            (entries) => {
              const entering: Element[] = [];
              const passed: Element[] = [];
              for (const e of entries) {
                if (e.isIntersecting) entering.push(e.target);
                else if (e.boundingClientRect.bottom <= 0) passed.push(e.target);
                else continue;
                io.unobserve(e.target);
              }
              // Already scrolled past (e.g. after a jump): show without animating.
              if (passed.length) gsap.set(passed, { opacity: 1, y: 0 });
              if (entering.length)
                gsap.to(entering, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08, overwrite: true });
            },
            { rootMargin: "0px 0px -8% 0px" },
          );
          targets.forEach((el) => io.observe(el));
          return () => io.disconnect();
        },
      );
      html.classList.add("motion-ready");

      // Elements added later (e.g. menu search results) fade in once.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mo = new MutationObserver((records) => {
        const fresh: HTMLElement[] = [];
        for (const r of records)
          r.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement)) return;
            if (n.matches("[data-reveal]")) fresh.push(n);
            n.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => fresh.push(el));
          });
        const targets = fresh.filter((el) => !el.style.opacity);
        if (!targets.length) return;
        if (reduce) gsap.set(targets, { opacity: 1 });
        else gsap.fromTo(targets, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "expo.out", stagger: 0.03 });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      revert = () => {
        mo.disconnect();
        mm.revert();
      };
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
