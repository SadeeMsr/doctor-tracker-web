import { AppSidebar } from '@/components/layout/app-sidebar';

export default function DashboardLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-surface/80 px-4 backdrop-blur sm:px-6">
          {/* Mobile nav, search and user menu go here. */}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
