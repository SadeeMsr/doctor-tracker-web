import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileDock, MobileHeader } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserMenu } from '@/features/auth/components/user-menu';

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
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
      <ThemeToggle className="absolute top-6 right-6 hidden lg:inline-flex" />
      {/* Bottom padding on phones keeps the last row clear of the floating dock. */}
      <main className="mx-auto w-full max-w-[88rem] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <MobileDock />
    </div>
  );
}
