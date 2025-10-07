// src/components/sections/footer.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"

export function Footer() {
  const t = useTranslations("Footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        {/* Desktop: Una sola línea */}
        <p className="hidden sm:block">
          {t("copyright").replace("{year}", currentYear.toString())}
        </p>
        
        {/* Mobile: Dividido en 2 líneas */}
        <div className="sm:hidden">
          <p>{t("copyright_name").replace("{year}", currentYear.toString())}</p>
          <p>{t("copyright_rights")}</p>
        </div>
      </div>
    </footer>
  )
}