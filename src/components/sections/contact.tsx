// src/components/sections/contact.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

// Componente WhatsApp SVG personalizado
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.488"/>
  </svg>
)

export function Contact() {
  const t = useTranslations("Contact")
  
  // Obtener métodos de contacto de las traducciones
  const contactMethods = t.raw("methods") as {
    email: string;
    github: string;
    linkedin: string;
    whatsapp: string;
  }

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Botón principal de email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Link href={`mailto:${contactMethods.email}`} target="_blank">
            <Button size="lg" className="gap-3 px-8 py-3 text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <Mail className="h-5 w-5" />
              {t("email_button")}
            </Button>
          </Link>
        </motion.div>

        {/* Redes sociales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground mb-6">{t("text_other")}</p>
          
          <div className="flex justify-center items-center gap-4">
            {contactMethods.github && (
              <Link href={contactMethods.github} target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="icon" 
                  aria-label="GitHub"
                  className="hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-900 dark:hover:border-gray-700 transition-all duration-200 hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {contactMethods.linkedin && (
              <Link href={contactMethods.linkedin} target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="icon" 
                  aria-label="LinkedIn"
                  className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800 transition-all duration-200 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5 text-blue-600 hover:text-blue-700" />
                </Button>
              </Link>
            )}
            
            {contactMethods.whatsapp && (
              <Link href={contactMethods.whatsapp} target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="icon" 
                  aria-label="WhatsApp" 
                  className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950 dark:hover:border-green-800 transition-all duration-200 hover:scale-110"
                >
                  <WhatsAppIcon className="h-5 w-5 text-green-600 hover:text-green-700" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}