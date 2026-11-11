import { Suspense } from "react";

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import { Workflow } from "@/components/sections/workflow";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Separate boundaries so hydration yields between these sections */}
      <Suspense>
        <Work />
      </Suspense>
      <Suspense>
        <Workflow />
      </Suspense>
      <Services />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
