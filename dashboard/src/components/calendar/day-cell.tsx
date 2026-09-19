"use client";

import { cn } from "@/lib/utils";
import type { ContentItem } from "./types";
import { ContentChip } from "./content-chip";

const MAX_VISIBLE_CHIPS = 3;

interface DayCellProps {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  items: ContentItem[];
  onOpenDay: (date: Date, items: ContentItem[]) => void;
}

export function DayCell({ date, inCurrentMonth, isToday, items, onOpenDay }: DayCellProps) {
  const visible = items.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = items.length - visible.length;
  const hasItems = items.length > 0;

  return (
    <div
      onClick={() => hasItems && onOpenDay(date, items)}
      className={cn(
        "flex min-h-[92px] flex-col gap-1 border-b border-r border-border p-1.5 sm:min-h-[112px] sm:p-2",
        hasItems && "cursor-pointer hover:bg-accent/30"
      )}
    >
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
          inCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
          isToday && "bg-primary font-semibold text-primary-foreground"
        )}
      >
        {date.getUTCDate()}
      </span>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        {visible.map((item) => (
          <ContentChip key={item.id} item={item} />
        ))}
        {overflowCount > 0 && (
          <span className="px-1 text-[11px] text-muted-foreground">
            +{overflowCount} más
          </span>
        )}
      </div>
    </div>
  );
}
