// src/components/shared/quote-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight, CheckCircle, Copy, MessageCircle } from "lucide-react"
import { useTranslations } from "@/components/IntlProvider"
import { 
  getProjectFeatures, 
  calculateProjectPrice, 
  getProjectBasePrice,
  ADDITIONAL_SERVICES,
  type ProjectType 
} from "@/lib/pricing-config"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

interface QuoteState {
  projectType: string
  features: string[]
  complexity: 'simple' | 'medium' | 'complex'
  timeline: 'rush' | 'normal' | 'flexible'
  additionalServices: string[]
}

interface Feature {
  id: string
  name: string
  price: number
}

// Nota: La configuración de precios ahora está centralizada en /src/lib/pricing-config.ts

const initialState: QuoteState = {
  projectType: '',
  features: [],
  complexity: 'medium',
  timeline: 'normal',
  additionalServices: []
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const t = useTranslations("Quote")
  const [step, setStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteState>(initialState)
  const [isDark, setIsDark] = useState(false)

  // Function to get features with translations
  const getProjectFeaturesWithTranslations = (projectType: ProjectType): Feature[] => {
    const featuresConfig = getProjectFeatures(projectType)
    return Object.entries(featuresConfig).map(([id, price]) => ({
      id,
      name: t(`features.${id}`),
      price
    }))
  }

  // Function to get free features for a project type
  const getFreeFeatures = (projectType: ProjectType): string[] => {
    const features = getProjectFeaturesWithTranslations(projectType)
    return features.filter(f => f.price === 0).map(f => f.id)
  }

  // Detectar tema actual
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.classList.contains('dark')
      setIsDark(theme)
    }
    
    checkTheme()
    
    // Observer para cambios de tema
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return quoteData.projectType !== ''
      case 2:
        return true // Step 2 can always proceed (features are optional)
      case 3:
        return true // Step 3 can always proceed (complexity and timeline have defaults)
      default:
        return true
    }
  }

  const handleClose = () => {
    setStep(1)
    setQuoteData(initialState)
    onClose()
  }

  const toggleFeature = (featureId: string) => {
    setQuoteData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }))
  }

  const toggleAdditionalService = (serviceId: string) => {
    setQuoteData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(s => s !== serviceId)
        : [...prev.additionalServices, serviceId]
    }))
  }

  const getCurrentFeatures = () => {
    if (!quoteData.projectType) return []
    return getProjectFeaturesWithTranslations(quoteData.projectType as ProjectType)
  }

  const getAdditionalServicesWithTranslations = (): Feature[] => {
    return Object.entries(ADDITIONAL_SERVICES).map(([id, price]) => ({
      id,
      name: t(`additional_services.${id}`),
      price: price as number
    }))
  }

  const calculatePrice = () => {
    if (!quoteData.projectType) return { min: 0, max: 0 }
    
    const priceData = calculateProjectPrice({
      projectType: quoteData.projectType as ProjectType,
      selectedFeatures: quoteData.features,
      complexity: quoteData.complexity,
      timeline: quoteData.timeline,
      additionalServices: quoteData.additionalServices
    })
    
    return {
      min: priceData.min,
      max: priceData.max
    }
  }

  const generateQuoteText = () => {
    const price = calculatePrice()
    const selectedFeatures = getCurrentFeatures().filter(f => quoteData.features.includes(f.id))
    const selectedServices = getAdditionalServicesWithTranslations().filter(s => quoteData.additionalServices.includes(s.id))

    const baseMessage = t('messages.whatsapp_message')
    const featuresText = t('messages.selected_features') + '\n' + selectedFeatures.map(f => `→ ${f.name.replace(/[📱🔐📊🗄️🔌⚡📦💳📋👨‍💼🔍📈📖🧪📞💬📧📝✨📚🛒🎯]/g, '')}${f.price > 0 ? ` (+$${f.price})` : ` ${t('messages.included')}`}`).join('\n')
    
    const servicesText = selectedServices.length > 0 
      ? '\n\n🔧 SERVICIOS ADICIONALES:\n' + selectedServices.map(s => `→ ${s.name.replace(/[🌐⚙️🖥️🔒📧💻🔧🔍📚💾]/g, '')} (+$${s.price})`).join('\n')
      : ''
    
    return baseMessage
      .replace('{type}', t(`project_types.${quoteData.projectType}`))
      .replace('{projectType}', t(`project_types.${quoteData.projectType}`))
      .replace('{complexity}', t(`complexity.${quoteData.complexity}`))
      .replace('{timeline}', t(`timeline.${quoteData.timeline}`))
      .replace('{featuresText}', featuresText + servicesText)
      .replace('{total}', '$' + price.max.toLocaleString())
  }

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(generateQuoteText())
      // Temporal: usando alert, en producción podrías usar un toast
      alert('✅ ¡Cotización copiada al portapapeles!')
    } catch (err) {
      console.error('Error al copiar:', err)
      // Fallback para navegadores que no soportan clipboard API
      try {
        const textArea = document.createElement('textarea')
        textArea.value = generateQuoteText()
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('✅ ¡Cotización copiada al portapapeles!')
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr)
        alert('❌ Error al copiar la cotización')
      }
    }
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(generateQuoteText())
    // Usar directamente el número de WhatsApp para evitar problemas con traducciones
    const whatsappUrl = `https://wa.me/50376592632?text=${message}`
    window.open(whatsappUrl, '_blank')
  }



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-10 left-0 right-0 bottom-0 z-[9999] flex items-start justify-center p-4 pt-4 sm:pt-8">
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl lg:max-w-3xl z-10 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-none"
          >
            <div 
              className="shadow-2xl overflow-hidden rounded-lg" 
              style={{
                backgroundColor: isDark ? 'rgb(15, 23, 42)' : 'rgb(255, 255, 255)',
                borderColor: isDark ? 'rgb(51, 65, 85)' : 'rgb(229, 231, 235)',
                borderWidth: '1px'
              }}
            >
                <div 
                  className="relative px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0" 
                  style={{
                    backgroundColor: isDark ? 'rgb(15, 23, 42)' : 'rgb(255, 255, 255)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 
                      className="text-xl sm:text-2xl font-bold"
                      style={{
                        color: isDark ? 'rgb(99, 102, 241)' : 'rgb(59, 130, 246)'
                      }}
                    >
                      💰 {t("title")}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="absolute top-4 right-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span 
                        className="text-sm"
                        style={{
                          color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                        }}
                      >
                        {t("step_of").replace("{step}", step.toString()).replace("{total}", totalSteps.toString())}
                      </span>
                      <span 
                        className="text-sm"
                        style={{
                          color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                        }}
                      >
                        {Math.round((step / totalSteps) * 100)}%
                      </span>
                    </div>
                    <div 
                      className="w-full rounded-full h-2"
                      style={{
                        backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)'
                      }}
                    >
                      <motion.div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className="px-4 sm:px-6 pb-0 flex flex-col min-h-0 md:min-h-fit" 
                  style={{
                    backgroundColor: isDark ? 'rgb(15, 23, 42)' : 'rgb(255, 255, 255)'
                  }}
                >
                  {/* Step Content */}
                  <div className="py-2 sm:py-4 max-h-[50vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[65vh] overflow-y-auto">
                    {step === 1 && (
                      <div className="space-y-4">
                        <h3 
                          className="text-lg font-semibold mb-4"
                          style={{
                            color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                          }}
                        >
                          {t("step1.title")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Landing Page */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('landing')
                              setQuoteData({...quoteData, projectType: 'landing', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🎯</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.landing')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.landing')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('landing')}</div>
                            </div>
                          </div>

                          {/* Web App */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('webapp')
                              setQuoteData({...quoteData, projectType: 'webapp', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">⚡</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.webapp')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.webapp')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('webapp')}</div>
                            </div>
                          </div>

                          {/* E-commerce */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('ecommerce')
                              setQuoteData({...quoteData, projectType: 'ecommerce', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🛒</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.ecommerce')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.ecommerce')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('ecommerce')}</div>
                            </div>
                          </div>

                          {/* Panel Administrativo */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('admin')
                              setQuoteData({...quoteData, projectType: 'admin', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">⚙️</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.admin')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.admin')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('admin')}</div>
                            </div>
                          </div>

                          {/* API/Backend */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('api')
                              setQuoteData({...quoteData, projectType: 'api', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🔌</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.api')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.api')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('api')}</div>
                            </div>
                          </div>

                          {/* CMS/Sistema de Contenido */}
                          <div 
                            className="p-6 rounded-lg border-2 hover:border-primary cursor-pointer transition-all group"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(51, 65, 85)' : 'rgb(243, 244, 246)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'
                            }}
                            onClick={() => {
                              const requiredFeatures = getFreeFeatures('cms')
                              setQuoteData({...quoteData, projectType: 'cms', features: requiredFeatures})
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">📝</div>
                              <h4 className="font-semibold mb-2" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('project_types.cms')}</h4>
                              <p className="text-sm" style={{color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}}>{t('project_descriptions.cms')}</p>
                              <div className="mt-3 text-primary font-medium">Desde ${getProjectBasePrice('cms')}</div>
                            </div>
                          </div>
                        </div>
                        
                        {quoteData.projectType && (
                          <div 
                            className="mt-4 p-4 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)',
                              borderColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(147, 197, 253)'
                            }}
                          >
                            <p 
                              className="text-sm text-center"
                              style={{
                                color: isDark ? 'rgb(191, 219, 254)' : 'rgb(30, 58, 138)'
                              }}
                            >
                              <span dangerouslySetInnerHTML={{ __html: t('messages.selected').replace('{type}', t(`project_types.${quoteData.projectType}`)) }} />
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                          {t("step2.title")}
                        </h3>
                        
                        {!quoteData.projectType ? (
                          <div 
                            className="p-6 rounded-lg border text-center"
                            style={{
                              backgroundColor: isDark ? 'rgb(69, 26, 3)' : 'rgb(254, 252, 232)',
                              borderColor: isDark ? 'rgb(146, 64, 14)' : 'rgb(252, 211, 77)'
                            }}
                          >
                            <p 
                              style={{
                                color: isDark ? 'rgb(254, 215, 170)' : 'rgb(146, 64, 14)'
                              }}
                            >
                              {t('messages.select_project_first')}
                            </p>
                          </div>
                        ) : (
                          <div 
                            className="p-6 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                          >
                            <p className="text-muted-foreground text-center mb-4">
                              <span dangerouslySetInnerHTML={{ __html: t('step2.select_features').replace('{type}', t(`project_types.${quoteData.projectType}`)) }} />
                            </p>
                            
                            {/* Contenedor para funcionalidades */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {getCurrentFeatures().map((feature) => {
                                const isSelected = quoteData.features.includes(feature.id)
                                const isRequired = feature.price === 0
                                
                                return (
                                  <div
                                    key={feature.id}
                                    onClick={() => !isRequired && toggleFeature(feature.id)}
                                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${isRequired ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    style={{
                                      backgroundColor: isSelected 
                                        ? (isDark ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)') 
                                        : (isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'),
                                      borderColor: isSelected 
                                        ? 'rgb(59, 130, 246)' 
                                        : (isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)')
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSelected && !isRequired) {
                                        e.currentTarget.style.borderColor = 'rgb(147, 197, 253)'
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.borderColor = isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                                      }
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                                        <div 
                                          className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{
                                            backgroundColor: (isSelected || isRequired) ? 'rgb(59, 130, 246)' : 'transparent',
                                            borderColor: (isSelected || isRequired) 
                                              ? 'rgb(59, 130, 246)' 
                                              : (isDark ? 'rgb(107, 114, 128)' : 'rgb(209, 213, 219)')
                                          }}
                                        >
                                          {(isSelected || isRequired) && (
                                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span className="font-medium text-sm block leading-relaxed" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                                            {feature.name}
                                          </span>
                                          {isRequired && (
                                            <div className="text-xs text-muted-foreground mt-1">Obligatorio</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <span className={`text-sm font-medium block ${
                                          feature.price === 0 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-blue-600 dark:text-blue-400'
                                        }`}>
                                          {feature.price === 0 ? 'Incluido' : `+$${feature.price}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            
                            {quoteData.features.length > 0 && (
                              <div 
                                className="mt-4 p-3 rounded-lg border"
                                style={{
                                  backgroundColor: isDark ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)',
                                  borderColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(147, 197, 253)'
                                }}
                              >
                                <p 
                                  className="text-sm text-center"
                                  style={{
                                    color: isDark ? 'rgb(191, 219, 254)' : 'rgb(30, 58, 138)'
                                  }}
                                >
                                  {t('messages.features_selected').replace('{count}', quoteData.features.length.toString())}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                          {t("step3.title")}
                        </h3>
                        <div className="space-y-6">
                                                    <div 
                            className="p-6 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                          >
                            <h4 className="font-medium mb-3" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('step3.complexity_title')}</h4>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="complexity" 
                                  className="text-blue-600" 
                                  checked={quoteData.complexity === 'simple'}
                                  onChange={() => setQuoteData({...quoteData, complexity: 'simple'})}
                                />
                                <span className="text-muted-foreground">{t('complexity_descriptions.simple')}</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="complexity" 
                                  className="text-primary" 
                                  checked={quoteData.complexity === 'medium'}
                                  onChange={() => setQuoteData({...quoteData, complexity: 'medium'})}
                                />
                                <span className="text-muted-foreground">{t('complexity_descriptions.medium')}</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="complexity" 
                                  className="text-primary" 
                                  checked={quoteData.complexity === 'complex'}
                                  onChange={() => setQuoteData({...quoteData, complexity: 'complex'})}
                                />
                                <span className="text-muted-foreground">{t('complexity_descriptions.complex')}</span>
                              </label>
                            </div>
                          </div>
                          
                          <div 
                            className="p-6 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)',
                              borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                            }}
                          >
                            <h4 className="font-medium mb-3" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>{t('step3.timeline_title')}</h4>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="timeline" 
                                  className="text-blue-600" 
                                  checked={quoteData.timeline === 'rush'}
                                  onChange={() => setQuoteData({...quoteData, timeline: 'rush'})}
                                />
                                <span className="text-muted-foreground">{t('timeline_descriptions.rush')}</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="timeline" 
                                  className="text-blue-600" 
                                  checked={quoteData.timeline === 'normal'}
                                  onChange={() => setQuoteData({...quoteData, timeline: 'normal'})}
                                />
                                <span className="text-muted-foreground">{t('timeline_descriptions.normal')}</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="timeline" 
                                  className="text-blue-600" 
                                  checked={quoteData.timeline === 'flexible'}
                                  onChange={() => setQuoteData({...quoteData, timeline: 'flexible'})}
                                />
                                <span className="text-muted-foreground">{t('timeline_descriptions.flexible')}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                          {t("step4.title")}
                        </h3>
                        <p className="text-muted-foreground text-center mb-6">
                          {t("step4.optional")}
                        </p>
                        
                        {/* Contenedor para servicios adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getAdditionalServicesWithTranslations().map((service) => {
                            const isSelected = quoteData.additionalServices.includes(service.id)
                            
                            return (
                              <div
                                key={service.id}
                                onClick={() => toggleAdditionalService(service.id)}
                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer`}
                                style={{
                                  backgroundColor: isSelected 
                                    ? (isDark ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)') 
                                    : (isDark ? 'rgb(30, 41, 59)' : 'rgb(249, 250, 251)'),
                                  borderColor: isSelected 
                                    ? 'rgb(59, 130, 246)' 
                                    : (isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)')
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = 'rgb(147, 197, 253)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                                    <div 
                                      className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                                      style={{
                                        backgroundColor: isSelected ? 'rgb(59, 130, 246)' : 'transparent',
                                        borderColor: isSelected 
                                          ? 'rgb(59, 130, 246)' 
                                          : (isDark ? 'rgb(107, 114, 128)' : 'rgb(209, 213, 219)')
                                      }}
                                    >
                                      {isSelected && (
                                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium text-sm block leading-relaxed" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                                        {service.name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-sm font-medium block text-blue-600 dark:text-blue-400">
                                      +${service.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {quoteData.additionalServices.length > 0 && (
                          <div 
                            className="mt-4 p-3 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)',
                              borderColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(147, 197, 253)'
                            }}
                          >
                            <p 
                              className="text-sm text-center"
                              style={{
                                color: isDark ? 'rgb(191, 219, 254)' : 'rgb(30, 58, 138)'
                              }}
                            >
                              ✅ {quoteData.additionalServices.length} servicios adicionales seleccionados
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-4" style={{color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'}}>
                            {t("step5.title")}
                          </h3>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="text-center space-y-4">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              ${calculatePrice().min.toLocaleString()} - ${calculatePrice().max.toLocaleString()} USD
                            </div>
                            <p className="text-muted-foreground">
                              {t('step5.estimated_quote')}
                            </p>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>• {t('step5.project_summary.type')} {quoteData.projectType ? t(`project_types.${quoteData.projectType}`) : t('step5.project_summary.not_selected')}</div>
                              <div>• {t('step5.project_summary.features')} {quoteData.features.length} {t('step5.project_summary.features_selected')}</div>
                              <div>• {t('step5.project_summary.complexity')} {t(`complexity.${quoteData.complexity}`)}</div>
                              <div>• {t('step5.project_summary.timeline')} {t(`timeline.${quoteData.timeline}`)}</div>
                              {quoteData.additionalServices.length > 0 && (
                                <div>• Servicios adicionales: {quoteData.additionalServices.length} seleccionados</div>
                              )}
                            </div>
                            <div className="pt-4 border-t border-blue-200 dark:border-blue-700 space-y-3">
                              <p className="text-sm text-muted-foreground">
                                {t('step5.contact_message')}
                              </p>
                              
                              {/* Botones de Acción */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                  onClick={copyQuote}
                                  variant="outline"
                                  className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <Copy className="w-4 h-4" />
                                  {t('step5.actions.copy_quote')}
                                </Button>
                                
                                <Button
                                  onClick={shareWhatsApp}
                                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  {t('step5.actions.send_whatsapp')}
                                </Button>
                              </div>
                              
                              <div className="text-xs text-muted-foreground text-center">
                                El mensaje incluirá todos los detalles de tu cotización
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4 sm:pt-6 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={step === 1}
                      className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("previous")}
                    </Button>

                    {step < totalSteps ? (
                      <Button
                        onClick={handleNext}
                        disabled={!canProceedToNextStep()}
                        className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                      >
                        {t("next")}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleClose()
                          // Scroll to contact section
                          const contactSection = document.getElementById('contact')
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' })
                          }
                        }}
                        variant="outline"
                        className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {t("contact")}
                      </Button>
                    )}
                  </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}