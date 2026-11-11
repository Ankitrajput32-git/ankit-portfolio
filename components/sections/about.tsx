import { Database, GraduationCap, Trophy } from "@phosphor-icons/react/dist/ssr";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/section-header";
import { achievements, education, project } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32">
      <SectionHeader
        section="about"
        heading="About"
        label="Education and achievements"
        aside="Lucknow, India"
        title="A computer science grad *who makes videos*"
        titleId="about-title"
      />

      <div className="shell grid-12 mt-10 md:mt-14 gap-y-12 lg:mt-20">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <Reveal>
            <p className="lede">
              I&apos;m Ankit. I live in Lucknow and I make videos with AI for a living.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-8 max-w-[60ch] space-y-5 text-[1rem] leading-relaxed">
            <p>
              I finished my B.Tech in Computer Science in 2025, and it helps more than you&apos;d
              think. When a model gives me a bad result, I can usually work out why and fix the
              prompt, instead of regenerating and hoping.
            </p>
            <p>
              Before this I sold Unicharm products in retail and checked documents at Mas Callnet.
              The sales job got me used to asking what people want before pitching anything. The
              verification job was hours of careful checking, and that habit stuck.
            </p>
            <p>Outside work I take photos and edit them. I write and speak English and Hindi.</p>
          </Reveal>
        </div>

        {/* Education */}
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
          <h3 className="label flex items-center gap-2 border-b border-ink pb-2">
            <span className="icon-tile size-7">
              <GraduationCap weight="duotone" aria-hidden className="icon-duo size-4" />
            </span>
            Education
          </h3>
          <ul>
            {education.map((e) => (
              <li
                key={e.title}
                className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-rule py-4 md:grid-cols-[5rem_1fr_auto]"
              >
                <span className="label pt-1.5 text-ink-2">{e.year}</span>
                <div>
                  <p className="font-display text-[1.5rem] font-medium leading-tight tracking-[-0.01em]">
                    {e.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-2">{e.place}</p>
                </div>
                {e.note ? (
                  <span className="label col-start-2 mt-2 text-ink md:col-start-3 md:mt-0 md:pt-1.5">
                    {e.note}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-l-2 border-accent pl-5">
            <p className="label flex items-center gap-2 text-ink-2">
              <Database weight="duotone" aria-hidden className="icon-duo size-4 text-ink-2" />
              College project
            </p>
            <p className="mt-2 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.01em]">
              {project.title}
            </p>
            <p className="mt-2 max-w-[60ch] text-base leading-relaxed">{project.body}</p>
            <p className="label mt-3 text-ink-2">{project.stack}</p>
          </div>
        </Reveal>

        {/* Achievements */}
        <Reveal delay={0.06} className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end">
          <h3 className="label flex items-center gap-2 border-b border-ink pb-2">
            <span className="icon-tile size-7">
              <Trophy weight="duotone" aria-hidden className="icon-duo size-4" />
            </span>
            Achievements
          </h3>
          <ul>
            {achievements.map((a) => (
              <li key={a.title} className="flex items-start gap-3 border-b border-rule py-4">
                <span className="icon-tile mt-0.5 size-9 shrink-0">
                  <a.icon weight="duotone" aria-hidden className="icon-duo size-5" />
                </span>
                <div>
                  <p className="font-display text-[1.375rem] font-medium leading-tight tracking-[-0.01em]">
                    {a.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-2">{a.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
