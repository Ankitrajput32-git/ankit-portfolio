"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

import { site } from "@/content/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
      className="label relative isolate inline-flex h-11 items-center gap-2 overflow-hidden border border-on-accent/50 px-3 transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-on-accent before:transition-transform before:duration-300 before:ease-(--ease-out) hover:text-paper-fixed hover:before:scale-x-100 focus-visible:before:scale-x-100"
    >
      {copied ? <Check weight="bold" aria-hidden /> : <Copy weight="bold" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
