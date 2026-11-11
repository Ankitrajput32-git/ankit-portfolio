export type WorkFormat = "reel" | "video" | "poster" | "post";

export type WorkItem = {
  id: string;
  format: WorkFormat;
  title: string;
  context: string;
  year: string;
  /** e.g. "/work/reel-01.jpg" (put files in /public/work) */
  thumbnail?: string;
  /** YouTube video id. Hover plays a muted preview; the lightbox plays it in full. */
  youtubeId?: string;
  /** Short muted loop for non-YouTube work, e.g. "/work/reel-01-preview.mp4" */
  preview?: string;
  /** Full video file for the lightbox, if not on YouTube */
  video?: string;
  /** Link to the live post */
  href?: string;
  /** What I did on it, shown in the lightbox */
  role: string;
  /** Tools used, shown in the lightbox */
  tools: string;
  /** Small tag on the card, e.g. "Most watched" */
  badge?: string;
  /** Placement in the curated "All" view (12-column grid at lg) */
  layout: string;
  /** The one big tile at the top of the "All" view */
  featured?: boolean;
};

export const formats: Record<
  WorkFormat,
  { label: string; plural: string; ratio: string; aspect: string; span: string; lg: string }
> = {
  reel: {
    label: "Short",
    plural: "Shorts",
    ratio: "9:16",
    aspect: "aspect-[9/16]",
    span: "col-span-2 md:col-span-2",
    lg: "lg:col-span-3",
  },
  video: {
    label: "Video",
    plural: "Videos",
    ratio: "16:9",
    aspect: "aspect-video",
    span: "col-span-4 md:col-span-4",
    lg: "lg:col-span-4",
  },
  poster: {
    label: "Poster",
    plural: "Posters",
    ratio: "4:5",
    aspect: "aspect-[4/5]",
    span: "col-span-2 md:col-span-3",
    lg: "lg:col-span-4",
  },
  post: {
    label: "Post",
    plural: "Posts",
    ratio: "1:1",
    aspect: "aspect-square",
    span: "col-span-2 md:col-span-3",
    lg: "lg:col-span-4",
  },
};

export const channel = {
  name: "Xtrusio",
  url: "https://www.youtube.com/@xtrusio",
};

/* Every Xtrusio piece so far is end to end. Override per item if one differs. */
const xtrusioCredits = {
  role: "Script, visuals, voiceover, edit and thumbnail",
  tools: "Claude, ChatGPT, Gemini (Veo), Google Flow, HeyGen, ElevenLabs",
};

const short = (youtubeId: string, title: string, layout: string, badge?: string): WorkItem => ({
  ...xtrusioCredits,
  id: youtubeId,
  format: "reel",
  title,
  context: "Xtrusio · YouTube Short",
  year: "2026",
  thumbnail: `/work/yt-${youtubeId}.jpg`,
  youtubeId,
  href: `https://www.youtube.com/shorts/${youtubeId}`,
  layout,
  badge,
});

const video = (youtubeId: string, title: string, layout: string, badge?: string): WorkItem => ({
  ...xtrusioCredits,
  id: youtubeId,
  format: "video",
  title,
  context: "Xtrusio · YouTube",
  year: "2026",
  thumbnail: `/work/yt-${youtubeId}.jpg`,
  youtubeId,
  href: `https://www.youtube.com/watch?v=${youtubeId}`,
  layout,
  badge,
});

/*
 * From the Xtrusio channel. The "All" view runs: the most-watched video as
 * one big tile, the four Shorts in a row of phones, then three videos. Add
 * posters or posts with format "poster" / "post" and their filter tab
 * appears on its own.
 */
export const work: WorkItem[] = [
  {
    ...video("D64Xr5vMumk", "What Is llms.txt? Do You Need an llms.txt File?", "col-span-4 md:col-span-8 lg:col-span-12", "Most watched"),
    featured: true,
  },
  short("81ipKf1agyg", "4 AEO Tips to Make Your Content AI-Friendly", "lg:col-span-3", "Most watched"),
  short("1UoxGu1aNJs", "If AI Doesn't Say Your Name, You Stay Invisible", "lg:col-span-3"),
  short("q10TvDNKd08", "Perplexity SEO: Check This 1 Thing First", "lg:col-span-3"),
  short("cVWfj-MAqpQ", "AI Mentioned Your Brand. Did It Cite Your Page?", "lg:col-span-3"),
  video("9qgdLYrA8uY", "Semrush AI Visibility: Is It Worth It in 2026?", "lg:col-span-4"),
  video("ftIDC9Pd8hI", "Perplexity SEO: How to Get Your Brand Mentioned", "lg:col-span-4"),
  video("pkiMVf-Je4M", "Best AEO Tools 2026: What They Track, Cost and Leave to You", "lg:col-span-4"),
];
