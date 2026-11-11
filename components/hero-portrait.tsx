"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";

import { ToolLogo } from "@/components/brand";
import { heroTools } from "@/content/skills";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Where each tool tag sits on the photo (desktop only), in the order of
 * heroTools: left and right of the head, clear of the face, plus how far it
 * drifts with the pointer. Different depths make the layer feel 3D.
 */
const spots: { pos: CSSProperties; depth: number }[] = [
  { pos: { left: "4%", top: "9%" }, depth: 14 },
  { pos: { right: "1%", top: "6%" }, depth: 10 },
  { pos: { left: "0%", top: "24%" }, depth: 8 },
  { pos: { right: "0%", top: "21%" }, depth: 16 },
  { pos: { left: "5%", top: "39%" }, depth: 12 },
  { pos: { right: "3%", top: "36%" }, depth: 9 },
];

/**
 * The hero photo: the cut-out with its cropped edges faded into the page,
 * and the AI tools as tags around the head that drift a little with the
 * pointer.
 */
export function PortraitStage() {
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  // Pointer parallax. Eased toward the target each frame so it trails the
  // cursor instead of snapping. Mouse and trackpad only, never under reduced motion.
  useEffect(() => {
    const hero = stage.current?.closest("section");
    if (!hero) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      tags.current.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(${-x * spots[i].depth}px, ${-y * spots[i].depth}px, 0)`;
      });
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    hero.addEventListener("pointermove", onMove);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={stage} className="relative isolate h-full">
      {/* Desktop: fills its column from the top of the hero to the bottom edge.
          The frame is taller than the photo, so it crops the outer shoulders,
          which the side fades hide anyway, and the face gets bigger. */}
      <div
        className="portrait-blend intro-lift relative z-10 aspect-[1328/1184] lg:aspect-auto lg:h-full"
        style={delay(120)}
      >
        {/* Expression softened with ChatGPT; the untouched original is /portrait.png */}
        <Image
          src="/portrait-smile.png"
          alt="Ankit Singh smiling slightly, in a navy suit and white shirt, looking to the side"
          fill
          preload
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 62vw"
          className="object-contain object-bottom lg:object-cover lg:object-top"
        />
      </div>

      <ul aria-label="AI tools I use" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        {heroTools.map((tool, i) => (
          <li key={tool.name} className="intro-fade absolute" style={{ ...spots[i].pos, ...delay(1250 + i * 70) }}>
            <span
              ref={(el) => {
                tags.current[i] = el;
              }}
              className="label inline-flex h-9 items-center gap-2 border border-rule-strong bg-paper px-3 text-ink"
            >
              <ToolLogo id={tool.logo} className="text-[15px]" />
              {tool.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
