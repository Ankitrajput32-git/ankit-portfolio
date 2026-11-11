"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useSpring } from "motion/react";

import { useFinePointer, usePrefersReducedMotion } from "@/hooks/use-media-query";

type CursorState = { kind: "dot" | "ring" | "label" | "hidden"; label?: string; ink?: boolean };

const ease = [0.2, 0.7, 0, 1] as const;

/**
 * Desktop-only cursor. A small accent dot that becomes a ring over links and
 * a labelled disc over anything with data-cursor="Label". data-cursor="hide"
 * hides it. Inside data-cursor-tone="ink"
 * (the blue contact block) it turns ink so it stays visible. Off for touch and for
 * reduced motion, where the native cursor stays.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 });

  const [state, setState] = useState<CursorState>({ kind: "dot" });
  const [visible, setVisible] = useState(false);
  const last = useRef("dot");

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-cursor], a, button, [role='button'], label, summary");
      let next: CursorState = { kind: "dot" };
      if (el) {
        const attr = el.getAttribute("data-cursor");
        if (attr === "hide") next = { kind: "hidden" };
        else if (attr) next = { kind: "label", label: attr };
        else next = { kind: "ring" };
      }
      next.ink = !!target?.closest?.("[data-cursor-tone='ink']");
      const key = next.kind + (next.label ?? "") + (next.ink ? "ink" : "");
      if (key !== last.current) {
        last.current = key;
        setState(next);
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.kind === "label" ? 84 : state.kind === "ring" ? 44 : 10;
  const rgb = state.ink ? "21,20,15" : "33,136,187";

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className={
          "label flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.625rem] " +
          (state.ink ? "text-paper-fixed" : "text-on-accent")
        }
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: visible && state.kind !== "hidden" ? 1 : 0,
          backgroundColor: `rgba(${rgb},${state.kind === "ring" ? 0 : 1})`,
          borderColor: `rgba(${rgb},1)`,
          borderWidth: state.kind === "ring" ? 1.5 : 0,
        }}
        style={{ borderStyle: "solid" }}
        transition={{ duration: 0.25, ease }}
      >
        {state.kind === "label" ? state.label : null}
      </m.div>
    </m.div>
  );
}
