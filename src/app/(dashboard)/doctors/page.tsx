import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
      <p className="text-sm text-muted-foreground">Manage doctors and their patients.</p>
    </section>
  );
}
