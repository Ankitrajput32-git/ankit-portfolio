import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

/* Branded 404: same type and colours as the site, one way back home */
export default function NotFound() {
  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center pb-16 pt-28">
      <p className="label text-ink-2">Error 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,16vw,13rem)] leading-[0.85]">
        Page not <span className="text-accent">found</span>
      </h1>
      <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-2">
        This link doesn&apos;t go anywhere. The portfolio is all on one page.
      </p>
      <Link
        href="/"
        className="label mt-8 inline-flex h-12 w-fit items-center gap-2.5 bg-accent px-5 text-on-accent transition-colors hover:bg-ink hover:text-paper"
      >
        <ArrowLeft weight="bold" aria-hidden className="size-4" />
        Back to the portfolio
      </Link>
    </section>
  );
}
