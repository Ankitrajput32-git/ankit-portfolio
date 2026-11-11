import {
  DownloadSimple,
  EnvelopeSimple,
  HandWaving,
  LinkedinLogo,
  MapPin,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

import { CopyEmail } from "@/components/copy-email";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskWords } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function Contact() {
  const rows = [
    {
      label: "Phone",
      value: site.phone,
      href: site.phoneHref,
      icon: <Phone weight="duotone" aria-hidden className="icon-duo [--icon-fill:rgb(243_239_230/0.55)] size-5" />,
    },
    {
      label: "LinkedIn",
      value: site.linkedinLabel,
      href: site.linkedin,
      icon: <LinkedinLogo weight="duotone" aria-hidden className="icon-duo [--icon-fill:rgb(243_239_230/0.55)] size-5" />,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-cursor-tone="ink"
      className="bg-accent text-on-accent selection:bg-on-accent selection:text-paper-fixed"
    >
      <div className="shell pb-10 pt-20 md:pt-28 lg:pt-36">
        <div className="h-px bg-on-accent/40" />
        <div className="grid-12 label pt-3">
          <span className="col-span-4 flex items-center gap-2">
            <HandWaving weight="duotone" aria-hidden className="icon-duo [--icon-fill:rgb(243_239_230/0.55)] size-[18px]" />
            Contact
          </span>
          <span className="hidden text-right md:col-span-4 md:block lg:col-span-4 lg:col-start-9">
            Open to AI-native content roles
          </span>
        </div>

        <h2
          id="contact-title"
          className="display mt-12 text-[clamp(3.5rem,12.5vw,13rem)] leading-[0.88] md:mt-16"
        >
          <MaskWords text="Send me *the brief.*" emphasis="text-paper-fixed" />
        </h2>

        <div className="grid-12 mt-14 gap-y-10 md:mt-20">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <p className="label flex items-center gap-2">
              <EnvelopeSimple weight="duotone" aria-hidden className="icon-duo [--icon-fill:rgb(243_239_230/0.55)] size-5" />
              Email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-1 inline-block break-all py-2 font-display text-[clamp(1.375rem,4.1vw,3.75rem)] font-medium leading-tight tracking-[-0.015em]"
            >
              {site.email}
            </a>
            <div className="mt-5">
              <CopyEmail />
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <ul className="border-t border-on-accent/40">
              {rows.map((row) => (
                <li key={row.label} className="border-b border-on-accent/40">
                  <a
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-center gap-3">
                      {row.icon}
                      <span className="label">{row.label}</span>
                    </span>
                    <span className="link-underline text-base">{row.value}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 border-b border-on-accent/40 py-4">
                <span className="flex items-center gap-3">
                  <MapPin weight="duotone" aria-hidden className="icon-duo [--icon-fill:rgb(243_239_230/0.55)] size-5" />
                  <span className="label">Based in</span>
                </span>
                <span className="text-base">{site.area}</span>
              </li>
            </ul>
            <div className="mt-8">
              <Magnetic>
                <Button asChild variant="inverse">
                  <a href={site.resume} download="Ankit-Singh-Resume.pdf">
                    <DownloadSimple weight="bold" aria-hidden />
                    Download resume
                    <span className="opacity-70">PDF</span>
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
