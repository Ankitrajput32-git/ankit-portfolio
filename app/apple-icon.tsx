import { ImageResponse } from "next/og";

import { ogColors as c, ogFonts } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.accent,
          color: c.paper,
          fontFamily: "Clash",
          fontWeight: 600,
          fontSize: 150,
          lineHeight: 1,
          paddingBottom: 14,
        }}
      >
        A
      </div>
    ),
    { ...size, fonts }
  );
}
