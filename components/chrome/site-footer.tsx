"use client";

import { ArrowUp } from "@phosphor-icons/react";

import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-paper">
      <div className="shell flex label items-center justify-between gap-4 py-3 text-ink-2">
        <p>© 2026 {site.name}</p>
        <p>
          <a href="#top" className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-ink">
            Back to top <ArrowUp weight="bold" aria-hidden className="size-3" />
          </a>
        </p>
      </div>
      {/* Sign-off: the name once more, outlined and as wide as the grid */}
      {/* Bottom room on phones so Pixel (fixed bottom-right) never covers the end of the page */}
      <div className="shell overflow-x-clip border-t border-rule pb-24 pt-6 md:pb-2 md:pt-10">
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
