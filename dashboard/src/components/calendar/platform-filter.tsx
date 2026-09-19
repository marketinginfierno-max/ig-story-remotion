"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PLATFORM_ICONS,
  PLATFORM_LABELS,
  PLATFORM_ORDER,
  platformColor,
  type Platform,
} from "./types";

interface PlatformFilterProps {
  active: Set<Platform>;
  onToggle: (platform: Platform) => void;
  onReset: () => void;
}

export function PlatformFilter({ active, onToggle, onReset }: PlatformFilterProps) {
  const allActive = active.size === PLATFORM_ORDER.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={allActive ? "secondary" : "ghost"}
        size="sm"
        className="h-8 text-xs"
        onClick={onReset}
      >
        Todas
      </Button>
      {PLATFORM_ORDER.map((platform) => {
        const Icon = PLATFORM_ICONS[platform];
        const isActive = active.has(platform);
        return (
          <button
            key={platform}
            type="button"
            onClick={() => onToggle(platform)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
              isActive
                ? "border-transparent text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            style={
              isActive
                ? {
                    backgroundColor: platformColor(platform, 0.15),
                    borderColor: platformColor(platform, 0.4),
                  }
                : undefined
            }
          >
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: isActive ? platformColor(platform) : undefined }}
            />
            {PLATFORM_LABELS[platform]}
          </button>
        );
      })}
    </div>
  );
}
