// src/components/sections/experience.tsx
"use client"

import { useTranslations } from "@/components/IntlProvider"
import { motion } from "framer-motion"
import { ExperienceItem } from "@/components/shared/experience-item"

interface ExperienceItemData {
  date: string;
  title: string;
  company: string;
  description: string;
}

export function Experience() {
  const t = useTranslations("Experience")
  const experienceItems = (t.raw("items") as ExperienceItemData[]) || [];

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-24 px-4"
    >
      <h2 className="text-3xl font-bold text-center mb-16 text-primary">
        {t("title")}
      </h2>
      
      {/* Timeline Container */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Línea vertical principal */}
          <div 
            className="absolute left-4 top-4 bottom-8 w-0.5 shadow-sm" 
            style={{ backgroundColor: 'hsl(var(--timeline-line))' }}
          />
          
          {experienceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <ExperienceItem
                date={item.date}
                title={item.title}
                company={item.company}
                description={item.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}