import {
  Camera,
  BarChart3,
  CalendarDays,
  Radar,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  {
    title: "Gestor de Instagram",
    href: "/instagram",
    icon: Camera,
    description: "Planifica, programa y publica contenido de Instagram.",
  },
  {
    title: "Analítica",
    href: "/analytics",
    icon: BarChart3,
    description: "Sigue el rendimiento de todos tus canales.",
  },
  {
    title: "Calendario de Contenido",
    href: "/calendar",
    icon: CalendarDays,
    description: "Visualiza todo lo programado de un vistazo.",
  },
  {
    title: "Seguimiento de Competencia",
    href: "/competitors",
    icon: Radar,
    description: "Mantente al tanto de lo que publica la competencia.",
  },
  {
    title: "Feed de Noticias",
    href: "/news",
    icon: Newspaper,
    description: "Mantente al día con noticias y tendencias del sector.",
  },
];
