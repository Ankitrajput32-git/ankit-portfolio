import { Code, Sparkle, Toolbox, Translate, UsersThree } from "@phosphor-icons/react/dist/ssr";

import { ToolLogo } from "@/components/brand";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/section-header";
import { skills, toolkit } from "@/content/skills";
import { cn } from "@/lib/utils";

const groupIcons = [Sparkle, Code, UsersThree, Translate];

/* Uneven columns on purpose: the craft list gets the room. */
const columns = [
  "col-span-4 md:col-span-4 lg:col-span-5",
  "col-span-4 md:col-span-4 lg:col-span-3",
  "col-span-4 md:col-span-4 lg:col-span-2",
  "col-span-4 md:col-span-4 lg:col-span-2",
];

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="bg-paper-2 pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32">
      <SectionHeader
        section="skills"
        heading="Skills"
        label="Skills and tools"
        aside="From my resume and my current job"
        title="What I know, *and what I use.*"
        titleId="skills-title"
      />

      <div className="shell grid-12 mt-10 md:mt-14 gap-y-14 lg:mt-20">
        {skills.map((group, i) => {
          const Icon = groupIcons[i];
          return (
          <Reveal key={group.group} delay={i * 0.06} className={columns[i]}>
            <h3 className="label flex items-center justify-between border-b border-ink pb-2 text-ink">
              <span className="flex items-center gap-2">
                <span className="icon-tile size-7">
                  <Icon weight="duotone" aria-hidden className="icon-duo size-4" />
                </span>
                {group.group}
              </span>
              <span className="text-ink-2">({String(group.items.length).padStart(2, "0")})</span>
            </h3>
            <ul>
              {group.items.map(({ name, icon: ItemIcon }) => (
                <li
                  key={name}
                  className={cn(
                    "flex items-center gap-[0.45em] border-b border-rule py-3 font-display font-medium leading-tight tracking-[-0.015em]",
                    i === 0 ? "text-[clamp(1.5rem,2.6vw,2.375rem)]" : "text-[clamp(1.25rem,1.6vw,1.5rem)]"
                  )}
                >
                  <ItemIcon weight="duotone" aria-hidden className="icon-duo size-[0.8em] shrink-0 text-accent-ink" />
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
          );
        })}

        <Reveal className="col-span-4 md:col-span-8 lg:col-span-12">
          <div className="grid-12 gap-y-6 border-t border-ink pt-5">
            <div className="col-span-4 md:col-span-2 lg:col-span-3">
              <h3 className="label flex items-center gap-2 text-ink">
                <span className="icon-tile size-7">
                  <Toolbox weight="duotone" aria-hidden className="icon-duo size-4" />
                </span>
                AI toolkit
              </h3>
              <p className="mt-3 max-w-[24ch] text-base leading-relaxed text-ink-2">
                What I open on a normal workday, sorted by the job it does.
              </p>
            </div>
            <dl className="col-span-4 md:col-span-6 lg:col-span-9">
              {toolkit.map((row) => (
                <div
                  key={row.job}
                  className="grid grid-cols-1 gap-y-1 border-b border-rule py-4 first:pt-0 md:grid-cols-[11rem_1fr] md:items-baseline md:gap-x-6"
                >
                  <dt className="label text-ink-2">{row.job}</dt>
                  <dd className="flex flex-wrap gap-x-7 gap-y-2 font-display text-[clamp(1.375rem,2.2vw,2rem)] font-medium leading-tight tracking-[-0.015em]">
                    {row.tools.map((tool) => (
                      <span key={tool.name} className="inline-flex items-center gap-[0.35em]">
                        <ToolLogo id={tool.logo} className="text-[0.8em]" />
                        {tool.name}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
