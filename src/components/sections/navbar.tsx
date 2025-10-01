// src/components/sections/navbar.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { LanguageSwitcher } from "../shared/language-switcher"
import { ThemeToggleButton } from "../shared/theme-toggle-button"
import { useTranslations } from "@/components/IntlProvider"

export function Navbar() {
  const t = useTranslations("Hero")

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/" className="font-bold text-lg hover:text-primary transition-colors">
          Andrés Córdova
        </Link>

        <div className="flex items-center gap-2">
          {/* Botón CV - Solo visible en desktop */}
          <div className="hidden sm:block">
            <Button
              size="sm"
              variant="ghost"
              className="group relative"
              onClick={() => {
                window.open('/cv/andres-cordova-cv.pdf', '_blank')
              }}
              title={t("cv_tooltip")}
            >
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              <span className="sr-only">{t("cta_cv")}</span>
            </Button>
          </div>
          <LanguageSwitcher />
          <ThemeToggleButton />
        </div>
      </div>
    </motion.nav>
  )
}