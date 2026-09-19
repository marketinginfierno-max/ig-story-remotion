import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIC_ICONS, TOPIC_LABELS, type NewsItem } from "./types";
import { formatPublished } from "./format-published";

export function NewsCard({ item }: { item: NewsItem }) {
  const Icon = TOPIC_ICONS[item.topic];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full bg-card/60 transition-colors hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 p-4 pb-0">
          <Badge variant="outline" className="gap-1.5 font-normal text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            {TOPIC_LABELS[item.topic]}
          </Badge>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4 pt-3">
          <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-foreground">
            {item.headline}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{item.source}</span>
            <span>·</span>
            <span className="shrink-0">{formatPublished(item.publishedAt)}</span>
          </div>
          {item.summary && (
            <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
