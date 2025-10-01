// src/components/sections/footer.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"

export function Footer() {
  const t = useTranslations("Footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>
          {t("copyright").replace("{year}", currentYear.toString())}
        </p>
      </div>
    </footer>
  )
}