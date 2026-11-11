"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "static" | "waiting" | "typing" | "holding" | "deleting";

/* "n " for roles that need "an", so the article is typed and deleted with the role */
const tail = (role: string) => (/^[aeiou]/i.test(role) ? "n " : " ") + role;

/**
 * "I'm a ___" with the role typed out, held, deleted and the next one typed,
 * on a loop. It pauses while off screen, while the tab is hidden and while
 * the pointer rests on it. The server render and reduced motion show the
 * first role with no caret, which also keeps hydration in sync. `startAt` is
 * ms after navigation, so the first word lines up with the CSS intro.
 */
export function TypedRole({ roles, startAt = 0 }: { roles: readonly string[]; startAt?: number }) {
  const [text, setText] = useState(() => tail(roles[0]));
  const [phase, setPhase] = useState<Phase>("static");
  const line = useRef<HTMLSpanElement>(null);
  const hovered = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let offscreen = false;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
    });
    if (line.current) observer.observe(line.current);

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const paused = () => offscreen || document.hidden || hovered.current;
    const wait = async (ms: number) => {
      await sleep(ms);
      while (!cancelled && paused()) await sleep(200);
    };

    (async () => {
      setText("");
      setPhase("waiting");
      await wait(Math.max(0, startAt - performance.now()));

      for (let r = 0; !cancelled; r = (r + 1) % roles.length) {
        const word = tail(roles[r]);
        setPhase("typing");
        for (let i = 1; i <= word.length; i++) {
          if (cancelled) return;
          setText(word.slice(0, i));
          // Slightly uneven keystrokes read as a person typing, not a ticker
          await wait(50 + (i % 3) * 16);
        }
        setPhase("holding");
        await wait(1600);
        setPhase("deleting");
        for (let i = word.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setText(word.slice(0, i));
          await wait(28);
        }
        await wait(240);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [roles, startAt]);

  const lead = text.startsWith("n") ? "n" : "";
  return (
    <span
      ref={line}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
      className="block whitespace-nowrap"
    >
      I&apos;m a{lead}
      <span className="font-semibold text-accent-ink">{text.slice(lead.length)}</span>
      <span aria-hidden data-state={phase} className="type-caret" />
    </span>
  );
}
