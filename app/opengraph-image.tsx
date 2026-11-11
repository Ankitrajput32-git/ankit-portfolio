import { ImageResponse } from "next/og";

import { ogColors as c, ogFonts } from "@/lib/og-fonts";

export const alt = "Ankit Singh, AI-native content creator in Lucknow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same idea as the hero: the name, with a viewfinder inverting part of it. */
const NAME_TOP = 132;
const FRAME = { left: 640, top: 300, width: 288, height: 162 };

function Name({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", color, fontFamily: "Clash", fontWeight: 600 }}>
      <div style={{ fontSize: 232, lineHeight: 0.84, letterSpacing: -11 }}>Ankit</div>
      <div
        style={{
          fontSize: 232,
          lineHeight: 0.84,
          letterSpacing: -11,
          marginLeft: 380,
        }}
      >
        Singh
      </div>
    </div>
  );
}

export default async function Image() {
  const fonts = await ogFonts();
  const corner = { position: "absolute" as const, width: 14, height: 14, borderColor: c.ink };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: c.paper,
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 48,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 14,
            borderBottom: `1px solid ${c.ink2}55`,
            fontSize: 16,
            letterSpacing: 1.5,
            color: c.ink2,
          }}
        >
          <span>PORTFOLIO, 2026</span>
          <span>LUCKNOW, INDIA</span>
        </div>

        <div style={{ position: "absolute", left: 56, top: NAME_TOP, display: "flex" }}>
          <Name color={c.ink} />
        </div>

        {/* Inverted copy inside the frame */}
        <div
          style={{
            position: "absolute",
            left: FRAME.left,
            top: FRAME.top,
            width: FRAME.width,
            height: FRAME.height,
            overflow: "hidden",
            background: c.accent,
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 56 - FRAME.left,
              top: NAME_TOP - FRAME.top,
              display: "flex",
            }}
          >
            <Name color={c.paper} />
          </div>
        </div>
        <div style={{ ...corner, left: FRAME.left - 8, top: FRAME.top - 8, borderLeftWidth: 2, borderTopWidth: 2 }} />
        <div style={{ ...corner, left: FRAME.left + FRAME.width - 6, top: FRAME.top - 8, borderRightWidth: 2, borderTopWidth: 2 }} />
        <div style={{ ...corner, left: FRAME.left - 8, top: FRAME.top + FRAME.height - 6, borderLeftWidth: 2, borderBottomWidth: 2 }} />
        <div style={{ ...corner, left: FRAME.left + FRAME.width - 6, top: FRAME.top + FRAME.height - 6, borderRightWidth: 2, borderBottomWidth: 2 }} />
        <div
          style={{
            position: "absolute",
            left: FRAME.left,
            top: FRAME.top - 34,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            letterSpacing: 1.5,
            color: c.ink,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 8, background: c.accent }} />
          REC 00:00:07:14
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            bottom: 52,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span style={{ fontFamily: "Clash", fontWeight: 500, fontSize: 38, letterSpacing: -0.8, color: c.ink }}>
            AI-native content creator
          </span>
          <span style={{ fontSize: 16, letterSpacing: 1.5, color: c.ink2 }}>
            AI VIDEO / REELS / POSTERS / POSTS
          </span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
