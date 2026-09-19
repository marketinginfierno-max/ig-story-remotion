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

El **Gestor de Instagram** y **Analítica** ya tienen funcionalidad real (ver
las secciones dedicadas más abajo); las otras tres secciones siguen siendo
un placeholder estático (tarjeta "Próximamente") — todavía no hay obtención
de datos, autenticación ni integración con backend. La ruta `/` es una
página de resumen con tarjetas que enlazan a cada sección.

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
  (`button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`, `dialog.tsx`,
  `input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`) se escribieron a
  mano, replicando exactamente el código fuente estándar/estilo
  "new-york" de shadcn (mismas variantes, mismo uso de `cva`, mismo
  helper `cn()`), de modo que sean compatibles si el CLI se puede usar más
  adelante (por ejemplo `npx shadcn@2.9.3 add <componente>` contra el
  `components.json` existente). Se dejó un `components.json` en el repo
  para que el CLI funcione de inmediato si en el futuro hay acceso de red a
  `ui.shadcn.com`.
  - Agrega componentes nuevos de la misma forma (escribir a mano el código
    fuente de shadcn correspondiente, o correr el CLI si hay acceso de red)
    a medida que las secciones ganen funcionalidad real.
- **lucide-react** para íconos. **Decisión:** la versión instalada
  (`^1.x`) eliminó todos los íconos de marcas/logos (no existe un ícono
  `Instagram` exportado) — es un cambio intencional upstream, no un bug.
  El sidebar usa `Camera` para el Gestor de Instagram en lugar de un
  glifo literal de Instagram.
- **class-variance-authority**, **clsx**, **tailwind-merge**,
  **tailwindcss-animate** — el stack estándar de variantes y combinación
  de clases de shadcn/ui (`cn()` vive en `src/lib/utils.ts`).
- **@radix-ui/react-slot**, **@radix-ui/react-separator**,
  **@radix-ui/react-dialog**, **@radix-ui/react-label**,
  **@radix-ui/react-select**, **@radix-ui/react-popover** — primitivos
  detrás de `Button` (`asChild`), `Separator`, `Dialog` (el formulario de
  nueva publicación), `Label`, `Select` (los dropdowns de ese formulario)
  y `Popover` (el selector de rango de fechas de Analítica).
  `@radix-ui/react-tooltip` está instalado pero todavía no se usa en
  ningún lado (los tooltips de los gráficos de Analítica son un tooltip
  hecho a mano, no este componente — ver la sección de Analítica).
- **Sin librería de gráficos.** **Decisión y por qué:** los gráficos de
  barras de Analítica son SVG escrito a mano
  (`src/components/analytics/bar-chart.tsx`), no Recharts/Chart.js/etc.
  Se siguió la skill `dataviz` de Claude, que enseña a construir cada
  pieza (barras, ejes, tooltip, vista de tabla) en HTML/SVG plano para
  tener control exacto sobre el spec de marcas (barras finas, extremo
  superior redondeado a 4px y cuadrado en la base, gap de 2px, tooltip
  accesible por hover/foco) en vez de pelear con la temización de una
  librería de terceros para lograr lo mismo. Si el dashboard necesita
  gráficos más complejos más adelante (líneas multi-serie, áreas
  apiladas, heatmaps), evaluar entonces si conviene sumar una librería —
  para dos gráficos de barras de una sola serie no se justificaba.

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
│   │   ├── instagram/page.tsx    # Gestor de Instagram — funcional (ver sección dedicada)
│   │   ├── analytics/page.tsx    # Analítica — funcional (ver sección dedicada)
│   │   ├── calendar/page.tsx     # placeholder de Calendario de Contenido
│   │   ├── competitors/page.tsx  # placeholder de Seguimiento de Competencia
│   │   └── news/page.tsx         # placeholder de Feed de Noticias
│   ├── components/
│   │   ├── ui/                   # primitivos de shadcn/ui escritos a mano (button, card, badge, separator, dialog, input, textarea, label, select, popover)
│   │   ├── layout/
│   │   │   ├── nav-items.ts      # única fuente de verdad para los links del sidebar/menú móvil (title, href, icon, description)
│   │   │   ├── sidebar.tsx       # sidebar fijo de escritorio (md+), resalta el link activo vía usePathname
│   │   │   ├── mobile-nav.tsx    # barra superior + menú desplegable que se muestra por debajo del breakpoint md
│   │   │   ├── page-header.tsx   # encabezado compartido "<Título> [badge opcional] + descripción" para las páginas
│   │   │   └── coming-soon.tsx   # cuerpo placeholder compartido (tarjeta punteada) para las páginas sin funcionalidad aún
│   │   ├── instagram/            # todo lo específico del Gestor de Instagram (ver sección dedicada)
│   │   │   ├── types.ts          # tipos Post/PostType/PostStatus + labels e íconos en español
│   │   │   ├── seed-posts.ts     # publicaciones de ejemplo iniciales
│   │   │   ├── use-posts.ts      # hook de estado + persistencia en localStorage
│   │   │   ├── board.tsx         # orquestador: header + botón "Nueva publicación" + columnas
│   │   │   ├── status-column.tsx # una columna del tablero (encabezado + tarjetas de ese estado)
│   │   │   ├── post-card.tsx     # tarjeta individual de una publicación
│   │   │   └── new-post-dialog.tsx # formulario modal para crear una publicación
│   │   └── analytics/            # todo lo específico de Analítica (ver sección dedicada)
│   │       ├── mock-data.ts      # generador de datos de ejemplo deterministas (sin backend todavía)
│   │       ├── date-range.ts     # presets de rango de fechas + cálculo del período anterior
│   │       ├── date-range-picker.tsx # popover con presets + rango personalizado
│   │       ├── stat-card.tsx     # tarjeta de estadística (ícono, label, valor, delta)
│   │       ├── bar-chart.tsx     # gráfico de barras SVG hecho a mano (ver "Stack técnico")
│   │       └── analytics-view.tsx # orquestador: header + date picker + stat cards + los dos gráficos
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

