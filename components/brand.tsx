import type { CSSProperties } from "react";

import { brandPaths, type BrandPath } from "@/content/brand-paths";
import { cn } from "@/lib/utils";

/*
 * Tool logos in their real brand colours. ChatGPT and ElevenLabs are
 * black-and-white brands, so they follow the text colour (and flip in dark
 * mode). Gemini uses its gradient, defined once in <BrandDefs />.
 */
const vectorFill: Record<BrandPath, string> = {
  claude: "#D97757",
  chatgpt: "currentColor",
  gemini: "url(#gemini-gradient)",
  elevenlabs: "currentColor",
};

const rasterTools = {
  flow: "/logos/flow-color.png",
  heygen: "/logos/heygen-color.png",
} as const;

export type ToolId = BrandPath | keyof typeof rasterTools;

/** A tool's logo at 1em. */
export function ToolLogo({ id, className }: { id: ToolId; className?: string }) {
  if (id in brandPaths) {
    const b = brandPaths[id as BrandPath];
    return (
      <svg viewBox={b.viewBox} aria-hidden className={cn("size-[1em] shrink-0", className)}>
        <path d={b.d} fill={vectorFill[id as BrandPath]} />
      </svg>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static marks, no optimisation needed
    <img
      src={rasterTools[id as keyof typeof rasterTools]}
      alt=""
      aria-hidden
      width={96}
      height={96}
      className={cn("size-[1em] shrink-0 object-contain", className)}
    />
  );
}

/** Shared SVG paint servers. Rendered once in the layout. */
export function BrandDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="gemini-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4796E3" />
          <stop offset="55%" stopColor="#9177C7" />
          <stop offset="100%" stopColor="#CA6673" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const maskStyle = (src: string): CSSProperties => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
});

/** The imaPRO wordmark (a white PNG) recoloured to the current text colour. */
export function ImaproLogo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="imaPRO"
      className={cn("inline-block aspect-[286/64] h-[1em] bg-current", className)}
      style={maskStyle("/logos/imapro.png")}
    />
  );
}
