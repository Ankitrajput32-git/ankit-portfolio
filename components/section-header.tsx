import { MaskWords } from "@/components/motion/reveal";
import { sectionIcons, type SectionId } from "@/components/section-icons";
import { cn } from "@/lib/utils";

/**
 * Every section opens the same way: a hairline, a mono running head, then
 * the section's name set huge and thin, with the title under it. The name
 * drifts against the scroll (CSS scroll-driven animation where supported).
 * It matches the nav label, so the page reads like chapters.
 */
export function SectionHeader({
  section,
  heading,
  label,
  aside,
  title,
  titleId,
  className,
}: {
  section: SectionId;
  heading: string;
  label: string;
  aside?: string;
  title: string;
  titleId: string;
  className?: string;
}) {
  const Icon = sectionIcons[section];
  return (
    <div className={cn("shell", className)}>
      <div className="rule" />
      <div className="grid-12 label items-center pt-3 text-ink-2">
        <span className="col-span-4 flex items-center gap-2 md:col-span-4 lg:col-span-5">
          <Icon weight="duotone" aria-hidden className="icon-duo size-[18px] shrink-0 text-accent-ink" />
          {label}
        </span>
        {aside ? (
          <span className="hidden text-right md:col-span-4 md:block lg:col-span-4 lg:col-start-9">
            {aside}
          </span>
        ) : null}
      </div>

      <div aria-hidden className="mt-6 overflow-x-clip md:mt-8 lg:mt-10">
        <span className="numeral-drift block select-none font-display text-[clamp(3rem,18vw,15rem)] font-extralight leading-[0.9] tracking-[-0.055em] text-accent">
          {heading}
        </span>
      </div>

      <div className="grid-12 mt-6 md:mt-8">
        <h2 id={titleId} className="h2 col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-5">
          <MaskWords text={title} />
        </h2>
      </div>
    </div>
  );
}
