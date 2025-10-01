// src/components/sections/hero.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const t = useTranslations("Hero")

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10" />
      </div>

      <div className="max-w-4xl relative z-10">
        {/* Floating sparkle icon */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-0 sm:transform-none text-yellow-400"
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight px-2 sm:px-0"
        >
          <span className="block sm:inline">Andrés</span>{" "}
          <span className="block sm:inline">Córdova</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-xl text-primary font-medium px-4 sm:px-0"
        >
          {t("title")}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto px-6 sm:px-0"
        >
          {t("subtitle")}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
        >
          <div className="flex items-center gap-x-4">
            <Link href="#projects">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  {t("cta_projects")}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="secondary"
              className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => {
                window.open('/cv/andres-cordova-cv.pdf', '_blank')
              }}
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              <span>{t("cta_cv")}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
          
          <Link href="#contact">
            <Button 
              size="lg" 
              variant="outline"
              className="group border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <span>{t("cta_contact")}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}