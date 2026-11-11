import { AtSign, Building2, Pencil, Phone } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate, formatNumber } from '@/lib/format';

import type { Doctor } from '../types';

const contactClass =
  'inline-flex items-center gap-2 text-sm text-brand-muted [&_svg]:size-4 [&_svg]:text-accent';

function Contacts({ doctor }: { doctor: Doctor }) {
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
      <li className={contactClass}>
        <Building2 aria-hidden />
        {doctor.hospital}
      </li>
      <li>
        <a href={`tel:${doctor.phone}`} className={`${contactClass} hover:text-brand-foreground`}>
          <Phone aria-hidden />
          {doctor.phone}
        </a>
      </li>
      <li>
        <a
          href={`mailto:${doctor.email}`}
          className={`${contactClass} hover:text-brand-foreground`}
        >
          <AtSign aria-hidden />
          {doctor.email}
        </a>
      </li>
    </ul>
  );
}

function Caseload({ doctor }: { doctor: Doctor }) {
  return (
    <div className="rounded-2xl bg-brand-foreground/8 px-5 py-4 lg:text-right">
      <p className="text-4xl font-semibold tracking-[-0.03em] text-accent tabular-nums">
        {formatNumber(doctor.patientCount)}
      </p>
      <p className="text-xs text-brand-muted">
        {doctor.patientCount === 1 ? 'patient' : 'patients'} in care
      </p>
    </div>
  );
}

/** The doctor's profile banner on their detail page. */
export function DoctorHero({ doctor, onEdit }: { doctor: Doctor; onEdit: () => void }) {
  return (
    <Card tone="brand" className="relative isolate overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 -z-10 ecg-grid" aria-hidden />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={doctor.name} size="lg" tone="lime" />
          <div className="min-w-0 space-y-3">
            <Badge tone="accent">{doctor.specialization}</Badge>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{doctor.name}</h1>
            <Contacts doctor={doctor} />
          </div>
        </div>
        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
          <Caseload doctor={doctor} />
          <Button variant="accent" size="sm" onClick={onEdit}>
            <Pencil aria-hidden />
            Edit details
          </Button>
        </div>
      </div>
      <p className="mt-6 font-mono text-[0.68rem] tracking-[0.14em] text-brand-muted uppercase">
        On the roster since {formatDate(doctor.createdAt)}
      </p>
    </Card>
  );
}
