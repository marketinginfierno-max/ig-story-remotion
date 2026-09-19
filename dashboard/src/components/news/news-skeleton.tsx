import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NewsCardSkeleton() {
  return (
    <Card className="bg-card/60">
      <CardHeader className="space-y-0 p-4 pb-0">
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4 pt-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
