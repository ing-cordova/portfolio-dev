// src/components/sections/navbar.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Calculator } from "lucide-react"
import { LanguageSwitcher } from "../shared/language-switcher"
import { ThemeToggleButton } from "../shared/theme-toggle-button"
import { QuoteModal } from "../shared/quote-modal"
import { useTranslations } from "@/components/IntlProvider"
import { useState } from "react"

export function Navbar() {
  const t = useTranslations("Hero")
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/" className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 dark:hover:from-blue-300 dark:hover:via-purple-300 dark:hover:to-blue-300 transition-all duration-300">
          AC
        </Link>

        <div className="flex items-center gap-2">
          {/* Botón Cotizar */}
          <Button
            size="sm"
            variant="ghost"
            className="hidden sm:flex items-center gap-2 relative font-semibold px-4 py-2 rounded-lg bg-transparent hover:bg-transparent border-transparent animate-gradient-border transition-all duration-300 hover:scale-105"
            onClick={() => setShowQuoteModal(true)}
          >
            <Calculator className="w-4 h-4" />
            <span>{t("quote_button")}</span>
          </Button>

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

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />
    </motion.nav>
  )
}