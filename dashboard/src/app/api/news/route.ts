import { NextResponse } from "next/server";

import { FEED_SOURCES, NEWS_CACHE_SECONDS } from "@/components/news/feeds";
import { parseFeedXml } from "@/components/news/parse-rss";
import type { NewsItem } from "@/components/news/types";

// Corre en el servidor (nunca en el navegador): la mayoría de los feeds RSS
// no traen headers CORS, así que un fetch desde el cliente fallaría. Ver
// CLAUDE.md, sección "Feed de Noticias".
export async function GET() {
  const results = await Promise.allSettled(
    FEED_SOURCES.map(async (source) => {
      const res = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ContentDashboardBot/1.0)",
          Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
        },
        next: { revalidate: NEWS_CACHE_SECONDS },
      });
      if (!res.ok) {
        throw new Error(`${source.url} respondió ${res.status}`);
      }
      const xml = await res.text();
      return parseFeedXml(xml, source.label, source.topic);
    })
  );

  const items: NewsItem[] = [];
  const failedSources: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      const source = FEED_SOURCES[index];
      failedSources.push(source.label);
    }
  });

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return NextResponse.json({ items, failedSources });
}
