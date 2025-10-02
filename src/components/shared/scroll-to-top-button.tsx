"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 group sm:bottom-8 sm:right-8"
          aria-label="Scroll to top"
        >
          {/* Background with glassmorphism effect */}
          <div className="relative w-12 h-12 rounded-full bg-background/90 backdrop-blur-md border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 sm:w-14 sm:h-14">
            {/* Always visible gradient background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/15 group-hover:from-primary/30 group-hover:to-purple-500/25 transition-all duration-300" />
            
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-primary group-hover:text-primary group-hover:-translate-y-1 transition-all duration-200 drop-shadow-sm sm:w-6 sm:h-6" />
            </div>
            
            {/* Enhanced border glow */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Subtle outer glow for visibility */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-110 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}