import { EASE, ScrollTrigger, gsap, useGSAP } from "../lib/gsap";

export function useScrollReveal(scopeRef, selector = "[data-reveal]") {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = root.querySelectorAll(selector);
      items.forEach((el) => {
        gsap.from(el, {
          y: reduce ? 0 : 16,
          autoAlpha: 0,
          duration: reduce ? 0 : 0.45,
          ease: EASE,
          scrollTrigger: {
            trigger: el,
            scroller: root.closest("main") || undefined,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: scopeRef, dependencies: [] }
  );
}

export { ScrollTrigger };
