# Plantilla de Historias Diarias (Remotion)

Video vertical 1080x1920 (formato Instagram Stories/Reels) generado 100% por codigo, sin costo de renderizado (corre en tu maquina).

## Uso

```bash
npm install
npm run start      # abre Remotion Studio para previsualizar y editar en vivo
npm run render     # renderiza out/daily-story.mp4 listo para subir
npm run still      # exporta un frame como PNG (util si solo quieres una imagen fija)
```

## Como cambiar el contenido cada dia

Todo el texto y los colores estan en `defaultProps` dentro de `src/Root.tsx`:

- `headline`: titulo principal
- `subtext`: texto de apoyo
- `badge`: etiqueta pequeña arriba (ej: "HOY", "NUEVO", "OFERTA")
- `bgColorFrom` / `bgColorTo`: gradiente de fondo
- `accentColor`: color del badge y la barra de progreso

No necesitas tocar `DailyStory.tsx` para cambiar el contenido diario — solo edita esos valores (o pasa props distintas al renderizar con `--props`).

Ejemplo para renderizar con contenido distinto sin editar el archivo:

```bash
npx remotion render src/index.ts DailyStory out/story-lunes.mp4 --props='{"headline":"Lunes de pasta","subtext":"2x1 en pastas artesanales solo hoy","badge":"PROMO"}'
```

## Siguientes pasos sugeridos

- Agregar una imagen/foto de producto de fondo con el componente `<Img>` de Remotion.
- Agregar un logo con `<Img src={staticFile("logo.png")} />` (coloca el logo en una carpeta `public/`).
- Crear una composicion por dia de la semana duplicando `DailyStory.tsx`.
- Conectar esto a un script que genere el video automaticamente cada mañana (por ejemplo con una tarea programada) y lo suba a Instagram.

## Notas

- Requiere Node.js instalado. El primer render descarga un Chromium headless (Remotion lo hace automatico).
- Gratis para uso individual o equipos de hasta 3 personas segun la licencia de Remotion.
