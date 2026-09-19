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

Un dashboard de operación de contenido con cinco secciones detrás de un
sidebar compartido, las cinco con funcionalidad real:

- **Gestor de Instagram** (`/instagram`)
- **Analítica** (`/analytics`)
- **Calendario de Contenido** (`/calendar`)
- **Seguimiento de Competencia** (`/competitors`)
- **Feed de Noticias** (`/news`) — la única que trae datos reales de
  internet (RSS); las otras cuatro siguen usando datos de ejemplo, sin
  backend propio todavía.

La ruta `/` es una página de resumen con tarjetas que enlazan a cada
sección.

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
- **fast-xml-parser.** Única dependencia nueva para Feed de Noticias:
  convierte el XML de un feed RSS/Atom en un objeto JS. Es la única
  sección que trae datos reales de internet en vez de datos de ejemplo —
  ver la sección dedicada más abajo.

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
│   │   ├── calendar/page.tsx     # Calendario de Contenido — funcional (ver sección dedicada)
│   │   ├── competitors/page.tsx  # Seguimiento de Competencia — funcional (ver sección dedicada)
│   │   ├── news/page.tsx         # Feed de Noticias — funcional (ver sección dedicada)
│   │   └── api/news/route.ts     # Route Handler: trae y combina los feeds RSS en el servidor
│   ├── components/
│   │   ├── ui/                   # primitivos de shadcn/ui escritos a mano (button, card, badge, separator, dialog, input, textarea, label, select, popover)
│   │   ├── layout/
│   │   │   ├── nav-items.ts      # única fuente de verdad para los links del sidebar/menú móvil (title, href, icon, description)
│   │   │   ├── sidebar.tsx       # sidebar fijo de escritorio (md+), resalta el link activo vía usePathname
│   │   │   ├── mobile-nav.tsx    # barra superior + menú desplegable que se muestra por debajo del breakpoint md
│   │   │   └── page-header.tsx   # encabezado compartido "<Título> [badge opcional] + descripción" para las páginas
│   │   ├── instagram/            # todo lo específico del Gestor de Instagram (ver sección dedicada)
│   │   │   ├── types.ts          # tipos Post/PostType/PostStatus + labels e íconos en español
│   │   │   ├── seed-posts.ts     # publicaciones de ejemplo iniciales
│   │   │   ├── use-posts.ts      # hook de estado + persistencia en localStorage
│   │   │   ├── board.tsx         # orquestador: header + botón "Nueva publicación" + columnas
│   │   │   ├── status-column.tsx # una columna del tablero (encabezado + tarjetas de ese estado)
│   │   │   ├── post-card.tsx     # tarjeta individual de una publicación
│   │   │   └── new-post-dialog.tsx # formulario modal para crear una publicación
│   │   ├── analytics/            # todo lo específico de Analítica (ver sección dedicada)
│   │   │   ├── mock-data.ts      # generador de datos de ejemplo deterministas (sin backend todavía)
│   │   │   ├── date-range.ts     # presets de rango de fechas + cálculo del período anterior
│   │   │   ├── date-range-picker.tsx # popover con presets + rango personalizado
│   │   │   ├── stat-card.tsx     # tarjeta de estadística (ícono, label, valor, delta)
│   │   │   ├── bar-chart.tsx     # gráfico de barras SVG hecho a mano (ver "Stack técnico")
│   │   │   └── analytics-view.tsx # orquestador: header + date picker + stat cards + los dos gráficos
│   │   ├── calendar/             # todo lo específico del Calendario de Contenido (ver sección dedicada)
│   │   │   ├── types.ts          # tipo Platform/ContentItem + labels, íconos y color por plataforma
│   │   │   ├── seed-items.ts     # contenido de ejemplo, con fechas relativas a "hoy"
│   │   │   ├── platform-filter.tsx # fila de botones para filtrar por plataforma (multi-selección)
│   │   │   ├── content-chip.tsx  # chip de un item dentro de una celda del calendario
│   │   │   ├── day-cell.tsx      # una celda del calendario (número de día + chips + "+N más")
│   │   │   ├── month-grid.tsx    # arma la grilla de 6x7 días y los encabezados de la semana
│   │   │   ├── day-items-dialog.tsx # diálogo con el detalle completo de un día
│   │   │   └── calendar-view.tsx # orquestador: header + navegación de mes + filtro + grilla
│   │   ├── competitors/          # todo lo específico de Seguimiento de Competencia (ver sección dedicada)
│   │   │   ├── types.ts          # tipo Competitor + SortKey/SortState para la tabla
│   │   │   ├── mock-data.ts      # genera estadísticas de ejemplo a partir de un hash del handle
│   │   │   ├── use-competitors.ts # hook de estado + persistencia en localStorage
│   │   │   ├── competitors-table.tsx # tabla ordenable (clic en cualquier columna)
│   │   │   ├── growth-delta.tsx  # crecimiento con flecha + color (subida = verde, bajada = roja)
│   │   │   ├── add-competitor-dialog.tsx # formulario modal para agregar un handle
│   │   │   └── data-source-note.tsx # nota visible en la página sobre dónde conectar datos reales
│   │   └── news/                 # todo lo específico del Feed de Noticias (ver sección dedicada)
│   │       ├── types.ts          # tipo NewsTopic/NewsItem + labels e íconos por tema
│   │       ├── feeds.ts          # config editable: qué URL de RSS trae cada tema
│   │       ├── parse-rss.ts      # XML (RSS 2.0 o Atom) -> NewsItem[], sin depender del formato exacto
│   │       ├── use-news.ts       # hook: fetch a /api/news + estado loading/success/error
│   │       ├── topic-filter.tsx  # fila de botones para filtrar por tema (multi-selección)
│   │       ├── news-card.tsx     # tarjeta de una noticia (link a la fuente original)
│   │       ├── news-skeleton.tsx # tarjeta placeholder animada mientras carga
│   │       ├── format-published.ts # fecha de publicación relativa ("hace 3 h") o absoluta
│   │       └── news-feed-view.tsx # orquestador: header + botón actualizar + filtro + grilla
│   └── lib/
│       ├── utils.ts              # cn() — clsx + tailwind-merge
│       ├── date.ts               # helpers de fecha compartidos (addDays, diffInDays, toISODate, today, startOfMonth, addMonths)
│       ├── random.ts             # hashString + mulberry32 — PRNG con semilla para datos de ejemplo deterministas
│       ├── format.ts             # formatCompactNumber/formatNumber/formatPercent — formateo de números en español
│       └── use-local-storage-state.ts # hook genérico de estado + persistencia en localStorage (con hidratación segura)
```

**Decisión:** `lib/date.ts`, `lib/random.ts` y `lib/format.ts` empezaron
como código interno de `analytics/mock-data.ts` y se extrajeron a medida
que otra sección necesitó lo mismo — no se diseñaron por adelantado. El
Calendario necesitó los helpers de fecha (no tenía sentido que
`calendar/` importara desde adentro de `analytics/`), y Seguimiento de
Competencia necesitó exactamente el mismo generador con semilla
(`hashString` + `mulberry32`) que ya generaba los datos de ejemplo de
Analítica, y el mismo patrón de hidratación con `localStorage` que ya
tenía `use-posts.ts` del Gestor de Instagram (por eso también existe
`use-local-storage-state.ts`, genérico, y `use-posts.ts` se reescribió
para usarlo). Si una tercera sección necesita generar datos de ejemplo
deterministas o persistir estado en `localStorage`, usar estos módulos en
vez de reinventarlos.

**Decisión:** `navItems` en `nav-items.ts` es la única fuente de verdad
para el sidebar — tanto `sidebar.tsx` (escritorio) como `mobile-nav.tsx`
(móvil) lo importan, así que agregar/reordenar/renombrar una sección solo
requiere editar ese arreglo.

**Historial:** hasta la primera versión de este dashboard, cada página sin
funcionalidad real seguía el mismo patrón de dos piezas — `PageHeader`
con `badge="Próximamente"` seguido de un componente `ComingSoon`
(ícono + una línea). Las cinco secciones ya tienen funcionalidad real, así
que ese patrón dejó de usarse: se borró `coming-soon.tsx` (había quedado
sin ningún uso — código muerto) y ninguna página pasa `badge` hoy.
`PageHeader` conserva el prop `badge` opcional por si en el futuro se
agrega una sección nueva todavía sin funcionalidad — en ese caso, ese es
el patrón a repetir (y si `ComingSoon` hace falta de nuevo, recrearlo es
trivial: ver el diff de cuando se reemplazó cada sección en el historial
de git).

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

## Calendario de Contenido (`/calendar`)

Tercera sección con funcionalidad real. Vista mensual (grilla de 6x7 días,
semana empieza en lunes), navegación entre meses, botón "Hoy", y cada día
puede mostrar varios items de contenido como chips coloreados por
plataforma. Filtro de plataforma (multi-selección) arriba de la grilla,
que oculta los chips de las plataformas desactivadas en toda la vista.

- **Modelo de datos independiente del Gestor de Instagram — a propósito.**
  **Decisión y por qué:** al principio iba a hacer que el calendario
  mostrara los `scheduledDate` de los posts reales del Gestor de
  Instagram (`usePosts`), ya que el modelo ya existía. Pero el pedido de
  color-codificar y filtrar **por plataforma** (Instagram, TikTok,
  Facebook, X) no encaja con `Post`, que es explícitamente solo de
  Instagram (no tiene ni necesita un campo `platform`). Se optó por un
  modelo propio en `src/components/calendar/types.ts`
  (`Platform`, `ContentItem { id, title, platform, date }`), separado del
  de Instagram. Son secciones conceptualmente distintas: el Gestor de
  Instagram administra el detalle de publicaciones de una sola red; el
  Calendario de Contenido es una vista de planificación cruzada entre
  redes. Si en el futuro se quiere que los posts de Instagram aparezcan
  también en este calendario, el punto de unión sería agregar un
  `platform: "instagram"` implícito a cada `Post` y fusionar ambas listas
  en `calendar-view.tsx` — no fusionar los tipos.
- **Plataformas soportadas:** Instagram, TikTok, Facebook y X — las
  cuatro más comunes, fácil de ampliar agregando un valor a `Platform` y
  sus entradas en `PLATFORM_LABELS`/`PLATFORM_ICONS`/las variables CSS de
  color.
- **Sin backend todavía — datos de ejemplo estáticos, sin `localStorage`.**
  A diferencia del Gestor de Instagram, esta página es de solo lectura
  (no se pidió un formulario para agregar contenido), así que
  `seed-items.ts` no necesita persistencia — simplemente recalcula fechas
  relativas a `today()` en cada carga (`offset` en días desde hoy), para
  que siempre haya contenido visible en el mes actual sin importar cuándo
  se abra la página. Si más adelante se agrega un formulario para crear
  items, ahí sí va a hacer falta el mismo patrón de `localStorage` con
  hidratación que usa `use-posts.ts` en el Gestor de Instagram.
- **Colores por plataforma con codificación secundaria obligatoria.**
  **Decisión y por qué:** se necesitaban 4 colores categóricos que
  conviven en la misma vista (los chips de cualquier plataforma pueden
  quedar uno al lado del otro en cualquier celda), así que se validaron
  con `--pairs all` de `scripts/validate_palette.js` de la skill
  `dataviz` — no alcanza con validar solo pares adyacentes. La skill
  documenta que su paleta de 8 tonos por defecto solo garantiza las 3
  primeras posiciones "todos contra todos" en ambos modos; probé varias
  combinaciones de 4 y ninguna pasa limpio. La que mejor validó
  (`--platform-instagram: 338 61% 58%` magenta, `--platform-facebook: 213
  77% 56%` azul, `--platform-tiktok: 40 100% 39%` ámbar, `--platform-x:
  120 100% 26%` verde, en `globals.css`) pasa separación de visión normal
  (ΔE 19.3, sobre el piso de 15) pero queda en la banda 6.9 de separación
  CVD, que la skill permite **solo con codificación secundaria**. Por eso
  cada chip (`content-chip.tsx`) y cada fila del filtro
  (`platform-filter.tsx`) siempre llevan un ícono distinto por plataforma
  además del color — nunca solo el color — y el diálogo de detalle del
  día también repite el nombre de la plataforma en texto. No agregar una
  quinta plataforma sin volver a correr el validador.
- **Íconos por plataforma** (`PLATFORM_ICONS` en `types.ts`): como
  `lucide-react` no tiene íconos de marca, se usan genéricos — `Camera`
  para Instagram (mismo ícono que ya usa el sidebar), `Music2` para
  TikTok, `Users` para Facebook, `Hash` para X.
- **Chips responsive:** en pantallas angostas (`<sm`) el texto del chip
  se oculta (`hidden sm:inline`) y solo queda el ícono coloreado — con 7
  columnas en una pantalla de celular no alcanza el espacio para texto
  legible, y el texto truncado a una sola letra no aporta nada. Tocar el
  día igual abre el diálogo con el detalle completo (título + plataforma
  en texto) para cualquier tamaño de pantalla.
- **Extracción de utilidades de fecha a `src/lib/date.ts`.** Antes
  `addDays`/`diffInDays`/`toISODate`/`today` vivían dentro de
  `analytics/mock-data.ts` y `analytics/date-range.ts`. El calendario
  también los necesita (`startOfMonth`, `addMonths` se agregaron ahí
  mismo) y hubiera sido raro que `calendar/` importara utilidades
  genéricas desde adentro de `analytics/`. Se movieron a `lib/date.ts`
  como el lugar neutral correcto, y `analytics/` se actualizó para
  importar desde ahí en vez de definirlas.

## Seguimiento de Competencia (`/competitors`)

Cuarta sección con funcionalidad real. Una tabla ordenable (clic en
cualquier encabezado de columna alterna ascendente/descendente) con
Handle, Seguidores, Posts recientes (30 días), Frecuencia (por semana),
Interacción y Crecimiento (30 días) — un botón "Agregar competidor" abre
un diálogo para sumar un handle nuevo.

- **Sin backend todavía — nota visible en la página, no solo en el
  código.** **Decisión y por qué:** el usuario pidió explícitamente
  "note where I would connect a real data source later", lo cual se leyó
  como "que se vea en la página", no solo como un comentario en el
  código — alguien mirando el dashboard sin abrir el editor también
  necesita saber que los números son de ejemplo y dónde se conectaría
  algo real. Por eso existe `data-source-note.tsx`: una nota en la propia
  página (no solo en `CLAUDE.md`) que dice explícitamente que las
  estadísticas son de ejemplo y nombra el archivo exacto
  (`use-competitors.ts`) donde se generan hoy y donde se pedirían a una
  fuente real (API de Meta/Instagram, o un servicio de terceros) más
  adelante.
- **Estadísticas generadas por hash del handle** (`mock-data.ts`,
  `generateCompetitorStats`): mismo patrón de `hashString` +
  `mulberry32` que ya usaba Analítica (ahora en `lib/random.ts`) — así
  que agregar el mismo handle dos veces (en dos sesiones distintas, por
  ejemplo) da las mismas estadísticas de partida, en vez de números al
  azar sin relación entre sí. `recentPosts` se deriva de `postsPerWeek`
  (con algo de ruido) para que ambos números sean coherentes entre sí en
  vez de independientes.
- **Persistencia en `localStorage`**, mismo patrón que el Gestor de
  Instagram — ver la decisión de arriba sobre `use-local-storage-state.ts`.
  Los competidores que agregues sobreviven a un refresh de página.
- **Ordenamiento client-side** (`competitors-table.tsx`): estado
  `{ key, direction }`, clic en un header ya activo invierte la
  dirección, clic en uno nuevo usa una dirección por defecto sensata
  (descendente para las métricas — "el más grande primero" es lo que
  normalmente se quiere ver; ascendente para el handle, alfabético). No
  se usó una librería de tablas (TanStack Table, etc.) — para una sola
  tabla con 6 columnas y sin paginación ni filtros por columna, el
  `useMemo` + `.sort()` de siempre alcanza; revisar si en algún momento
  se necesita paginación o edición inline.
- **Sin eliminar competidores todavía.** Solo se pidió agregar y ver —
  no hay botón para sacar un handle de la tabla. Si se pide, seguir el
  mismo patrón de `addCompetitor` en `use-competitors.ts` (un
  `removeCompetitor` que filtra por `id`).

## Feed de Noticias (`/news`)

Quinta sección con funcionalidad real, y la única que trae **datos reales
de internet** en vez de datos de ejemplo — trae y combina varios feeds
RSS reales del rubro gourmet (café, té, delicatessen), en tarjetas
filtrables por tema.

- **Nicho: café, té y delicatessen/gourmet.** El pedido original decía
  literalmente "[your niche]" sin completar (una plantilla/guía copiada
  sin editar); se le preguntó al usuario y confirmó gastronomía en
  general primero, y después lo acotó a "gourmet (tea, coffee,
  delicatessen)" en su siguiente mensaje — eso es lo que quedó
  implementado. `TOPIC_ORDER` en `types.ts` es el lugar para agregar o
  sacar temas si esto cambia.
- **El fetch corre en el servidor, nunca en el navegador — no es
  opcional.** **Decisión y por qué:** la mayoría de los feeds RSS no
  mandan headers CORS, así que un `fetch` hecho desde un componente de
  cliente fallaría directo en el navegador contra casi cualquier fuente
  real. Por eso existe `src/app/api/news/route.ts`, un Route Handler de
  Next.js (corre en el servidor) que trae cada feed, los parsea y le
  devuelve al cliente JSON ya combinado y ordenado. `use-news.ts` en el
  cliente solo le pega a `/api/news` (mismo origen, sin problema de
  CORS). Si se agrega una fuente nueva, siempre va en `feeds.ts` y se
  trae desde la ruta de API — nunca directo desde un componente cliente.
- **Fuentes reales configuradas en `feeds.ts`:** tres feeds de Google
  News por tema (`news.google.com/rss/search?q=...`), no blogs
  individuales. **Decisión y por qué:** Google News RSS es un endpoint
  público muy estable y bien documentado que agrega muchas fuentes reales
  del rubro (Sprudge, Daily Coffee News, World Tea News, etc.) sin
  depender de que un blog puntual no haya cambiado de plataforma, no
  bloquee bots, o no haya movido su URL de feed — cosas que no se podían
  verificar desde este entorno (ver el punto siguiente). `feeds.ts` tiene
  en comentarios cómo sumar una fuente directa de un sitio específico del
  rubro (por ejemplo Sprudge o Daily Coffee News) el día que se confirme
  que esa URL de feed responde bien.
- **Limitación real de este entorno: no se pudo probar el fetch en vivo.**
  **Esto hay que saberlo antes de tocar este código.** La política de red
  saliente de este sandbox de desarrollo bloquea cualquier dominio fuera
  de una lista corta (`registry.npmjs.org`, `pypi.org`, etc. — la misma
  razón por la que `ui.shadcn.com` está bloqueado, ver "Stack técnico").
  Se probó con `curl` contra `news.google.com`, `sprudge.com` y varios
  blogs candidatos del rubro y **todos** devolvieron 403 a nivel de
  proxy — no es que esas fuentes específicas fallen, es que este sandbox
  no deja salir a ningún dominio arbitrario. La función de parseo
  (`parse-rss.ts`) se validó aparte, corriendo `fast-xml-parser`
  directamente contra fixtures de RSS 2.0 (formato Google News y formato
  WordPress genérico) y Atom escritos a mano que imitan la estructura
  real de esos formatos — así que la lógica de parseo está probada, pero
  el fetch en vivo contra las URLs reales **todavía no se verificó fuera
  de este sandbox**. Cuando esto se despliegue en un entorno con salida a
  internet normal (Vercel, la computadora del usuario, etc.), verificar
  una vez que `/api/news` efectivamente trae resultados — si Google News
  cambiara su formato de RSS o alguna query dejara de traer resultados,
  ese es el primer lugar donde mirar.
- **Google News RSS repite el título en la descripción — se detecta y se
  descarta.** Al armar el fixture de prueba (a partir de ejemplos reales
  conocidos de Google News RSS) se notó que su `<description>` no es un
  resumen real: es el título de vuelta más el nombre de la fuente pegado
  al final. `dedupeSummary()` en `parse-rss.ts` detecta cuando el
  "resumen" arranca igual que el título y lo descarta — la tarjeta
  (`news-card.tsx`) simplemente no muestra el párrafo de resumen en ese
  caso, en vez de mostrar el título duplicado como si fuera un resumen.
  Los feeds que si traen un resumen real (formato WordPress típico, Atom)
  no se ven afectados.
- **Resiliente por fuente, no todo-o-nada.** `route.ts` usa
  `Promise.allSettled` sobre los tres feeds — si uno falla (o los tres),
  los que sí respondieron se muestran igual, y `failedSources` en la
  respuesta lista cuáles fallaron para que la página lo muestre como una
  nota chica, no como un error bloqueante. Se verificó exactamente este
  camino en este sandbox (ya que acá los tres feeds fallan siempre por la
  limitación de red): la página muestra la nota de fuentes fallidas y un
  estado vacío prolijo, sin romperse.
- **Caché de 15 minutos** (`NEWS_CACHE_SECONDS` en `feeds.ts`), vía la
  opción `next: { revalidate }` del `fetch` de Next.js — para no golpear
  los feeds reales en cada carga de la página.
- **Filtro por tema, sin colores por tema.** A diferencia del Calendario
  (que sí necesitaba color por plataforma porque los chips conviven sin
  espacio para texto), acá cada botón de filtro y cada tarjeta ya llevan
  ícono + texto siempre visibles, así que no hacía falta validar una
  paleta categórica nueva — se usó el mismo tratamiento de "activo" que
  ya usa el resto de la app (fondo con tinte de `--primary`).
- **Filtrado client-side, sin re-fetch.** Cambiar de tema no dispara una
  llamada nueva a `/api/news` — se filtra el arreglo ya cargado en
  memoria. Coherente con la skill `dataviz` aunque esto no sea un
  gráfico: cambiar un filtro nunca debería mostrar un skeleton de nuevo.
- **Estados de carga/error explícitos** (`news-feed-view.tsx`): skeleton
  animado mientras `status === "loading"`, tarjeta de error con botón
  "Reintentar" si el fetch a `/api/news` falla del todo, y "no hay
  noticias para los temas seleccionados" si el filtro no deja nada. El
  botón "Actualizar" del header dispara un refetch manual.

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
- **Cualquier dominio fuera de una lista corta (`registry.npmjs.org`,
  `pypi.org`, etc.) está bloqueado por la misma política de proxy** — no
  solo `ui.shadcn.com`. Se confirmó probando con `curl` contra
  `news.google.com`, `sprudge.com` y otros sitios del rubro gourmet para
  Feed de Noticias: los tres devolvieron 403 a nivel de proxy. Esto
  importa para cualquier función que necesite `fetch` a internet en algún
  momento futuro (no solo RSS) — no se va a poder probar el fetch en vivo
  desde este sandbox de desarrollo; sí va a funcionar una vez desplegado
  en un entorno normal (Vercel, la computadora de quien lo use, etc.).
  Ver la sección "Feed de Noticias" para cómo se validó la lógica de
  todos modos (con fixtures, sin red real).
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
- Calendario de Contenido verificado manualmente en navegador headless:
  la grilla muestra el mes actual con "hoy" resaltado; navegar entre
  meses y volver con "Hoy" funciona; desactivar una plataforma en el
  filtro oculta sus chips en toda la grilla sin errores; hacer clic en un
  día con varios items abre el diálogo con el detalle completo (ícono +
  título + nombre de plataforma); en móvil los chips colapsan a solo
  ícono (sin texto truncado a una letra) y tocar el día sigue mostrando
  el detalle completo.
- Seguimiento de Competencia verificado manualmente en navegador
  headless: hacer clic en un encabezado de columna ordena la tabla y
  vuelve a hacer clic invierte el orden; agregar un competidor nuevo lo
  suma a la tabla con estadísticas coherentes entre sí; el competidor
  agregado persiste después de recargar la página (confirma
  `localStorage`); sin errores en consola.
- Feed de Noticias verificado en dos partes, por la limitación de red de
  este sandbox (ver "Limitaciones"): (1) la ruta de API y el parseo se
  probaron end-to-end sirviendo los fixtures de RSS/Atom desde un
  servidor HTTP local y apuntando `feeds.ts` ahí temporalmente — la
  página mostró las tarjetas correctamente (badge de tema, headline,
  fuente, fecha, resumen cuando lo hay, sin resumen duplicado en los
  ítems estilo Google News), el filtro por tema funcionó sin re-fetch, y
  el layout respondió bien en móvil; después se revirtió `feeds.ts` a las
  URLs reales de Google News. (2) Contra las URLs reales (que fallan acá
  por la red del sandbox, no por un bug), se confirmó que `/api/news`
  responde `200` con `items: []` y `failedSources` listando las tres
  fuentes, y que la página lo muestra de forma prolija (nota de fuentes
  fallidas + estado vacío), sin romperse. Falta confirmar el camino feliz
  contra las URLs reales fuera de este sandbox.

## Desplegar en un hosting con cPanel (sin Vercel)

El usuario tiene hosting propio (cPanel, con la sección "Node.js" / "Setup
Node.js App" tipo Passenger) y prefirió usarlo en vez de Vercel. Ese panel
no tenía "Terminal" — solo el Administrador de archivos y la pantalla de
Node.js — así que no se puede correr `npm install` ni `npm run build` en
el servidor. La solución fue el modo `output: "standalone"` de Next.js
(activado en `next.config.mjs`).

- **Qué hace `output: "standalone"`:** al correr `npm run build`, además
  del build normal genera `.next/standalone/` — una carpeta autocontenida
  con su propio `server.js` (generado por Next, no el `server.js` de la
  raíz del proyecto — ver el punto siguiente) y **solo** los
  `node_modules` que se usan de verdad en producción (no las
  devDependencies ni nada de build-time). Está pensada exactamente para
  este caso: hostings donde no se puede correr `npm install` en el
  servidor. Hay que copiar a mano `.next/static` adentro de
  `.next/standalone/.next/static` (y `public/` si existiera — este
  proyecto no tiene carpeta `public/`) porque el modo standalone no los
  incluye solo, para no duplicar esos archivos en otros modos de
  despliegue.
- **Dos `server.js` distintos, a propósito:**
  - `dashboard/server.js` (en la raíz del proyecto, committeado): para un
    hosting que sí tiene terminal/SSH y puede correr
    `npm install && npm run build && node server.js` directo, sin modo
    standalone.
  - `.next/standalone/server.js`: generado automáticamente por Next en
    cada build standalone, no se edita a mano ni se committea (vive
    dentro de `.next/`, que está en `.gitignore`). Es el que se usa en el
    despliegue real a Tecno Inver.
- **Proceso para generar el paquete a subir** (lo hace Claude, no es algo
  que el usuario tenga que correr):
  ```bash
  cd dashboard
  rm -rf .next
  npm run build
  cp -r .next/static .next/standalone/.next/static
  # empaquetar .next/standalone/ (con ese contenido) en un .zip y
  # mandárselo al usuario para que lo suba por el Administrador de
  # archivos de cPanel.
  ```
- **Pasos que hace el usuario en cPanel** (repetir cada vez que Claude
  manda un .zip nuevo):
  1. Administrador de archivos → subir el `.zip` → extraerlo.
  2. Node.js → "Create Application" (o editar la app ya creada):
     - Versión de Node.js: 18.x o más nueva (Next 14 pide >=18.17).
     - Modo: Production.
     - Application root: la carpeta donde se extrajo el `.zip`.
     - Application startup file: `server.js` (relativo a esa carpeta).
     - Application URL: el dominio o subdominio donde se quiere ver el
       dashboard.
  3. **No hace falta tocar "Run NPM Install"** — todo lo necesario ya
     viene adentro del `.zip`. Si ya existe una versión previa corriendo,
     alcanza con "Restart".
  4. No hacen falta variables de entorno — el proyecto no usa ninguna
     todavía.
- Cada vez que se agregue una sección o se cambie algo, hay que repetir
  el proceso completo (rebuild acá, nuevo `.zip`, el usuario lo sube y le
  da "Restart") — este hosting no se actualiza solo con cada `git push`
  como pasaría con Vercel. Si en algún momento se vuelve tedioso, ese es
  el argumento a favor de reconsiderar Vercel (o de configurar un cron
  de cPanel que haga `git pull` + build si el hosting lo permite — no
  evaluado todavía).

## Comandos

```bash
cd dashboard
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm run start:cpanel  # node server.js — para probar el server.js de la raíz, no el standalone
```
