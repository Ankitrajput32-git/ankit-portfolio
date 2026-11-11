"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ArrowCounterClockwise,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  DownloadSimple,
  EnvelopeSimple,
  FilmSlate,
  Robot,
  Toolbox,
  X,
  type Icon,
} from "@phosphor-icons/react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* three.js only loads once the page is idle, and never on the server */
const RobotCanvas = dynamic(() => import("./robot").then((mod) => mod.RobotCanvas), { ssr: false });

const NAME = "Pixel";
const GLOW = "#5cc8ff";
const suggestions: { text: string; icon: Icon }[] = [
  { text: "What does Ankit make?", icon: FilmSlate },
  { text: "Which AI tools does Ankit use?", icon: Toolbox },
  { text: "Is Ankit open to work?", icon: Briefcase },
  { text: "How do I contact Ankit?", icon: EnvelopeSimple },
];
const ease = [0.2, 0.7, 0, 1] as const;
const GREETED_KEY = "pixel-greeted";

/* The route answers with a code when it can't reply; Pixel says it nicely */
function fallbackLine(error: Error) {
  let code = error.message;
  try {
    code = JSON.parse(error.message).code ?? code;
  } catch {}
  if (code === "not-configured")
    return `I'm not connected to my brain yet, so I can't chat right now. You can reach Ankit at ${site.email}.`;
  if (code === "rate-limited")
    return `That's a lot of questions! Give me a few minutes, or email Ankit at ${site.email}.`;
  return `Something went wrong on my side. Try again, or email Ankit at ${site.email}.`;
}

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/* Emails and links in a reply become tappable */
const LINK = /([\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/[^\s)]+)/g;
function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(LINK).map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
        return (
          <a
            key={i}
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="break-all underline decoration-accent/60 underline-offset-2 hover:decoration-accent"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

/** Pixel's little avatar beside its messages */
function Avatar({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center bg-[#0b1016]",
        size === "md" ? "size-10" : "size-7"
      )}
      style={{ color: GLOW }}
    >
      <Robot weight="fill" className={size === "md" ? "size-5" : "size-3.5"} />
    </span>
  );
}

