"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowRight, DownloadSimple, X } from "@phosphor-icons/react";

import { LocalTime } from "@/components/chrome/local-time";
import { ThemeToggle } from "@/components/chrome/theme-toggle";
import { useLockSmoothScroll, useSmoothScroll } from "@/components/providers/smooth-scroll";
import { sectionIcons } from "@/components/section-icons";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function SiteHeader() {
  const { scrollYProgress } = useScroll();
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = useRef<string | null>(null);
  const { scrollToId } = useSmoothScroll();
  useLockSmoothScroll(menuOpen);

  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper"
    >
      <div className="shell grid-12 h-14 items-center">
        <a
          href="#top"
          className="col-span-2 flex h-14 items-center gap-3 justify-self-start lg:col-span-3"
          aria-label="Ankit Singh, back to top"
        >
          <span className="font-display text-[1.3125rem] font-semibold leading-none tracking-[-0.01em]">
            Ankit Singh
          </span>
        </a>

        <nav aria-label="Sections" className="hidden lg:col-span-6 lg:block">
          <ul className="flex items-center justify-between">
            {nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "label group relative -mx-2 inline-flex h-14 items-center px-2 transition-colors",
                      isActive ? "text-ink" : "text-ink-2 hover:text-ink"
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-2 bottom-[-1px] h-px origin-left bg-ink transition-transform duration-300 ease-(--ease-out)",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-6 lg:col-span-3">
          <LocalTime className="label mr-3 hidden text-ink-2 xl:inline" />
          <Button asChild variant="outline" size="sm" className="mr-1 hidden md:inline-flex">
            <a href={site.resume} download="Ankit-Singh-Resume.pdf">
              <DownloadSimple weight="bold" aria-hidden />
              Resume
            </a>
          </Button>
          <ThemeToggle />

          <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogPrimitive.Trigger className="label -mr-2 inline-flex h-11 items-center px-2 text-ink lg:hidden">
              Menu
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Content
                data-lenis-prevent
                aria-describedby={undefined}
                onCloseAutoFocus={(e) => {
                  if (!pending.current) return;
                  e.preventDefault();
                  scrollToId(pending.current);
                  pending.current = null;
                }}
                className={cn(
                  "fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-paper text-ink outline-none",
                  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=open]:duration-300",
                  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200"
                )}
              >
                <div className="shell flex h-14 shrink-0 items-center justify-between border-b border-rule">
                  <DialogPrimitive.Title className="font-display text-[1.3125rem] font-semibold leading-none tracking-[-0.01em]">
                    Ankit Singh
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="label -mr-2 inline-flex h-11 items-center gap-2 px-2">
                    Close <X weight="bold" className="size-3.5" aria-hidden />
                  </DialogPrimitive.Close>
                </div>
                <nav aria-label="Sections" className="shell flex-1 py-6">
                  <ul>
                    {nav.map((item, i) => {
                      const Icon = sectionIcons[item.id];
                      return (
                      <li
                        key={item.id}
                        className="border-b border-rule animate-in fade-in-0 slide-in-from-bottom-2 [animation-fill-mode:both] duration-300"
                        style={{ animationDelay: `${60 + i * 35}ms` }}
                      >
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            pending.current = item.id;
                            setMenuOpen(false);
                          }}
                          className="flex items-center justify-between py-4"
                        >
                          <span className="flex items-center gap-4 font-display text-[2.75rem] font-medium leading-none tracking-[-0.025em]">
                            <span className="icon-tile size-11 shrink-0">
                              <Icon weight="duotone" aria-hidden className="icon-duo size-6" />
                            </span>
                            {item.label}
                          </span>
                          <ArrowRight weight="bold" aria-hidden className="size-5 text-ink-2" />
                        </a>
                      </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="shell label flex shrink-0 justify-between gap-4 border-t border-rule py-4 text-ink-2">
                  <LocalTime />
                  <a href={`mailto:${site.email}`} className="text-ink">
                    Email me
                  </a>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>

      <m.div
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
