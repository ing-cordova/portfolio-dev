// src/components/shared/experience-item.tsx
type LocationType = "remote" | "on-site" | "hybrid"

interface ExperienceItemProps {
  date: string;
  title: string;
  company: string;
  description: string;
  location?: string;
}

export function ExperienceItem({ date, title, company, description, location }: ExperienceItemProps) {
  const locationStyles: Record<LocationType, { label: string; classes: string }> = {
    remote: {
      label: "Remote",
      classes: "bg-emerald-100/70 text-emerald-800 border border-emerald-200"
    },
    "on-site": {
      label: "On-site",
      classes: "bg-sky-100/70 text-sky-800 border border-sky-200"
    },
    hybrid: {
      label: "Hybrid",
      classes: "bg-violet-100/70 text-violet-800 border border-violet-200"
    }
  }

  const isLocationType = (value: string): value is LocationType =>
    ["remote", "on-site", "hybrid"].includes(value as LocationType)

  const normalizedLocation = location?.toLowerCase().trim() ?? ""
  const chipData = normalizedLocation && isLocationType(normalizedLocation)
    ? locationStyles[normalizedLocation]
    : undefined
  const chipLabel = chipData?.label ?? location
  const chipClasses = chipData?.classes ?? "bg-muted text-foreground border border-muted-foreground/40"

  return (
    <div className="relative pl-12 pb-8 group">
      {/* Círculo del timeline */}
      <div 
        className="absolute left-2.5 top-2.5 w-4 h-4 border-3 border-background rounded-full shadow-md group-hover:scale-110 transition-transform duration-200 z-10" 
        style={{ backgroundColor: 'hsl(var(--timeline-circle))' }}
      />
      
      {/* Contenido */}
      <div className="space-y-2">
        {/* Fecha */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted border border-muted-foreground/30">
          <time className="text-sm font-semibold text-foreground">
            {date}
          </time>
        </div>
        
        {/* Título y Empresa */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-base font-semibold text-primary/80">
              {company}
            </div>
            {location && (
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${chipClasses}`}>
                <span className="h-2 w-2 rounded-full bg-current opacity-70" aria-hidden="true" />
                {chipLabel}
              </span>
            )}
          </div>
        </div>
        
        {/* Descripción */}
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  )
}