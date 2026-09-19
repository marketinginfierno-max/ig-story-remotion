export interface Competitor {
  id: string;
  handle: string;
  followers: number;
  recentPosts: number; // posts en los últimos 30 días
  postsPerWeek: number;
  engagementRate: number; // %
  growthPercent: number; // % de crecimiento de seguidores en los últimos 30 días
  addedAt: string;
}

export type SortKey =
  | "handle"
  | "followers"
  | "recentPosts"
  | "postsPerWeek"
  | "engagementRate"
  | "growthPercent";

export interface SortState {
  key: SortKey;
  direction: "asc" | "desc";
}
