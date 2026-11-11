import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Static TTF instances for next/og (Satori cannot read variable fonts or woff2). */
export async function ogFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [light, medium, semibold, mono] = await Promise.all([
    readFile(join(dir, "ClashDisplay-Light.ttf")),
    readFile(join(dir, "ClashDisplay-Medium.ttf")),
    readFile(join(dir, "ClashDisplay-Semibold.ttf")),
    readFile(join(dir, "GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Clash", data: light, style: "normal" as const, weight: 300 as const },
    { name: "Clash", data: medium, style: "normal" as const, weight: 500 as const },
    { name: "Clash", data: semibold, style: "normal" as const, weight: 600 as const },
    { name: "Geist Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

export const ogColors = {
  paper: "#f3efe6",
  ink: "#15140f",
  ink2: "#5e5a52",
  accent: "#2188bb",
};
