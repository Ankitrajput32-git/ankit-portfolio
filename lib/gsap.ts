import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Loaded = { gsap: typeof GSAP; ScrollTrigger: typeof ScrollTriggerType };

let interacted: Promise<void> | null = null;
let loaded: Promise<Loaded> | null = null;

/**
 * Resolves on the visitor's first scroll, tap, key or mouse move (or right
 * away if the page opened scrolled or on a #section). Nothing that GSAP
 * drives is visible before then, so the hero never waits on it.
 */
function firstInteraction(): Promise<void> {
  if (!interacted) {
    interacted = new Promise((resolve) => {
      if (window.scrollY > 0 || location.hash) return resolve();
      const events = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"];
      const go = () => {
        events.forEach((e) => window.removeEventListener(e, go));
        resolve();
      };
      events.forEach((e) => window.addEventListener(e, go, { passive: true }));
    });
  }
  return interacted;
}

/** GSAP and ScrollTrigger in their own chunk, loaded after first interaction. */
export function loadGsap(): Promise<Loaded> {
  if (!loaded) {
    loaded = firstInteraction()
      .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
      .then(([g, st]) => {
        g.gsap.registerPlugin(st.ScrollTrigger);
        return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
      });
  }
  return loaded;
}

/** Same trigger, for other deferred work (Lenis). */
export const afterFirstInteraction = firstInteraction;
