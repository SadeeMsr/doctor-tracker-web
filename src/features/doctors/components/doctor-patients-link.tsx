import { ArrowRight, Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

import type { Doctor } from '../types';

interface DoctorPatientsLinkProps {
  doctor: Doctor;
  /** With no patients yet, the pill adds the first one in place instead of navigating. */
  onAddPatient: (doctor: Doctor) => void;
  className?: string;
}

const pillClass = cn(
  'group/link inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap',
  'bg-canvas-soft text-foreground ring-1 ring-border transition-colors duration-200',
  'hover:bg-brand hover:text-brand-foreground hover:ring-brand',
);

/**
 * The way into a doctor's patients: always visible on the row or card, never behind a menu.
 * "N patients" opens the doctor's page; with none yet, "Add patient" opens the form right here.
 */
export function DoctorPatientsLink({ doctor, onAddPatient, className }: DoctorPatientsLinkProps) {
  const count = doctor.patientCount;

  if (count === 0) {
    return (
      <button
        type="button"
        onClick={() => onAddPatient(doctor)}
        className={cn(pillClass, className)}
      >
        {/* One group, so a full-width pill on phone cards keeps icon and label together. */}
        <span className="inline-flex items-center gap-2">
          <Plus className="size-4 shrink-0" aria-hidden />
          Add patient
        </span>{' '}
        <span className="sr-only">for {doctor.name}</span>
      </button>
    );
  }

  return (
    <Link href={`/doctors/${doctor.id}`} className={cn(pillClass, className)}>
      <Users className="size-4 shrink-0" aria-hidden />
      <span className="tabular-nums">
        {String(count)} {count === 1 ? 'patient' : 'patients'}
      </span>{' '}
      <span className="sr-only">for {doctor.name}</span>
      <ArrowRight
        className="size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
