"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type Lenis from "lenis";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { afterFirstInteraction, loadGsap } from "@/lib/gsap";

type SmoothScrollContext = {
  lenis: Lenis | null;
  scrollToId: (id: string) => void;
};

const Ctx = createContext<SmoothScrollContext>({ lenis: null, scrollToId: () => {} });

export const useSmoothScroll = () => useContext(Ctx);

function headerOffset() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return (header?.offsetHeight ?? 56) + 8;
}

/**
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and ScrollTrigger
 * listens to Lenis. All three load on the first interaction. Reduced-motion
 * users get native scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    afterFirstInteraction()
      .then(() => Promise.all([import("lenis"), loadGsap()]))
      .then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
        const instance = new LenisCtor({ lerp: 0.12, smoothWheel: true });
        instance.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setLenis(instance);
        cleanup = () => {
          gsap.ticker.remove(tick);
          instance.destroy();
        };
      });

    return () => {
      cancelled = true;
      cleanup?.();
      setLenis(null);
    };
  }, [reduced]);

  // Fonts loading, images arriving and the work filter all change the page
  // height. Pinned sections need fresh measurements whenever that happens.
  useEffect(() => {
    const refresh = () => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    document.fonts?.ready.then(refresh);
    const main = document.getElementById("main");
    if (!main) return;
    let last = main.offsetHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      const h = main.offsetHeight;
      if (Math.abs(h - last) < 2) return;
      last = h;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        refresh().then(() => (last = main.offsetHeight));
      }, 250);
    });
    ro.observe(main);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const scrollToId = useCallback(
    (id: string) => {
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(id === "top" ? 0 : target, { offset: -headerOffset(), duration: 1.1 });
      } else {
        target.scrollIntoView({ block: "start" });
      }

      history.pushState(null, "", id === "top" ? location.pathname : `#${id}`);

      // Move focus so keyboard and screen reader users land in the section too.
      const focusTarget = id === "top" ? document.getElementById("main") : target;
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    },
    [lenis]
  );

  // One handler for every in-page link on the site.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent(anchor.hash.slice(1)) || "top";
      if (id !== "top" && !document.getElementById(id)) return;
      event.preventDefault();
      scrollToId(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollToId]);

  const value = useMemo(() => ({ lenis, scrollToId }), [lenis, scrollToId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Pause smooth scroll while a modal owns the screen. */
export function useLockSmoothScroll(locked: boolean) {
  const { lenis } = useSmoothScroll();
  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [lenis, locked]);
}
