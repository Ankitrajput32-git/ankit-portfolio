import type { CSSProperties } from "react";
import Image from "next/image";

import { ToolLogo } from "@/components/brand";
import { heroTools } from "@/content/skills";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Where each tool tag sits on the photo (desktop only), in the order of
 * heroTools: left and right of the head, clear of the face.
 */
const spots: CSSProperties[] = [
  { left: "4%", top: "9%" },
  { right: "1%", top: "6%" },
  { left: "0%", top: "24%" },
  { right: "0%", top: "21%" },
  { left: "5%", top: "39%" },
  { right: "3%", top: "36%" },
];

/**
 * The hero photo: the cut-out with its cropped edges faded into the page,
 * and the AI tools as tags around the head.
 */
export function PortraitStage() {
  return (
    <div className="relative isolate h-full">
      {/* Phones: out of flow, so it adds no height of its own; as tall as the
          row it is given, width from the photo's ratio, right-aligned.
          Desktop: fills its column from the top of the hero to the bottom edge.
          The frame is taller than the photo, so it crops the outer shoulders,
          which the side fades hide anyway, and the face gets bigger. */}
      <div
        className="portrait-blend intro-lift z-10 aspect-[1328/1184] max-w-full max-md:absolute max-md:inset-y-0 max-md:right-0 md:relative lg:aspect-auto lg:h-full"
        style={delay(120)}
      >
        {/* Expression softened with ChatGPT; the untouched original is /portrait.png */}
        <Image
          src="/portrait-smile.png"
          alt="Ankit Singh smiling slightly, in a navy suit and white shirt, looking to the side"
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 62vw"
          className="object-contain object-bottom lg:object-cover lg:object-top"
        />
      </div>

      <ul aria-label="AI tools I use" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        {heroTools.map((tool, i) => (
          <li key={tool.name} className="intro-fade absolute" style={{ ...spots[i], ...delay(1250 + i * 70) }}>
            <span className="label inline-flex h-9 items-center gap-2 border border-rule-strong bg-paper px-3 text-ink">
              <ToolLogo id={tool.logo} className="text-[15px]" />
              {tool.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
