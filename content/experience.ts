export const experience = [
  {
    role: "AI Native Content Creator",
    company: "imaPRO",
    logo: { kind: "imapro" },
    start: "Jun 2026",
    end: "Present",
    current: true,
    points: [
      "Make AI videos for brands start to finish. Most of my work so far is explainers and Shorts for Xtrusio's YouTube channel.",
      "Write the scripts and hooks with Claude and ChatGPT, then generate the shots in Gemini (Veo), Google Flow, HeyGen and ChatGPT.",
      "Cut the clips into Shorts and longer videos, add an ElevenLabs voiceover, and size the captions for each platform.",
      "Design the thumbnail and the social posts for every video.",
    ],
  },
  {
    role: "Document Verification Analyst",
    company: "Mas Callnet India Pvt Ltd",
    logo: { kind: "image", src: "/logos/mascallnet.png", width: 299, height: 108 },
    start: "Jul 2025",
    end: "Dec 2025",
    current: false,
    points: [
      "Checked applicant documents to confirm they were genuine and met company policy.",
      "Worked through a high volume of sensitive files and finished every check inside the turnaround time.",
    ],
  },
  {
    role: "Salesperson",
    company: "Unicharm",
    logo: { kind: "image", src: "/logos/unicharm.svg", width: 522, height: 160 },
    start: "Jan 2024",
    end: "Oct 2024",
    current: false,
    points: [
      "Asked customers what they needed, then showed them which products fit.",
      "Kept the product displays tidy and easy to shop.",
      "Answered questions on the spot. Got to know the regular customers, which helped repeat sales.",
    ],
  },
] as const;
