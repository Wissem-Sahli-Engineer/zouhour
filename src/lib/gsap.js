import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const EASE = "power2.out";
export const DURATION = 0.4;
export const ROUTE_DURATION = 0.3;

gsap.defaults({ duration: DURATION, ease: EASE });

export { gsap, ScrollTrigger, useGSAP };