function BotMessage({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return (
    <div className="flex items-end gap-2.5">
      <span className={cn(!first && "invisible")}>
        <Avatar />
      </span>
      <div className="min-w-0 max-w-[85%]">
        {first ? <p className="label mb-1 text-ink-2">{NAME}</p> : null}
        <div className="whitespace-pre-wrap border border-rule bg-paper-2 px-3.5 py-2.5 text-base leading-relaxed md:text-[0.9375rem] text-ink">
          {children}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-wrap bg-accent px-3.5 py-2.5 text-base leading-relaxed md:text-[0.9375rem] text-on-accent">
        {children}
      </p>
    </div>
  );
}

/**
 * Pixel: a 3D robot in the corner that opens a chat about Ankit. Replies
 * stream from /api/chat (Groq). The robot waves on hover and while it says
 * hello, hops and spins when clicked, and its mouth moves while a reply
 * streams. On phones the chat is a full-width sheet above a smaller robot.
 */
export function Assistant() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState<"wait" | "3d" | "flat">("wait");
  const [hovered, setHovered] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [input, setInput] = useState("");
  const [spins, setSpins] = useState(0);

  const anchor = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, status, error, clearError, stop } = useChat();
  const busy = status === "submitted" || status === "streaming";

  // Load the robot when the browser is idle
  useEffect(() => {
    const go = () => setReady(hasWebGL() ? "3d" : "flat");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(go, 1200);
    return () => clearTimeout(id);
  }, []);

  // Say hello once per visit, a few seconds in
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(GREETED_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = window.setTimeout(() => setGreeting(true), 3500);
    const hide = window.setTimeout(() => setGreeting(false), 11500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const dismissGreeting = () => {
    setGreeting(false);
    try {
      sessionStorage.setItem(GREETED_KEY, "1");
    } catch {}
  };

  const toggle = (next = !open) => {
    setOpen(next);
    if (next) setSpins((n) => n + 1);
    dismissGreeting();
    if (!next) launcher.current?.focus();
  };

  // Focus the field on open; Esc closes
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => field.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status, error]);

  const ask = (text: string) => {
    const clean = text.trim().slice(0, 300);
    if (!clean || busy) return;
    if (error) clearError();
    sendMessage({ text: clean });
    setInput("");
  };

  const startOver = () => {
    if (busy) stop();
    if (error) clearError();
    setMessages([]);
    field.current?.focus();
  };

  const visible = messages
    .map((msg) => ({ id: msg.id, role: msg.role, text: msg.parts.filter(isTextUIPart).map((p) => p.text).join("") }))
    .filter((msg) => msg.text);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <m.div
            key="panel"
            id="pixel-chat"
            role="dialog"
            aria-labelledby="pixel-title"
            data-lenis-prevent
            initial={{ opacity: 0, transform: "translateY(12px) scale(0.97)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(8px) scale(0.98)", transition: { duration: 0.14, ease } }}
            transition={{ duration: 0.24, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-2 bottom-[6rem] z-[70] flex max-h-[min(38rem,calc(100svh-7.5rem))] flex-col overflow-hidden border border-rule-strong bg-paper shadow-[0_40px_90px_-30px_rgb(0_0_0/0.65),0_12px_24px_-12px_rgb(0_0_0/0.25)] md:inset-x-auto md:bottom-[10.75rem] md:right-5 md:w-[25.5rem]"
          >
            {/* Signature line */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, var(--accent), ${GLOW} 50%, var(--accent))` }}
            />

            <header className="flex items-center gap-3 px-4 pb-3 pt-4">
              <span className="relative">
                <Avatar size="md" />
                <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#34d399] ring-2 ring-paper" />
              </span>
              <div className="min-w-0 flex-1">
                <p id="pixel-title" className="font-display text-[1.1875rem] font-semibold leading-none tracking-[-0.01em]">
                  {NAME}
                </p>
                <p className="mt-1.5 text-xs text-ink-2">Ankit&apos;s AI assistant · replies in seconds</p>
              </div>
              {visible.length || error ? (
                <button
                  type="button"
                  onClick={startOver}
                  aria-label="Start over"
                  title="Start over"
                  className="inline-flex size-11 items-center justify-center text-ink-2 transition-colors hover:text-ink"
                >
                  <ArrowCounterClockwise weight="bold" className="size-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => toggle(false)}
                aria-label="Close chat"
                className="-mr-2 inline-flex size-11 items-center justify-center text-ink-2 transition-colors hover:text-ink"
              >
                <X weight="bold" className="size-4" />
              </button>
            </header>
            <div className="h-px bg-rule" />

            <div
              ref={log}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {visible.length === 0 && !error ? (
                <>
                  <div>
                    <p className="font-display text-[1.875rem] font-medium leading-[1.02] tracking-[-0.025em]">
                      Hi, I&apos;m {NAME}.
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                      Ask me anything about Ankit&apos;s videos, tools, experience or how to work with him.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {suggestions.map(({ text, icon: SuggestionIcon }) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => ask(text)}
                        className="group flex min-h-12 items-center gap-3 border border-rule px-3 py-2 text-left text-base transition-colors md:text-[0.9375rem] hover:border-accent hover:bg-accent/[0.06]"
                      >
                        <span className="icon-tile size-8 shrink-0">
                          <SuggestionIcon weight="duotone" aria-hidden className="icon-duo size-4" />
                        </span>
                        <span className="flex-1">{text}</span>
                        <ArrowUpRight
                          weight="bold"
                          aria-hidden
                          className="size-3.5 text-ink-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={site.resume}
                      download="Ankit-Singh-Resume.pdf"
                      className="label inline-flex min-h-11 items-center gap-2 bg-ink px-3 text-paper transition-opacity hover:opacity-85"
                    >
                      <DownloadSimple weight="bold" aria-hidden className="size-3.5" />
                      Resume
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="label inline-flex min-h-11 items-center gap-2 border border-rule-strong px-3 transition-colors hover:border-ink"
                    >
                      <EnvelopeSimple weight="bold" aria-hidden className="size-3.5" />
                      Email Ankit
                    </a>
                  </div>
                </>
              ) : null}

              {visible.map((msg, i) =>
                msg.role === "user" ? (
                  <UserMessage key={msg.id}>{msg.text}</UserMessage>
                ) : (
                  <BotMessage key={msg.id} first={i === 0 || visible[i - 1].role === "user"}>
                    <Linkified text={msg.text} />
                  </BotMessage>
                )
              )}

              {status === "submitted" ? (
                <BotMessage first>
                  <span className="sr-only">{NAME} is typing</span>
                  <span aria-hidden className="pixel-dots inline-flex gap-1 py-1">
                    <span />
                    <span />
                    <span />
                  </span>
                </BotMessage>
              ) : null}

              {error ? (
                <BotMessage first>
                  <Linkified text={fallbackLine(error)} />
                </BotMessage>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-rule px-3 pb-3 pt-3"
            >
              <div className="flex items-center gap-1 border border-rule-strong bg-paper-2 pl-3 transition-colors focus-within:border-accent">
                <label htmlFor="pixel-input" className="sr-only">
                  Message {NAME}
                </label>
                <input
                  id="pixel-input"
                  ref={field}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={300}
                  autoComplete="off"
                  placeholder="Ask about Ankit…"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-2"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim() || busy}
                  className="m-0.5 inline-flex size-11 shrink-0 items-center justify-center bg-accent text-on-accent transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-35"
                >
                  <ArrowUp weight="bold" className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-2">
                {NAME} can get things wrong. For anything important, email Ankit.
              </p>
            </form>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div ref={anchor} className="fixed bottom-1 right-1 z-[70] size-[5.5rem] md:bottom-4 md:right-4 md:size-36">
        <AnimatePresence>
          {greeting && !open ? (
            <m.div
              key="hello"
              initial={{ opacity: 0, transform: "translateY(6px) scale(0.95)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease }}
              className="absolute bottom-full right-1 mb-1 hidden w-max max-w-[min(15rem,calc(100vw-2rem))] origin-bottom-right items-center gap-1 border border-rule-strong bg-paper py-1 pl-3 pr-1 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.45)] md:bottom-[58%] md:right-[88%] md:mb-0 md:flex md:origin-right"
            >
              <button type="button" onClick={() => toggle(true)} className="py-1.5 text-left text-sm">
                Hi! I&apos;m {NAME}. Ask me about Ankit.
              </button>
              <button
                type="button"
                onClick={dismissGreeting}
                aria-label="Dismiss"
                className="inline-flex size-7 shrink-0 items-center justify-center text-ink-2 hover:text-ink"
              >
                <X weight="bold" className="size-3" />
              </button>
            </m.div>
          ) : null}
        </AnimatePresence>

        <div aria-hidden className="absolute inset-0">
          {ready === "3d" ? (
            <RobotCanvas
              anchor={anchor}
              still={reduce}
              spin={spins}
              wave={hovered || (greeting && !open)}
              talking={status === "streaming"}
            />
          ) : ready === "flat" ? (
            <span className="absolute inset-[22%] flex items-center justify-center rounded-full bg-accent text-on-accent">
              <Robot weight="fill" className="size-1/2" />
            </span>
          ) : null}
        </div>

        <button
          ref={launcher}
          type="button"
          onClick={() => toggle()}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-expanded={open}
          aria-controls="pixel-chat"
          aria-label={open ? `Close chat with ${NAME}` : `Chat with ${NAME}, Ankit's robot`}
          className="absolute inset-[14%] rounded-full outline-offset-2"
        />
      </div>
    </>
  );
}
