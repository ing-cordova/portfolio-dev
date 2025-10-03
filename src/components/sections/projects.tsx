// src/components/sections/projects.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/shared/project-card"
import { Button } from "@/components/ui/button"

import { Filter, Grid, List, ChevronDown, Search, Check } from "lucide-react"
import { useState } from "react"
import { SmoothScroll } from "@/components/shared/smooth-scroll"

interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  status?: 'production' | 'finished' | 'development';
}

export function Projects() {
  const t = useTranslations("Projects")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  
  // Obtenemos los proyectos del archivo de traducción usando la función raw
  const projectItems = (t.raw("items") as ProjectItem[]) || [];

  // Extraer tags únicos con contadores
  const tagCounts = projectItems.reduce((acc, project) => {
    project.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Ordenar tags por popularidad (más usados primero)
  const sortedTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([tag]) => tag)
  
  // Filtrar tags según término de búsqueda
  const filteredTags = sortedTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
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

        {/* Controles de filtro y vista - Dropdown limpio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          {/* Dropdown de filtros */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              
              {/* Dropdown Button */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="min-w-[200px] justify-between"
                >
                  <span>
                    {selectedFilter === "all" 
                      ? `${t("filters.all_technologies")} (${projectItems.length})` 
                      : `${selectedFilter} (${tagCounts[selectedFilter]})`
                    }
                  </span>
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </Button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full mt-2 w-80 border border-border rounded-lg shadow-xl z-50"
                    style={{ 
                      backgroundColor: 'hsl(var(--card))',
                      backdropFilter: 'none'
                    }}
                  >
                    {/* Search Input */}
                    <div className="p-3 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder={t("filters.search_placeholder")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground text-foreground"
                          style={{ backgroundColor: 'hsl(var(--card))' }}
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                      {/* Opción "Todas" */}
                      <button
                        onClick={() => {
                          setSelectedFilter("all")
                          setIsDropdownOpen(false)
                          setSearchTerm("")
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-muted/80 transition-colors flex items-center justify-between ${
                          selectedFilter === "all" ? "bg-primary/15 text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        <span className="font-medium">{t("filters.all_technologies")}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {projectItems.length} {projectItems.length !== 1 ? t("filters.projects_count_plural") : t("filters.projects_count")}
                          </span>
                          {selectedFilter === "all" && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </button>

                      {/* Separador */}
                      <div className="border-b border-border" />

                      {/* Lista de tecnologías filtrada */}
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag) => {
                          const count = tagCounts[tag]
                          const isSelected = selectedFilter === tag
                          
                          return (
                            <button
                              key={tag}
                              onClick={() => {
                                setSelectedFilter(tag)
                                setIsDropdownOpen(false)
                                setSearchTerm("")
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-muted/80 transition-colors flex items-center justify-between ${
                                isSelected ? "bg-primary/15 text-primary font-medium" : "text-foreground"
                              }`}
                            >
                              <span className="font-medium">{tag}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {count} {count !== 1 ? t("filters.projects_count_plural") : t("filters.projects_count")}
                                </span>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </button>
                          )
                        })
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                          {t("filters.no_results")} &ldquo;{searchTerm}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Overlay para cerrar dropdown */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => {
                  setIsDropdownOpen(false)
                  setSearchTerm("")
                }}
              />
            )}
          </div>

          {/* Toggle vista */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
              aria-label="Vista en grilla"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
              aria-label="Vista en lista"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Contador de resultados mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filteredProjects.length}
                </span>
                {filteredProjects.length !== projectItems.length && (
                  <span> de {projectItems.length}</span>
                )} {t("text_showing")}{filteredProjects.length !== 1 ? 's' : ''}
                {selectedFilter !== "all" && (
                  <span> con <strong>{selectedFilter}</strong></span>
                )}
              </div>
            </div>
            
            {selectedFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className="text-xs hover:bg-primary/10"
              >
                Ver todos
              </Button>
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
                status={project.status}
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
            <a href="https://github.com/ing-cordova" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">{t("cta_git")}</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}