**Decisión:** `PageHeader` recibe un `badge` opcional (antes era fijo,
siempre mostraba "Próximamente"). Las cuatro páginas que siguen siendo
placeholder pasan `badge="Próximamente"` explícitamente; el Gestor de
Instagram (con funcionalidad real) y la página de resumen no pasan badge,
así que no se muestra ninguno.

## Gestor de Instagram (`/instagram`)

Primera sección con funcionalidad real, no placeholder. Es un tablero
estilo kanban: publicaciones agrupadas en columnas por estado, con un
diálogo para crear publicaciones nuevas.

- **Modelo de datos** (`src/components/instagram/types.ts`):
  ```ts
  interface Post {
    id: string;
    caption: string;
    type: "reel" | "carousel" | "story";
    status: "idea" | "draft" | "ready" | "scheduled" | "posted";
    scheduledDate: string | null; // "YYYY-MM-DD" o null
    createdAt: string; // ISO timestamp
  }
  ```
  Las etiquetas visibles (`POST_TYPE_LABELS`, `POST_STATUS_LABELS`) están
  en español aunque los valores internos (`"reel"`, `"idea"`, etc.) se
  mantienen en inglés — son claves de código, no texto de UI.
- **Sin backend todavía — persistencia en `localStorage`.**
  **Decisión y por qué:** el dashboard no tiene backend ni base de datos
  configurados en este punto, pero "déjame agregar una publicación" implica
  que lo agregado sobreviva a un refresh de página. `use-posts.ts` guarda
  el arreglo de publicaciones en `localStorage` bajo la clave
  `dashboard.instagram.posts`. El hook usa dos `useEffect` con una bandera
  `hydrated`: el primero carga desde `localStorage` una sola vez al montar
  (y solo entonces marca `hydrated = true`); el segundo solo escribe a
  `localStorage` cuando `hydrated` ya es `true`. Esto evita el bug típico
  de que el efecto de guardado se dispare con el estado semilla ANTES de
  que el efecto de carga alcance a leer lo ya guardado, lo que borraría
  datos reales del usuario. El estado inicial (`SEED_POSTS` en
  `seed-posts.ts`) es el que se renderiza en el server, así que no hay
  mismatch de hidratación de React — la lectura real de `localStorage`
  ocurre después del montaje, en el cliente.
  - Si más adelante se conecta una base de datos o una API real,
    `use-posts.ts` es el único lugar que hay que cambiar — el resto de los
    componentes (`board.tsx`, `status-column.tsx`, `post-card.tsx`,
    `new-post-dialog.tsx`) solo conocen `posts` y `addPost`, no de dónde
    vienen.
