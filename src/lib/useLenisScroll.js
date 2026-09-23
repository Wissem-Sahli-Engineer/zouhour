import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "./gsap";

// A self-contained Lenis instance scoped to one scroll container, independent
// of the app-wide singleton in lib/lenis.js (which drives the main page scroll).
export function useLenisScroll(ref) {
  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper,
      content: wrapper.firstElementChild || wrapper,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [ref]);
}
