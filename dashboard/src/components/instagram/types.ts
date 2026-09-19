import { Clapperboard, GalleryHorizontal, CircleDashed, type LucideIcon } from "lucide-react";

export type PostType = "reel" | "carousel" | "story";
export type PostStatus = "idea" | "draft" | "ready" | "scheduled" | "posted";

export interface Post {
  id: string;
  caption: string;
  type: PostType;
  status: PostStatus;
  scheduledDate: string | null;
  createdAt: string;
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  reel: "Reel",
  carousel: "Carrusel",
  story: "Historia",
};

export const POST_TYPE_ICONS: Record<PostType, LucideIcon> = {
  reel: Clapperboard,
  carousel: GalleryHorizontal,
  story: CircleDashed,
};

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Borrador",
  ready: "Listo",
  scheduled: "Programado",
  posted: "Publicado",
};

export const POST_STATUS_DOT_CLASSES: Record<PostStatus, string> = {
  idea: "bg-slate-400",
  draft: "bg-amber-400",
  ready: "bg-sky-400",
  scheduled: "bg-violet-400",
  posted: "bg-emerald-400",
};

export const POST_STATUS_ORDER: PostStatus[] = [
  "idea",
  "draft",
  "ready",
  "scheduled",
  "posted",
];