- **Layout tipo kanban** (`board.tsx` + `status-column.tsx`): una columna
  por estado, en el orden fijo `POST_STATUS_ORDER` (idea → borrador →
  listo → programado → publicado). En pantallas chicas (`<sm`) las
  columnas son un `flex` con scroll horizontal (`overflow-x-auto`, cada
  columna `w-72 shrink-0`); desde `sm:` para arriba pasa a `grid` (2
  columnas en `sm`, 5 en `lg`). Cada columna muestra su conteo de
  publicaciones y, si está vacía, un mensaje "Sin publicaciones" en vez de
  quedar en blanco.
- **Nueva publicación** (`new-post-dialog.tsx`): un `Dialog` de shadcn/ui
  con un formulario controlado — `Textarea` para el caption (validación
  mínima: no puede estar vacío), `Select` para tipo de publicación y
  estado, e `Input type="date"` nativo para la fecha programada
  (opcional). **Decisión:** se usó un `<input type="date">` nativo en vez
  de construir un date-picker con Radix Popover + Calendar — es
  suficiente para este caso de uso y evita agregar `react-day-picker` u
  otra dependencia solo para esto. La publicación nueva se agrega al
  principio del arreglo (`addPost` hace `[newPost, ...prev]`), por lo que
  aparece primero en su columna.
- **Íconos por tipo** (`POST_TYPE_ICONS` en `types.ts`): `Clapperboard`
  para reel, `GalleryHorizontal` para carrusel, `CircleDashed` para
  historia — elegidos porque, igual que con `Instagram` en el sidebar,
  `lucide-react` no tiene íconos de marca para "reel" o "story" de
  Instagram.

## Analítica (`/analytics`)

Segunda sección con funcionalidad real. Cuatro tarjetas de estadísticas,
dos gráficos de barras diarios (alcance e interacción) y un selector de
rango de fechas que filtra todo lo demás en la página. Se construyó
siguiendo la skill `dataviz` de Claude — cargarla de nuevo
(`Skill({ skill: "dataviz" })`) antes de tocar cualquier cosa relacionada
a color, marcas o interacción de gráficos aquí.

- **Sin backend todavía — datos de ejemplo deterministas.**
  **Decisión y por qué:** el usuario pidió explícitamente "por ahora,
  llénalo con datos de ejemplo realistas", así que `mock-data.ts` no
  intenta conectarse a nada real (ni siquiera a los posts reales del
  Gestor de Instagram — son módulos independientes a propósito, para no
  fingir una integración que no existe). Los números no se generan con
  `Math.random()`: cada día usa un hash de su fecha (`YYYY-MM-DD`) como
  semilla de un PRNG (`mulberry32`), así que los valores son estables
  entre renders y recargas de página en vez de cambiar cada vez que se
  visita la página — importante para que el layout se vea consistente
  mientras se revisa. Cada día tiene una tendencia lenta (`dayIndex` desde
  un `ANCHOR_DATE` fijo de 2024-01-01), un patrón semanal (más
  alcance/interacción viernes-domingo) y ruido aleatorio.
  - **Bug real encontrado y corregido durante la construcción:** el
    coeficiente de tendencia original de `engagementRate` (`+0.01` por
    día) crecía sin límite porque `dayIndex` se mide desde una fecha fija
    cada vez más lejana — para fechas ~1000 días después del ancla (osea,
    "hoy" en 2026), el valor base ya superaba el techo del `clamp`
    (9.5%), así que TODAS las barras del gráfico de interacción se veían
    exactamente iguales (aplanadas contra el techo), sin importar el
    ruido ni el patrón semanal. Se bajó el coeficiente a `+0.0015`/día.
    Si se agrega alguna otra métrica con tendencia + `dayIndex` +
    `clamp`, verificar que el coeficiente no sature el clamp en el
    horizonte de fechas que la página realmente puede mostrar (los
    presets llegan hasta 90 días atrás, pero el rango personalizado no
    tiene límite superior de antigüedad más que `ANCHOR_DATE`).
  - Cuando haya una fuente de datos real (API de Meta/Instagram, o un
    backend propio), `mock-data.ts` es el único módulo que hay que
    reemplazar — `analytics-view.tsx`, `bar-chart.tsx` y `stat-card.tsx`
    no saben que los datos son sintéticos.
