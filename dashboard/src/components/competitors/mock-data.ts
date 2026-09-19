// Estadísticas de ejemplo, sin backend todavía — ver CLAUDE.md, sección
// "Seguimiento de Competencia". Se derivan de un hash del handle (mismo
// patrón que analytics/mock-data.ts), así que agregar el mismo handle da
// siempre las mismas estadísticas de partida, en vez de números al azar
// distintos cada vez.

import { hashString, mulberry32 } from "@/lib/random";
import type { Competitor } from "./types";

const SEED_HANDLES = [
  "@sabor.urbano",
  "@cocinafresca.ok",
  "@delicias.express",
  "@gustoreal",
  "@mesalinda.oficial",
];

export function generateCompetitorStats(
  handle: string
): Omit<Competitor, "id" | "handle" | "addedAt"> {
  const rand = mulberry32(hashString(handle));

  const followers = Math.round(3000 + rand() * 250000);
  const postsPerWeek = Number((1 + rand() * 6).toFixed(1));
  const recentPosts = Math.round((postsPerWeek * 30) / 7 + (rand() - 0.5) * 4);
  const engagementRate = Number((1 + rand() * 7).toFixed(1));
  const growthPercent = Number(((rand() - 0.35) * 10).toFixed(1));

  return {
    followers,
    recentPosts: Math.max(0, recentPosts),
    postsPerWeek,
    engagementRate,
    growthPercent,
  };
}

function normalizeHandle(input: string): string {
  const trimmed = input.trim().replace(/^@/, "");
  return `@${trimmed}`;
}

export function createCompetitor(handleInput: string): Competitor {
  const handle = normalizeHandle(handleInput);
  return {
    id: crypto.randomUUID(),
    handle,
    addedAt: new Date().toISOString(),
    ...generateCompetitorStats(handle),
  };
}

export function getSeedCompetitors(): Competitor[] {
  return SEED_HANDLES.map((handle, index) => ({
    id: `seed-${index}`,
    handle,
    addedAt: new Date(2026, 0, index + 1).toISOString(),
    ...generateCompetitorStats(handle),
  }));
}
