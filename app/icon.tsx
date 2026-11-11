import { ImageResponse } from "next/og";

import { ogColors as c, ogFonts } from "@/lib/og-fonts";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 54,
          lineHeight: 1,
          paddingBottom: 6,
        }}
      >
        A
      </div>
    ),
    { ...size, fonts }
  );
}
