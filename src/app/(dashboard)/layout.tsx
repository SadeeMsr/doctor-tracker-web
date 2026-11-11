import { AppSidebar } from '@/components/layout/app-sidebar';
import { GlobalShortcuts } from '@/components/layout/global-shortcuts';
import { MobileDock, MobileHeader } from '@/components/layout/mobile-nav';
import { ShortcutsButton } from '@/components/layout/shortcuts-button';
import { ShortcutsDialog } from '@/components/layout/shortcuts-dialog';
import { ShortcutsHint } from '@/components/layout/shortcuts-hint';
import { ShortcutsProvider } from '@/components/layout/shortcuts-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserMenu } from '@/features/auth/components/user-menu';

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <ShortcutsProvider>
      <div className="relative min-h-dvh lg:pl-[17.5rem]">
        <AppSidebar footer={<UserMenu layout="rail" />} />
        <MobileHeader
          actions={
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu layout="compact" />
            </div>
          }
        />
        {/* Desktop: the top-right corner of the content area; it scrolls away with the page. */}
        <div className="absolute top-6 right-6 hidden items-center gap-2 lg:flex">
          <ShortcutsHint className="flex" />
          <ShortcutsButton />
          <ThemeToggle />
        </div>
        {/* Bottom padding on phones keeps the last row clear of the floating dock. */}
        <main className="mx-auto w-full max-w-[88rem] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <MobileDock />
      </div>
      <GlobalShortcuts />
      <ShortcutsDialog />
    </ShortcutsProvider>
  );
}
