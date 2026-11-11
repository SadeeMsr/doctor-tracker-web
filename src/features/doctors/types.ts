import type { SPECIALIZATIONS } from './constants';

export type Specialization = (typeof SPECIALIZATIONS)[number];

/** Mirrors the API's `presentDoctor` exactly. */
export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Query string of `GET /doctors` (the API's `listDoctorsQuery`). */
export type DoctorListParams = {
  page: number;
  limit: number;
  search?: string;
  /** Any of these (sent as repeated keys). */
  specialization?: readonly Specialization[];
  /** Any of these hospitals (sent as repeated keys: names may contain commas). */
  hospital?: readonly string[];
  from?: string;
  to?: string;
  sortBy: 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
};

export type DoctorInput = Pick<Doctor, 'name' | 'specialization' | 'hospital' | 'phone' | 'email'>;
