import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Overview of doctors, patients and trends.</p>
    </section>
  );
}
