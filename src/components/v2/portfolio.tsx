"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, CodeXml, Copy, Download, Github, Linkedin, Menu, Pause, Play, X } from "lucide-react";
import { ExperienceTimeline } from "./experience-timeline";
import { ParticleField } from "./particle-field";
import { TechnologyGrid } from "./technology-grid";
import { content } from "./content";
import esMessages from "@/messages/es.json";
import enMessages from "@/messages/en.json";
import "./portfolio.css";

export function Portfolio({ locale }: { locale: "es" | "en" }) {
  const c = content[locale];
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("");
  const [erpPreview, setErpPreview] = useState("dashboard");
  const rootRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const experience = (locale === "es" ? esMessages : enMessages).Experience.items;
  const email = "andrescordovaoficial@gmail.com";
  const projects = c.projects.filter(project => filter === "all" || project.category === filter);
  const erpPreviews = [
    { id: "dashboard", label: "BackOffice", image: "/projects/v2/cordova-dashboard.png" },
    { id: "landing", label: "Landing", image: "/projects/v2/cordova-landing.png" },
    { id: "manuals", label: locale === "es" ? "Manuales" : "Guides", image: "/projects/v2/cordova-manuals.png" },
  ];
  const erpImage = erpPreviews.find(preview => preview.id === erpPreview) ?? erpPreviews[0];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    rootRef.current?.querySelectorAll("[data-reveal]").forEach(element => revealObserver.observe(element));
    rootRef.current?.classList.add("v2-reveal-ready");
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-15% 0px -60% 0px" });
    rootRef.current?.querySelectorAll("section[id]").forEach(section => sectionObserver.observe(section));
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="portfolio-v2" ref={rootRef}>
      <a className="v2-skip" href="#projects">{c.projectsCta}</a>
      <header className="v2-header">
        <a href="#home" className="v2-brand" aria-label="Andrés Córdova">Andrés Córdova</a>
        <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="v2-desktop-nav">
          {c.nav.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-active" : ""}>{item.label}</a>)}
        </nav>
        <div className="v2-nav-actions">
          <div className="v2-languages" aria-label={locale === "es" ? "Idioma" : "Language"}><Link href="/es" aria-current={locale === "es" ? "page" : undefined}>ES</Link><span>/</span><Link href="/en" aria-current={locale === "en" ? "page" : undefined}>EN</Link></div>
          <a href="#contact" className="v2-nav-contact">{c.contactCta}<ArrowUpRight size={15} /></a>
          <button className="v2-mobile-toggle" aria-label={menuOpen ? c.close : c.menu} aria-expanded={menuOpen} aria-controls="v2-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      {menuOpen && <nav id="v2-mobile-nav" className="v2-mobile-nav" aria-label={c.menu}>{[...c.nav, { id: "contact", label: c.contactCta }].map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={20} /></a>)}</nav>}
      <main>
        <section id="home" className="v2-hero">
          <ParticleField className="v2-particles" paused={paused} />
          <div className="v2-hero-shade" />
          <div className="v2-hero-content">
            <div className="v2-eyebrow v2-hero-eyebrow">{c.role}</div>
            <p className="v2-introduction">Andrés Córdova</p>
            <h1>{c.heroLine1}<br />{c.heroLine2}<br /><em>{c.heroAccent.replace(/\.$/, "")}</em><span className="v2-title-dot">.</span></h1>
            <p className="v2-hero-description">{c.heroDescription}</p>
            <div className="v2-hero-actions"><a href="#projects" className="v2-button">{c.projectsCta}<ArrowDownRight size={18} /></a><a href="/cv/andres-cordova-cv.pdf" className="v2-text-link" download>{c.downloadCv}<Download size={15} /></a></div>
          </div>
          <div className="v2-hero-bottom"><span>{c.location}<span className="v2-utc">UTC −6</span></span><a href="#projects" className="v2-scroll-label">SCROLL TO EXPLORE<ArrowDown size={14} /></a><button onClick={() => setPaused(!paused)} aria-label={paused ? c.resume : c.pause} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? c.resume : c.pause}</span></button></div>
        </section>
        <div className="v2-discipline-strip" aria-label={c.role}><span>FULL STACK ENGINEERING</span><i aria-hidden="true"><CodeXml size={22} strokeWidth={1.4} /></i><span>CONVERSATIONAL AI</span><i aria-hidden="true"><CodeXml size={22} strokeWidth={1.4} /></i><span>DIGITAL EXPERIENCES</span><i aria-hidden="true"><CodeXml size={22} strokeWidth={1.4} /></i><span>FROM IDEA TO PRODUCTION</span></div>

        <section id="projects" className="v2-section v2-projects">
          <div className="v2-section-head" data-reveal><div><p className="v2-eyebrow">{c.projectEyebrow}</p><h2>{c.projectTitle}<span className="v2-section-count">(04)</span></h2></div><p className="v2-section-intro">{c.projectIntro}</p></div>
          <div className="v2-project-toolbar"><div className="v2-filters" aria-label={c.projectEyebrow}>{c.projectFilters.map(item => <button key={item.id} aria-pressed={filter === item.id} className={filter === item.id ? "is-selected" : ""} onClick={() => setFilter(item.id)}>{item.label}{item.id === "all" && <span>04</span>}</button>)}</div><span className="v2-production-legend">{c.live}</span></div>
          <div className="v2-project-grid" aria-live="polite">
            {projects.map(project => {
              const imageSrc = project.id === "cordova-erp" ? erpImage.image : project.image;
              const imageAlt = project.id === "family-friendly"
                ? (locale === "es" ? "Chat de Family Friendly abierto sobre el portal Plan Familiar" : "Family Friendly chat open on the Plan Familiar portal")
                : project.id === "cordova-erp"
                  ? `${project.name} — ${erpImage.label}${erpPreview === "dashboard" ? (locale === "es" ? " con datos ficticios de demostración" : " with fictional demonstration data") : ""}`
                  : `${project.name} — ${project.categoryLabel}`;
              return <article key={project.id} className={`v2-project v2-project-${project.id}`}>
              <a className="v2-project-visual" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${c.visit}`}>
                <div className="v2-project-image"><Image src={imageSrc} alt={imageAlt} width={1600} height={1000} sizes="(max-width: 760px) 92vw, 44vw" /></div>
                <span className="v2-project-index">/{project.number}</span><span className="v2-project-open"><ArrowUpRight size={23} /></span><span className="v2-project-image-label">{project.name}</span>
              </a>
              {project.id === "cordova-erp" && <div className="v2-preview-switch" aria-label={locale === "es" ? "Vistas de Córdova ERP" : "Córdova ERP views"}>{erpPreviews.map(view => <button key={view.id} aria-pressed={erpPreview === view.id} onClick={() => setErpPreview(view.id)}>{view.label}</button>)}</div>}
              <div className="v2-project-caption"><span className="v2-eyebrow">{project.categoryLabel}</span><span className="v2-live-dot">{c.live}</span></div>
              <h3><a href={project.url} target="_blank" rel="noopener noreferrer">{project.headline}<ArrowUpRight size={22} /></a></h3>
              <p>{project.description}</p><div className="v2-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="v2-project-detail"><span>{project.detail}</span><div>{project.links?.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={12} /></a>)}</div></div>
            </article>;
            })}
          </div>
        </section>

        <section id="about" className="v2-section v2-about">
          <p className="v2-eyebrow" data-reveal>{c.aboutEyebrow}</p>
          <div className="v2-about-grid"><div className="v2-portrait" data-reveal><Image src="/profile.webp" alt="Andrés Córdova" width={650} height={800} sizes="(max-width: 760px) 85vw, 32vw" /><div className="v2-portrait-label"><span>ANDRÉS CÓRDOVA</span><span>ENGINEER & BUILDER ↗</span></div><span className="v2-portrait-mark" aria-hidden="true"><CodeXml strokeWidth={1.25} /></span></div><div className="v2-about-copy" data-reveal><h2>{c.aboutTitle}</h2><p>{c.aboutText}</p><p className="v2-about-note">{c.aboutNote}</p><div className="v2-about-signature"><span>Ing. Andrés.</span><a href="/cv/andres-cordova-cv.pdf" download className="v2-text-link">{c.downloadCv}<Download size={15} /></a></div></div></div>
        </section>

        <section id="skills" className={`v2-section v2-skills ${active === "skills" ? "is-active" : ""}`} data-paused={paused}>
          <div className="v2-section-head" data-reveal><div><p className="v2-eyebrow">{c.skillsEyebrow}</p><h2>{c.skillsTitle.split(". ")[0]}. <em>{c.skillsTitle.split(". ")[1]}</em></h2></div><p className="v2-section-intro">{c.skillsIntro}</p></div>
          <TechnologyGrid locale={locale} motionPaused={paused} onResumeMotion={() => setPaused(false)} />
        </section>

        <section id="experience" className="v2-section v2-experience">
          <div className="v2-experience-heading" data-reveal><p className="v2-eyebrow">{c.experienceEyebrow}</p><h2>{c.experienceTitle}</h2><span className="v2-experience-symbol" aria-hidden="true">↗</span></div>
          <ExperienceTimeline>{experience.map((item, index) => <article key={item.company}><div className="v2-job-date">{item.date}<span>{item.location === "remote" ? (locale === "es" ? "Remoto" : "Remote") : (locale === "es" ? "Presencial" : "On-site")}</span></div><h3>{item.title}</h3><h4>{item.company}</h4><p>{item.description}</p><span className="v2-job-index">0{index + 1}</span></article>)}</ExperienceTimeline>
        </section>

        <section id="education" className="v2-section v2-education" aria-labelledby="education-title">
          <div className="v2-education-heading" data-reveal><p className="v2-eyebrow">{c.educationEyebrow}</p><h2 id="education-title">{c.educationTitle}</h2></div>
          <div className="v2-education-path" data-reveal>{c.education.map(item => <article key={item.title}><p className="v2-education-date">{item.period}</p><h3>{item.title}</h3><p className="v2-education-institution">{item.institution}</p>{item.detail && <p className="v2-education-distinction">{item.detail}</p>}</article>)}</div>
        </section>

        <section id="contact" className="v2-section v2-contact">
          <div className="v2-contact-top"><p className="v2-eyebrow">06 / {c.contactEyebrow}</p><span className="v2-contact-mark" aria-hidden="true"><CodeXml strokeWidth={1.25} /></span></div>
          <h2 data-reveal>{c.contactTitle}<ArrowUpRight aria-hidden="true" /></h2><div className="v2-contact-bottom"><p>{c.contactText}</p><div className="v2-contact-actions"><a href={`mailto:${email}`} className="v2-button">{c.emailCta}<ArrowUpRight size={18} /></a><button className="v2-copy-email" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={16} />}<span>{copied ? c.copied : c.copyEmail}</span></button><span className="v2-copy-status" role="status">{copied ? c.copied : ""}</span></div></div>
          <div className="v2-socials"><a href="https://github.com/ing-cordova" target="_blank" rel="noopener noreferrer"><Github size={16} />GitHub<ArrowUpRight size={13} /></a><a href="https://linkedin.com/in/ing-cordova" target="_blank" rel="noopener noreferrer"><Linkedin size={16} />LinkedIn<ArrowUpRight size={13} /></a><a href="https://wa.me/50376592632" target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={13} /></a></div>
        </section>
      </main>
      <footer className="v2-footer"><a href="#home" className="v2-brand" aria-label={`Andrés Córdova — ${c.backTop}`}>Andrés Córdova</a><span>© {new Date().getFullYear()} Andrés Córdova</span><span>{c.footerNote}</span><a href="#home">{c.backTop}<ArrowRight size={14} className="v2-back-arrow" /></a></footer>
    </div>
  );
}



