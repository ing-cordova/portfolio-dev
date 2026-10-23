import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { ScrollToTopButton } from "@/components/shared/scroll-to-top-button";
import { FloatingNav } from "@/components/shared/floating-nav";
import { Navbar } from "@/components/sections/navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
      <FloatingNav />
      <ScrollToTopButton />
    </main>
  );
}
