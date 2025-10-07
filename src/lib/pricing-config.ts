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
  landing: 250,
  webapp: 600, 
  ecommerce: 1000,
  admin: 1200,
  api: 400,
  cms: 800
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
    auth: 250,         // Login de usuarios
    dashboard: 300,    // Panel de control
    database: 200,     // Guarda información
    api: 250,          // Conecta con otros sistemas
    realtime: 350      // Actualizaciones instantáneas
  },
  ecommerce: {
    responsive: 0,      // Siempre incluido
    cart: 200,         // Carrito de compras
    payments: 300,     // Recibir pagos online
    inventory: 250,    // Control de productos
    orders: 200,       // Gestión de pedidos
    admin: 350         // Panel administrativo
  },
  admin: {
    responsive: 0,      // Siempre incluido
    database: 0,       // Base de datos (incluido - esencial)
    auth: 0,           // Login básico (incluido)
    dashboard: 200,    // Panel de control principal
    users: 300,        // Gestión completa de usuarios
    reports: 400,      // Reportes y estadísticas avanzadas
    notifications: 250, // Sistema de notificaciones
    audit: 300,        // Registro de actividades
    inventory: 400,    // Sistema de inventario
    security: 350,     // Seguridad avanzada + OAuth
    api: 300,          // API REST para integraciones
    backup: 250,       // Respaldos automáticos
    roles: 350         // Sistema de roles y permisos
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
    auth: 0,           // Login de usuarios (incluido)
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
  rush: 1.5,      // +50% - Lo necesito YA
  normal: 1.0,    // Precio base - Tiempo normal
  flexible: 0.85  // -15% - Sin prisa
} as const

// Configuración para mostrar rangos de precio (min/max)
export const PRICE_RANGE_CONFIG = {
  minMultiplier: 0.9,  // El precio mínimo es 90% del calculado
  maxMultiplier: 1.2   // El precio máximo es 120% del calculado
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
}

export function calculateProjectPrice(params: PriceCalculationParams) {
  const { projectType, selectedFeatures, complexity, timeline } = params
  
  // Precio base del tipo de proyecto
  const basePrice = BASE_PRICES[projectType] || 0
  
  // Sumar precios de funcionalidades seleccionadas
  const featuresPrice = selectedFeatures.reduce((total, featureId) => {
    const featurePrice = FEATURE_PRICES[projectType]?.[featureId as keyof typeof FEATURE_PRICES[typeof projectType]] || 0
    return total + featurePrice
  }, 0)
  
  // Aplicar multiplicadores
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity]
  const timelineMultiplier = TIMELINE_MULTIPLIERS[timeline]
  
  const totalBase = (basePrice + featuresPrice) * complexityMultiplier * timelineMultiplier
  
  return {
    basePrice,
    featuresPrice,
    subtotal: basePrice + featuresPrice,
    complexityMultiplier,
    timelineMultiplier,
    total: Math.round(totalBase),
    min: Math.round(totalBase * PRICE_RANGE_CONFIG.minMultiplier),
    max: Math.round(totalBase * PRICE_RANGE_CONFIG.maxMultiplier)
  }
}

/**
 * Función para obtener el precio base de un tipo de proyecto
 * Útil para mostrar "Desde $X" en las tarjetas
 */
export function getProjectBasePrice(projectType: ProjectType): number {
  return BASE_PRICES[projectType] || 0
}