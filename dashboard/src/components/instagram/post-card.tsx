import { CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { POST_TYPE_ICONS, POST_TYPE_LABELS, type Post } from "./types";

function formatScheduledDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PostCard({ post }: { post: Post }) {
  const Icon = POST_TYPE_ICONS[post.type];

  return (
    <Card className="bg-card/60 transition-colors hover:border-primary/40">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 p-4 pb-0">
        <Badge variant="outline" className="gap-1.5 font-normal text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {POST_TYPE_LABELS[post.type]}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4 pt-3">
        <p className="line-clamp-4 text-sm leading-relaxed text-foreground">
          {post.caption}
        </p>
        {post.scheduledDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatScheduledDate(post.scheduledDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
