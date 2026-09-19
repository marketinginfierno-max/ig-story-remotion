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
    title: "Instagram Manager",
    href: "/instagram",
    icon: Camera,
    description: "Plan, schedule, and publish Instagram content.",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Track performance across your channels.",
  },
  {
    title: "Content Calendar",
    href: "/calendar",
    icon: CalendarDays,
    description: "See everything scheduled at a glance.",
  },
  {
    title: "Competitor Tracker",
    href: "/competitors",
    icon: Radar,
    description: "Keep an eye on what competitors are posting.",
  },
  {
    title: "News Feed",
    href: "/news",
    icon: Newspaper,
    description: "Stay on top of industry news and trends.",
  },
];
