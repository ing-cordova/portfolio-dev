// src/lib/pricing-config.ts
/**
 * Configuración centralizada de precios para el sistema de cotización
 * Todos los precios están en USD
 * 
 * Para cambiar precios:
 * 1. Modifica este archivo
 * 2. Los cambios se aplican automáticamente en toda la aplicación
 */

// Precios base por tipo de proyecto
export const BASE_PRICES = {
  landing: 350,
  webapp: 1500, 
  ecommerce: 1800,
  admin: 2000,
  api: 800,
  cms: 1500
} as const

// Precios de funcionalidades adicionales por tipo de proyecto
export const FEATURE_PRICES = {
  landing: {
    responsive: 0,      // Siempre incluido
    seo: 100,          // Aparece en Google
    analytics: 50,     // Estadísticas de visitantes
    forms: 75,         // Formulario de contacto
    animations: 150,   // Efectos visuales
    cms: 200          // Puedes editar contenido
  },
  webapp: {
    responsive: 0,      // Siempre incluido
    auth: 0,           // Login de usuarios (incluido - básico)
    database: 0,       // Base de datos (incluido - esencial)
    interactive_forms: 150, // Formularios interactivos
    search: 200,       // Sistema de búsqueda
    notifications: 250, // Notificaciones en tiempo real
    api: 300,          // Integraciones con servicios externos
    dashboard: 400,    // Dashboard personalizable para usuarios
    realtime: 450      // Actualizaciones en tiempo real
  },
  ecommerce: {
    responsive: 0,      // Siempre incluido
    cart: 200,         // Carrito de compras
    payments: 400,     // Recibir pagos online
    inventory: 250,    // Control de productos
    orders: 200,       // Gestión de pedidos
    admin: 350         // Panel administrativo
  },
  admin: {
    responsive: 0,      // Siempre incluido
    database: 0,       // Base de datos (incluido - esencial)
    auth: 0,           // Login básico (incluido)
    dashboard: 0,      // Panel de control principal (incluido)
    users: 250,        // Gestión completa de usuarios
    reports: 300,      // Reportes y estadísticas avanzadas
    audit: 350,        // Registro de actividades y logs
    inventory: 400,    // Sistema de inventario empresarial
    security: 450,     // Seguridad avanzada y auditoría
    roles: 300,        // Sistema de roles y permisos granulares
    backup: 250,       // Respaldos automáticos programados
    api: 350,          // API REST para integraciones ERP
    workflows: 500,    // Flujos de trabajo automatizados
    analytics: 400     // Analytics empresarial avanzado
  },
  api: {
    rest: 0,           // Conexión básica (incluido)
    security: 150,     // Seguridad avanzada
    database: 200,     // Guarda información
    docs: 100,         // Manual de uso
    backup: 200,       // Respaldo automático
    monitoring: 150    // Reportes y alertas
  },
  cms: {
    responsive: 0,      // Siempre incluido
    blog: 0,           // Sistema de blog básico (incluido)
    auth: 250,           // Login de usuarios (incluido)
    editor: 200,       // Editor visual avanzado
    seo: 150,          // SEO integrado y optimizado
    themes: 300,       // Temas y plantillas personalizables
    media: 200,        // Librería de medios y archivos
    plugins: 400,      // Sistema de plugins/extensiones
    comments: 150,     // Sistema de comentarios
    multilang: 350,    // Soporte multilenguaje
    users: 250,        // Gestión de usuarios y roles
    analytics: 200,    // Estadísticas y reportes integrados
    backup: 300        // Respaldos automáticos programados
  }
} as const

// Multiplicadores por complejidad
export const COMPLEXITY_MULTIPLIERS = {
  simple: 0.8,    // -20%
  medium: 1.0,    // Precio base
  complex: 1.5    // +50%
} as const

