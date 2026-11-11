'use client';

import { SearchX, Stethoscope } from 'lucide-react';

import { Pagination } from '@/components/data-table/pagination';
import { TableSkeleton } from '@/components/data-table/table-skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

import type { DoctorFilterState } from '../hooks/use-doctor-filters';
import { useDoctors } from '../queries';
import type { Doctor } from '../types';

import { DoctorsTable } from './doctors-table';

interface DoctorsResultsProps {
  state: DoctorFilterState;
  onCreate: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

/** Fetches the current page and picks the loading, error, empty or table state. */
export function DoctorsResults({ state, onCreate, onEdit, onDelete }: DoctorsResultsProps) {
  const query = useDoctors(state.params);

  if (!query.data) {
    return query.isError ? (
      <ErrorState
        description={getErrorMessage(query.error)}
        reference={getErrorReference(query.error)}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <TableSkeleton label="Loading doctors" />
    );
  }

  const { data: doctors, meta } = query.data;

  if (doctors.length === 0 && state.hasFilters) {
    return (
      <EmptyState
        icon={<SearchX aria-hidden />}
        title="No doctors match"
        description="Nothing fits this search and these filters. Loosen them to see more."
        action={
          <Button variant="secondary" onClick={state.reset}>
            Clear filters
          </Button>
        }
      />
    );
  }
  if (doctors.length === 0 && meta.page === 1) {
    return (
      <EmptyState
        icon={<Stethoscope aria-hidden />}
        title="No doctors yet"
        description="Add your first doctor to start assigning patients and filling the dashboard."
        action={<Button onClick={onCreate}>Add doctor</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DoctorsTable
        doctors={doctors}
        isStale={query.isPlaceholderData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Pagination {...meta} noun="doctors" onPageChange={state.setPage} />
    </div>
  );
}
