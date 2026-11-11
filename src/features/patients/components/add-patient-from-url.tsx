'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { ADD_PATIENT_PARAM } from '@/lib/constants';

import { useDoctorOptions } from '../queries';

import { PatientFormDialog } from './patient-form-dialog';

/**
 * Opens the Add patient form for the doctor in `?addPatient=<doctorId>`. Pages that list
 * doctors mount it next to their view, so a patient can be added without leaving the list.
 */
export function AddPatientFromUrl() {
  const [doctorId, setDoctorId] = useQueryState(ADD_PATIENT_PARAM, parseAsString);
  const options = useDoctorOptions();
  const doctorLabel = options.data?.find((option) => option.value === doctorId)?.label;

  return (
    <PatientFormDialog
      open={doctorId !== null}
      onOpenChange={(open) => {
        if (!open) void setDoctorId(null);
      }}
      doctorId={doctorId ?? undefined}
      doctorLabel={doctorLabel}
    />
  );
}
