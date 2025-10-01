// src/components/shared/language-switcher.tsx
"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const changeLocale = (locale: string) => {
    // El pathname incluye el locale actual (ej: /es/proyectos)
    // Lo quitamos para construir la nueva ruta (ej: /en/proyectos)
    const newPath = `/${locale}${pathname.substring(3)}`
    router.replace(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="Change language"
          className="border-2 bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Languages className="h-[1.2rem] w-[1.2rem] text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem onSelect={() => changeLocale("es")} className="flex items-center gap-2">
          <span className="text-lg">🇪🇸</span>
          <span>Español</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => changeLocale("en")} className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}