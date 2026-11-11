import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileDock, MobileHeader } from '@/components/layout/mobile-nav';
import { UserMenu } from '@/features/auth/components/user-menu';

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="min-h-dvh lg:pl-[17.5rem]">
      <AppSidebar footer={<UserMenu layout="rail" />} />
      <MobileHeader actions={<UserMenu layout="compact" />} />
      {/* Bottom padding on phones keeps the last row clear of the floating dock. */}
      <main className="mx-auto w-full max-w-[88rem] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <MobileDock />
    </div>
  );
}
