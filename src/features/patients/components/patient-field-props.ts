import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { PatientValues } from '../schemas';

/** What each group of patient form fields needs from the form. */
export interface PatientFieldProps {
  control: Control<PatientValues>;
  register: UseFormRegister<PatientValues>;
  errors: FieldErrors<PatientValues>;
}
