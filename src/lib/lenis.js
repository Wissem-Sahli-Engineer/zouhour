import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis;

export function initLenis(wrapper) {
  destroyLenis();

  const options = {
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  };

  if (wrapper && wrapper !== window) {
    options.wrapper = wrapper;
    options.content = wrapper.firstElementChild || wrapper;
  }

  lenis = new Lenis(options);
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function raf(time) {
  lenis?.raf(time * 1000);
}

export function destroyLenis() {
  if (!lenis) return;
  gsap.ticker.remove(raf);
  lenis.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
