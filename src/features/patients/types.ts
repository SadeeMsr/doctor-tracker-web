import type { Condition } from '@/lib/conditions';

import type { Gender } from './constants';

/** Mirrors the API's `presentPatient` exactly. */
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string | null;
  condition: Condition;
  diagnosis: string;
  admittedAt: string;
  /** Null only if the doctor record disappeared. */
  doctor: { id: string; name: string; specialization: string } | null;
  createdAt: string;
  updatedAt: string;
}

/** Query string of `GET /patients` and `GET /doctors/:id/patients`. */
export type PatientListParams = {
  page: number;
  limit: number;
  search?: string;
  /** Comma-separated conditions. */
  condition?: string;
  gender?: Gender;
  from?: string;
  to?: string;
  sortBy: 'admittedAt' | 'name';
  sortOrder: 'asc' | 'desc';
};

/** Body of a create; an update sends any subset plus an optional `doctorId`. */
export interface PatientInput {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string | null;
  condition: Condition;
  diagnosis: string;
  admittedAt: string;
}

export type PatientChanges = Partial<PatientInput & { doctorId: string }>;

export interface DoctorOption {
  value: string;
  label: string;
}
