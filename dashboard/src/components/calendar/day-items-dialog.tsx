"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLATFORM_ICONS, PLATFORM_LABELS, platformColor, type ContentItem } from "./types";

function formatDialogDate(date: Date) {
  const formatted = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

interface DayItemsDialogProps {
  date: Date | null;
  items: ContentItem[];
  onOpenChange: (open: boolean) => void;
}

export function DayItemsDialog({ date, items, onOpenChange }: DayItemsDialogProps) {
  return (
    <Dialog open={date !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date ? formatDialogDate(date) : ""}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = PLATFORM_ICONS[item.platform];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border border-border p-3"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: platformColor(item.platform, 0.15) }}
                >
                  <Icon className="h-4 w-4" style={{ color: platformColor(item.platform) }} />
                </span>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm text-foreground">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {PLATFORM_LABELS[item.platform]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
