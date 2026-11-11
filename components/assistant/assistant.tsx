"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowUp, Robot, X } from "@phosphor-icons/react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* three.js only loads once the page is idle, and never on the server */
const RobotCanvas = dynamic(() => import("./robot").then((mod) => mod.RobotCanvas), { ssr: false });

const NAME = "Pixel";
const suggestions = [
  "What does Ankit make?",
  "Which AI tools does Ankit use?",
  "Is Ankit open to work?",
  "How do I contact Ankit?",
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

/**
 * Pixel: a 3D robot in the corner that opens a small chat about Ankit.
 * Replies stream from /api/chat (Groq). The robot waves on hover and while
 * it says hello, and its mouth moves while a reply is streaming.
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

  const { messages, sendMessage, status, error, clearError } = useChat();
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
            initial={{ opacity: 0, transform: "translateY(10px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(6px) scale(0.98)", transition: { duration: 0.14, ease } }}
            transition={{ duration: 0.22, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[7.75rem] right-3 z-[70] flex max-h-[min(34rem,calc(100svh-9.5rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col border border-rule-strong bg-paper shadow-[0_28px_70px_-24px_rgb(0_0_0/0.5)] md:bottom-[10.75rem] md:right-5"
          >
            <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2">
              <div className="flex items-center gap-3">
                <span className="icon-tile size-9">
                  <Robot weight="duotone" aria-hidden className="icon-duo size-5" />
                </span>
                <div>
                  <p id="pixel-title" className="font-display text-[1.125rem] font-semibold leading-tight">
                    {NAME}
                  </p>
                  <p className="label flex items-center gap-1.5 text-ink-2">
                    <span aria-hidden className="size-1.5 bg-accent" />
                    Ankit&apos;s robot
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(false)}
                aria-label="Close chat"
                className="-mr-2 inline-flex size-11 items-center justify-center text-ink-2 transition-colors hover:text-ink"
              >
                <X weight="bold" className="size-4" />
              </button>
            </header>

            <div
              ref={log}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              <Bubble from="bot">
                Hi! I&apos;m {NAME}. Ask me anything about Ankit&apos;s videos, tools, experience or how
                to work with him.
              </Bubble>

              {messages.length === 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="min-h-11 border border-rule-strong px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:text-accent-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              {messages.map((msg) => {
                const text = msg.parts.filter(isTextUIPart).map((p) => p.text).join("");
                if (!text) return null;
                return (
                  <Bubble key={msg.id} from={msg.role === "user" ? "you" : "bot"}>
                    {text}
                  </Bubble>
                );
              })}

              {status === "submitted" ? (
                <Bubble from="bot">
                  <span className="sr-only">{NAME} is typing</span>
                  <span aria-hidden className="pixel-dots inline-flex gap-1">
                    <span />
                    <span />
                    <span />
                  </span>
                </Bubble>
              ) : null}

              {error ? <Bubble from="bot">{fallbackLine(error)}</Bubble> : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-rule px-2 py-2"
            >
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
                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-ink-2"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || busy}
                className="inline-flex size-11 shrink-0 items-center justify-center bg-accent text-on-accent transition-opacity disabled:opacity-40"
              >
                <ArrowUp weight="bold" className="size-4" />
              </button>
            </form>
            <p className="border-t border-rule px-4 py-2 text-xs text-ink-2">
              {NAME} can get things wrong. For anything important, email Ankit.
            </p>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div ref={anchor} className="fixed bottom-2 right-2 z-[70] size-28 md:bottom-4 md:right-4 md:size-36">
        <AnimatePresence>
          {greeting && !open ? (
            <m.div
              key="hello"
              initial={{ opacity: 0, transform: "translateX(8px) scale(0.95)" }}
              animate={{ opacity: 1, transform: "translateX(0px) scale(1)" }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease }}
              style={{ transformOrigin: "right center" }}
              className="absolute bottom-[58%] right-[88%] flex w-max max-w-[15rem] items-center gap-1 border border-rule-strong bg-paper py-1 pl-3 pr-1 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.45)]"
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

function Bubble({ from, children }: { from: "bot" | "you"; children: React.ReactNode }) {
  return (
    <div className={cn("flex", from === "you" && "justify-end")}>
      <p
        className={cn(
          "max-w-[85%] whitespace-pre-wrap px-3 py-2 text-base leading-relaxed",
          from === "you" ? "bg-accent text-on-accent" : "bg-paper-2 text-ink"
        )}
      >
        {children}
      </p>
    </div>
  );
}
