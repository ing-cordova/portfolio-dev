"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Home, 
  User, 
  FolderOpen, 
  Briefcase, 
  Code, 
  Mail
} from "lucide-react"
import { useTranslations } from "@/components/IntlProvider"

interface NavItem {
  id: string
  icon: React.ElementType
  targetId: string
}

const navItems: NavItem[] = [
  { id: "hero", icon: Home, targetId: "hero" },
  { id: "about", icon: User, targetId: "about" },
  { id: "projects", icon: FolderOpen, targetId: "projects" },
  { id: "experience", icon: Briefcase, targetId: "experience" },
  { id: "skills", icon: Code, targetId: "skills" },
  { id: "contact", icon: Mail, targetId: "contact" }
]

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const t = useTranslations("FloatingNav")

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.targetId))
      const scrollPosition = window.scrollY + 150 // Offset for navbar
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Check if we're near the bottom of the page
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100

      // If near bottom, activate the last section
      if (isNearBottom) {
        setActiveSection(navItems[navItems.length - 1].id)
        return
      }

      // Otherwise, use normal detection logic
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      const navbarHeight = 64
      const targetPosition = element.offsetTop - navbarHeight
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:bottom-8"
    >
      <div className="relative">
        {/* Navigation container */}
        <motion.nav
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-background/90 backdrop-blur-md border border-border/50 rounded-full px-2 py-1.5 shadow-xl sm:px-3 sm:py-2"
        >
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.targetId)}
                  className={`group relative p-2 rounded-full transition-all duration-300 sm:p-2.5 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  title={t(item.id)}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {t(item.id)}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.nav>
      </div>
    </motion.div>
  )
}