// Multiplicadores por timeline
export const TIMELINE_MULTIPLIERS = {
  rush: 1.6,      // +60% - Lo necesito YA
  normal: 1.0,    // Precio base - Tiempo normal
  flexible: 0.85  // -15% - Sin prisa
} as const

// Configuración para mostrar rangos de precio (min/max)
export const PRICE_RANGE_CONFIG = {
  minMultiplier: 0.9,  // El precio mínimo es 90% del calculado
  maxMultiplier: 1.2   // El precio máximo es 120% del calculado
} as const

// Servicios adicionales (dominio, hosting, instalación, etc.)
export const ADDITIONAL_SERVICES = {
  domain_purchase: 30,      // Compra de dominio (.com)
  domain_setup: 25,         // Configuración de dominio
  hosting_setup: 50,        // Configuración de hosting
  ssl_setup: 35,            // Instalación de SSL
  email_setup: 40,          // Configuración de emails corporativos
  local_installation: 100,   // Instalación en servidor local
  maintenance_1month: 150,  // Mantenimiento 1 mes
  maintenance_3months: 400, // Mantenimiento 3 meses
  maintenance_6months: 750, // Mantenimiento 6 meses
  seo_optimization: 200,    // Optimización SEO avanzada
  training: 100,            // Capacitación de uso
  backup_setup: 60          // Configuración de respaldos automáticos
} as const

// Tipo para los tipos de proyecto válidos
export type ProjectType = keyof typeof BASE_PRICES
export type FeatureId<T extends ProjectType> = keyof typeof FEATURE_PRICES[T]

/**
 * Función para obtener todas las funcionalidades disponibles para un tipo de proyecto
 */
export function getProjectFeatures(projectType: ProjectType) {
  return FEATURE_PRICES[projectType] || {}
}

/**
 * Función para calcular el precio total de una cotización
 */
export interface PriceCalculationParams {
  projectType: ProjectType
  selectedFeatures: string[]
  complexity: keyof typeof COMPLEXITY_MULTIPLIERS
  timeline: keyof typeof TIMELINE_MULTIPLIERS
  additionalServices?: string[]
}

export function calculateProjectPrice(params: PriceCalculationParams) {
  const { projectType, selectedFeatures, complexity, timeline, additionalServices = [] } = params
  
  // Precio base del tipo de proyecto
  const basePrice = BASE_PRICES[projectType] || 0
  
  // Sumar precios de funcionalidades seleccionadas
  const featuresPrice = selectedFeatures.reduce((total, featureId) => {
    const featurePrice = FEATURE_PRICES[projectType]?.[featureId as keyof typeof FEATURE_PRICES[typeof projectType]] || 0
    return total + featurePrice
  }, 0)
  
  // Sumar precios de servicios adicionales
  const servicesPrice = additionalServices.reduce((total, serviceId) => {
    const servicePrice = ADDITIONAL_SERVICES[serviceId as keyof typeof ADDITIONAL_SERVICES] || 0
    return total + servicePrice
  }, 0)
  
  // Aplicar multiplicadores solo al precio base + funcionalidades (no a servicios)
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity]
  const timelineMultiplier = TIMELINE_MULTIPLIERS[timeline]
  
  const projectTotal = (basePrice + featuresPrice) * complexityMultiplier * timelineMultiplier
  const finalTotal = projectTotal + servicesPrice
  
  return {
    basePrice,
    featuresPrice,
    servicesPrice,
    subtotal: basePrice + featuresPrice,
    complexityMultiplier,
    timelineMultiplier,
    total: Math.round(finalTotal),
    min: Math.round(finalTotal * PRICE_RANGE_CONFIG.minMultiplier),
    max: Math.round(finalTotal * PRICE_RANGE_CONFIG.maxMultiplier)
  }
}

/**
 * Función para obtener el precio base de un tipo de proyecto
 * Útil para mostrar "Desde $X" en las tarjetas
 */
export function getProjectBasePrice(projectType: ProjectType): number {
  return BASE_PRICES[projectType] || 0
}