import type { CSSProperties } from "react";
import Image from "next/image";
import { Check, MagicWand } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/*
 * One small animated scene per workflow step. Each plays once when its step
 * switches on (data-on), and the CSS in globals.css (.scene / .sv-*) holds
 * the motion: transform and opacity only, from each element's --d delay.
 * Without JS, or under reduced motion, they show their finished state.
 * Purely illustrative, so hidden from screen readers.
 */

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const frame = "scene relative aspect-[16/10] w-full max-w-[22rem] overflow-hidden border border-rule bg-paper";

/* Idea: four angles appear, three fade back, one is picked */
function IdeaScene() {
  const angles = [70, 52, 86, 60];
  return (
    <div className="flex h-full flex-col justify-center gap-[9%] px-[10%]">
      {angles.map((w, i) => {
        const picked = i === 2;
        return (
          <span key={i} className={cn("relative flex items-center gap-3", !picked && "sv-dim")} style={d(950)}>
            <span className="sv-grow relative h-2.5 bg-rule-strong" style={{ width: `${w}%`, ...d(i * 110) }}>
              {picked ? <span className="sv-fade absolute inset-0 bg-accent" style={d(1000)} /> : null}
            </span>
            {picked ? (
              <span className="sv-pop flex size-5 items-center justify-center bg-accent text-on-accent" style={d(1150)}>
                <Check weight="bold" className="size-3" />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

/* Script: lines type out next to their shot markers, then the hook is highlighted */
function ScriptScene() {
  const lines = [88, 70, 94, 56, 80];
  return (
    <div className="flex h-full flex-col justify-center gap-[7%] px-[9%]">
      {lines.map((w, i) => (
        <span key={i} className="flex items-center gap-3">
          <span
            className={cn("sv-pop size-2 shrink-0", i % 2 === 0 ? "bg-accent" : "bg-transparent")}
            style={d(i * 170)}
          />
          <span className="relative h-2 flex-1">
            {i === 0 ? (
              <span className="sv-grow absolute -inset-y-1.5 -left-1 bg-accent/25" style={{ width: "96%", ...d(1050) }} />
            ) : null}
            <span className="sv-type absolute inset-y-0 left-0 bg-ink-2/60" style={{ width: `${w}%`, ...d(i * 170) }} />
          </span>
        </span>
      ))}
    </div>
  );
}

/* Visuals: a real frame from the Xtrusio channel "renders" tile by tile */
const TILE_ORDER = [5, 17, 2, 11, 20, 8, 0, 14, 22, 3, 9, 19, 6, 12, 1, 23, 15, 7, 21, 4, 10, 18, 13, 16];
function VisualsScene() {
  return (
    <div className="absolute inset-[8%]">
      <Image src="/work/yt-D64Xr5vMumk.jpg" alt="" fill sizes="20rem" className="object-cover" />
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {TILE_ORDER.map((order, i) => (
          <span key={i} className="sv-hide bg-paper-2" style={d(120 + order * 42)} />
        ))}
      </div>
      <span
        className="sv-pop absolute -right-2.5 -top-2.5 flex size-7 items-center justify-center bg-accent text-on-accent"
        style={d(1300)}
      >
        <MagicWand weight="fill" className="size-4" />
      </span>
    </div>
  );
}

/* Edit: clips land on the timeline, the waveform draws, the playhead runs */
const WAVE = [40, 70, 55, 90, 35, 65, 80, 45, 60, 95, 50, 70, 30, 85, 55, 75, 40, 65];
function EditScene() {
  return (
    <div className="absolute inset-[9%] flex flex-col justify-center gap-[7%]">
      <div className="flex h-[26%] gap-1">
        {[
          { w: "30%", tone: "bg-accent" },
          { w: "40%", tone: "bg-accent/60" },
          { w: "24%", tone: "bg-accent/85" },
        ].map((clip, i) => (
          <span key={i} className={cn("sv-in h-full", clip.tone)} style={{ width: clip.w, ...d(i * 150) }} />
        ))}
      </div>
      <div className="flex h-[12%] gap-1.5">
        {["18%", "26%", "14%", "22%"].map((w, i) => (
          <span key={i} className="sv-in h-full bg-ink-2/45" style={{ width: w, ...d(350 + i * 110) }} />
        ))}
      </div>
      <div className="flex h-[26%] items-end gap-[3px]">
        {WAVE.map((h, i) => (
          <span key={i} className="sv-grow-y flex-1 bg-ink-2/60" style={{ height: `${h}%`, ...d(550 + i * 28) }} />
        ))}
      </div>
      <div className="sv-play pointer-events-none absolute -inset-y-[6%] left-0 right-0" style={d(900)}>
        <span className="absolute inset-y-0 left-0 w-px bg-accent" />
        <span className="absolute -left-[3px] top-0 size-[7px] bg-accent" />
      </div>
    </div>
  );
}

/* Publish: the post slides up on a phone, uploads, goes live, numbers start moving */
function PublishScene() {
  return (
    <div className="flex h-full items-center justify-center gap-[8%]">
      <div className="relative h-[82%] aspect-[9/16] rounded-[0.8rem] border-2 border-ink/70 p-[3px]">
        <div className="relative h-full overflow-hidden rounded-[0.55rem] bg-paper-2">
          <div className="sv-rise absolute inset-0" style={d(150)}>
            <Image src="/work/yt-81ipKf1agyg.jpg" alt="" fill sizes="6rem" className="object-cover" />
          </div>
          <span className="absolute inset-x-[10%] top-[6%] h-[3px] bg-paper/60">
            <span className="sv-grow absolute inset-0 bg-accent" style={d(650)} />
          </span>
        </div>
        <span
          className="sv-pop absolute -right-3 -top-3 flex size-7 items-center justify-center rounded-full bg-accent text-on-accent"
          style={d(1350)}
        >
          <Check weight="bold" className="size-4" />
        </span>
      </div>
      <div className="flex w-[28%] flex-col gap-2.5">
        {[90, 64, 78].map((w, i) => (
          <span key={i} className="sv-grow h-2 bg-ink-2/50" style={{ width: `${w}%`, ...d(1450 + i * 120) }} />
        ))}
      </div>
    </div>
  );
}

const scenes = [IdeaScene, ScriptScene, VisualsScene, EditScene, PublishScene];

export function StepScene({ index, on }: { index: number; on: boolean }) {
  const Scene = scenes[index];
  if (!Scene) return null;
  return (
    <div aria-hidden data-on={on} className={frame}>
      <Scene />
    </div>
  );
}
