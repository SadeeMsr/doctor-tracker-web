'use client';

import { UserRoundX } from 'lucide-react';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { useDisclosure } from '@/hooks/use-disclosure';
import { isApiError } from '@/lib/api-client';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

import { useDoctor } from '../queries';
import type { Doctor } from '../types';

import { DoctorBackLink } from './doctor-back-link';
import { DoctorFormDialog } from './doctor-form-dialog';
import { DoctorHero } from './doctor-hero';
import { DoctorProfileSkeleton } from './doctor-profile-skeleton';

function DoctorMissing({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  if (isApiError(error) && error.status === 404) {
    return (
      <EmptyState
        icon={<UserRoundX aria-hidden />}
        title="Doctor not found"
        description="This doctor may have been removed, or the link is wrong."
        action={<DoctorBackLink />}
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
      <DoctorProfileSkeleton />
    );
  }

  const doctor = query.data;
  return (
    <div className="space-y-3">
      <DoctorBackLink />
      <DoctorHero doctor={doctor} onEdit={() => editing.show(doctor)} />
      <DoctorFormDialog
        open={editing.isOpen}
        onOpenChange={editing.hide}
        doctor={editing.item ?? undefined}
      />
    </div>
  );
}
