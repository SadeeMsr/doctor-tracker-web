import { ArrowRight, Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

import type { Doctor } from '../types';

interface DoctorPatientsLinkProps {
  doctor: Doctor;
  className?: string;
}

/**
 * The way into a doctor's patients: always visible on the row or card, never behind a menu.
 * With no patients yet it invites adding the first one.
 */
export function DoctorPatientsLink({ doctor, className }: DoctorPatientsLinkProps) {
  const count = doctor.patientCount;
  const Icon = count === 0 ? Plus : Users;

  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className={cn(
        'group/link inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap',
        'bg-canvas-soft text-foreground ring-1 ring-border transition-colors duration-200',
        'hover:bg-brand hover:text-brand-foreground hover:ring-brand',
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="tabular-nums">
        {count === 0 ? 'Add patients' : `${String(count)} ${count === 1 ? 'patient' : 'patients'}`}
      </span>
      <span className="sr-only"> for {doctor.name}</span>
      <ArrowRight
        className="size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
