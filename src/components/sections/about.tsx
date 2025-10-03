// src/components/sections/about.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent } from "@/components/ui"
import { Code2, Coffee, MapPin, Heart } from "lucide-react"

export function About() {
  const t = useTranslations("About")

  const stats = [
    { icon: <Code2 className="w-6 h-6" />, label: t("stats.projects"), value: "10+" },
    { icon: <Coffee className="w-6 h-6" />, label: t("stats.coffee"), value: "∞" },
    { icon: <MapPin className="w-6 h-6" />, label: t("stats.location"), value: "Remote" },
    { icon: <Heart className="w-6 h-6" />, label: t("stats.passion"), value: "100%" },
  ]

  return (
    <section id="about" className="relative py-24 px-4 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        {/* Título con efecto */}
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
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto px-4">
          
          {/* Columna izquierda - Avatar y estadísticas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Avatar con efectos */}
            <div className="relative flex justify-center w-full mb-10">
              <div className="relative group">
                {/* Anillo decorativo */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                
                <Avatar className="relative w-56 h-56 md:w-64 md:h-64 border-4 border-background shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage 
                    src="/profile.webp" 
                    alt="Andrés Córdova"
                    className="object-cover" 
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    AC
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto lg:max-w-md flex-grow">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="h-full"
                >
                  <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-background/50 backdrop-blur-sm border border-border/50 h-full">
                    <CardContent className="p-0 h-full min-h-[120px]">
                      <div className="h-full pt-4 grid place-items-center text-center">
                        <div className="space-y-1">
                          <div className="flex justify-center items-center text-primary group-hover:scale-110 transition-transform duration-200">
                            {stat.icon}
                          </div>
                          <div className="text-xl font-bold text-foreground">
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Columna derecha - Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col h-full"
          >
            {/* Card principal con contenido dinámico */}
            <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 bg-background/60 backdrop-blur-md border border-border/50 flex-grow">
              <CardContent className="p-8 lg:p-10 h-full flex flex-col">
                <div className="space-y-6 flex-grow">
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-lg pt-4 leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  >
                    {t("paragraph1")}
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  >
                    {t("paragraph2")}
                  </motion.p>

                  {/* Elemento decorativo */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-transparent rounded-full"
                  />
                </div>

                {/* Call-to-action integrado */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t("cta")}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t("cta_pharagraph")}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}