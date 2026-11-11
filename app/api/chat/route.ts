import { groq } from "@ai-sdk/groq";
import {
  APICallError,
  convertToModelMessages,
  createUIMessageStreamResponse,
  isTextUIPart,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

import { pixelInstructions } from "@/lib/pixel-knowledge";

/* A model on Groq's free plan. Set GROQ_MODEL in .env.local to swap it. */
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

/*
 * Per-visitor speed bump: 12 messages per 10 minutes, counted in memory.
 * Vercel spreads requests over several instances, each with its own count,
 * so in production this only slows a burst that lands on one instance. The
 * real per-visitor limit is a Vercel Firewall rate-limit rule on /api/chat.
 */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 12;
const hits = new Map<string, { count: number; reset: number }>();

function overLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

/*
 * Only the site itself may call this. Browsers always send Origin on a POST,
 * so requests from other sites, or scripts that don't fake the header, are
 * turned away before they can spend the free Groq quota.
 */
function fromThisSite(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* The chat panel turns these codes into Pixel's friendly fallback lines */
const fail = (code: string, status: number) => Response.json({ code }, { status });

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) return fail("not-configured", 503);
  if (!fromThisSite(req)) return fail("forbidden", 403);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (overLimit(ip)) return fail("rate-limited", 429);

  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return fail("bad-request", 400);
  }
  if (!Array.isArray(messages) || messages.length === 0) return fail("bad-request", 400);

  // Recent turns only, text only, each capped: the free plan counts every token
  const recent = messages.slice(-8).map((m) => ({
    ...m,
    parts: m.parts.filter(isTextUIPart).map((p) => ({ ...p, text: p.text.slice(0, 600) })),
  }));

  const result = streamText({
    model: groq(MODEL),
    instructions: pixelInstructions,
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 600,
    providerOptions: { groq: { reasoningEffort: "low" } },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: false,
      onError: (error) =>
        APICallError.isInstance(error) && error.statusCode === 429 ? "rate-limited" : "error",
    }),
  });
}
