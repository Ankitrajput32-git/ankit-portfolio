import type { CSSProperties } from "react";
import {
  ArrowDown,
  DownloadSimple,
  EnvelopeSimple,
  HandWaving,
  LinkedinLogo,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

import { PortraitStage } from "@/components/hero-portrait";
import { Magnetic } from "@/components/motion/magnetic";
import { TypedRole } from "@/components/motion/typed-role";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { ImaproLogo, ToolLogo } from "@/components/brand";
import { heroTools } from "@/content/skills";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* The "I'm a ___" line types these in turn, on a loop. All from the imaPRO job. */
const roles = [
  "AI content creator",
  "AI video maker",
  "scriptwriter",
  "video editor",
  "thumbnail designer",
] as const;

/* Intro timeline (ms after first paint) */
const GREETING_AT = 100;
const NAME_AT = 420;
const STEP = 45;

/** One letter at a time, each from its own delay. Pure CSS, so it plays before hydration. */
function Kinetic({ text, from, className }: { text: string; from: number; className: string }) {
  return (
    <span className={className}>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="kinetic-letter" style={delay(from + i * STEP)}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * One screen, top to bottom: who (name), what (headline), proof (current
 * role in the top row), and what to do next (work, resume). Type and the
 * portrait scale with viewport height as well as width, so it fits short
 * laptop screens without scrolling.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-x-clip pt-14"
    >
      <div className="shell">
        <div className="intro-rule rule mt-4" style={delay(0)} />
        <div className="intro-fade grid-12 label pt-3 text-ink-2" style={delay(200)}>
          <p className="col-span-2 lg:col-span-3">Portfolio, 2026</p>
          <p className="hidden items-center gap-2 md:col-span-3 md:flex lg:col-span-3">
            Currently at <ImaproLogo className="-mt-0.5 text-[17px] text-ink" />
          </p>
          <p className="hidden items-center gap-1.5 lg:col-span-3 lg:flex">
            <MapPin weight="duotone" aria-hidden className="icon-duo size-4 text-accent-ink" />
            {site.city}, India
          </p>
          <p className="col-span-2 flex items-center justify-end gap-2 md:col-span-3 lg:col-span-3">
            <span aria-hidden className="size-2 bg-accent" />
            Open to <span className="hidden sm:inline">content</span> roles
          </p>
        </div>
      </div>

      {/* On desktop the name is sized to the grid (cqw) and the viewport height
          (svh), so "Singh" always ends short of the portrait's shoulder and the
          whole hero stays on one screen. */}
      <div className="shell grid-12 @container flex-1 grid-rows-[auto_auto_1fr] pb-6 pt-5 md:grid-rows-[auto_1fr] md:pb-10 md:pt-10 lg:pb-8 lg:pt-4">
        {/* Phones and tablets: name, photo and text are separate grid rows (the
            wrapper is display: contents). Desktop: one column centred beside the
            photo, so the name, role and text read as one block with no dead gap. */}
        <div className="contents lg:relative lg:z-10 lg:col-span-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:justify-center">
        <div className="relative z-10 col-span-4 md:col-span-8">
        <h1 className="display text-[24vw] leading-[0.82] tracking-[-0.03em] md:text-[min(27vw,19svh)] lg:text-[min(16.5cqw,22svh)]">
          <span className="sr-only">Hi, I&apos;m Ankit Singh</span>
          <span aria-hidden className="block">
            {/* Same size and tone as the role line under the name: the two
                frame the name instead of competing with it */}
            <span className="mb-[0.25em] flex items-center gap-[0.3em] font-display text-[clamp(1.375rem,min(2.3vw,3.8svh),2.375rem)] font-medium leading-none tracking-[-0.015em] text-ink-2">

              <span>
                {Array.from("Hi, I'm").map((ch, i) => (
                  <span key={i} className="kinetic-char" style={delay(GREETING_AT + i * STEP)}>
                    {ch}
                  </span>
                ))}
              </span>
              <HandWaving
                weight="duotone"
                className="hero-wave icon-duo size-[1.05em] text-accent-ink"
                style={delay(GREETING_AT + 7 * STEP + 120)}
              />
            </span>
            <Kinetic text="Ankit" from={NAME_AT} className="kinetic-line" />{" "}
            {/* indented by exactly one grid column at every breakpoint */}
            <Kinetic
              text="Singh"
              from={NAME_AT + 5 * STEP}
              className="kinetic-line pl-[calc((100%-3rem)/4+1rem)] md:pl-[calc((100%-8.75rem)/8+1.25rem)] lg:pl-[calc((100%-10.5rem)/8+1.5rem)]"
            />
          </span>
        </h1>
        {/* The role is the only thing typed, on one line of its own, so only the
            caret moves while it types; nothing under it reflows. */}
        <p
          className="intro-fade mt-[min(1.25rem,2svh)] font-display text-[clamp(1.375rem,min(2.3vw,3.8svh),2.375rem)] font-medium leading-[1.1] tracking-[-0.015em] text-ink-2"
          style={delay(850)}
        >
          <span className="sr-only">
            I&apos;m an AI content creator, AI video maker, scriptwriter, video editor and thumbnail
            designer.
          </span>
          <span aria-hidden>
            <TypedRole roles={roles} startAt={1250} />
          </span>
        </p>
        </div>

        <div className="relative z-10 col-span-4 row-start-3 mt-4 self-end md:col-span-4 md:col-start-1 md:row-start-2 md:mt-10 lg:mt-[min(2.75rem,5svh)] lg:w-[calc((100%-10.5rem)*0.75+7.5rem)] lg:self-auto">
          <p
            className="intro-fade max-w-[40ch] text-[clamp(1rem,min(1.25vw,2.3svh),1.1875rem)] leading-relaxed text-ink-2"
            style={delay(950)}
          >
            <span className="text-ink">I make AI videos for brands, start to finish.</span> Right now
            that&apos;s explainers and Shorts for Xtrusio&apos;s YouTube channel.
          </p>
          <div className="intro-fade mt-4 flex flex-wrap gap-3 lg:mt-[min(2rem,3svh)]" style={delay(1050)}>
            <Magnetic>
              <Button asChild>
                <a href="#work">
                  See my work
                  <ArrowDown weight="bold" aria-hidden />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline">
                <a href={site.resume} download="Ankit-Singh-Resume.pdf">
                  <DownloadSimple weight="bold" aria-hidden />
                  <span className="hidden sm:inline">Download resume</span>
                  <span className="sm:hidden">Resume</span>
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="icon" className="size-12">
                <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                  <LinkedinLogo weight="bold" aria-hidden className="size-5" />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="icon" className="size-12">
                <a href={`mailto:${site.email}`} aria-label="Email me">
                  <EnvelopeSimple weight="bold" aria-hidden className="size-5" />
                </a>
              </Button>
            </Magnetic>
          </div>
          <p
            className="intro-fade label mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-2 lg:hidden"
            style={delay(1150)}
          >
            <span className="text-ink">Tools</span>
            {heroTools.map((tool) => (
              <span key={tool.name} className="inline-flex items-center gap-1.5" title={tool.name}>
                <ToolLogo id={tool.logo} className="text-[16px] text-ink" />
                <span className="sr-only sm:not-sr-only lg:sr-only xl:not-sr-only">{tool.name}</span>
              </span>
            ))}
          </p>
        </div>
        </div>

        {/* Desktop: the photo takes the right half and stands on the bottom edge
            of the hero (the negative margin cancels the bottom padding), sized
            from the viewport height so it never pushes the hero past one screen. */}
        <div className="col-span-4 row-start-2 -mt-[3vw] w-[64%] justify-self-end md:col-span-4 md:col-start-5 md:row-start-2 md:mt-0 md:w-full md:self-end lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:-mb-8 lg:w-full lg:self-stretch">
          <PortraitStage />
        </div>
      </div>
    </section>
  );
}
