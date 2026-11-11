'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { MenuHeading, MenuRadioGroup, MenuRadioItem } from '@/components/ui/menu';

const THEMES = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const;

/**
 * Light / dark / system choice, for use inside a `MenuContent`. The choice is remembered.
 * @example <MenuContent><ThemeMenuItems /></MenuContent>
 */
export function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <MenuHeading>Appearance</MenuHeading>
      <MenuRadioGroup value={theme ?? 'system'} onValueChange={(value: string) => setTheme(value)}>
        {THEMES.map(({ value, label, Icon }) => (
          <MenuRadioItem key={value} value={value} closeOnClick={false}>
            <Icon aria-hidden />
            {label}
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
    </>
  );
}
