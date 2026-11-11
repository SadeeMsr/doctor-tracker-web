'use client';

import { DataTable, type DataTableColumn } from '@/components/data-table/data-table';
import { formatDate } from '@/lib/format';

import type { Patient } from '../types';

import { ConditionBadge } from './condition-badge';
import { PatientCard } from './patient-card';
import { PatientDoctorLink } from './patient-doctor-link';
import { PatientIdentity } from './patient-identity';
import { PatientRowActions } from './patient-row-actions';

interface PatientsTableProps {
  patients: Patient[];
  isStale: boolean;
  showDoctor: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const DOCTOR_COLUMN: DataTableColumn<Patient> = {
  id: 'doctor',
  header: 'Doctor',
  className: 'max-w-48',
  cell: (patient) => <PatientDoctorLink doctor={patient.doctor} />,
};

/** One page of patients: a table on desktop, cards on phones. */
export function PatientsTable({
  patients,
  isStale,
  showDoctor,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  const actions = (patient: Patient) => (
    <PatientRowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
  );

  const columns: DataTableColumn<Patient>[] = [
    { id: 'patient', header: 'Patient', cell: (patient) => <PatientIdentity patient={patient} /> },
    {
      id: 'condition',
      header: 'Condition',
      cell: (patient) => <ConditionBadge condition={patient.condition} />,
    },
    {
      id: 'diagnosis',
      header: 'Diagnosis',
      className: 'max-w-64 max-2xl:hidden',
      cell: (patient) => <p className="truncate text-muted-foreground">{patient.diagnosis}</p>,
    },
    ...(showDoctor ? [DOCTOR_COLUMN] : []),
    {
      id: 'admitted',
      header: 'Admitted',
      className: 'whitespace-nowrap text-muted-foreground',
      cell: (patient) => formatDate(patient.admittedAt),
    },
    { id: 'actions', header: '', className: 'w-0 pl-0', cell: actions },
  ];

  return (
    <DataTable
      caption="Patients"
      columns={columns}
      data={patients}
      getRowId={(patient) => patient.id}
      isStale={isStale}
      renderCard={(patient) => (
        <PatientCard patient={patient} showDoctor={showDoctor} actions={actions(patient)} />
      )}
    />
  );
}
