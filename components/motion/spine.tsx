"use client";

import { useEffect, useRef } from "react";

import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** The timeline's accent line, drawn as you read down the list. */
export function Spine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const el = ref.current;
      ctx = gsap.context(() => {
        gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 60%", scrub: true },
            }
          );
        });
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return <span ref={ref} aria-hidden className={cn("origin-top bg-accent", className)} />;
}
