import { Coffee, Leaf, ShoppingBasket, type LucideIcon } from "lucide-react";

export type NewsTopic = "coffee" | "tea" | "delicatessen";

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: string; // ISO
  summary: string;
  topic: NewsTopic;
}

export const TOPIC_ORDER: NewsTopic[] = ["coffee", "tea", "delicatessen"];

export const TOPIC_LABELS: Record<NewsTopic, string> = {
  coffee: "Café",
  tea: "Té",
  delicatessen: "Delicatessen",
};

export const TOPIC_ICONS: Record<NewsTopic, LucideIcon> = {
  coffee: Coffee,
  tea: Leaf,
  delicatessen: ShoppingBasket,
};
