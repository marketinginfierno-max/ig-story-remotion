import { PLATFORM_ICONS, platformColor, type ContentItem } from "./types";

export function ContentChip({ item }: { item: ContentItem }) {
  const Icon = PLATFORM_ICONS[item.platform];

  return (
    <div
      className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] leading-tight text-foreground sm:px-1.5"
      style={{ backgroundColor: platformColor(item.platform, 0.15) }}
    >
      <Icon
        className="h-3 w-3 shrink-0"
        style={{ color: platformColor(item.platform) }}
      />
      <span className="hidden truncate sm:inline">{item.title}</span>
    </div>
  );
}
