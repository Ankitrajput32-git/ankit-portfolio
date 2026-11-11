import { Fragment, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

/*
 * Server-rendered reveals. The motion lives in CSS (.reveal, .mask-words in
 * globals.css) and one shared IntersectionObserver (RevealObserver) adds
 * data-in when an element enters the viewport. No per-element JavaScript.
 *
 * That attribute is set outside React on purpose, and it can land before a
 * client section (Work, Workflow) hydrates, so each marked element carries
 * suppressHydrationWarning. React never renders data-in, so it never
 * removes it either.
 */

/** Fade and lift on first view. Reduced motion keeps the fade only. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      suppressHydrationWarning
      className={cn("reveal", className)}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Words rise out of their own masks, staggered. `*words*` render in the
 * muted tone, which is how section titles get their two-tone emphasis.
 */
export function MaskWords({
  text,
  className,
  emphasis = "text-ink-2",
}: {
  text: string;
  className?: string;
  emphasis?: string;
}) {
  const words: { word: string; muted: boolean }[] = [];
  text.split("*").forEach((chunk, i) => {
    chunk
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => words.push({ word, muted: i % 2 === 1 }));
  });

  return (
    <span suppressHydrationWarning className={cn("mask-words", className)}>
      {words.map(({ word, muted }, i) => (
        <Fragment key={i}>
          <span className="intro-mask inline-block align-bottom">
            <span
              className={cn("mask-word inline-block", muted && emphasis)}
              style={{ "--i": i } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
