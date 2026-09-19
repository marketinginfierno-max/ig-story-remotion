import type { NewsTopic } from "./types";

export interface FeedSource {
  url: string;
  label: string;
  topic: NewsTopic;
}

// Fuentes reales de RSS para el nicho gourmet (café, té, delicatessen). Se
// priorizan feeds de Google News por tema, que son un endpoint muy estable
// (no dependen de que un blog puntual no haya cambiado de plataforma o
// bloquee bots) — ver CLAUDE.md, sección "Feed de Noticias", para el porqué
// de esta elección y las limitaciones de este entorno para probarla en vivo.
//
// Para agregar una fuente directa de un sitio específico del rubro en vez
// de (o además de) Google News, solo hace falta sumar otra entrada acá con
// su URL de RSS real, por ejemplo:
//   { url: "https://sprudge.com/feed", label: "Sprudge", topic: "coffee" }
//   { url: "https://dailycoffeenews.com/feed/", label: "Daily Coffee News", topic: "coffee" }
//   { url: "https://worldteanews.com/feed/", label: "World Tea News", topic: "tea" }
export const FEED_SOURCES: FeedSource[] = [
  {
    url: "https://news.google.com/rss/search?q=specialty+coffee+industry&hl=en-US&gl=US&ceid=US:en",
    label: "Google News",
    topic: "coffee",
  },
  {
    url: "https://news.google.com/rss/search?q=specialty+tea+industry&hl=en-US&gl=US&ceid=US:en",
    label: "Google News",
    topic: "tea",
  },
  {
    url: "https://news.google.com/rss/search?q=gourmet+delicatessen+food&hl=en-US&gl=US&ceid=US:en",
    label: "Google News",
    topic: "delicatessen",
  },
];

export const NEWS_CACHE_SECONDS = 900; // 15 minutos
