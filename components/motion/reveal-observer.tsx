"use client";

import { useEffect } from "react";

/*
 * Marks elements with a data-in attribute, not a class: React owns className,
 * and sections that hydrate after this runs (Work sits in a Suspense
 * boundary) would see a changed className and report a hydration mismatch.
 * An attribute React never renders is left alone.
 */
const SELECTOR = ".reveal:not([data-in]), .mask-words:not([data-in]), .wipe:not([data-in])";

/** One observer for every reveal on the page, including ones added later. */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    const scan = (root: ParentNode) => root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.matches(SELECTOR)) io.observe(node);
            scan(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
