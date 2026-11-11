"use client";

import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Light/dark switch. Where the View Transitions API exists, the new theme
 * opens as a circle from the button (450ms). Otherwise it swaps instantly.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }

    // Keyboard clicks report 0,0, so fall back to the button's centre.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => flushSync(apply));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 450,
          easing: "cubic-bezier(0.2, 0.7, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggle}
          aria-label="Switch colour theme"
          className="relative inline-flex size-11 items-center justify-center text-ink transition-colors hover:text-accent-ink"
        >
          <Sun weight="bold" className="size-[18px] dark:hidden" aria-hidden />
          <Moon weight="bold" className="hidden size-[18px] dark:block" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="dark:hidden">Dark mode</span>
        <span className="hidden dark:inline">Light mode</span>
      </TooltipContent>
    </Tooltip>
  );
}
