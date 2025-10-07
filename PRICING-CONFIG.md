# 💰 Sistema de Configuración de Precios

Este documento describe cómo funciona el sistema de precios parametrizados para el módulo de cotización.

## 📁 Archivos Principales

### `/src/lib/pricing-config.ts`
**Archivo central de configuración de precios**. Todos los precios están aquí centralizados para fácil mantenimiento.

### `/src/components/shared/quote-modal.tsx`
Componente del modal de cotización que usa la configuración centralizada.

## ⚙️ Configuración de Precios

### 1. Precios Base por Tipo de Proyecto
```typescript
export const BASE_PRICES = {
  landing: 250,     // Página Promocional
  webapp: 600,      // Sistema Web  
  ecommerce: 1000,  // Tienda Online
  admin: 1200,      // Panel Administrativo (Frontend + Backend + BD)
  api: 400          // Conexión de Sistemas
}
```

### 2. Precios de Funcionalidades Adicionales
```typescript
export const FEATURE_PRICES = {
  landing: {
    responsive: 0,    // Siempre incluido
    seo: 100,        // Aparece en Google
    analytics: 50,   // Estadísticas de visitantes
    // ... más funcionalidades
  },
  // ... otros tipos de proyecto
}
```

### 3. Multiplicadores por Complejidad
```typescript
export const COMPLEXITY_MULTIPLIERS = {
  simple: 0.8,    // -20% descuento
  medium: 1.0,    // Precio base
  complex: 1.5    // +50% incremento
}
```

### 4. Multiplicadores por Timeline
```typescript
export const TIMELINE_MULTIPLIERS = {
  rush: 1.5,      // +50% - Lo necesito YA
  normal: 1.0,    // Precio base
  flexible: 0.85  // -15% descuento - Sin prisa
}
```

## 🔧 Cómo Cambiar Precios

### Para cambiar precios base:
1. Abrir `/src/lib/pricing-config.ts`
2. Modificar valores en `BASE_PRICES`
3. Los cambios se aplican automáticamente

**Ejemplo:**
```typescript
// Cambiar precio de landing de $250 a $300
export const BASE_PRICES = {
  landing: 300,  // ← Cambiar aquí
  webapp: 600,
  ecommerce: 1000,
  admin: 1200,
  api: 400
}
```

### Para cambiar precios de funcionalidades:
1. Modificar valores en `FEATURE_PRICES`
2. Cambios instantáneos en toda la aplicación

**Ejemplo:**
```typescript
// Cambiar precio de SEO de $100 a $150
landing: {
  responsive: 0,
  seo: 150,  // ← Cambiar aquí
  analytics: 50,
  // ...
}
```

### Para ajustar multiplicadores:
```typescript
// Hacer urgente menos costoso: +50% → +30%
export const TIMELINE_MULTIPLIERS = {
  rush: 1.3,  // ← Cambiar de 1.5 a 1.3
  normal: 1.0,
  flexible: 0.85
}
```

## 🎯 Funciones Disponibles

### `calculateProjectPrice(params)`
Calcula el precio total de una cotización con todos los multiplicadores aplicados.

```typescript
const priceData = calculateProjectPrice({
  projectType: 'webapp',
  selectedFeatures: ['auth', 'database'],
  complexity: 'medium',
  timeline: 'normal'
})

console.log(priceData.total) // Precio final
console.log(priceData.min)   // Rango mínimo
console.log(priceData.max)   // Rango máximo
```

### `getProjectBasePrice(projectType)`
Obtiene el precio base de un tipo de proyecto.

```typescript
const basePrice = getProjectBasePrice('landing') // 250
```

### `getProjectFeatures(projectType)`
Obtiene todas las funcionalidades disponibles para un tipo de proyecto.

```typescript
const features = getProjectFeatures('webapp')
// { responsive: 0, auth: 250, dashboard: 300, ... }
```

## 📊 Rangos de Precio

El sistema genera rangos automáticamente:
- **Mínimo**: 90% del precio calculado
- **Máximo**: 120% del precio calculado

Se puede ajustar en `PRICE_RANGE_CONFIG`:
```typescript
export const PRICE_RANGE_CONFIG = {
  minMultiplier: 0.9,  // 90%
  maxMultiplier: 1.2   // 120%
}
```

## 🌍 Consideraciones de Mercado

Los precios actuales están ajustados para **El Salvador y LATAM**:
- 50% menos que precios estadounidenses
- Funcionalidades adicionales proporcionales
- Multiplicadores conservadores

## ✅ Ventajas del Sistema

1. **Centralizado**: Un solo archivo para todos los precios
2. **Escalable**: Fácil agregar nuevos tipos de proyecto
3. **Mantenible**: Cambios instantáneos sin tocar múltiples archivos
4. **Type-safe**: TypeScript previene errores
5. **Flexible**: Multiplicadores configurables
6. **Documentado**: Cada precio tiene comentarios explicativos

## 🚀 Próximas Mejoras

- [ ] Configuración por moneda (USD, Bitcoin, etc.)
- [ ] Descuentos por volumen
- [ ] Precios dinámicos basados en demanda
- [ ] Integration con APIs de precios externos

---

Para cualquier duda sobre el sistema de precios, consulta este documento o revisa el código en `/src/lib/pricing-config.ts`.