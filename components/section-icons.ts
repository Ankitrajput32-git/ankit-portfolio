import {
  Briefcase,
  FilmStrip,
  FlowArrow,
  HandWaving,
  IdentificationCard,
  Lightning,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";

/** One icon per section, shared by the section headers and the mobile menu. */
export const sectionIcons = {
  work: FilmStrip,
  workflow: FlowArrow,
  services: Storefront,
  experience: Briefcase,
  skills: Lightning,
  about: IdentificationCard,
  contact: HandWaving,
} as const;

export type SectionId = keyof typeof sectionIcons;
