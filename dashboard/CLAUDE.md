# Panel de Contenido — Memoria del Proyecto

Este archivo es la fuente de verdad sobre cómo está construida esta app y por
qué. Mantenlo actualizado cuando cambien las decisiones — cualquier trabajo
futuro (de Claude o de cualquier persona) debería leer esto primero.

## Idioma

**Decisión:** toda la interfaz visible del dashboard, la documentación
(`README.md`, este archivo) y la comunicación sobre este proyecto son en
español. Los identificadores de código (nombres de archivos, rutas,
componentes, variables, nombres de funciones) se mantienen en inglés,
siguiendo la convención estándar del ecosistema Next.js/React — solo el
texto que ve la persona usuaria y la documentación están en español.
Si se agrega texto nuevo a la UI, debe escribirse en español desde el
principio.

## Qué es esto

Un dashboard de operación de contenido, aún en modo placeholder, con cinco
secciones detrás de un sidebar compartido:

- **Gestor de Instagram** (`/instagram`)
- **Analítica** (`/analytics`)
- **Calendario de Contenido** (`/calendar`)
- **Seguimiento de Competencia** (`/competitors`)
- **Feed de Noticias** (`/news`)

Cada sección es actualmente un placeholder estático (tarjeta "Próximamente")
— todavía no hay obtención de datos, autenticación ni integración con
backend. La ruta `/` es una página de resumen con tarjetas que enlazan a
cada sección.

## Dónde vive esto en el repositorio

Este repositorio (`ig-story-remotion`) originalmente contiene una plantilla
de video de Remotion sin relación con el dashboard (`src/`,
`remotion.config.ts` en la raíz del repo — genera videos de Instagram
Stories). El dashboard es una **app de Next.js separada** en `dashboard/`
en la raíz del repo, con su propio `package.json`, `node_modules` e
historial de git hacia adelante. **Decisión:** mantenerlos como dos
proyectos independientes en un mismo repositorio en lugar de fusionar el
tooling o convertir el proyecto de Remotion, ya que resuelven problemas sin
relación (renderizado de video vs. un dashboard web) y tienen runtimes
incompatibles. Todos los comandos del dashboard se ejecutan desde dentro de
`dashboard/`.

## Stack técnico

- **Next.js 14** (App Router, carpeta `src/`), fijado explícitamente vía
  `create-next-app@14`. **Decisión:** el tag `latest` en el momento en que
  se construyó esto resolvía a Next 16, cuyo propio `AGENTS.md` generado
  advierte explícitamente que tiene cambios que rompen compatibilidad
  respecto a los datos de entrenamiento del modelo y dice que hay que leer
  `node_modules/next/dist/docs/` antes de escribir código. Para evitar
  construir sobre APIs no documentadas o desconocidas, se fijó la versión a
  las convenciones bien establecidas del App Router de Next 14.
- **React 18** (coincide con la plantilla de Next 14; no React 19).
- **TypeScript**, modo estricto (del `tsconfig.json` por defecto de
  `create-next-app`).
- **Tailwind CSS v3.4** para estilos (no v4 — la configuración de v4 difiere
  bastante y v3 es lo que asumen los primitivos ya probados de shadcn/ui).
- **Componentes shadcn/ui escritos a mano (no generados por el CLI).**
  **Decisión y por qué:** el endpoint del registro del CLI de shadcn
  (`ui.shadcn.com`) está bloqueado por la política de red saliente de este
  entorno (403 a nivel de proxy), y el CLI más reciente (`shadcn@4.x`)
  además usa un nuevo sistema de presets "base-nova" con
  `--base radix|base|aria`, que se aparta del formato clásico de
  `components.json`. Por eso los primitivos en `src/components/ui/`
  (`button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`) se escribieron a
  mano, replicando exactamente el código fuente estándar/estilo
  "new-york" de shadcn (mismas variantes, mismo uso de `cva`, mismo
  helper `cn()`), de modo que sean compatibles si el CLI se puede usar más
  adelante (por ejemplo `npx shadcn@2.9.3 add <componente>` contra el
  `components.json` existente). Se dejó un `components.json` en el repo
  para que el CLI funcione de inmediato si en el futuro hay acceso de red a
  `ui.shadcn.com`.
  - Por ahora solo existen `button`, `card`, `badge` y `separator` — agrega
    más de la misma forma (escribir a mano el código fuente de shadcn
    correspondiente, o correr el CLI) a medida que las secciones ganen
    funcionalidad real.
- **lucide-react** para íconos. **Decisión:** la versión instalada
  (`^1.x`) eliminó todos los íconos de marcas/logos (no existe un ícono
  `Instagram` exportado) — es un cambio intencional upstream, no un bug.
  El sidebar usa `Camera` para el Gestor de Instagram en lugar de un
  glifo literal de Instagram.
- **class-variance-authority**, **clsx**, **tailwind-merge**,
  **tailwindcss-animate** — el stack estándar de variantes y combinación
  de clases de shadcn/ui (`cn()` vive en `src/lib/utils.ts`).
- **@radix-ui/react-slot**, **@radix-ui/react-separator** — primitivos
  detrás de `Button` (`asChild`) y `Separator`. `@radix-ui/react-tooltip`
  está instalado pero todavía no se usa en ningún lado.

## Tema oscuro

