// src/components/shared/project-card.tsx
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Eye, Wrench, CheckCircle, Rocket } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "@/components/IntlProvider"

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

export function ProjectCard({ title, description, image, tags, githubUrl, liveUrl }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const t = useTranslations()

  const getProjectStatus = () => {
    if (liveUrl) {
      return {
        label: t('ProjectCard.status.production'),
        icon: <Rocket className="w-3 h-3" />,
        bgColor: "bg-green-500/95 hover:bg-green-600/95",
        textColor: "text-white"
      }
    }
    
    const isFinished = tags.some(tag => 
      tag.toLowerCase().includes('finalizado') || 
      tag.toLowerCase().includes('completed') ||
      tag.toLowerCase().includes('finished') ||
      tag.toLowerCase().includes('done')
    ) || title.toLowerCase().includes('finalizado')
    
    if (isFinished) {
      return {
        label: t('ProjectCard.status.finished'),
        icon: <CheckCircle className="w-3 h-3" />,
        bgColor: "bg-blue-500/95 hover:bg-blue-600/95", 
        textColor: "text-white"
      }
    }
    
    return {
      label: t('ProjectCard.status.development'), 
      icon: <Wrench className="w-3 h-3" />,
      bgColor: "bg-orange-500/95 hover:bg-orange-600/95",
      textColor: "text-white"
    }
  }

  const projectStatus = getProjectStatus()

  return (
    <Card className="group flex flex-col h-full overflow-hidden bg-background/60 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      {/* Imagen con overlay de información */}
      <div className="relative overflow-hidden">
        <div className="relative w-full h-48 bg-muted">
          {!imageError ? (
            <Image
              src={image}
              alt={title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-primary/60" />
                <p className="text-sm text-muted-foreground">{t('ProjectCard.labels.preview')}</p>
              </div>
            </div>
          )}
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          {/* Overlay con acciones rápidas */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                <Github className="w-4 h-4 mr-2" />
                {t('ProjectCard.buttons.code')}
              </Button>
            </Link>
            {liveUrl && (
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="backdrop-blur-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('ProjectCard.buttons.demo')}
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Badge de estado mejorado */}
        <div className="absolute top-3 right-3">
          <div 
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 shadow-lg transition-colors duration-200 ${projectStatus.bgColor} ${projectStatus.textColor}`}
          >
            {projectStatus.icon}
            {projectStatus.label}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
        
        {/* Tags mejorados */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs px-3 py-1.5 bg-primary/5 border-primary/20 text-primary font-medium hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-200 shadow-sm"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge 
              variant="outline" 
              className="text-xs px-3 py-1.5 bg-muted/50 border-muted-foreground/20 text-muted-foreground font-medium hover:bg-muted/70 transition-all duration-200 shadow-sm"
            >
              +{tags.length - 4} {t('ProjectCard.labels.more')}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-border/50">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Github className="w-4 h-4 mr-2" />
                {t('ProjectCard.buttons.code')}
              </Button>
            </Link>
            {liveUrl && (
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('ProjectCard.buttons.view_demo')}
                </Button>
              </Link>
            )}
          </div>
          
          {/* Indicador de tecnologías */}
          <div className="text-xs text-muted-foreground">
            {tags.length} {tags.length === 1 ? t('ProjectCard.labels.technology') : t('ProjectCard.labels.technologies')}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}