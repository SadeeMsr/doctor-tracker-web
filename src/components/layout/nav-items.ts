import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from 'lucide-react';
import type { Route } from 'next';

export interface NavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
];
