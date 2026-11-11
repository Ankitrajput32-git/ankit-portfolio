export const site = {
  name: "Ankit Singh",
  role: "AI-native content creator",
  city: "Lucknow",
  area: "Indira Nagar, Lucknow",
  email: "ankitsingh70.8070@gmail.com",
  phone: "+91 96484 02231",
  phoneHref: "tel:+919648402231",
  linkedin: "https://www.linkedin.com/in/ankit-singh-220138276",
  linkedinLabel: "in/ankit-singh-220138276",
  resume: "/ankit-singh-cv.pdf",
  description:
    "Ankit Singh makes AI videos, Shorts, posters and social posts for brands. He works at imaPRO in Lucknow and has a B.Tech in Computer Science.",
  /*
   * Public address for link previews, the sitemap and canonical links.
   * Vercel's own production URL is its auto-generated name, so production
   * uses the chosen one. NEXT_PUBLIC_SITE_URL overrides it (e.g. a custom
   * domain later); previews use their deployment URL.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === "production"
      ? "https://ankit-portfolio-ai.vercel.app"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
} as const;

export const nav = [
  { id: "work", label: "Work" },
  { id: "workflow", label: "Workflow" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
