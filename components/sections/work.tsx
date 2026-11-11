"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, AnimatePresence, LayoutGroup } from "motion/react";
import {
  ArrowUpRight,
  Buildings,
  DeviceMobile,
  FrameCorners,
  ImageSquare,
  MonitorPlay,
  Play,
  SquaresFour,
  UserFocus,
  Wrench,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";

import { useLockSmoothScroll } from "@/components/providers/smooth-scroll";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { channel, formats, work, type WorkFormat, type WorkItem } from "@/content/work";
import { useFinePointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type Filter = "all" | WorkFormat;

const ease = [0.2, 0.7, 0, 1] as const;
/* Only formats that have work get a tab */
const filterIcons: Record<Filter, Icon> = {
  all: SquaresFour,
  reel: DeviceMobile,
  video: MonitorPlay,
  poster: FrameCorners,
  post: ImageSquare,
};

const filters: Filter[] = [
  "all",
  ...(["reel", "video", "poster", "post"] as const).filter((f) => work.some((w) => w.format === f)),
];

const embed = (id: string, params: Record<string, string>) =>
  `https://www.youtube-nocookie.com/embed/${id}?${new URLSearchParams({
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    ...params,
  })}`;

/**
 * Muted, chrome-less YouTube player that mounts after a short hover and
 * fades in once it has had a moment to start, so the thumbnail never
 * flashes black. Mouse only: touch and keyboard users open the lightbox.
 */
function HoverPreview({ youtubeId }: { youtubeId: string }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <iframe
      src={embed(youtubeId, {
        autoplay: "1",
        mute: "1",
        controls: "0",
        loop: "1",
        playlist: youtubeId,
        disablekb: "1",
      })}
      title=""
      aria-hidden
      tabIndex={-1}
      allow="autoplay; encrypted-media"
      onLoad={() => {
        timer.current = window.setTimeout(() => setVisible(true), 700);
      }}
      className={cn(
        "pointer-events-none absolute inset-0 size-full border-0 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
    />
  );
}

/** Drafting-style stand-in for a piece that has no thumbnail. */
function Placeholder({ item, large = false }: { item: WorkItem; large?: boolean }) {
  const f = formats[item.format];
  return (
    <div className="hatch absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
      <span
        className={cn(
          "font-display font-light leading-none tracking-[-0.04em] text-ink-2",
          large ? "text-7xl" : "text-5xl"
        )}
      >
        {f.ratio}
      </span>
      <span className="label bg-paper px-2 py-1 text-ink-2">{item.title}</span>
    </div>
  );
}

function CropMarks() {
  const mark = "absolute size-2.5 border-ink-2";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span className={cn(mark, "left-1.5 top-1.5 border-l border-t")} />
      <span className={cn(mark, "right-1.5 top-1.5 border-r border-t")} />
      <span className={cn(mark, "bottom-1.5 left-1.5 border-b border-l")} />
      <span className={cn(mark, "bottom-1.5 right-1.5 border-b border-r")} />
    </span>
  );
}

/** A vertical Short sits inside a phone outline, notch and all. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.9rem] bg-[#0d0d0c] p-[6px] ring-1 ring-rule-strong">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem]">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-2.5 z-20 h-[6px] w-[30%] -translate-x-1/2 rounded-full bg-black/80"
        />
      </div>
    </div>
  );
}

function WorkCard({
  item,
  featured = false,
  className,
  onOpen,
}: {
  item: WorkItem;
  featured?: boolean;
  className: string;
  onOpen: () => void;
}) {
  const f = formats[item.format];
  const FormatIcon = filterIcons[item.format];
  const phone = item.format === "reel";
  const video = useRef<HTMLVideoElement>(null);
  const fine = useFinePointer();
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const play = () => {
    video.current?.play().catch(() => {});
  };
  const stop = () => {
    const v = video.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };
  const enter = (e: React.PointerEvent) => {
    play();
    if (e.pointerType !== "mouse" || !fine || !item.youtubeId) return;
    // A short delay so sweeping the cursor across the grid doesn't load players
    hoverTimer.current = window.setTimeout(() => setHovered(true), 350);
  };
  const leave = () => {
    stop();
    window.clearTimeout(hoverTimer.current);
    setHovered(false);
  };
  const hasPreview = Boolean(item.preview || item.youtubeId);

  const media = (
    <>
      {/* Hover: landscape tiles close in like a frame, inside the crop marks */}
      <div
        className={cn(
          "absolute inset-0",
          !phone &&
            "transition-[clip-path] duration-500 ease-(--ease-out) [clip-path:inset(0)] group-hover:[clip-path:inset(0.75rem)] group-focus-within:[clip-path:inset(0.75rem)]"
        )}
      >
        <div className="absolute inset-0">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt=""
              fill
              sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
              className="object-cover"
            />
          ) : (
            <Placeholder item={item} />
          )}
          {item.preview ? (
            <video
              ref={video}
              src={item.preview}
              poster={item.thumbnail}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            />
          ) : null}
          {hovered && item.youtubeId ? <HoverPreview youtubeId={item.youtubeId} /> : null}
        </div>
      </div>
      {!phone ? (
        <span className="label absolute bottom-3 left-3 z-10 bg-paper px-1.5 py-0.5 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          {hasPreview ? "Preview" : "Open"}
        </span>
      ) : null}
      {/* Scrubber: fills while hovered, like a preview playing through */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100 group-hover:duration-[2400ms] group-hover:ease-linear"
      />
    </>
  );

  return (
    <m.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      className={className}
    >
      <article
        className={cn(
          "group relative",
          phone && "mx-auto max-w-[17rem]",
          featured && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6"
        )}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onFocus={play}
        onBlur={stop}
      >
        <div className={cn(featured && "lg:col-span-8")}>
          {/* data-in comes from RevealObserver, see components/motion/reveal.tsx */}
          <div suppressHydrationWarning className="wipe">
            {phone ? (
              <PhoneFrame>{media}</PhoneFrame>
            ) : (
              <div className={cn("relative overflow-hidden", f.aspect)}>
                <CropMarks />
                {media}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "mt-3 flex items-start justify-between gap-4 border-t border-rule pt-3",
            featured && "lg:col-span-4 lg:mt-0 lg:flex-col lg:border-t-0 lg:pb-1 lg:pt-0"
          )}
        >
          <div className="min-w-0">
            <p className="label flex items-center gap-1.5 text-ink-2">
              <FormatIcon weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" />
              {f.label} · {f.ratio}
              {item.badge ? <span className="text-ink">· {item.badge}</span> : null}
            </p>
            <h3
              className={cn(
                "mt-1.5 font-display font-medium leading-tight",
                featured
                  ? "text-[clamp(1.5rem,2.6vw,2.75rem)] leading-[1.02] tracking-[-0.02em] lg:mt-3"
                  : "text-[1.0625rem] tracking-[-0.005em] md:text-[1.375rem] md:tracking-[-0.01em]"
              )}
            >
              <button
                type="button"
                onClick={onOpen}
                data-cursor={hasPreview ? "Play" : "View"}
                className="text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
              >
                {item.title}
              </button>
            </h3>
            <p className="mt-1 text-sm text-ink-2">{item.context}</p>
          </div>
          {featured ? (
            <span
              aria-hidden
              className="label mt-6 hidden h-12 items-center gap-2.5 bg-accent px-5 text-on-accent transition-colors duration-300 group-hover:bg-ink group-hover:text-paper lg:inline-flex"
            >
              <Play weight="fill" className="size-4" />
              Play video
            </span>
          ) : null}
          <ArrowUpRight
            weight="bold"
            aria-hidden
            className={cn(
              "mt-1 size-4 shrink-0 text-ink-2 transition-transform duration-300 ease-(--ease-out) group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink",
              featured && "lg:hidden"
            )}
          />
        </div>
      </article>
    </m.li>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<WorkItem | null>(null);
  useLockSmoothScroll(!!open);

  const items = filter === "all" ? work : work.filter((w) => w.format === filter);
  const OpenIcon = open ? filterIcons[open.format] : null;
  const count = (f: Filter) => (f === "all" ? work.length : work.filter((w) => w.format === f).length);

  return (
    <section id="work" aria-labelledby="work-title" className="pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32">
      <SectionHeader
        section="work"
        heading="Work"
        label="Selected videos"
        aside="Made for Xtrusio in 2026"
        title="Explainers and Shorts *for an AI search brand*"
        titleId="work-title"
      />

      <div className="shell mt-10 md:mt-14 lg:mt-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule">
          <LayoutGroup id="work-filter">
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(v) => v && setFilter(v as Filter)}
              aria-label="Filter work by format"
            >
              {filters.map((f) => {
                const TabIcon = filterIcons[f];
                return (
                <ToggleGroupItem key={f} value={f} className="relative gap-1.5">
                  <TabIcon weight={filter === f ? "fill" : "regular"} aria-hidden className="size-4" />
                  {f === "all" ? "All" : formats[f].plural}
                  <span className="ml-1.5 hidden tabular-nums text-ink-2 sm:inline">{count(f)}</span>
                  {filter === f ? (
                    <m.span
                      layoutId="filter-underline"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-accent"
                      transition={{ duration: 0.3, ease }}
                    />
                  ) : null}
                </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </LayoutGroup>
          <p className="label hidden text-ink-2 md:block">Hover to preview · Click to open</p>
        </div>
      </div>

      <LayoutGroup id="work-grid">
        <ul className="shell grid-12 mt-10 grid-flow-row-dense gap-y-14 md:gap-y-16 lg:mt-14 lg:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => {
              const f = formats[item.format];
              return (
                <WorkCard
                  key={item.id}
                  item={item}
                  featured={filter === "all" && item.featured}
                  onOpen={() => setOpen(item)}
                  className={cn(f.span, filter === "all" ? item.layout : f.lg)}
                />
              );
            })}
          </AnimatePresence>
        </ul>
      </LayoutGroup>

      <div className="shell mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5 lg:mt-24">
        <p className="label flex items-center gap-3 text-ink-2">
          <Image src="/logos/xtrusio.svg" alt="" width={28} height={28} className="size-7" />
          {work.length} of 50+ videos on the {channel.name} channel
        </p>
        <Button asChild variant="outline" size="sm">
          <a href={channel.url} target="_blank" rel="noreferrer">
            <YoutubeLogo weight="fill" aria-hidden /> See the full channel <ArrowUpRight weight="bold" aria-hidden />
          </a>
        </Button>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open ? (
          <DialogContent>
            <div className="grid md:grid-cols-[1.4fr_1fr]">
              <div className="relative flex items-center justify-center bg-paper-2 p-4 md:p-8">
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    formats[open.format].aspect,
                    open.format === "reel" && "max-w-[18rem]",
                    (open.format === "poster" || open.format === "post") && "max-w-[28rem]"
                  )}
                >
                  {open.youtubeId ? (
                    <iframe
                      src={embed(open.youtubeId, { autoplay: "1" })}
                      title={open.title}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0 bg-black"
                    />
                  ) : open.video || open.preview ? (
                    <video
                      src={open.video ?? open.preview}
                      poster={open.thumbnail}
                      controls
                      playsInline
                      autoPlay
                      muted
                      className="absolute inset-0 size-full bg-black object-contain"
                    />
                  ) : open.thumbnail ? (
                    <Image
                      src={open.thumbnail}
                      alt={open.title}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-contain"
                    />
                  ) : (
                    <Placeholder item={open} large />
                  )}
                </div>
              </div>
              <div className="flex flex-col p-6 pt-14 md:p-8 md:pt-16">
                <p className="label flex items-center gap-1.5 text-ink-2">
                  {OpenIcon ? <OpenIcon weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" /> : null}
                  {formats[open.format].label} · {formats[open.format].ratio} · {open.year}
                </p>
                <DialogTitle className="mt-3 text-[2rem] leading-tight">{open.title}</DialogTitle>
                <DialogDescription className="mt-3 text-base">{open.context}</DialogDescription>
                <dl className="label mt-8 grid grid-cols-[6rem_1fr] gap-y-3 border-t border-rule pt-4">
                  <dt className="flex items-center gap-1.5 text-ink-2">
                    <Buildings weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" /> Client
                  </dt>
                  <dd className="flex items-center gap-2">
                    <Image src="/logos/xtrusio.svg" alt="" width={18} height={18} className="size-[18px]" />
                    {channel.name}
                  </dd>
                  <dt className="flex items-center gap-1.5 text-ink-2">
                    <UserFocus weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" /> Role
                  </dt>
                  <dd>{open.role}</dd>
                  <dt className="flex items-center gap-1.5 text-ink-2">
                    <Wrench weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" /> Tools
                  </dt>
                  <dd>{open.tools}</dd>
                </dl>
                {open.href ? (
                  <div className="mt-auto pt-10">
                    <Button asChild variant="outline">
                      <a href={open.href} target="_blank" rel="noreferrer">
                        {open.youtubeId ? <YoutubeLogo weight="fill" aria-hidden /> : null}
                        {open.youtubeId ? "Watch on YouTube" : "See the original"}{" "}
                        <ArrowUpRight weight="bold" aria-hidden />
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </section>
  );
}
