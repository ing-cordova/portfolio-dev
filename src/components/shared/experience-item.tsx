// src/components/shared/experience-item.tsx
interface ExperienceItemProps {
  date: string;
  title: string;
  company: string;
  description: string;
}

export function ExperienceItem({ date, title, company, description }: ExperienceItemProps) {
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
          <div className="text-base font-semibold text-primary/80">
            {company}
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