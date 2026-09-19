"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TOPIC_ICONS, TOPIC_LABELS, TOPIC_ORDER, type NewsTopic } from "./types";

interface TopicFilterProps {
  active: Set<NewsTopic>;
  onToggle: (topic: NewsTopic) => void;
  onReset: () => void;
}

export function TopicFilter({ active, onToggle, onReset }: TopicFilterProps) {
  const allActive = active.size === TOPIC_ORDER.length;

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
      {TOPIC_ORDER.map((topic) => {
        const Icon = TOPIC_ICONS[topic];
        const isActive = active.has(topic);
        return (
          <button
            key={topic}
            type="button"
            onClick={() => onToggle(topic)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
              isActive
                ? "border-primary/40 bg-primary/15 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {TOPIC_LABELS[topic]}
          </button>
        );
      })}
    </div>
  );
}
