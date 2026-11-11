import {
  Camera,
  ChatCenteredText,
  ChatCircleText,
  ChatsCircle,
  Database,
  FileHtml,
  FilePy,
  FileSql,
  Flag,
  ImageSquare,
  Microphone,
  PenNib,
  PuzzlePiece,
  Scissors,
  Signpost,
  SlidersHorizontal,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";

import type { ToolId } from "@/components/brand";

export const skills = [
  {
    group: "Making",
    items: [
      { name: "AI video generation", icon: VideoCamera },
      { name: "AI image generation", icon: ImageSquare },
      { name: "AI voiceover", icon: Microphone },
      { name: "Scriptwriting", icon: PenNib },
      { name: "Prompt writing", icon: ChatCenteredText },
      { name: "Video editing", icon: Scissors },
      { name: "Photography", icon: Camera },
      { name: "Photo editing", icon: SlidersHorizontal },
    ],
  },
  {
    group: "Technical",
    items: [
      { name: "Python", icon: FilePy },
      { name: "MySQL", icon: FileSql },
      { name: "Database management", icon: Database },
      { name: "HTML, CSS, JavaScript", icon: FileHtml },
    ],
  },
  {
    group: "With people",
    items: [
      { name: "Communication", icon: ChatsCircle },
      { name: "Problem-solving", icon: PuzzlePiece },
      { name: "Decision-making", icon: Signpost },
      { name: "Leadership", icon: Flag },
      { name: "Teamwork", icon: UsersThree },
    ],
  },
  {
    group: "Languages",
    items: [
      { name: "English", icon: ChatCircleText },
      { name: "Hindi", icon: ChatCircleText },
    ],
  },
] as const;

type Tool = { name: string; logo: ToolId };

const claude: Tool = { name: "Claude", logo: "claude" };
const chatgpt: Tool = { name: "ChatGPT", logo: "chatgpt" };
const gemini: Tool = { name: "Gemini (Veo)", logo: "gemini" };
const flow: Tool = { name: "Google Flow", logo: "flow" };
const heygen: Tool = { name: "HeyGen", logo: "heygen" };
const elevenlabs: Tool = { name: "ElevenLabs", logo: "elevenlabs" };

/** The AI tools I work with, grouped by the job they do. Add rows or tools here. */
export const toolkit: { job: string; tools: Tool[] }[] = [
  { job: "Ideas and scripts", tools: [claude, chatgpt] },
  { job: "Images", tools: [{ name: "ChatGPT image generation", logo: "chatgpt" }] },
  { job: "Video generation", tools: [gemini, flow, heygen] },
  { job: "Voice", tools: [elevenlabs] },
];

/** The one-line toolkit in the hero. */
export const heroTools: Tool[] = [claude, chatgpt, { ...gemini, name: "Gemini" }, flow, heygen, elevenlabs];
