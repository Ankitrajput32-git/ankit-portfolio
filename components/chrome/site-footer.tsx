"use client";

import { ArrowUp, GridFour, TextAa } from "@phosphor-icons/react";

import { TOGGLE_GRID_EVENT } from "@/components/chrome/grid-overlay";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-paper">
      <div className="shell grid-12 label items-center gap-y-1 py-3 text-ink-2">
        <p className="col-span-2 lg:col-span-3">© 2026 {site.name}</p>
        <p className="col-span-2 flex items-center justify-end gap-1.5 md:justify-start lg:col-span-3">
          <TextAa weight="bold" aria-hidden className="size-3.5 shrink-0" />
          Set in Clash Display and Geist
        </p>
        <p className="col-span-2 md:col-span-2 lg:col-span-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(TOGGLE_GRID_EVENT))}
            className="inline-flex min-h-11 items-center uppercase transition-colors hover:text-ink"
          >
            <GridFour weight="bold" aria-hidden className="mr-1.5 size-3.5" />
            Show the grid <span className="ml-1 hidden md:inline">(G)</span>
          </button>
        </p>
        <p className="col-span-2 text-right md:col-span-2 lg:col-span-3">
          <a href="#top" className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-ink">
            Back to top <ArrowUp weight="bold" aria-hidden className="size-3" />
          </a>
        </p>
      </div>
      {/* Sign-off: the name once more, outlined and as wide as the grid */}
      <div className="shell overflow-x-clip border-t border-rule pb-2 pt-6 md:pt-10">
        <p
          aria-hidden
          className="footer-name select-none whitespace-nowrap font-display text-[min(17.2vw,19.25rem)] font-semibold leading-[0.8] tracking-[-0.045em]"
        >
          Ankit Singh
        </p>
      </div>
    </footer>
  );
}
