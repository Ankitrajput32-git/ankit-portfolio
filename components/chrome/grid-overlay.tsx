"use client";

import { useEffect, useState } from "react";

export const TOGGLE_GRID_EVENT = "toggle-grid";

/**
 * The layout grid, shown on demand. Press G (or use the footer button)
 * to see the 4 / 8 / 12 columns every section sits on.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return;
      setVisible((v) => !v);
    };
    const onToggle = () => setVisible((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener(TOGGLE_GRID_EVENT, onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TOGGLE_GRID_EVENT, onToggle);
    };
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150]">
      <div className="shell grid-12 h-full">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={
              "h-full border-x border-accent/25 bg-accent/[0.06] " +
              (i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : "")
            }
          />
        ))}
      </div>
      <p className="label absolute bottom-3 left-1/2 -translate-x-1/2 bg-accent px-2 py-1 text-on-accent">
        <span className="md:hidden">4 columns</span>
        <span className="hidden md:inline lg:hidden">8 columns</span>
        <span className="hidden lg:inline">12 columns</span> · G to hide
      </p>
    </div>
  );
}
