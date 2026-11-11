'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tv } from 'tailwind-variants';

import { Avatar } from '@/components/ui/avatar';
import {
  Menu,
  MenuContent,
  MenuHeading,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import { Skeleton } from '@/components/ui/skeleton';

import { useLogout, useMe } from '../queries';

const triggerStyles = tv({
  base: 'flex items-center gap-3 rounded-full text-left transition-colors',
  variants: {
    layout: {
      rail: 'w-full bg-brand-foreground/8 p-2 pr-4 text-brand-foreground hover:bg-brand-foreground/12',
      compact: 'p-0.5',
    },
  },
});

interface UserMenuProps {
  /** `rail`: name and email on the green sidebar. `compact`: just the avatar. */
  layout: 'rail' | 'compact';
}

/** Who is signed in, and the way out. */
export function UserMenu({ layout }: UserMenuProps) {
  const router = useRouter();
  const { data: user } = useMe();
  const logout = useLogout();

  if (!user) return <Skeleton className="size-11 rounded-full opacity-40" />;

  const signOut = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        router.replace('/login');
      },
    });
  };

  return (
    <Menu>
      <MenuTrigger className={triggerStyles({ layout })} aria-label={`Account: ${user.name}`}>
        <Avatar name={user.name} tone="lime" />
        {layout === 'rail' && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-brand-muted">{user.email}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-brand-muted" aria-hidden />
          </>
        )}
      </MenuTrigger>
      <MenuContent side={layout === 'rail' ? 'top' : 'bottom'} className="min-w-56">
        <MenuHeading>
          Signed in as{' '}
          <span className="block truncate font-medium text-foreground">{user.email}</span>
        </MenuHeading>
        <MenuSeparator />
        <MenuItem tone="danger" onClick={signOut} disabled={logout.isPending}>
          <LogOut aria-hidden />
          Sign out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
