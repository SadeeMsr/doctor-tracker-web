'use client';

import { SearchX, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import { Pagination } from '@/components/data-table/pagination';
import { ResultCount } from '@/components/data-table/result-count';
import { TableSkeleton } from '@/components/data-table/table-skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

import type { PatientFilterState } from '../hooks/use-patient-filters';
import { usePatients } from '../queries';
import type { Patient } from '../types';

import { PatientsTable } from './patients-table';

interface PatientsResultsProps {
  /** Set on a doctor's page: only that doctor's patients. */
  doctorId: string | null;
  state: PatientFilterState;
  /** What to do next when there are no patients at all. */
  emptyDescription: string;
  emptyAction: ReactNode;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

/** Fetches the current page and picks the loading, error, empty or table state. */
export function PatientsResults({
  doctorId,
  state,
  emptyDescription,
  emptyAction,
  onEdit,
  onDelete,
}: PatientsResultsProps) {
  const query = usePatients(doctorId, state.params);

  if (!query.data) {
    return query.isError ? (
      <ErrorState
        description={getErrorMessage(query.error)}
        reference={getErrorReference(query.error)}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <TableSkeleton label="Loading patients" />
    );
  }

  const { data: patients, meta } = query.data;

  if (patients.length === 0 && state.hasFilters) {
    return (
      <EmptyState
        icon={<SearchX aria-hidden />}
        title="No patients match"
        description="Nothing fits this search and these filters. Loosen them to see more."
        action={
          <Button variant="secondary" onClick={state.reset}>
            Clear filters
          </Button>
        }
      />
    );
  }
  if (patients.length === 0 && meta.page === 1) {
    return (
      <EmptyState
        icon={<Users aria-hidden />}
        title="No patients yet"
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ResultCount
        total={meta.total}
        noun={['patient', 'patients'] as const}
        isFiltered={state.hasFilters}
      />
      <PatientsTable
        patients={patients}
        isStale={query.isPlaceholderData}
        showDoctor={doctorId === null}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Pagination {...meta} noun="patients" onPageChange={state.setPage} />
    </div>
  );
}
