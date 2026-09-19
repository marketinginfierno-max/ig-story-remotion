import { addDays, diffInDays, toISODate, today } from "@/lib/date";

export type DateRangePreset = "today" | "7d" | "30d" | "90d" | "month" | "custom";

export interface DateRangeValue {
  preset: DateRangePreset;
  start: Date;
  end: Date;
}

export const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  month: "Este mes",
  custom: "Personalizado",
};

export const PRESET_ORDER: Exclude<DateRangePreset, "custom">[] = [
  "today",
  "7d",
  "30d",
  "90d",
  "month",
];

export function getPresetRange(preset: Exclude<DateRangePreset, "custom">): DateRangeValue {
  const end = today();
  switch (preset) {
    case "today":
      return { preset, start: end, end };
    case "7d":
      return { preset, start: addDays(end, -6), end };
    case "30d":
      return { preset, start: addDays(end, -29), end };
    case "90d":
      return { preset, start: addDays(end, -89), end };
    case "month": {
      const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
      return { preset, start, end };
    }
  }
}

export function getPreviousPeriod(range: DateRangeValue): { start: Date; end: Date } {
  const days = diffInDays(range.end, range.start) + 1;
  const end = addDays(range.start, -1);
  const start = addDays(end, -(days - 1));
  return { start, end };
}

export function formatRangeLabel(range: DateRangeValue): string {
  const fmt = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" });
  const fmtWithYear = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (toISODate(range.start) === toISODate(range.end)) {
    return fmtWithYear.format(range.start);
  }
  const sameYear = range.start.getUTCFullYear() === range.end.getUTCFullYear();
  const startLabel = sameYear ? fmt.format(range.start) : fmtWithYear.format(range.start);
  return `${startLabel} – ${fmtWithYear.format(range.end)}`;
}
