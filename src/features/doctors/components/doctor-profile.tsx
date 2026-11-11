'use client';

import { ArrowLeft, UserRoundX } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { buttonStyles } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisclosure } from '@/hooks/use-disclosure';
import { isApiError } from '@/lib/api-client';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

import { useDoctor } from '../queries';
import type { Doctor } from '../types';

import { DoctorFormDialog } from './doctor-form-dialog';
import { DoctorHero } from './doctor-hero';

function BackLink() {
  return (
    <Link
      href="/doctors"
      className={buttonStyles({ variant: 'ghost', size: 'sm', className: '-ml-3' })}
    >
      <ArrowLeft aria-hidden />
      All doctors
    </Link>
  );
}

function DoctorMissing({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  if (isApiError(error) && error.status === 404) {
    return (
      <EmptyState
        icon={<UserRoundX aria-hidden />}
        title="Doctor not found"
        description="This doctor may have been removed, or the link is wrong."
        action={<BackLink />}
      />
    );
  }
  return (
    <ErrorState
      description={getErrorMessage(error)}
      reference={getErrorReference(error)}
      onRetry={onRetry}
    />
  );
}

/** Loads one doctor and shows their profile banner. */
export function DoctorProfile({ id }: { id: string }) {
  const query = useDoctor(id);
  const editing = useDisclosure<Doctor>();

  if (!query.data) {
    return query.isError ? (
      <DoctorMissing error={query.error} onRetry={() => void query.refetch()} />
    ) : (
      <Skeleton
        className="h-56 rounded-3xl"
        role="status"
        aria-label="Loading doctor"
        aria-hidden={false}
      />
    );
  }

  const doctor = query.data;
  return (
    <div className="space-y-3">
      <BackLink />
      <DoctorHero doctor={doctor} onEdit={() => editing.show(doctor)} />
      <DoctorFormDialog
        open={editing.isOpen}
        onOpenChange={editing.hide}
        doctor={editing.item ?? undefined}
      />
    </div>
  );
}
