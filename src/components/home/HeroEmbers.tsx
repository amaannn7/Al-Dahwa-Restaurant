"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient ember sparks rising over the hero photo, echoing the fire in the
 * design reference. Built with Three.js following threejs-skills guidance:
 * one Points draw call, additive blending, capped pixel ratio, paused when
 * off-screen or the tab is hidden, full disposal on unmount.
 * Skipped for reduced motion, Save-Data, small screens and low-memory devices,
 * and only started once the page has loaded and gone idle, so it never
 * competes with the hero photo or the first interaction.
 */
export function HeroEmbers() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    if (window.innerWidth < 768) return;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (mem !== undefined && mem < 4) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const {
        WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, BufferAttribute,
        ShaderMaterial, AdditiveBlending, Points, Clock,
      } = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      } catch {
        return;
      }
      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      host.appendChild(canvas);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const isSmall = window.innerWidth < 640;
      const COUNT = isSmall ? 70 : 140;
      const seeds = new Float32Array(COUNT * 4);
      for (let i = 0; i < COUNT; i++) {
        seeds[i * 4] = Math.random() * 2 - 1; // x origin
        seeds[i * 4 + 1] = Math.random(); // phase
        seeds[i * 4 + 2] = 0.35 + Math.random() * 0.9; // speed
        seeds[i * 4 + 3] = Math.random(); // size / warmth
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(new Float32Array(COUNT * 3), 3));
      geometry.setAttribute("seed", new BufferAttribute(seeds, 4));

      const material = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixel: { value: renderer.getPixelRatio() },
          uAspect: { value: 1 },
        },
        vertexShader: /* glsl */ `
          attribute vec4 seed;
          uniform float uTime; uniform float uPixel; uniform float uAspect;
          varying float vLife; varying float vWarm;
          void main() {
            float t = fract(seed.y + uTime * 0.045 * seed.z);
            float y = -1.1 + t * 2.4;
            // concentrate sparks in the lower-centre where the fire sits
            float x = seed.x * (0.55 + t * 0.5) + sin(uTime * 0.7 * seed.z + seed.y * 30.0) * 0.04 * (1.0 + t);
            vLife = t; vWarm = seed.w;
            gl_Position = vec4(x, y, 0.0, 1.0);
            gl_PointSize = (1.4 + seed.w * 2.6) * uPixel * (1.0 - t * 0.6);
          }`,
        fragmentShader: /* glsl */ `
          varying float vLife; varying float vWarm;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float core = smoothstep(0.5, 0.0, d);
            float fade = smoothstep(0.0, 0.12, vLife) * (1.0 - smoothstep(0.55, 1.0, vLife));
            vec3 col = mix(vec3(1.0, 0.45, 0.12), vec3(1.0, 0.78, 0.45), vWarm);
            gl_FragColor = vec4(col * core, core * fade * 0.85);
          }`,
      });

      const points = new Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        renderer.setSize(w, h, false);
        material.uniforms.uAspect.value = w / Math.max(h, 1);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let visible = true;
      let raf = 0;
      const clock = new Clock();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);
      canvas.style.opacity = "0";
      canvas.style.transition = "opacity 1.2s ease";
      requestAnimationFrame(() => (canvas.style.opacity = "1"));
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    };

    // Start after the load event, then wait for an idle period.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idleId = 0;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        idleId = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 4000 }) : window.setTimeout(start, 0);
      }, 1500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      clearTimeout(timer);
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}
