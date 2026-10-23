# Andrés Córdova · Portfolio v2

Portfolio bilingüe construido con Next.js 15, React 19 y TypeScript. La segunda versión combina Manrope e Instrument Serif, una paleta azul y morado sobre azul noche, partículas Canvas animadas y capturas reales de proyectos en producción.

## Ejecutar

```powershell
npm ci
npm run dev
```

La raíz redirige a `/es`. La versión inglesa está en `/en`. La primera versión se conserva en `/es/v1` y `/en/v1`.

## Docker

```powershell
docker compose up -d --build
docker compose ps
```

Disponible en http://localhost:3021. La imagen utiliza la salida standalone de Next.js y un usuario sin privilegios. El servicio incluye comprobación HTTP de salud.

## Contenido y diseño

- `src/components/v2/content.ts`: textos, tecnologías, enlaces y proyectos en español e inglés.
- `src/components/v2/portfolio.tsx`: secciones, navegación, filtros, selector de capturas ERP y contacto.
- `src/components/v2/portfolio.css`: diseño y adaptación móvil.
- `src/components/v2/particle-field.tsx`: partículas de polvo y cintas fluidas, con pausa manual, reducción de movimiento y suspensión fuera de pantalla o con la pestaña oculta.
- `public/projects/v2/`: capturas reales. La imagen del BackOffice procede de los manuales del repositorio ERP y contiene datos ficticios de demostración. Las capturas de Orion, la landing ERP y los manuales provienen de los servicios locales; Braings y el chat Family Friendly se capturaron de sus sitios públicos.

Proyectos: Orion, Córdova ERP (BackOffice, landing y manuales como una sola suite), Family Friendly y Braings. Las tecnologías se basan en los repositorios, información proporcionada por el propietario y, en Family Friendly, el frontend Vue observado en el sitio público. La captura pública de Orion muestra el acceso; no se publican datos financieros privados.

Las fuentes se descargan durante la compilación con `next/font` y se sirven desde la aplicación. La compilación necesita conectividad con Google Fonts.

## Validación

```powershell
npx tsc --noEmit
npx eslint src/components/v2/portfolio.tsx src/components/v2/content.ts src/components/v2/particle-field.tsx 'src/app/[locale]/page.tsx' 'src/app/[locale]/layout.tsx' 'src/app/[locale]/v1/page.tsx' next.config.mjs
npm run build
```

El build comprueba tipos y genera las páginas estáticas. Desactiva el lint automático de todo el repositorio: ESLint debe ejecutarse únicamente sobre los archivos modificados.
