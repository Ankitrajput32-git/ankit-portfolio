import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

import { BrandDefs } from "@/components/brand";
import { CustomCursor } from "@/components/chrome/custom-cursor";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { Assistant } from "@/components/assistant/assistant";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/content/site";

import "lenis/dist/lenis.css";
import "./globals.css";

/* Clash Display by Indian Type Foundry (Fontshare, ITF Free Font License) */
const clash = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  variable: "--font-clash",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = "Ankit Singh · AI-native content creator, Lucknow";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Ankit Singh" },
  description: site.description,
  applicationName: "Ankit Singh",
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  keywords: [
    "Ankit Singh",
    "AI content creator",
    "AI video",
    "content creator Lucknow",
    "reels",
    "short-form video",
    "AI-native",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title,
    description: site.description,
    siteName: "Ankit Singh",
    locale: "en_IN",
    firstName: "Ankit",
    lastName: "Singh",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "AI Native Content Creator",
  worksFor: { "@type": "Organization", name: "imaPRO" },
  email: `mailto:${site.email}`,
  telephone: site.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Dr. A.P.J. Abdul Kalam Technical University",
  },
  knowsLanguage: ["English", "Hindi"],
  sameAs: [site.linkedin],
  url: site.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${clash.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        {/* Reveal styles only apply once we know JS is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <BrandDefs />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <MotionProvider>
            <TooltipProvider>
              <SmoothScroll>
                <a
                  href="#main"
                  className="label fixed left-4 top-1.5 z-[300] inline-flex h-11 -translate-y-20 items-center bg-ink px-4 text-paper transition-transform focus:translate-y-0"
                >
                  Skip to content
                </a>
                <SiteHeader />
                <main id="main" tabIndex={-1} className="outline-none">
                  {children}
                </main>
                <SiteFooter />
                <Assistant />
                <CustomCursor />
                <RevealObserver />
              </SmoothScroll>
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
