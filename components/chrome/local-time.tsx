"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const format = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

/** Lucknow time, so visitors know when I'm likely to reply. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={cn("whitespace-nowrap", className)}>
      Lucknow <span className="tabular-nums">{time ?? "--:--"}</span> IST
    </span>
  );
}
