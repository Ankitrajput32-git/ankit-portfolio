import {
  ArrowUpRight,
  DeviceMobileCamera,
  FilmSlate,
  ImageSquare,
  PenNib,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/section-header";
import { services } from "@/content/services";
import { site } from "@/content/site";

/* In the same order as content/services.ts */
const serviceIcons = [FilmSlate, DeviceMobileCamera, ImageSquare, SquaresFour, PenNib];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="pb-10 pt-16 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32">
      <SectionHeader
        section="services"
        heading="Services"
        label="For brands and agencies"
        aside="Video, images and writing"
        title="What I can make *for your brand*"
        titleId="services-title"
      />

      <div className="shell grid-12 mt-10 md:mt-14 gap-y-10 lg:mt-20">
        <Reveal className="col-span-4 md:col-span-3 lg:col-span-3">
          <p className="max-w-[30ch] text-base leading-relaxed text-ink-2">
            Pick one or a few. Click a row and an email opens with the subject already written.
          </p>
        </Reveal>

        <ol className="col-span-4 border-t border-rule md:col-span-8 lg:col-span-9">
          {services.map((s, i) => {
            const Icon = serviceIcons[i] ?? FilmSlate;
            return (
            <li key={s.title} className="border-b border-rule">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(`Enquiry: ${s.title}`)}`}
                className="group relative grid grid-cols-4 gap-x-4 gap-y-3 py-7 md:grid-cols-9 md:gap-x-5 md:py-9 lg:gap-x-6"
              >
                <span className="pt-1 md:col-span-1">
                  <span className="icon-tile size-12 transition-colors duration-200 group-hover:text-ink">
                    <Icon weight="duotone" aria-hidden className="icon-duo size-7" />
                  </span>
                </span>
                <h3 className="col-span-3 font-display text-[clamp(1.875rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.025em] md:col-span-4">
                  {s.title}
                </h3>
                <div className="col-span-3 col-start-2 md:col-span-3 md:col-start-auto md:pt-2">
                  <p className="text-base leading-relaxed">{s.body}</p>
                  <ul className="label mt-4 flex flex-wrap gap-x-3 gap-y-1 text-ink-2">
                    {s.formats.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <ArrowUpRight
                  weight="bold"
                  aria-hidden
                  className="absolute right-0 top-7 size-5 -translate-x-1 translate-y-1 text-accent-ink opacity-0 transition-[opacity,translate] duration-200 ease-(--ease-out) group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 md:top-9"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-(--ease-out) group-hover:scale-x-100"
                />
              </a>
            </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
