export function formatPublished(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "hace instantes";
  if (diffHours < 24) return `hace ${Math.round(diffHours)} h`;
  if (diffHours < 24 * 7) return `hace ${Math.round(diffHours / 24)} d`;

  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(date);
}
