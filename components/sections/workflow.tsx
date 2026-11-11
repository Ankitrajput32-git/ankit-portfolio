"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, MagicWand, PaperPlaneTilt, PenNib, Scissors } from "@phosphor-icons/react";

import { SectionHeader } from "@/components/section-header";
import { ToolLogo } from "@/components/brand";
import { StepScene } from "@/components/workflow-scenes";
import { WithNotes } from "@/components/with-notes";
import { workflow } from "@/content/workflow";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* Idea, Script, Visuals, Edit, Publish */
const stepIcons = [Lightbulb, PenNib, MagicWand, Scissors, PaperPlaneTilt];

/**
 * Idea to publish as one horizontal line. On desktop the row pins and the
 * line fills as you scroll, switching each step on as it arrives. On smaller
 * screens it runs vertically and fills without pinning. Reduced motion shows
 * the finished state.
 */
export function Workflow() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    const set = (i: number) => {
      if (activeRef.current === i) return;
      activeRef.current = i;
      setActive(i);
    };

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(
          {
            desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
            mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { desktop, mobile, reduce } = context.conditions as Record<string, boolean>;
            const steps = gsap.utils.toArray<HTMLElement>("[data-step]");

            if (reduce) {
              set(steps.length - 1);
              return;
            }

            if (desktop) {
              gsap.set("[data-line-x]", { scaleX: 0 });
              gsap.timeline({
                scrollTrigger: {
                  trigger: pin.current,
                  start: "center center",
                  end: "+=130%",
                  pin: true,
                  scrub: true,
                  anticipatePin: 1,
                  onUpdate: (self) =>
                    set(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999 + 0.2))),
                  onLeaveBack: () => set(-1),
                },
              }).to("[data-line-x]", { scaleX: 1, ease: "none" });
            }

            if (mobile) {
              gsap.set("[data-line-y]", { scaleY: 0 });
              gsap.to("[data-line-y]", {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: "[data-steps]",
                  start: "top 70%",
                  end: "bottom 70%",
                  scrub: true,
                },
              });
              steps.forEach((step, i) => {
                ScrollTrigger.create({
                  trigger: step,
                  start: "top 70%",
                  onEnter: () => set(i),
                  onLeaveBack: () => set(i - 1),
                });
              });
            }
          }
        );
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="workflow"
      aria-labelledby="workflow-title"
      className="bg-paper-2 pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32"
    >
      <SectionHeader
        section="workflow"
        heading="Workflow"
        label="Five steps, every project"
        aside="Brief in, video out"
        title="How a brief becomes *a video you can post*"
        titleId="workflow-title"
      />

      <div ref={pin} className="shell pt-16 lg:flex lg:min-h-[70vh] lg:items-center lg:pt-0">
        <div className="relative w-full">
          {/* Horizontal line (desktop) */}
          <div aria-hidden className="absolute inset-x-0 top-[7px] hidden h-px bg-rule lg:block" />
          <div
            aria-hidden
            data-line-x
            className="absolute inset-x-0 top-[7px] hidden h-px origin-left bg-accent lg:block"
          />
          {/* Vertical line (mobile, tablet) */}
          <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-rule lg:hidden" />
          <div
            aria-hidden
            data-line-y
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent lg:hidden"
          />

          <ol data-steps className="grid gap-12 lg:grid-cols-5 lg:gap-6">
            {workflow.map((s, i) => {
              const on = i <= active;
              const Icon = stepIcons[i];
              return (
                <li key={s.step} data-step className="relative pl-10 lg:pl-0">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0 block size-[15px] border bg-paper-2 transition-colors duration-300 lg:relative",
                      on ? "border-accent" : "border-rule-strong"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-[3px] bg-accent transition-transform duration-300 ease-(--ease-out)",
                        on ? "scale-100" : "scale-0"
                      )}
                    />
                  </span>
                  <p
                    className={cn(
                      "label flex items-center gap-2 transition-colors duration-300 lg:mt-7",
                      on ? "text-accent-ink" : "text-ink-2"
                    )}
                  >
                    <Icon weight="duotone" aria-hidden className="icon-duo size-5" />
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(2.25rem,3.4vw,3.25rem)] font-medium leading-none tracking-[-0.025em]">
                    <span className="relative">
                      {s.step}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-(--ease-out)",
                          on ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </span>
                  </h3>
                  <div className="mt-6">
                    <StepScene index={i} on={on} />
                  </div>
                  <p className="mt-5 max-w-[34ch] text-base leading-relaxed">{s.body}</p>
                  <dl className="mt-6 grid grid-cols-[4.5rem_1fr] gap-y-2 border-t border-rule pt-3 text-[0.8125rem]">
                    <dt className="label pt-0.5 text-ink-2">Output</dt>
                    <dd>{s.output}</dd>
                    <dt className="label pt-0.5 text-ink-2">Tools</dt>
                    <dd className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {s.tools.map((t) => (
                        <span key={t.name} className="inline-flex items-center gap-1.5">
                          <ToolLogo id={t.logo} className="text-[15px]" />
                          {t.name}
                        </span>
                      ))}
                      {s.note ? (
                        <span className="text-ink-2">
                          <WithNotes text={s.note} />
                        </span>
                      ) : null}
                    </dd>
                  </dl>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
