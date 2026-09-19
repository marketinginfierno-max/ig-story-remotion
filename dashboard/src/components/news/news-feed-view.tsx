"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNews } from "./use-news";
import { TopicFilter } from "./topic-filter";
import { NewsCard } from "./news-card";
import { NewsCardSkeleton } from "./news-skeleton";
import { TOPIC_ORDER, type NewsTopic } from "./types";

export function NewsFeedView() {
  const { items, failedSources, status, refetch } = useNews();
  const [activeTopics, setActiveTopics] = React.useState<Set<NewsTopic>>(
    () => new Set(TOPIC_ORDER)
  );

  function toggleTopic(topic: NewsTopic) {
    setActiveTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  const visibleItems = items.filter((item) => activeTopics.has(item.topic));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Feed de Noticias"
          description="Lo último del mundo del café, el té y los productos gourmet/delicatessen."
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={refetch}
          disabled={status === "loading"}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", status === "loading" && "animate-spin")} />
          Actualizar
        </Button>
      </div>

      <TopicFilter
        active={activeTopics}
        onToggle={toggleTopic}
        onReset={() => setActiveTopics(new Set(TOPIC_ORDER))}
      />

      {failedSources.length > 0 && status !== "loading" && (
        <p className="text-xs text-muted-foreground">
          No se pudieron cargar algunas fuentes ({failedSources.join(", ")}). Se muestran las que
          sí respondieron.
        </p>
      )}

      {status === "error" ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">
            No se pudieron cargar las noticias. Puede ser un problema de red temporal.
          </p>
          <Button variant="outline" size="sm" onClick={refetch}>
            Reintentar
          </Button>
        </div>
      ) : status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No hay noticias para los temas seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
