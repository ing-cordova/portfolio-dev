// src/components/sections/projects.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/shared/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import { SmoothScroll } from "@/components/shared/smooth-scroll"

interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

export function Projects() {
  const t = useTranslations("Projects")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Obtenemos los proyectos del archivo de traducción usando la función raw
  const projectItems = (t.raw("items") as ProjectItem[]) || [];

  // Extraer tags únicos para filtros
  const allTags = Array.from(new Set(projectItems.flatMap(project => project.tags)))
  
  // Filtrar proyectos según tag seleccionado
  const filteredProjects = selectedFilter === "all" 
    ? projectItems 
    : projectItems.filter(project => project.tags.includes(selectedFilter))

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Controles de filtro y vista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12"
        >
          {/* Filtros por tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground mr-2" />
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className="transition-all duration-200"
            >
              Todos ({projectItems.length})
            </Button>
            {allTags.slice(0, 4).map((tag) => {
              const count = projectItems.filter(p => p.tags.includes(tag)).length
              return (
                <Button
                  key={tag}
                  variant={selectedFilter === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(tag)}
                  className="transition-all duration-200"
                >
                  {tag} ({count})
                </Button>
              )
            })}
          </div>

          {/* Toggle vista */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Contador de resultados */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
            <span>
              {filteredProjects.length} / {projectItems.length} {t("text_showing")}{filteredProjects.length !== 1 ? 's' : ''}
            </span>
            {selectedFilter !== "all" && (
              <Badge variant="secondary">
                {selectedFilter}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Grid de proyectos */}
        <div className={`grid gap-8 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={`${project.title}-${selectedFilter}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              layout
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
              />
            </motion.div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No se encontraron proyectos</h3>
            <p className="text-muted-foreground mb-4">
              No hay proyectos que coincidan con el filtro &ldquo;{selectedFilter}&rdquo;
            </p>
            <Button onClick={() => setSelectedFilter("all")} variant="outline">
              Ver todos los proyectos
            </Button>
          </motion.div>
        )}

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 pt-8 border-t border-border/50"
        >
          <h3 className="text-xl font-semibold mb-2">{t("cta")}</h3>
          <p className="text-muted-foreground mb-6">
            {t("cta_paragraph")}
          </p>
          <div className="flex justify-center gap-4">
            <SmoothScroll targetId="contact">
              <Button>{t("cta_contact")}</Button>
            </SmoothScroll>
            <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">{t("cta_git")}</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}