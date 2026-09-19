// Datos de ejemplo deterministas: cada día se deriva de su propia fecha (hash +
// PRNG con semilla), así que los números son estables entre renders y recargas
// en vez de cambiar aleatoriamente cada vez. No hay backend de analítica todavía —
// ver CLAUDE.md, sección "Analítica", para el detalle completo.

import { addDays, diffInDays, toISODate } from "@/lib/date";
import { hashString, mulberry32 } from "@/lib/random";

const ANCHOR_DATE = new Date(Date.UTC(2024, 0, 1));
const BASE_FOLLOWERS = 18500;

// Domingo(0) .. sábado(6): más alcance/interacción hacia el fin de semana.
const REACH_DOW_MULTIPLIER = [0.92, 0.95, 1.0, 1.0, 1.05, 1.22, 1.18];
const ENGAGEMENT_DOW_OFFSET = [-0.2, -0.1, 0, 0.1, 0.3, 0.6, 0.5];

export interface DailyMetrics {
  date: string;
  reach: number;
  engagementRate: number;
  postsPublished: number;
  followerDelta: number;
}

function dailyMetrics(date: Date): DailyMetrics {
  const iso = toISODate(date);
  const dow = date.getUTCDay();
  const dayIndex = diffInDays(date, ANCHOR_DATE);

  const rand = mulberry32(hashString(iso));
  const randReach = rand();
  const randEngagement = rand();
  const randPosts = rand();
  const randFollowers = rand();

  const reachTrend = 2800 + dayIndex * 2;
  const reach = Math.max(
    300,
    Math.round(
      reachTrend * REACH_DOW_MULTIPLIER[dow] * (1 + (randReach - 0.5) * 0.3)
    )
  );

  // Coeficiente pequeño a propósito: dayIndex crece sin límite (ANCHOR_DATE es
  // fija), así que un incremento diario grande satura el clamp de abajo y
  // aplana el gráfico para cualquier rango "reciente" — ver CLAUDE.md.
  const engagementTrend = 3.4 + dayIndex * 0.0015;
  const engagementRate = Math.min(
    9.5,
    Math.max(
      1.2,
      Number(
        (
          engagementTrend +
          ENGAGEMENT_DOW_OFFSET[dow] +
          (randEngagement - 0.5) * 1.4
        ).toFixed(2)
      )
    )
  );

  const postsRoll = randPosts;
  const postsPublished = postsRoll < 0.25 ? 0 : postsRoll < 0.6 ? 1 : postsRoll < 0.9 ? 2 : 3;

  const followerDelta = Math.round(
    6 + dayIndex * 0.04 + (REACH_DOW_MULTIPLIER[dow] - 1) * 40 + (randFollowers - 0.4) * 20
  );

  return { date: iso, reach, engagementRate, postsPublished, followerDelta };
}

export function seriesForRange(start: Date, end: Date): DailyMetrics[] {
  const days = diffInDays(end, start) + 1;
  return Array.from({ length: days }, (_, i) => dailyMetrics(addDays(start, i)));
}

export function followersAt(date: Date): number {
  const days = diffInDays(date, ANCHOR_DATE) + 1;
  let total = BASE_FOLLOWERS;
  for (let i = 0; i < days; i++) {
    total += dailyMetrics(addDays(ANCHOR_DATE, i)).followerDelta;
  }
  return total;
}

export { formatCompactNumber, formatNumber, formatPercent } from "@/lib/format";
