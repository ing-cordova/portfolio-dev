// src/components/sections/skills.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Database, Palette, Server, Globe, Wrench } from "lucide-react"

// Mapeo de iconos para cada categoría
const categoryIcons = {
  frontend: <Code2 className="w-8 h-8" />,
  backend: <Server className="w-8 h-8" />,
  database: <Database className="w-8 h-8" />,
  design: <Palette className="w-8 h-8" />,
  tools: <Wrench className="w-8 h-8" />,
  web: <Globe className="w-8 h-8" />,
} as const

// Colores para cada categoría
const categoryColors = {
  frontend: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  backend: "from-green-500/20 to-emerald-500/20 border-green-500/30", 
  database: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  design: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  tools: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  web: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
} as const

export function Skills() {
  const t = useTranslations("Skills")
  
  // Obtenemos las categorías del archivo de traducción.
  const categories = t.raw("categories") as Record<string, { title: string; items: string[] }>;

  const getCategoryKey = (index: number): keyof typeof categoryIcons => {
    const keys = Object.keys(categoryIcons) as Array<keyof typeof categoryIcons>
    return keys[index % keys.length]
  }

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-24 px-4"
    >
      <div className="text-center mb-16">
        <motion.h2 
          className="text-4xl font-bold mb-4 text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(categories).map((category, index) => {
          const categoryKey = getCategoryKey(index)
          const icon = categoryIcons[categoryKey]
          const colorClasses = categoryColors[categoryKey]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="group hover:-translate-y-2 transition-transform duration-300 ease-out"
            >
              <Card className={`h-full relative overflow-hidden bg-gradient-to-br ${colorClasses} backdrop-blur-sm border-2 hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300`}>
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-background/10 backdrop-blur-sm w-fit group-hover:scale-105 transition-transform duration-200 ease-out">
                    <div className="text-primary">
                      {icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.items.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="secondary" 
                        className="text-sm px-3 py-1 bg-background/20 hover:bg-background/30 border border-primary/20 hover:border-primary/40 transition-colors duration-150 cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Indicador de cantidad de skills */}
                  <div className="pt-2 border-t border-primary/20">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>
                        {category.items.length} {category.items.length === 1 ? t("labels.technology") : t("labels.technologies")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Decoración de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/3 rounded-full blur-3xl" />
      </div>
    </motion.section>
  )
}