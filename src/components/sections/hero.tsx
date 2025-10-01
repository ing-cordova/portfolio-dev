// src/components/sections/hero.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const t = useTranslations("Hero")

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Andrés Córdova
        </h1>
        <p className="mt-4 text-lg text-primary">
          {t("title")}
        </p>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <div className="flex items-center gap-x-4">
            <Link href="#projects">
              <Button size="lg">
                {t("cta_projects")}
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="secondary"
              className="group relative overflow-hidden"
              onClick={() => {
                // Aquí iría la lógica para descargar el CV
                window.open('/cv/andres-cordova-cv.pdf', '_blank')
              }}
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              {t("cta_cv")}
            </Button>
          </div>
          <Link href="#contact">
            <Button size="lg" variant="outline">
              {t("cta_contact")}
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}