**Decisión:** el tema oscuro es el único tema — no hay modo claro ni
selector de tema. El `<html>` en `src/app/layout.tsx` tiene
`className="dark"` fijo, y `lang="es"`. Todos los tokens de color de
shadcn (`--background`, `--foreground`, `--card`, `--primary`, `--border`,
además de los tokens propios del dashboard `--sidebar-*`) se definen una
sola vez bajo `:root` en `src/app/globals.css` usando valores oscuros — no
hay una separación en bloques `.light`/`.dark` que mantener sincronizada,
porque el modo claro no existe. Si en algún momento se agrega modo claro,
primero hay que separar estas variables en bloques `.dark`/`:root` y
conectar un theme provider (por ejemplo `next-themes`).

## Estructura de carpetas

```
dashboard/
├── CLAUDE.md                     # este archivo
├── components.json               # configuración de shadcn/ui (style: new-york, base: neutral)
├── tailwind.config.ts            # tokens de diseño de shadcn (variables CSS en HSL) + tailwindcss-animate
├── src/
│   ├── app/
│   │   ├── layout.tsx            # shell raíz: <html lang="es" class="dark">, renderiza Sidebar + MobileNav + <main>
│   │   ├── page.tsx               # "/" — página de resumen, tarjetas que enlazan a cada sección
│   │   ├── globals.css           # directivas de Tailwind + variables CSS de shadcn (solo oscuro)
│   │   ├── instagram/page.tsx    # placeholder de Gestor de Instagram
│   │   ├── analytics/page.tsx    # placeholder de Analítica
│   │   ├── calendar/page.tsx     # placeholder de Calendario de Contenido
│   │   ├── competitors/page.tsx  # placeholder de Seguimiento de Competencia
│   │   └── news/page.tsx         # placeholder de Feed de Noticias
│   ├── components/
│   │   ├── ui/                   # primitivos de shadcn/ui escritos a mano (button, card, badge, separator)
│   │   └── layout/
│   │       ├── nav-items.ts      # única fuente de verdad para los links del sidebar/menú móvil (title, href, icon, description)
│   │       ├── sidebar.tsx       # sidebar fijo de escritorio (md+), resalta el link activo vía usePathname
│   │       ├── mobile-nav.tsx    # barra superior + menú desplegable que se muestra por debajo del breakpoint md
│   │       ├── page-header.tsx   # encabezado compartido "<Título> [badge Próximamente] + descripción" para las páginas de sección
│   │       └── coming-soon.tsx   # cuerpo placeholder compartido (tarjeta punteada) para las páginas de sección
│   └── lib/
│       └── utils.ts              # cn() — clsx + tailwind-merge
```

**Decisión:** cada página de sección sigue el mismo patrón de dos piezas —
`PageHeader` (título + badge "Próximamente" + descripción) seguido de
`ComingSoon` (ícono + una línea describiendo qué vivirá ahí eventualmente).
Esto hace que las cinco páginas placeholder sean triviales de extender
después: cuando una sección tenga funcionalidad real, se reemplaza el
`<ComingSoon />` por contenido real y se deja `PageHeader` tal cual.

**Decisión:** `navItems` en `nav-items.ts` es la única fuente de verdad
para el sidebar — tanto `sidebar.tsx` (escritorio) como `mobile-nav.tsx`
(móvil) lo importan, así que agregar/reordenar/renombrar una sección solo
requiere editar ese arreglo.

## Navegación / comportamiento responsive

- **Escritorio (`md:` en adelante):** un sidebar izquierdo fijo y siempre
  visible (`src/components/layout/sidebar.tsx`), de 16rem (`w-64`) de
  ancho. El `<main>` recibe `md:pl-64` para ubicarse junto a él.
- **Móvil (por debajo de `md`):** el sidebar fijo se oculta
  (`hidden md:flex`); en su lugar, `mobile-nav.tsx` renderiza una barra
  superior con un botón de menú (hamburguesa) que despliega una lista de
  navegación en línea. **Decisión:** esto es un simple toggle con
  `useState`, no un `Sheet` de shadcn ni un `Dialog` de Radix — se
  mantuvo sin dependencias extra porque no se necesitaba un drawer
  deslizante completo para páginas placeholder. Revisar esto si el menú
  móvil necesita superponerse al contenido, atrapar el foco, etc.
- El estado de link activo se determina con `usePathname()`
  (`pathname === href` o una subruta) en ambos componentes de navegación.

## Limitaciones / notas del entorno

- Las instalaciones de paquetes pasan por `registry.npmjs.org`, que este
  entorno permite acceder directamente (sin pasar por el proxy) — `npm
  install` funciona con normalidad.
- `ui.shadcn.com` (el registro de componentes de shadcn/ui) está
  **bloqueado** por la política de proxy saliente del entorno — no asumir
  que `npx shadcn add ...` va a funcionar; para agregar primitivos nuevos,
  escribirlos a mano siguiendo la configuración de `components.json`
  (style: `new-york`, base color: `neutral`, css variables: activadas).
- `npm audit` reporta vulnerabilidades preexistentes heredadas de las
  propias devDependencies de la plantilla `create-next-app@14` (deps
  transitivas antiguas de `eslint`/`glob`). No se abordaron aquí —
  arreglarlas implica subir versiones mayores de `eslint`/
  `eslint-config-next`, lo cual está fuera del alcance del scaffolding.

## Verificado y funcionando

- `npm run build` — el build de producción funciona, las 5 rutas de
  sección más `/` se prerenderizan como páginas estáticas.
- `npm run lint` — sin advertencias ni errores de ESLint.
- `npx tsc --noEmit` — sin errores de tipos.
- Verificado manualmente en un navegador headless: el sidebar se renderiza,
  el resaltado del link activo funciona al navegar entre secciones, el
  tema oscuro se aplica correctamente, y el breakpoint móvil cambia
  correctamente a la barra superior con menú hamburguesa.

## Comandos

```bash
cd dashboard
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
