"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ExperienceTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = ref.current;
    if (!timeline) return;
    const articles = Array.from(timeline.querySelectorAll("article"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = timeline.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.48;
      const points = articles.map(article => article.offsetTop + 8.5);
      const first = points[0] ?? 0;
      const last = points.at(-1) ?? first;
      const position = readingLine - bounds.top;
      const progress = Math.max(0, Math.min(last - first, position - first));
      timeline.style.setProperty("--timeline-start", `${first}px`);
      timeline.style.setProperty("--timeline-length", `${last - first}px`);
      timeline.style.setProperty("--timeline-progress", `${progress}px`);
      let active = -1;
      points.forEach((point, index) => { if (position >= point) active = index; });
      articles.forEach((article, index) => {
        article.classList.toggle("is-current", index === active);
        article.classList.toggle("is-reached", index <= active);
        if (index === active) article.setAttribute("aria-current", "step");
        else article.removeAttribute("aria-current");
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(timeline);
    articles.forEach(article => observer.observe(article));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div ref={ref} className="v2-timeline">{children}</div>;
}
