import Image from "next/image";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";

import { ImaproLogo } from "@/components/brand";
import { Reveal } from "@/components/motion/reveal";
import { Spine } from "@/components/motion/spine";
import { SectionHeader } from "@/components/section-header";
import { WithNotes } from "@/components/with-notes";
import { experience } from "@/content/experience";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32">
      <SectionHeader
        section="experience"
        heading="Experience"
        label="Three jobs so far"
        aside="Newest first"
        title="Where I've *worked.*"
        titleId="experience-title"
      />

      <div className="shell mt-10 md:mt-14 lg:mt-20">
        <ol className="relative border-t border-rule">
          {/* Spine sits on the line between the date and content columns */}
          <span
            aria-hidden
            className="absolute bottom-0 left-0 top-0 w-px bg-rule md:left-[calc((100%-8.75rem)/8*2+2.5rem)] lg:left-[calc((100%-16.5rem)/12*3+4.5rem)]"
          />
          <Spine className="absolute bottom-0 left-0 top-0 w-px md:left-[calc((100%-8.75rem)/8*2+2.5rem)] lg:left-[calc((100%-16.5rem)/12*3+4.5rem)]" />

          {experience.map((job) => (
            <li key={job.company} className="grid-12 relative gap-y-4 border-b border-rule py-10 md:py-14">
              <div className="col-span-4 pl-6 md:col-span-2 md:pl-0 lg:col-span-3">
                <p className="label flex items-center gap-1.5 text-ink-2">
                  <CalendarBlank weight="duotone" aria-hidden className="icon-duo size-4 text-accent-ink" />
                  {job.start} – {job.end}
                </p>
                {job.current ? (
                  <p className="label mt-3 inline-flex items-center gap-2 text-accent-ink">
                    <span aria-hidden className="size-1.5 animate-pulse bg-accent" />
                    Current role
                  </p>
                ) : null}
              </div>

              <div className="relative col-span-4 pl-6 md:col-span-6 md:pl-10 lg:col-span-8 lg:pl-12">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[4.5px] top-[0.45rem] size-[10px] border",
                    job.current ? "border-accent bg-accent" : "border-ink-2 bg-paper"
                  )}
                />
                <Reveal>
                  <h3 className="font-display text-[clamp(1.875rem,3.6vw,3.25rem)] font-medium leading-[1] tracking-[-0.025em]">
                    {job.role}
                  </h3>
                  <div className="mt-4 flex items-center gap-4">
                    {/* Real company logo on a white tile so brand colours read in both themes */}
                    <span className="flex h-12 w-32 shrink-0 items-center justify-center border border-rule bg-white px-3">
                      {job.logo.kind === "imapro" ? (
                        <ImaproLogo className="text-[22px] text-[#15140f]" />
                      ) : (
                        <Image
                          src={job.logo.src}
                          alt=""
                          width={job.logo.width}
                          height={job.logo.height}
                          className="h-8 w-auto max-w-full object-contain"
                        />
                      )}
                    </span>
                    <p className="text-[1.0625rem] text-ink-2">{job.company}</p>
                  </div>
                  <ul className="mt-6 max-w-[64ch] space-y-3">
                    {job.points.map((point) => (
                      <li key={point} className="grid grid-cols-[1.5rem_1fr] text-base leading-relaxed">
                        <span aria-hidden className="mt-[0.7em] h-px w-3 bg-ink-2" />
                        <span>
                          <WithNotes text={point} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
