"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const groups = [
  { es: "Frontend & UX/UI", en: "Frontend & UX/UI", technologies: [
    ["React", "react"], ["Next.js", "nextdotjs"], ["Angular", "angular"],
    ["Vue 3", "vuedotjs"], ["TypeScript", "typescript"], ["Tailwind CSS", "tailwindcss"],
    ["JavaScript"], ["HTML5 & CSS3"],
  ] },
  { es: "Backend", en: "Backend", technologies: [
    ["Node.js", "nodedotjs"], ["NestJS", "nestjs"], ["Python", "python"],
    ["Django", "django"], ["PHP", "php"], ["Java", "java"],
    ["Spring Framework"], ["Laravel"], ["REST APIs"], ["Microservices"],
  ] },
  { es: "Datos e integraciones", en: "Data & integrations", technologies: [
    ["PostgreSQL", "postgresql"], ["MySQL", "mysql"], ["Prisma", "prisma"],
    ["OpenAPI", "openapiinitiative"], ["WordPress", "wordpress"], ["Stripe", "stripe"],
    ["MongoDB"], ["SQL Server"], ["SQL"],
  ] },
  { es: "Herramientas e IA", en: "Tools & AI", technologies: [
    ["Codex", "codex"], ["Antigravity", "antigravity"], ["OpenCode", "opencode"],
    ["Claude Code", "anthropic"], ["MCP", "modelcontextprotocol"], ["Docker", "docker"],
    ["Linux/Unix", "linux"], ["Git", "git"], ["GitHub Actions", "githubactions"],
    ["Azure DevOps"], ["CI/CD"], ["Google Cloud"], ["Gemini"], ["GitHub Copilot"],
    ["Prompt engineering"], ["RAG"],
  ] },
];

export function TechnologyGrid({ locale, motionPaused = false, onResumeMotion }: { locale: "es" | "en"; motionPaused?: boolean; onResumeMotion?: () => void }) {
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stopped = paused || motionPaused;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const banners = Array.from(root.querySelectorAll<HTMLElement>(".v2-tech-banner"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const height = window.innerHeight;
      const readingLine = height * 0.52;
      // Read all geometry before updating styles to avoid repeated layout work.
      const positions = banners.map(banner => banner.querySelector(".v2-tech-scene")!.getBoundingClientRect());
      let closest = -1;
      let distance = Infinity;
      positions.forEach((bounds, index) => {
        const delta = Math.abs(bounds.top + bounds.height / 2 - readingLine);
        if (bounds.bottom > 86 && bounds.top < height && delta < distance) {
          closest = index;
          distance = delta;
        }
      });
      banners.forEach((banner, index) => {
        const bounds = positions[index];
        const progress = Math.max(0, Math.min(1, (height - bounds.top) / (height + bounds.height)));
        const proximity = Math.max(0, 1 - Math.abs(bounds.top + bounds.height / 2 - readingLine) / (height * 0.55));
        banner.classList.toggle("is-reading", index === closest);
        // Reading focus remains available even when decorative motion is disabled.
        if (preference.matches) {
          banner.style.removeProperty("--scroll-shift");
          banner.style.removeProperty("--scroll-light");
          banner.style.removeProperty("--scroll-progress");
          return;
        }
        if (stopped) return;
        banner.style.setProperty("--scroll-light", (proximity * 0.22).toFixed(3));
        banner.style.setProperty("--scroll-progress", progress.toFixed(3));
        const shift = (progress - 0.5) * (index % 2 === 0 ? 180 : -180);
        banner.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);

      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(root);
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [stopped]);

  const es = locale === "es";
  return <div ref={rootRef} className="v2-technology-banners" data-motion-paused={stopped}>
    <div className="v2-tech-controls">
      <span>{es ? "EXPLORA MI STACK" : "EXPLORE MY STACK"}</span>
      <button type="button" onClick={() => { if (motionPaused) { onResumeMotion?.(); setPaused(false); } else setPaused(!paused); }} aria-pressed={stopped}>
        {stopped ? <Play size={12} /> : <Pause size={12} />}
        {stopped ? (es ? "Activar movimiento" : "Resume motion") : (es ? "Pausar movimiento" : "Pause motion")}
      </button>
    </div>
    <div className="v2-tech-panorama">
    {groups.map((group, index) => <article className={`v2-tech-banner v2-tech-banner-${index}`} key={group.en} aria-labelledby={`tech-title-${index}`}>
      <div className="v2-tech-scene">
        <div className="v2-tech-backdrop" aria-hidden="true">
          <div className="v2-tech-orbit" />
          {group.technologies.filter(([, icon]) => icon).slice(0, 6).map(([, icon], iconIndex) => <Image className={`v2-tech-mark v2-tech-mark-${iconIndex}`} key={icon} src={`/technologies/${icon}.svg`} alt="" width={120} height={120} />)}
        </div>
        <div className="v2-tech-meta"><span>0{index + 1}<i />04</span><span>{(es ? ["DISEÑO + INTERACCIÓN", "LÓGICA + ARQUITECTURA", "DATOS + CONEXIONES", "ENTREGA + INTELIGENCIA"] : ["DESIGN + INTERACTION", "LOGIC + ARCHITECTURE", "DATA + CONNECTIONS", "DELIVERY + INTELLIGENCE"])[index]}</span></div>
        <div className="v2-tech-banner-title">
          <h3 id={`tech-title-${index}`}>{index === 0 ? <>Frontend <em>& UX/UI</em></> : index === 2 ? (es ? <>Datos <em>& conexiones</em></> : <>Data <em>& connections</em></>) : index === 3 ? (es ? <>Herramientas <em>& IA</em></> : <>Tools <em>& AI</em></>) : <em>Backend</em>}</h3>
          <p>{(es ? ["Interfaces pensadas para las personas.", "La lógica detrás de cada producto.", "Cada pieza, conectada con intención.", "Codex, Claude Code, Gemini y GitHub Copilot para desarrollar con IA. Asistentes con RAG, búsqueda semántica y memoria conversacional; integraciones MCP y automatización de procesos."] : ["Interfaces designed around people.", "The logic behind every product.", "Every piece, connected with intention.", "Codex, Claude Code, Gemini, and GitHub Copilot for AI-assisted development. Assistants with RAG, semantic search, and conversational memory; MCP integrations and workflow automation."])[index]}</p>
        </div>
        <ul className="v2-tech-accessible" aria-label={group[locale]}>{group.technologies.map(([name]) => <li key={name}>{name}</li>)}</ul>
      </div>
    </article>)}
    </div>
  </div>;
}
