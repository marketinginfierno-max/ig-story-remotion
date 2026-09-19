import { Camera, Music2, Users, Hash, type LucideIcon } from "lucide-react";

export type Platform = "instagram" | "tiktok" | "facebook" | "x";

export interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  date: string; // "YYYY-MM-DD"
}

export const PLATFORM_ORDER: Platform[] = ["instagram", "tiktok", "facebook", "x"];

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
};

// lucide-react no tiene íconos de marca (los quitaron) — se usan íconos
// genéricos como estar-de-pie-in para cada plataforma. Ver CLAUDE.md.
export const PLATFORM_ICONS: Record<Platform, LucideIcon> = {
  instagram: Camera,
  tiktok: Music2,
  facebook: Users,
  x: Hash,
};

// Nombre de la variable CSS (definida en globals.css) con el color validado
// de cada plataforma. Se arma el string "hsl(var(--platform-x))" en tiempo
// de uso porque Tailwind no puede generar clases a partir de un valor
// dinámico — mismo patrón que los colores de las series en bar-chart.tsx.
export const PLATFORM_COLOR_VAR: Record<Platform, string> = {
  instagram: "--platform-instagram",
  tiktok: "--platform-tiktok",
  facebook: "--platform-facebook",
  x: "--platform-x",
};

export function platformColor(platform: Platform, alpha?: number): string {
  const varName = PLATFORM_COLOR_VAR[platform];
  return alpha === undefined
    ? `hsl(var(${varName}))`
    : `hsl(var(${varName}) / ${alpha})`;
}
