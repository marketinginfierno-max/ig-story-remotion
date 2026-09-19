import { addDays, today, toISODate } from "@/lib/date";
import type { ContentItem, Platform } from "./types";

// Datos de ejemplo, sin backend todavía — ver CLAUDE.md, sección "Calendario
// de Contenido". Las fechas se calculan en relación a "hoy" (no están
// escritas a mano) para que el calendario siempre muestre contenido en el
// mes actual, sin importar cuándo se abra la página.
const SEED_OFFSETS: Array<{ offset: number; platform: Platform; title: string }> = [
  { offset: -12, platform: "instagram", title: "Recap del evento de la semana pasada" },
  { offset: -9, platform: "facebook", title: "Anuncio de horario especial" },
  { offset: -7, platform: "tiktok", title: "Detrás de cámaras del rodaje" },
  { offset: -5, platform: "instagram", title: "Testimonio de cliente" },
  { offset: -5, platform: "x", title: "Hilo: 5 tips rápidos" },
  { offset: -3, platform: "tiktok", title: "Reto viral del momento" },
  { offset: -1, platform: "facebook", title: "Encuesta a la comunidad" },
  { offset: 0, platform: "instagram", title: "Post del día: lanzamiento" },
  { offset: 0, platform: "x", title: "Anuncio breve del lanzamiento" },
  { offset: 2, platform: "tiktok", title: "Unboxing de la nueva colección" },
  { offset: 4, platform: "instagram", title: "Carrusel: antes y después" },
  { offset: 4, platform: "facebook", title: "Nota de prensa" },
  { offset: 6, platform: "x", title: "Respuesta a preguntas frecuentes" },
  { offset: 8, platform: "instagram", title: "Historia: encuesta rápida" },
  { offset: 8, platform: "tiktok", title: "Tutorial en 30 segundos" },
  { offset: 11, platform: "facebook", title: "Colaboración con influencer local" },
  { offset: 13, platform: "instagram", title: "Reel: resumen del mes" },
  { offset: 15, platform: "x", title: "Encuesta: próximo sabor" },
  { offset: 18, platform: "tiktok", title: "Detrás de cámaras del equipo" },
  { offset: 20, platform: "instagram", title: "Anuncio de colaboración" },
  { offset: 22, platform: "facebook", title: "Recordatorio de evento" },
  { offset: 25, platform: "instagram", title: "Post de cierre de mes" },
];

export function getSeedItems(): ContentItem[] {
  const base = today();
  return SEED_OFFSETS.map(({ offset, platform, title }, index) => ({
    id: `seed-${index}`,
    title,
    platform,
    date: toISODate(addDays(base, offset)),
  }));
}
