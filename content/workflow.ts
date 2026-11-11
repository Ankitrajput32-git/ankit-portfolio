import type { ToolId } from "@/components/brand";

type StepTool = { name: string; logo: ToolId };

const claude: StepTool = { name: "Claude", logo: "claude" };
const chatgpt: StepTool = { name: "ChatGPT", logo: "chatgpt" };

export const workflow: {
  step: string;
  body: string;
  output: string;
  tools: StepTool[];
  note?: string;
}[] = [
  {
    step: "Idea",
    body: "I read the brief and pick the one thing the video has to say. Then I get Claude and ChatGPT to pitch openings until one sounds like the brand.",
    output: "A one-line hook",
    tools: [claude, chatgpt],
  },
  {
    step: "Script",
    body: "AI writes the first draft. I rewrite it by hand and keep cutting until it fits the runtime.",
    output: "Script with shot notes",
    tools: [claude, chatgpt],
  },
  {
    step: "Visuals",
    body: "I generate or shoot each scene from the shot notes. Each video gets a short style guide so faces and colours don't drift between shots.",
    output: "Shots and stills",
    tools: [
      { name: "ChatGPT images", logo: "chatgpt" },
      { name: "Gemini (Veo)", logo: "gemini" },
      { name: "Google Flow", logo: "flow" },
      { name: "HeyGen", logo: "heygen" },
    ],
  },
  {
    step: "Edit",
    body: "I cut for pace, add captions and sound, then watch it on my phone before anyone else sees it.",
    output: "The final cut, in every size",
    tools: [{ name: "ElevenLabs", logo: "elevenlabs" }],
    note: "for the voiceover",
  },
  {
    step: "Publish",
    body: "I export a version for each platform and write the title and caption. Once it's live, I check the numbers and take what worked into the next video.",
    output: "Live post and notes",
    tools: [claude, chatgpt],
    note: "for titles and captions",
  },
];