- **El rango de fechas filtra todo.** `analytics-view.tsx` guarda el
  `DateRangeValue` seleccionado en estado y recalcula, a partir de él,
  la serie diaria del rango actual y la del "período anterior" de igual
  duración (`getPreviousPeriod`) para los deltas de las tarjetas — así
  las tarjetas y ambos gráficos siempre están mirando la misma ventana de
  tiempo, tal como pide la skill `dataviz` ("los filtros aplican a todo
  lo que está debajo").
- **Selector de rango de fechas** (`date-range-picker.tsx`): un `Popover`
  con presets como filas (Hoy, Últimos 7/30/90 días, Este mes), la
  selección marcada con un ícono de check, y el rango personalizado
  (dos `<input type="date">`) detrás de una línea divisoria en el pie —
  siguiendo al pie de la letra el spec de `references/palette.md` y
  `references/interaction.md` de la skill `dataviz` para controles de
  fecha.
- **Colores de las series** (`--chart-reach`, `--chart-engagement` en
  `globals.css`): alcance usa el mismo violeta de `--primary` de la
  marca; interacción usa un verde azulado nuevo. **Decisión:** ambos se
  eligieron corriendo `scripts/validate_palette.js` de la skill `dataviz`
  contra el fondo oscuro real del dashboard (`#09090b`) — pasan contraste
  ≥3:1, separación bajo simulación de daltonismo (ΔE 21.8 deutan) y
  separación de visión normal (ΔE 31.0), muy por encima de los pisos que
  pide la skill. Como cada color vive en su propio gráfico (nunca
  aparecen juntos con una leyenda compartida), no hace falta que compitan
  contra las 8 categóricas por defecto de la skill — pero igual se
  validaron como par para que, si en el futuro se combinan en una sola
  vista, ya se sepa que funcionan juntos.
- **Gráfico de barras hecho a mano** (`bar-chart.tsx`): ver la entrada
  correspondiente en "Stack técnico" para el porqué de no usar una
  librería. Implementa el spec de marcas de la skill al pie de la letra:
  barra ≤24px de grosor, extremo superior redondeado a 4px y cuadrado en
  la base (dibujado como `<path>`, no `<rect rx>`, para que solo las
  esquinas de arriba se redondeen), gap de 2px entre barras, grillas en
  gris apagado (`hsl(var(--border))`), y ticks del eje Y redondeados a
  números "limpios" (0 / mitad / máximo). El tooltip aparece tanto en
  hover como en foco de teclado (cada barra es un `<rect>` transparente
  con `tabIndex={0}` y `aria-label` con la fecha y el valor, así que el
  valor es alcanzable sin mouse y sin depender del tooltip visual). Cada
  gráfico tiene un botón "Ver tabla" que cambia a una tabla HTML con los
  mismos datos — el equivalente accesible que pide la skill.
- **Sin agregación semanal.** Los rangos de hasta 90 días se grafican con
  una barra por día (hasta 90 barras finas), no se agregan a semanas. Es
  una decisión simple a propósito: la skill no lo exige, y agregar un
  segundo modo de granularidad (diario vs. semanal) hoy sería complejidad
  sin un pedido concreto detrás. Revisar si en algún momento el rango
  personalizado permite ventanas mucho más largas (ej. un año) y 90+
  barras finas se vuelven difíciles de leer.

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
- Gestor de Instagram verificado manualmente en navegador headless: abrir
  el diálogo, llenar caption/tipo/estado/fecha y enviar agrega la tarjeta
  a la columna correcta; la publicación persiste después de recargar la
  página (confirma que la persistencia en `localStorage` funciona); el
  layout responde bien tanto en escritorio (grid de 5 columnas) como en
  móvil (scroll horizontal de columnas).
- Analítica verificado manualmente en navegador headless: los presets del
  selector de fechas (Hoy, 7/30/90 días, Este mes) y el rango
  personalizado recalculan las 4 tarjetas y ambos gráficos; el tooltip
  aparece en hover y resalta la barra; el toggle "Ver tabla" funciona en
  ambos gráficos; el caso límite de un solo día ("Hoy") no rompe nada
  (barra centrada, sin errores en consola); el layout responde bien en
  móvil. Este es también el proceso que encontró el bug de la tendencia
  de `engagementRate` saturando el clamp — ver la sección de Analítica.

## Comandos

```bash
cd dashboard
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
