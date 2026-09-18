import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { EASE, ROUTE_DURATION, gsap } from "../lib/gsap";

export function RouteTransition({ children }) {
  const ref = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: reduce ? 0 : 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduce ? 0 : ROUTE_DURATION, ease: EASE }
      );
    }, ref);
    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={ref} className="min-h-full">
      {children}
    </div>
  );
}
