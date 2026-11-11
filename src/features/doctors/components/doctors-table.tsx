'use client';

import { DataTable, type DataTableColumn } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';

import type { Doctor } from '../types';

import { DoctorCard } from './doctor-card';
import { DoctorIdentity } from './doctor-identity';
import { DoctorPatientsLink } from './doctor-patients-link';
import { DoctorRowActions } from './doctor-row-actions';

interface DoctorsTableProps {
  doctors: Doctor[];
  isStale: boolean;
  onAddPatient: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

/** One page of doctors: a table on desktop, cards on phones. */
export function DoctorsTable({
  doctors,
  isStale,
  onAddPatient,
  onEdit,
  onDelete,
}: DoctorsTableProps) {
  const actions = (doctor: Doctor) => (
    <DoctorRowActions
      doctor={doctor}
      onAddPatient={onAddPatient}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  const columns: DataTableColumn<Doctor>[] = [
    {
      id: 'doctor',
      header: 'Doctor',
      cell: (doctor) => <DoctorIdentity doctor={doctor} secondary={doctor.email} />,
    },
    {
      id: 'specialization',
      header: 'Specialization',
      cell: (doctor) => <Badge tone="accent">{doctor.specialization}</Badge>,
    },
    { id: 'hospital', header: 'Hospital', cell: (doctor) => doctor.hospital },
    {
      id: 'phone',
      header: 'Phone',
      className: 'whitespace-nowrap max-2xl:hidden',
      cell: (doctor) => <span className="tabular-nums">{doctor.phone}</span>,
    },
    {
      id: 'patients',
      header: 'Patients',
      cell: (doctor) => <DoctorPatientsLink doctor={doctor} onAddPatient={onAddPatient} />,
    },
    {
      id: 'added',
      header: 'Added',
      className: 'whitespace-nowrap text-muted-foreground max-2xl:hidden',
      cell: (doctor) => formatDate(doctor.createdAt),
    },
    { id: 'actions', header: '', className: 'w-0 pl-0', cell: actions },
  ];

  return (
    <DataTable
      caption="Doctors"
      columns={columns}
      data={doctors}
      getRowId={(doctor) => doctor.id}
      isStale={isStale}
      renderCard={(doctor) => (
        <DoctorCard doctor={doctor} actions={actions(doctor)} onAddPatient={onAddPatient} />
      )}
    />
  );
}
