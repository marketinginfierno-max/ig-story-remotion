import { addDays, startOfMonth, toISODate } from "@/lib/date";
import type { ContentItem } from "./types";
import { DayCell } from "./day-cell";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getMonthGridDays(monthDate: Date): Date[] {
  const firstOfMonth = startOfMonth(monthDate);
  const firstWeekday = firstOfMonth.getUTCDay(); // 0 = domingo
  const mondayOffset = (firstWeekday + 6) % 7; // días a retroceder hasta el lunes
  const gridStart = addDays(firstOfMonth, -mondayOffset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

interface MonthGridProps {
  month: Date;
  todayISO: string;
  itemsByDate: Map<string, ContentItem[]>;
  onOpenDay: (date: Date, items: ContentItem[]) => void;
}

export function MonthGrid({ month, todayISO, itemsByDate, onOpenDay }: MonthGridProps) {
  const days = getMonthGridDays(month);
  const currentMonthIndex = month.getUTCMonth();

  return (
    <div className="overflow-hidden rounded-lg border-l border-t border-border">
      <div className="grid grid-cols-7 border-b border-border bg-card/40">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-r border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const iso = toISODate(date);
          return (
            <DayCell
              key={iso}
              date={date}
              inCurrentMonth={date.getUTCMonth() === currentMonthIndex}
              isToday={iso === todayISO}
              items={itemsByDate.get(iso) ?? []}
              onOpenDay={onOpenDay}
            />
          );
        })}
      </div>
    </div>
  );
}
