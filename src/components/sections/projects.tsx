"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/shared/project-card"
import { Button } from "@/components/ui/button"

import { Filter, ChevronDown, Search, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // --- ESTADO DEL CARRUSEL ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)

  const gapByItems = { 1: 0, 2: 24, 3: 32 } as const
  const currentGap = gapByItems[itemsPerPage as keyof typeof gapByItems] ?? 24
  const cardWidthValue = `calc((100% - ${(itemsPerPage - 1) * currentGap}px) / ${itemsPerPage})`

  // Obtenemos los proyectos del archivo de traducción
  const projectItems = (t.raw("items") as ProjectItem[]) || [];

  // Extraer tags únicos con contadores
  const tagCounts = projectItems.reduce((acc, project) => {
    project.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Ordenar tags por popularidad
  const sortedTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([tag]) => tag)
  
  // Filtrar tags
  const filteredTags = sortedTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Filtrar proyectos
  const filteredProjects = selectedFilter === "all" 
    ? projectItems 
    : projectItems.filter(project => project.tags.includes(selectedFilter))

  // --- LÓGICA DEL CARRUSEL ---
  
  // 1. Determinar items por página (Responsive)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3); // Desktop
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(1); // Mobile
      }
    };

    handleResize(); // Ejecutar al inicio
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Resetear el índice si cambian los filtros
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter, searchTerm]);

  // 3. Medir el ancho real de cada tarjeta para desplazar exactamente un item
  useEffect(() => {
    const updateSlideWidth = () => {
      if (!carouselRef.current) return
      const firstItem = carouselRef.current.querySelector<HTMLElement>("[data-carousel-item]")
      if (!firstItem) return
      const measuredWidth = firstItem.getBoundingClientRect().width
      setSlideWidth(measuredWidth + currentGap)
    }

    updateSlideWidth()
    window.addEventListener("resize", updateSlideWidth)
    return () => window.removeEventListener("resize", updateSlideWidth)
  }, [itemsPerPage, filteredProjects.length, currentGap])

  // 4. Funciones de navegación
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= filteredProjects.length - itemsPerPage) return 0;
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return Math.max(0, filteredProjects.length - itemsPerPage);
      return prev - 1;
    });
  };

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
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

        {/* Controles de filtro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
        >
          {/* Dropdown de filtros */}
          <div className="relative w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              
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

                {isDropdownOpen && (
                  <div 
                    className="absolute top-full mt-2 w-80 border border-border rounded-lg shadow-xl z-50"
                    style={{ 
                      backgroundColor: 'hsl(var(--card))',
                      backdropFilter: 'none'
                    }}
                  >
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

                    <div className="max-h-60 overflow-y-auto">
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
                            {projectItems.length}
                          </span>
                          {selectedFilter === "all" && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </button>

                      <div className="border-b border-border" />

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
                                <span className="text-xs text-muted-foreground">{count}</span>
                                {isSelected && <Check className="h-4 w-4 text-primary" />}
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

            {/* Overlay */}
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

          {/* Contador simple */}
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            {filteredProjects.length} {filteredProjects.length !== 1 ? t("filters.projects_count_plural") : t("filters.projects_count")}
          </div>
        </motion.div>

        {/* --- INICIO DEL CARRUSEL --- */}
        {filteredProjects.length > 0 ? (
          <div className="relative px-2 sm:px-4"> 
            <div className="overflow-hidden py-4 -my-4">
              <motion.div
                ref={carouselRef}
                className="flex"
                style={{ gap: `${currentGap}px` }}
                animate={{
                  x: -currentIndex * slideWidth
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{
                  left: -Math.max(0, (filteredProjects.length - itemsPerPage) * slideWidth),
                  right: 0
                }}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) nextSlide();
                  else if (offset.x > 50) prevSlide();
                }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={`${project.title}-${selectedFilter}`}
                    className="flex-shrink-0"
                    data-carousel-item
                    style={{
                      width: cardWidthValue
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
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
              </motion.div>
            </div>

            {/* Controles unificados abajo (Flechas + Puntos) */}
            {filteredProjects.length > itemsPerPage && (
              <div className="flex items-center justify-center mt-8 gap-6">
                
                {/* Botón Anterior */}
                <button
                  onClick={prevSlide}
                  className="bg-background border border-border p-2 rounded-full shadow-sm hover:scale-110 hover:border-primary/50 hover:text-primary transition-all text-muted-foreground disabled:opacity-50"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Indicadores / Puntos */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(filteredProjects.length - (itemsPerPage - 1)) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx 
                          ? "bg-primary w-6" 
                          : "bg-muted-foreground/30 w-1.5 hover:bg-primary/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={nextSlide}
                  className="bg-background border border-border p-2 rounded-full shadow-sm hover:scale-110 hover:border-primary/50 hover:text-primary transition-all text-muted-foreground disabled:opacity-50"
                  aria-label="Next project"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Mensaje cuando no hay resultados */
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