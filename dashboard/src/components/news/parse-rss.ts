import { XMLParser } from "fast-xml-parser";

import { hashString } from "@/lib/random";
import type { NewsItem, NewsTopic } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

function textOf(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record["#text"] === "string") return record["#text"];
  }
  return "";
}

function linkOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    // Atom puede traer varios <link>; se prioriza rel="alternate" o el primero con @_href.
    const alt = value.find(
      (v) => typeof v === "object" && (v as Record<string, unknown>)["@_rel"] === "alternate"
    );
    const chosen = alt ?? value[0];
    return linkOf(chosen);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record["@_href"] === "string") return record["@_href"];
    if (typeof record["#text"] === "string") return record["#text"];
  }
  return "";
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function safeISODate(raw: unknown): string {
  const str = textOf(raw);
  const parsed = str ? new Date(str) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
}

function buildId(topic: NewsTopic, url: string, headline: string): string {
  return `news-${Math.abs(hashString(url || headline)).toString(36)}`;
}

// Google News RSS pone el título repetido dentro de <description> (más el
// nombre de la fuente pegado al final) en vez de un resumen real. Si el
// "resumen" no es más que el título de vuelta, se descarta — mejor no
// mostrar nada que mostrar el título duplicado como si fuera un resumen.
function dedupeSummary(headline: string, summary: string): string {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const headSample = normalize(headline).slice(0, 40);
  if (headSample.length > 0 && normalize(summary).startsWith(headSample)) return "";
  return summary;
}

/**
 * Convierte el XML crudo de un feed RSS 2.0 o Atom en una lista normalizada
 * de NewsItem. Soporta ambos formatos porque no todos los sitios del rubro
 * usan el mismo (la mayoría de blogs en WordPress usan RSS 2.0; algunos
 * sistemas más nuevos usan Atom).
 */
export function parseFeedXml(xml: string, fallbackLabel: string, topic: NewsTopic): NewsItem[] {
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch {
    return [];
  }

  const root = parsed as Record<string, unknown>;

  // RSS 2.0: <rss><channel><item>...
  const channel = (root.rss as Record<string, unknown> | undefined)?.channel as
    | Record<string, unknown>
    | undefined;
  if (channel) {
    const items = toArray(channel.item as unknown);
    return items
      .map((item) => {
        const record = item as Record<string, unknown>;
        const headline = decodeEntities(textOf(record.title).trim());
        if (!headline) return null;

        const url = linkOf(record.link);
        const sourceTag = record.source as unknown;
        const source =
          (typeof sourceTag === "object" ? textOf(sourceTag) : undefined) || fallbackLabel;

        const rawSummary = record.description ?? record["content:encoded"] ?? "";
        const summary = dedupeSummary(
          headline,
          truncate(decodeEntities(stripHtml(textOf(rawSummary))), 220)
        );

        const publishedAt = safeISODate(record.pubDate ?? record["dc:date"]);

        const newsItem: NewsItem = {
          id: buildId(topic, url, headline),
          headline,
          source,
          url,
          publishedAt,
          summary,
          topic,
        };
        return newsItem;
      })
      .filter((item): item is NewsItem => item !== null);
  }

  // Atom: <feed><entry>...
  const feed = root.feed as Record<string, unknown> | undefined;
  if (feed) {
    const entries = toArray(feed.entry as unknown);
    return entries
      .map((entry) => {
        const record = entry as Record<string, unknown>;
        const headline = decodeEntities(textOf(record.title).trim());
        if (!headline) return null;

        const url = linkOf(record.link);
        const author = record.author as Record<string, unknown> | undefined;
        const source = (author ? textOf(author.name) : "") || fallbackLabel;

        const rawSummary = record.summary ?? record.content ?? "";
        const summary = truncate(decodeEntities(stripHtml(textOf(rawSummary))), 220);

        const publishedAt = safeISODate(record.published ?? record.updated);

        const newsItem: NewsItem = {
          id: buildId(topic, url, headline),
          headline,
          source,
          url,
          publishedAt,
          summary,
          topic,
        };
        return newsItem;
      })
      .filter((item): item is NewsItem => item !== null);
  }

  return [];
}
