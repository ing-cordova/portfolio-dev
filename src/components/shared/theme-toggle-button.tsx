// src/components/shared/theme-toggle-button.tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme} 
        aria-label="Toggle theme"
        className="border-2 bg-background"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-slate-600" />
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="border-2 bg-background hover:bg-accent hover:text-accent-foreground"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 dark:text-yellow-400" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-black-500 dark:text-black-400" />
      )}
    </Button>
  )
}